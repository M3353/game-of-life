require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.USER_PUBLIC,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

const getBoards = (req, res) => {
  pool.query("SELECT * FROM boards ORDER BY id ASC", (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const getBoardById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM boards WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const updateBoard = (req, res) => {
  const id = parseInt(req.params.id);
  const { board, occupied, ready } = req.body;

  pool.query(
    "UPDATE boards SET board = $1, occupied = $2, ready = $3 WHERE id = $4",
    [board, occupied, ready, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`Board ${id} modified successfully.`);
    }
  );
};

module.exports = {
  getBoards,
  getBoardById,
  updateBoard,
};
