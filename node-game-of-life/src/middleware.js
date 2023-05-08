const sharp = require("sharp");
const { PythonShell } = require("python-shell");
const {
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { kMean } = require("./filters");
const { getImage, putImage } = require("./s3-client");
const { ENTRY_SIZE, PALETTE_SIZE, EPS } = require("./constants");
const { labToRgb } = require("./filters-utils");
const { s3 } = require("./s3-client");

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
  const { rows, columns, name, board, occupied } = req.body;
  const occupiedRows = rows / ENTRY_SIZE;
  const occupiedCols = columns / ENTRY_SIZE;
  let numOccupied = 0;

  // check for empty board
  const _board = board.data.length ? board : new Array(rows * columns).fill(0);
  const _occupied = occupied.data.length
    ? occupied
    : new Array(occupiedRows * occupiedCols).fill(0);

  // fill occupied board and count number of occupied slots
  for (let i = 0; i < rows; i += ENTRY_SIZE) {
    for (let j = 0; j < columns; j += ENTRY_SIZE) {
      if (foundOne(i, j, i + ENTRY_SIZE, j + ENTRY_SIZE, _board)) {
        _occupied[i * rows + j] = 1;
        numOccupied++;
      }
    }
  }

  // set ready to 0 if board is not completely occupied
  const ready = numOccupied == occupiedRows * occupiedCols ? true : false;

  // update the request body with valid board values
  req.body = {
    board: { data: _board },
    occupied: { data: _occupied },
    highDensityRegions: { data: [] },
    palette: { data: [] },
    rows,
    columns,
    ready,
    name,
  };

  next();
};

const updateBoardWithUserEntry = (req, res, next) => {
  const { board, boardOccupied, coords, entry, columns } = req.body;

  const x = coords[0];
  const y = coords[1];

  const row_offset = ENTRY_SIZE * y;
  const col_offset = ENTRY_SIZE * x;

  const updatedBoard = board.map((ele) => ele);

  board.forEach((ele, i) => {
    const r = i / columns;
    const c = i % columns;
    updatedBoard[i] =
      r >= row_offset &&
      r < row_offset + ENTRY_SIZE &&
      c >= col_offset &&
      c < col_offset + ENTRY_SIZE
        ? entry[i % (ENTRY_SIZE * ENTRY_SIZE)]
        : ele;
  });

  const updatedBoardOccupied = boardOccupied.map((ele) => ele);
  updatedBoardOccupied[y * parseInt(columns / ENTRY_SIZE) + x] = 1;

  req.body.board = { data: updatedBoard };
  req.body.occupied = { data: updatedBoardOccupied };
  req.body.ready = updatedBoardOccupied.every((ele) => ele != 0);

  next();
};

async function applyFilter(data, info) {
  const pixelArray = new Float32Array(data.buffer);
  const { width, height, channels, size } = info;

  const clusters = kMean(pixelArray, info, PALETTE_SIZE);
  const colors = [];

  clusters.forEach((cluster) => {
    const { l, a, b } = cluster.centroid;
    const rgbCentroid = labToRgb([l, a, b]);
    colors.push({
      color: rgbCentroid,
      weight: cluster.points.length / (width * height),
    });
    cluster.points.forEach((i) => {
      for (let c = 0; c < channels; c++) {
        if (c < rgbCentroid.length)
          pixelArray[i + c] = parseInt(rgbCentroid[c]);
      }
    });
  });
  return { pixelArray, colors };
}

function uniqueSort(arr) {
  arr.sort((a, b) => b.weight - a.weight);
  const ret = [{ color: arr[0].color, weight: arr[0].weight }];
  for (let i = 1; i < arr.length; i++) {
    const c1 = arr[i].color;
    const c2 = arr[i - 1].color;
    for (let j = 0; j < c1.length; j++) {
      if (Math.abs(c1[j] - c2[j]) > EPS) {
        ret.push({ color: c1, weight: arr[i].weight });
        break;
      }
    }
  }

  return ret;
}

async function handleSubmitImageError(key) {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };

  const deleteCommand = new DeleteObjectCommand(deleteParams);
  await s3.send(deleteCommand);

  console.log(`deleted image with key ${key}`);
}

async function updateBoardWithUserImage(req, res, next) {
  const { file, palette, boardOccupied, id } = req.body;

  const filePath = id + "/" + file;

  // remove background
  const pythonShellOptions = {
    pythonOptions: ["-u"],
    args: [
      filePath,
      process.env.S3_BUCKET,
      process.env.ACCESS_KEY,
      process.env.SECRET_ACCESS_KEY,
    ],
    ...(process.env.NODE_ENV !== "production" && {
      pythonPath: "/Users/jackli/.pyenv/versions/3.10.11/bin/python/",
    }),
  };

  try {
    await PythonShell.run(
      "background-remover/remove.py",
      pythonShellOptions
    ).then((results) => console.log(results));
  } catch (err) {
    handleSubmitImageError(filePath);
    res.status(401).send({
      message: `[ERROR] error when attempting to remove background ${filePath}`,
    });
    return next(err);
  }

  // try to get sharp metadata - if error, return
  try {
    await sharp(imageFromS3).metadata();
  } catch (err) {
    handleSubmitImageError(filePath);
    res.status(401).send({
      message: `[ERROR] error when attempting to process image ${filePath}`,
    });
    return next(err);
  }

  // get image from s3 and convert to byte stream
  const imageFromS3 = await getImage(filePath);

  // resize and blur image using sharp
  const { data, info } = await sharp(imageFromS3)
    .resize({ fit: sharp.fit.contain, width: 400 })
    .modulate({
      saturation: 2,
    })
    .gamma()
    .trim()
    .median()
    .toColorspace("lab")
    .raw({ depth: "float" })
    .toBuffer({ resolveWithObject: true });

  // manually process image
  const { pixelArray, colors } = await applyFilter(data, info);

  // sort colors by weight and put it in req body
  req.body.palette = { data: [...palette, ...colors] };

  const newPalette = uniqueSort(req.body.palette.data);
  req.body.palette.data = newPalette;
  if (req.body.palette.data.length > boardOccupied.length) {
    req.body.palette.data.splice(boardOccupied.length);
  }

  // convert raw data to buffer
  const { width, height, channels } = info;

  // put image to s3
  const imageToS3 = await sharp(new Uint8ClampedArray(pixelArray), {
    raw: { width, height, channels },
  })
    .toFormat("png")
    .toBuffer();

  await putImage(imageToS3, filePath);

  next();
}

async function emptyS3Directory(req, res, next) {
  const id = parseInt(req.params.id);
  const listParams = {
    Bucket: process.env.S3_BUCKET,
    Prefix: `${id}/`,
  };

  const listCommand = new ListObjectsV2Command(listParams);
  const listedObjects = await s3.send(listCommand);

  if (listedObjects.Contents.length === 0) return;

  for (let i = 0; i < listedObjects.Contents.length; i++) {
    const { Key } = listedObjects.Contents[i];
    const deleteParams = {
      Bucket: process.env.S3_BUCKET,
      Key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);
  }

  if (listedObjects.IsTruncated) await emptyS3Directory(req, res, next);

  next();
}

module.exports = {
  createValidBoard,
  updateBoardWithUserEntry,
  updateBoardWithUserImage,
  emptyS3Directory,
};
