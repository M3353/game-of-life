const schemas = require('./board-schema')

const validator = function (schema) {
	// check if the schema exists
	if (!schemas.hasOwnProperty(schema)) {
		throw new Error(`Schema ${schema} does not exist`)
	}

	return function(req, res, next) {
		const {err} = schemas[schema].validate(req.body)
		if (err) {
			return err.isJoi 
				? res.status(422).json({
						status: err
					})
				: res.status(500)
		}
		next()
	}
}

module.exports = validator
