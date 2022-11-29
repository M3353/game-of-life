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
  };
  next();
};

const inBoard = (x, y, nr, nc) => {
  return x >= 0 && y >= 0 && x < nc && y < nr;
};

const incrementBoard = (req, res, next) => {
  const { board } = req.body;
  const offsets = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [-1, -1],
    [1, -1],
    [1, 1],
  ];

  const nc = board.length;
  const nr = board[0].length;

  console.log(board);

  const incrementedBoard = board.map((row, r) => {
    return row.map((e, c) => {
      let alive = 0;

      // count alive neighbors
      offsets.forEach((coord) => {
        const x = coord[0] + c;
        const y = coord[1] + r;

        alive += inBoard(x, y, nr, nc) && board[y][x] > 0 ? 1 : 0;
      });

      return e > 0 && (alive == 2 || alive == 3)
        ? e + 1
        : e == 0 && alive == 3
        ? 1
        : 0;
    });
  });

  console.log(incrementedBoard);

  req.body = {
    board: incrementedBoard,
  };

  next();
};

module.exports = {
  validator,
  updateBoardWithUserEntry,
  incrementBoard,
};
