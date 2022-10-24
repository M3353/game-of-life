const schemas = require('./schemas')
const { minDim, maxDim, entrySize } = require('./data') 

const validator = function (schema) {
	// check if the schema exists
	if (!schemas.hasOwnProperty(schema)) {
		throw new Error(`Schema ${schema} does not exist`)
	}

	return function(req, res, next) {
		const { error } = schemas[schema].validate(req.body)
		if (error) {
			return error.isJoi 
				? res.status(422).json({
						status: error
					})
				: res.status(500)
		}
		next()
	}
}

const updateBoardWithUserEntry = (req, res, next) => {
	const { board, boardOccupied, location, entry } = req.body

	const nc = board.length
	const nr = board[0].length
	
	const _nc = location % nc
	const _nr = location / nc
	
	if (location > 0 && location >= _nc * _nr) {
		throw new Error(`Index Error: Location '${location}' is out of bounds '${_nr}' '${_nr}'`)
	}

	const row_offset = entrySize * _nr
	const col_offset = entrySize * _nc

	const updatedBoard = board.map((row, r) => {
		return row.map((e, c) => {
			return (
				r >= row_offset && 
				r < row_offset + entrySize &&
				c >= col_offset &&
				c < col_offset + entrySize
			)
			? entry[r % entrySize][c % entrySize]
			: c
		})
	})

	const updatedBoardOccupied = boardOccupied.slice()
	updatedBoardOccupied[location] = 1

	req.body = {
		"board": updatedBoard,
		"occupied": updatedBoardOccupied
	}
	next()
}

module.exports = {
	validator,
	updateBoardWithUserEntry,
}
