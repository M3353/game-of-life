const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const { PythonShell } = require("python-shell");

const { kMean, labArrayToRgb } = require("./filters");
const { minDim, maxDim, entrySize } = require("./data");

const PALETTE_SIZE = 5;

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  },
});

function foundOne(rowStart, rowEnd, colStart, colEnd, board) {
  // better algorithm is to sort and check the first val, O(nlogn)
  // current is O(n^2)

  for (let i = rowStart; i < rowEnd; i++) {
    for (let j = colStart; j < colEnd; j++) {
      if (board[i][j] >= 1) return true;
    }
  }
  return false;
}

const createValidBoard = (req, res, next) => {
  const { rows, columns, name } = req.body;
  const occupiedRows = rows / entrySize;
  const occupiedCols = columns / entrySize;
  let numOccupied = 0;

  // check for empty board
  const board = req.body.board.length
    ? req.body.board
    : new Array(rows * columns).fill(0);
  const occupied = req.body.occupied.length
    ? req.body.occupied
    : new Array(occupiedRows * occupiedCols).fill(0);

  // fill occupied board and count number of occupied slots
  for (let i = 0; i < rows; i += entrySize) {
    for (let j = 0; j < columns; j += entrySize) {
      if (foundOne(i, j, i + entrySize, j + entrySize, board)) {
        occupied[i * rows + j] = 1;
        numOccupied++;
      }
    }
  }

  // set ready to 0 if board is not completely occupied
  const ready = numOccupied == occupiedRows * occupiedCols ? true : false;

  // update the request body with valid board values
  req.body = {
    board: { data: board },
    occupied: { data: occupied },
    rows,
    columns,
    ready,
    name,
  };

  next();
};

function isBoardFull(occupied) {
  occupied.every((ele) => {
    if (ele == 0) return false;
  });
  return true;
}

const updateBoardWithUserEntry = (req, res, next) => {
  const { board, boardOccupied, coords, entry, rows } = req.body;

  const i = coords[0];
  const j = coords[1];

  const row_offset = entrySize * i;
  const col_offset = entrySize * j;

  const updatedBoard = board.map((ele) => ele);

  board.forEach((ele, i) => {
    const r = i / rows;
    const c = i % rows;
    updatedBoard[i] =
      r >= row_offset &&
      r < row_offset + entrySize &&
      c >= col_offset &&
      c < col_offset + entrySize
        ? entry[i % (entrySize * entrySize)]
        : ele;
  });

  const updatedBoardOccupied = boardOccupied.map((ele) => ele);

  updatedBoardOccupied[i * (rows / entrySize) + j] = 1;

  req.body = {
    board: { data: updatedBoard },
    occupied: { data: updatedBoardOccupied },
    ready: isBoardFull(updatedBoardOccupied),
  };

  next();
};

async function getS3Stream(res) {
  try {
    const chunks = [];

    for await (const chunk of res) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (err) {
    console.error("Error while downloading object from S3", err.message);
    throw err;
  }
}

async function applyFilter(data, info) {
  const image = new Float32Array(data.buffer);
  const { width, height, channels, size } = info;

  const clusters = kMean(image, info, PALETTE_SIZE);

  clusters.forEach((cluster) => {
    cluster.points.forEach((i) => {
      image[i] = cluster.centroid.l;
      image[i + 1] = cluster.centroid.a;
      image[i + 2] = cluster.centroid.b;
    });
  });
  return image;
}

async function getImage(file) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file,
  };

  try {
    const imageFromS3 = (await s3.send(new GetObjectCommand(params))).Body;
    return imageFromS3;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function putImage(img, file) {
  const putParams = {
    Bucket: process.env.S3_BUCKET,
    Key: file,
    Body: img,
    ContentType: "image/png",
    ContentLength: img.length,
  };

  try {
    const response = await s3.send(new PutObjectCommand(putParams));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateBoardWithUserImage(req, res, next) {
  const { file } = req.body;

  const pythonShellOptions = {
    pythonOptions: ["-u"],
    pythonPath: "/Users/jackli/.pyenv/versions/3.10.11/bin/python/",
    args: [
      file,
      process.env.S3_BUCKET,
      process.env.ACCESS_KEY,
      process.env.SECRET_ACCESS_KEY,
    ],
  };

  await PythonShell.run(
    "background-remover/remove.py",
    pythonShellOptions
  ).then((results) => {
    console.log(results);
  });

  // get image from s3 and convert to byte stream
  const imageFromS3 = await getImage(file);
  const s3Stream = await getS3Stream(imageFromS3);

  // resize and blur image using sharp
  const { data, info } = await sharp(s3Stream)
    .resize({ fit: sharp.fit.contain, width: 400 })
    .modulate({
      saturation: 3,
    })
    .gamma()
    .trim()
    .median()
    .toColorspace("lab")
    .raw({ depth: "float" })
    .toBuffer({ resolveWithObject: true });

  // manually process image
  const pixelArray = await applyFilter(data, info);

  const rgbPixelArray = await labArrayToRgb(pixelArray, info.channels);

  // convert raw data to buffer
  const { width, height, channels } = info;

  const imageToS3 = await sharp(rgbPixelArray, {
    raw: { width, height, channels },
  })
    .toFormat("png")
    .toBuffer();

  // put image to s3
  await putImage(imageToS3, file);

  next();
}

module.exports = {
  createValidBoard,
  updateBoardWithUserEntry,
  updateBoardWithUserImage,
};
