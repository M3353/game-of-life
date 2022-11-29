const Joi = require("joi");
const { minDim, maxDim, entrySize } = require("./data");

const boardSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(64).required(),

  id: Joi.number().integer().required(),

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

  board: Joi.array()
    .length(Joi.ref("rows"))
    .items(Joi.array().items(Joi.number().valid(0))),

  occupied: Joi.array().items(Joi.number().valid(0)),
});

const entrySchema = Joi.object({
  board: Joi.array()
    .items(Joi.array().items(Joi.number().valid(0, 1)))
    .required(),

  boardOccupied: Joi.array().items(Joi.number().valid(0, 1)).required(),

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
