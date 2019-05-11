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
      default: false,
      required: true
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: false,
      required: true
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: false,
      required: true
    },
    masterDevId: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      ref: "Thermostat"
    },
    thermostatId: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      ref: "Thermostat"
    },
    cTemps: { type: [Number], default: default144Size, required: true },
    oTemps: { type: [Number], default: default144Size, required: true },
    sTemps: { type: [Number], default: default144Size, required: true },
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
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required()
  };
  return Joi.validate(log, schema);
}

exports.DayLog = DayLog;
exports.validate = validateLog;
