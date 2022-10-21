const Pool = require('pg').Pool

const pool = new Pool({
	user: 'admin',
	host: 'localhost',
	database: 'game-of-life',
	password: 'Qwerty2001?',
	port: 5432, 
})

const createBoard = (req, res) => {
	const { id, name, height, width, board, occupied } = request.body

	pool.query(
		'INSERT INTO boards (id, name, board, occupied, height, width) VALUES ($1, $2, $3, $4, $5, $6)',
		[id, name, board, occupied, height, width],
		(err, results) => {
			if (err) {
				throw err
			}
			res.status(201).send(`Board added with ID: ${results.rows[0].id}.`)	
		}
	)
}

const deleteBoard = (req, res) => {
	const id = parseInt(req.params.id)

	pool.query('DELETE FROM users WHERE id = $1', [id], (err, results) => {
		if (err) {
			throw err
		}
			res.status(200).send(`Board deleted with ID: ${id}`)
	})
}

module.exports = {
	createBoard,
	deleteBoard,
}
