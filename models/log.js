const Joi = require("joi");
const { model, Schema } = require("mongoose");

const default144Size = new Array(144).fill(0);
const default144SizeBool = new Array(144).fill(null);

const DayLog = model(
  "DayLog",
  new Schema({
    year: {
      type: Number,
      min: 1000,
      max: 9999,
      default: false
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: false
    },
    day: {
      type: Number,
      minlength: 1,
      maxlength: 31,
      default: false
    },
    thermostatId: {
      type: String,
      ref: "Thermostat"
    },
    dayTemps: { type: [Number], default: default144Size, required: true },
    dayAmbientTemps: {
      type: [Number],
      default: default144Size,
      required: true
    },
    isOn: { type: [Boolean], default: default144SizeBool, required: true },
    minsOn: { type: [Number], default: default144Size, required: true },
    minsSaved: { type: [Number], default: default144Size, required: true }
  })
);

function validateLog(log) {
  const schema = {
    year: Joi.number().required(),
    month: Joi.number().required(),
    day: Joi.number().required(),
    thermostatId: Joi.string().required()
  };

  return Joi.validate(log, schema);
}

exports.DayLog = DayLog;
exports.validate = validateLog;
