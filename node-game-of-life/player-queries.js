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
  console.log(id);
  pool.query("SELECT * FROM boards WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const updateBoard = (req, res) => {
  const id = parseInt(req.params.id);
  const { board, occupied } = req.body;

  pool.query(
    "UPDATE boards SET board = $1, occupied = $2 WHERE id = $3",
    [board, occupied, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`Board ${id} modified successfully.`);
    }
  );
};

const updateBoardWithIncremented = (req, res) => {
  const id = parseInt(req.params.id);
  const { board } = req.body;

  pool.query(
    "UPDATE boards SET board = $1 WHERE id = $2",
    [board, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`Board ${id} incremeneted successfully.`);
    }
  );
};

// const updateAllBoardsWithIncremented = (req, res) => {
//   const { boards } = req.body;

//   pool.query(
//     "UPDATE boards SET board ="
//   )
// }

module.exports = {
  getBoards,
  getBoardById,
  updateBoard,
  updateBoardWithIncremented,
};
