const sharp = require("sharp");
const { PythonShell } = require("python-shell");

const { kMean, labArrayToRgb } = require("./filters");
const { getImage, putImage } = require("./s3-client");
const { ENTRY_SIZE, PALETTE_SIZE } = require("./data");

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
    highDensityRegions: {},
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

  req.body = {
    board: { data: updatedBoard },
    occupied: { data: updatedBoardOccupied },
    ready: updatedBoardOccupied.every((ele) => ele != 0),
  };

  next();
};

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

  // resize and blur image using sharp
  const { data, info } = await sharp(imageFromS3)
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
