const boardSchema = require('./board-schema').boardSchema

const validateBoard = function (req, res, next) {
	const validation = boardSchema.validate(req.body)
	if (validation.error) {
		return res.status(422).json({
			status: validation.error,
		})
  }
	next()
}

module.exports = {
	validateBoard
}
