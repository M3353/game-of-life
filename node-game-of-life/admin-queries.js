const Pool = require("pg").Pool;
const { minDim, maxDim, entrySize } = require("./data");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER_ADMIN,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

const createBoard = (req, res) => {
  const { id, name, rows, columns } = req.body;

  const board = req.body.board
    ? req.body.board
    : Array.from(Array(rows), () => Array(columns).fill(0));
  const occupied = req.body.occupied
    ? req.body.occupied
    : Array((rows / entrySize) * (columns / entrySize)).fill(0);

  pool.query(
    `INSERT INTO boards (id, name, board, occupied, rows, columns) \
		VALUES ($1, $2, $3, $4, $5, $6) \
		ON CONFLICT (id) DO NOTHING`,
    [id, name, board, occupied, rows, columns],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(201).send(`Board added with ID: ${id}.`);
    }
  );
};

const deleteBoard = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM boards WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).send(`Board deleted with ID: ${id}`);
  });
};

module.exports = {
  createBoard,
  deleteBoard,
};
