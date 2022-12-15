const fs = require("fs");

const schemas = require("./schemas");
const { minDim, maxDim, entrySize } = require("./data");

const validator = function (schema) {
  // check if the schema exists
  if (!schemas.hasOwnProperty(schema)) {
    throw new Error(`Schema ${schema} does not exist`);
  }

  return function (req, res, next) {
    const { error } = schemas[schema].validate(req.body);
    if (error) {
      return error.isJoi
        ? res.status(422).json({
            status: error,
          })
        : res.status(500);
    }
    next();
  };
};

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
  let numOccupied = 0;

  // check for empty board
  const board = req.body.board.length
    ? req.body.board
    : Array.from(Array(rows), () => Array(columns).fill(0));
  const occupied = req.body.occupied.length
    ? req.body.occupied
    : Array.from(Array(rows / entrySize), () =>
        Array(columns / entrySize).fill(0)
      );

  // fill occupied board and count number of occupied slots
  for (let i = 0; i < rows; i += entrySize) {
    for (let j = 0; j < columns; j += entrySize) {
      if (foundOne(i, j, i + entrySize, j + entrySize, board)) {
        occupied[i][j] = 1;
        numOccupied++;
      }
    }
  }

  // set ready to 0 if board is not completely occupied
  const ready =
    numOccupied == occupied.length * occupied[0].length ? true : false;

  // generate unique id ? synchronously
  const rawData = fs.readFileSync("ids.json");
  const dataString = JSON.parse(rawData);
  const id = parseInt(dataString.id);

  // write new id ? asynchronously
  const newId = JSON.stringify({ id: id + 1 }, null, 2);
  fs.writeFile("ids.json", newId, (err) => {
    if (err) throw err;
    console.log(`new id ${id + 1} written to id file`);
  });

  // update the request body with valid board values
  req.body = {
    board,
    occupied,
    rows,
    columns,
    ready,
    name,
    id,
  };

  next();
};

function isBoardFull(occupied) {
  for (let i = 0; i < occupied.length; i++) {
    for (var j = 0; j < occupied[i].length; j++) {
      if (occupied[i][j] == 0) return false;
    }
  }
  return true;
}

const updateBoardWithUserEntry = (req, res, next) => {
  const { board, boardOccupied, coords, entry } = req.body;

  const i = coords[0];
  const j = coords[1];

  const row_offset = entrySize * i;
  const col_offset = entrySize * j;

  const updatedBoard = board.map((row, r) => {
    return row.map((e, c) => {
      return r >= row_offset &&
        r < row_offset + entrySize &&
        c >= col_offset &&
        c < col_offset + entrySize
        ? entry[r % entrySize][c % entrySize]
        : e;
    });
  });

  const updatedBoardOccupied = boardOccupied.map(function (arr) {
    return arr.slice();
  });

  updatedBoardOccupied[i][j] = 1;

  req.body = {
    board: updatedBoard,
    occupied: updatedBoardOccupied,
    ready: isBoardFull(updatedBoardOccupied),
  };

  console.log(req.body);

  next();
};

module.exports = {
  validator,
  createValidBoard,
  updateBoardWithUserEntry,
};
