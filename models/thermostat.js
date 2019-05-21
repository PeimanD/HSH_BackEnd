const Joi = require("joi");
const { model, Schema } = require("mongoose");

const defaultSchedTemps = new Array(24).fill(20);

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
    maxlength: 3,
    default: 0
  },
  setTemp: {
    type: Number,
    required: true,
    default: 20.0
  },
  currentTemp: {
    type: Number,
    required: true,
    default: 0.0
  },
  weekSchedule: {
    mon: { type: [Number], default: defaultSchedTemps, required: true },
    tue: { type: [Number], default: defaultSchedTemps, required: true },
    wed: { type: [Number], default: defaultSchedTemps, required: true },
    thu: { type: [Number], default: defaultSchedTemps, required: true },
    fri: { type: [Number], default: defaultSchedTemps, required: true },
    sat: { type: [Number], default: defaultSchedTemps, required: true },
    sun: { type: [Number], default: defaultSchedTemps, required: true }
  },
  authedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});
thermostatSchema.index({ thermostatId: 1, masterDevId: 1 }, { unique: true });

const Thermostat = model("Thermostat", thermostatSchema);

const validateNewThermostat = thermostat => {
  const schema = Joi.object().keys({
    _id: Joi.object(),
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required(),
    roomName: Joi.string().required(),
    status: Joi.boolean(),
    mode: Joi.number(),
    setTemp: Joi.number().required(),
    currentTemp: Joi.number().required(),
    authedUsers: Joi.array().items(Joi.object()),
    weekSchedule: Joi.object().keys({
      mon: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      tue: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      wed: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      thu: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      fri: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      sat: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      sun: Joi.array()
        .items(Joi.number())
        .length(24)
        .required()
    })
  });

  return Joi.validate(thermostat, schema);
};

const validateSchedule = schedule => {
  // console.log("sched ", schedule);
  const schema = Joi.object()
    .keys({
      mon: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      tue: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      wed: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      thu: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      fri: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      sat: Joi.array()
        .items(Joi.number())
        .length(24)
        .required(),
      sun: Joi.array()
        .items(Joi.number())
        .length(24)
        .required()
    })
    .required();
  return Joi.validate(schedule, schema);
};

const validateMode = thermostat => {
  const schema = Joi.object().keys({
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required(),
    mode: Joi.number().required()
  });
  console.log("validate mode: ", Joi.validate(thermostat, schema).error);
  // console.log(thermostat);
  return Joi.validate(thermostat, schema);
};

const validateStatus = thermostat => {
  const schema = Joi.object().keys({
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required(),
    status: Joi.boolean().required()
  });
  console.log("validate status: ", Joi.validate(thermostat, schema).error);
  // console.log(thermostat);
  return Joi.validate(thermostat, schema);
};

exports.Thermostat = Thermostat;
exports.validateNewThermostat = validateNewThermostat;
exports.validateSchedule = validateSchedule;
exports.validateStatus = validateStatus;
exports.validateMode = validateMode;
