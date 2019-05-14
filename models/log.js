const Joi = require("joi");
const { model, Schema } = require("mongoose");

const default144Size = new Array(144).fill(0);
const default144SizeBool = new Array(144).fill(false);

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

function validateDayLog(log) {
  const schema = {
    _id: Joi.object(),
    year: Joi.number()
      .min(1000)
      .max(9999)
      .required(),
    month: Joi.number()
      .min(1)
      .max(12)
      .required(),
    day: Joi.number()
      .min(1)
      .max(31)
      .required(),
    thermostatId: Joi.string()
      .min(5)
      .max(50)
      .required(),
    masterDevId: Joi.string()
      .min(5)
      .max(50)
      .required(),
    cTemps: Joi.array()
      .items(Joi.number())
      .length(144)
      .required(),
    oTemps: Joi.array()
      .items(Joi.number())
      .length(144)
      .required(),
    sTemps: Joi.array()
      .items(Joi.number())
      .length(144)
      .required(),
    isOn: Joi.array()
      .items(Joi.boolean())
      .length(144)
      .required(),
    minsOn: Joi.array()
      .items(Joi.number())
      .length(144)
      .required(),
    minsSaved: Joi.array()
      .items(Joi.number())
      .length(144)
      .required()
  };
  return Joi.validate(log, schema);
}

exports.DayLog = DayLog;
exports.validateDayLog = validateDayLog;
