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
  for (let isOccupied of occupied) {
    if (!isOccupied) return false;
  }
  return true;
}

const updateBoardWithUserEntry = (req, res, next) => {
  const { board, boardOccupied, location, entry } = req.body;

  const nc = board.length;
  const nr = board[0].length;

  const _nc = location % nc;
  const _nr = location / nc;

  if (location > 0 && location >= _nc * _nr) {
    throw new Error(
      `Index Error: Location '${location}' is out of bounds '${_nr}' '${_nr}'`
    );
  }

  const row_offset = entrySize * _nr;
  const col_offset = entrySize * _nc;

  const updatedBoard = board.map((row, r) => {
    return row.map((e, c) => {
      return r >= row_offset &&
        r < row_offset + entrySize &&
        c >= col_offset &&
        c < col_offset + entrySize
        ? entry[r % entrySize][c % entrySize]
        : c;
    });
  });

  const updatedBoardOccupied = boardOccupied.slice();
  updatedBoardOccupied[location] = 1;

  req.body = {
    board: updatedBoard,
    occupied: updatedBoardOccupied,
    ready: isBoardFull(updatedBoardOccupied),
  };
  next();
};

module.exports = {
  validator,
  createValidBoard,
  updateBoardWithUserEntry,
};
