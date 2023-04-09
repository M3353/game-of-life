const { minDim, maxDim, entrySize } = require("./data");

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

  // generate unique id ? synchronously
  // const rawData = fs.readFileSync("ids.json");
  // const dataString = JSON.parse(rawData);
  // const id = parseInt(dataString.id);

  // write new id ? asynchronously
  // const newId = JSON.stringify({ id: id + 1 }, null, 2);
  // fs.writeFile("ids.json", newId, (err) => {
  //   if (err) throw err;
  //   console.log(`new id ${id + 1} written to id file`);
  // });

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

module.exports = {
  createValidBoard,
  updateBoardWithUserEntry,
};
