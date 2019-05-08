const Joi = require("joi");
const { model, Schema } = require("mongoose");

const thermostatSchema = new Schema({
  thermostatId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  masterDevId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  roomName: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 1,
    maxlength: 50
  },
  status: {
    type: Boolean,
    default: false
  },
  mode: {
    type: Number,
    minlength: 1,
    maxlength: 3
  },
  setTemp: {
    type: Number,
    required: true,
    default: 20.0
  },
  weekSchedule: {
    mon: [{ type: Number, default: 0.0 }],
    tue: [{ type: Number, default: 0.0 }],
    wed: [{ type: Number, default: 0.0 }],
    thu: [{ type: Number, default: 0.0 }],
    fri: [{ type: Number, default: 0.0 }],
    sat: [{ type: Number, default: 0.0 }],
    sun: [{ type: Number, default: 0.0 }]
  },
  authedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});
thermostatSchema.index({ thermostatId: 1, masterDevId: 1 }, { unique: true });

const Thermostat = model("Thermostat", thermostatSchema);

function validateThermostat(thermostat) {
  const schema = Joi.object().keys({
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required(),
    roomName: Joi.string().required(),
    status: Joi.boolean(),
    mode: Joi.number(),
    setTemp: Joi.number()
    // weekSchedule: Joi.object(Joi.array().items(Joi.number()))
  });

  return Joi.validate(thermostat, schema);
}

const validateSchedule = req => {
  const schema = Joi.object().keys({
    weekSchedule: Joi.object().required()
  });
  return Joi.validate(thermostat, schema);
};

exports.Thermostat = Thermostat;
exports.validateThermostat = validateThermostat;
exports.validateSchedule = validateSchedule;
