const Joi = require("joi");
const { minDim, maxDim, entrySize } = require("./data");

const namePattern = /^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/;
const boardSchema = Joi.object({
  name: Joi.string().min(3).max(64).pattern(namePattern).required(),

  id: Joi.number().integer().required(),

  ready: Joi.boolean(),

  rows: Joi.number()
    .integer()
    .min(minDim)
    .max(maxDim)
    .multiple(entrySize)
    .required(),

  columns: Joi.number()
    .integer()
    .min(minDim)
    .max(maxDim)
    .multiple(entrySize)
    .required(),

  board: Joi.array(),
  occupied: Joi.array(),
});

const entrySchema = Joi.object({
  board: Joi.array()
    .items(Joi.array().items(Joi.number().valid(0, 1)))
    .required(),

  boardOccupied: Joi.array()
    .items(Joi.array().items(Joi.number().valid(0, 1)))
    .required(),

  location: Joi.number().integer().required(),

  entry: Joi.array()
    .length(entrySize)
    .items(Joi.array().items(Joi.number().valid(0, 1)))
    .required(),
});

module.exports = {
  boardSchema,
  entrySchema,
};
