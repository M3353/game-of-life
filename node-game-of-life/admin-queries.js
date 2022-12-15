const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER_ADMIN,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

const createBoard = (req, res) => {
  const { id, name, rows, columns, board, occupied, ready } = req.body;

  pool.query(
    `INSERT INTO boards (id, name, board, occupied, rows, columns, ready) \
		VALUES ($1, $2, $3, $4, $5, $6, $7) \
		ON CONFLICT (id) DO NOTHING`,
    [id, name, board, occupied, rows, columns, ready],
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

const incrementBoard = (req, res) => {
  const { board, id } = req.body;

  pool.query(
    "UPDATE boards SET board = $1 WHERE id = $2",
    [board, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`Board ${id} incremented successfully.`);
    }
  );
};

module.exports = {
  createBoard,
  deleteBoard,
  incrementBoard,
};
