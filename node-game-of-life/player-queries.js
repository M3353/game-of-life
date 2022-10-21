const Pool = require('pg').Pool

const pool = new Pool({
	user: 'publicuser',
	host: 'localhost',
	database: 'gameoflife',
	port: 5432,
});

const getBoards = (req, res) => {
	pool.query('SELECT * FROM boards ORDER BY id ASC', (err, results) => {
		if (err) {
			throw err
		}
		res.status(200).json(results.rows)
	})
}

const getBoardById = (req, res) => {
	const id = parseInt(req.params.id)

	pool.query('SELECT * FROM boards WHERE id = $1', [id], (err, results) => {
		if (err) {
			throw er
		}
		res.status(200).json(results.row)
	})
} 

const updateBoard = (req, res) => {
	const id = parseInt(req.params.id)
	const { board, occupied } = req.body

	pool.query(
		'UPDATE boards SET board = $1, occupied = $2 WHERE id = $3',
		[board, occupied, id],
		(err, results) => {
			if (err) {
				throw err
			}
			res.status(200).send(`Board ${id} modified successfully.`)
		}
	)
}

module.exports = {
  getBoards,
  getBoardById,
  updateBoard,
}
