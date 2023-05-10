const sharp = require("sharp");
const { ENTRY_SIZE } = require("./constants");
const { prevOccupiedMap, prevBoardMap } = require("./cache");
const { getImage, deleteImage } = require("./s3-client");

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
  const id = parseInt(req.params.id);
  const { board, boardOccupied, coords, entry, columns, rows } = req.body;

  const x = coords[0];
  const y = coords[1];

  const row_offset = ENTRY_SIZE * y;
  const col_offset = ENTRY_SIZE * x;

  if (!prevBoardMap.has(id)) prevBoardMap.set(id, board);
  if (!prevOccupiedMap.has(id)) prevOccupiedMap.set(id, boardOccupied);

  const _board = prevBoardMap.get(id);
  const _occupied = prevOccupiedMap.get(id);

  const updatedBoard = _board.map((ele, i) => {
    const r = i / columns;
    const c = i % columns;
    return r >= row_offset &&
      r < row_offset + ENTRY_SIZE &&
      c >= col_offset &&
      c < col_offset + ENTRY_SIZE
      ? entry[i % (ENTRY_SIZE * ENTRY_SIZE)]
      : ele;
  });

  const updatedBoardOccupied = _occupied.map((ele, i) =>
    i === y * Math.floor(columns / ENTRY_SIZE) + x ? 1 : ele
  );

  req.body.board = { data: updatedBoard };
  req.body.occupied = { data: updatedBoardOccupied };
  req.body.ready = updatedBoardOccupied.every((ele) => ele != 0);

  next();
};

async function checkUserImageSupport(req, res, next) {
  const id = parseInt(req.params.id);
  const { file } = req.body;
  const filePath = id + "/" + file;

  // get image from s3 and convert to byte stream
  const imageFromS3 = await getImage(filePath);

  // try to get sharp metadata - if error, return
  try {
    await sharp(imageFromS3).metadata();
  } catch (err) {
    console.log("[ERROR] sharp image compatibility err");
    deleteImage(filePath);
    return next(err);
  }

  next();
}

module.exports = {
  createValidBoard,
  updateBoardWithUserEntry,
  checkUserImageSupport,
};
