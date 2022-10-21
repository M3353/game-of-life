const Joi = require('joi')

const min = 5;
const max = 100;


const boardSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(64)
    .required(),

  id: Joi.number()
    .integer()
    .required(),

  // number of columns in the board
  height: Joi.number()
    .integer()
    .min(min)
    .max(max)
    .multiple(min)
    .required(),

  // number of rows in the board
  width: Joi.number()
    .integer()
    .min(min)
    .max(max)
    .multiple(min)
    .required(),

  board: Joi.array()
    .length(Joi.ref('width'))
    .items(
      Joi.array()
        .items(
          Joi.number().valid(0)
        )
    )
    .required(),
  
  occupied: Joi.array().items(
    Joi.number().valid(0)
  )
    .length(Joi.ref('width', {
      adjust: (val) => val / min
    }))
    .required(),
})

module.exports = {
  boardSchema
}
