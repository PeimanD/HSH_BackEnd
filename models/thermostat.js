const Joi = require('joi');
const { model, Schema } = require('mongoose');

const Thermostat = model('Thermostat', new Schema({
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
  status:{
    type: Boolean,
    default: false
  },
  mode:{
    type: Number,
    minlength: 1,
    maxlength: 3
  },
  setTemp:{
    type: Number,
    required: true,
    default: 20.0
  },
  weekSchedule: {
    mon: [{type: Number, default: 0.0 }],
    tue: [{type: Number, default: 0.0 }],
    wed: [{type: Number, default: 0.0 }],
    thu: [{type: Number, default: 0.0 }],
    fri: [{type: Number, default: 0.0 }],
    sat: [{type: Number, default: 0.0 }],
    sun: [{type: Number, default: 0.0 }],
  },
  authedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
}));

const DayLog = model('DayLog', new Schema({
  year :{
    type: Number,
    min: 1000,
    max: 9999,
    default: false
  },
  month :{
    type: Number,
    min: 1,
    max: 12,
    default: false
  },
  day :{
    type: Number,
    minlength: 1,
    maxlength: 31,
    default: false
  },
  thermostatId: {
    type: String,
    ref: 'Thermostat'
  },
  dayTemps: [Number],
  dayAmbientTemps: [Number],
  is_on: [Boolean],
  minsOn: [Number],
  minsSaved: [Number]
}));

function validateThermostat(thermostat) {
  const schema = {
    authedUsers: Joi.array().items(Joi.object(User)),
    thermostatId: Joi.string().required(),
    masterDevId: Joi.string().required(),
    roomName: Joi.string().required(),
    status: Joi.boolean(),
    mode: Joi.number(),
    setTemp: Joi.number(),
    weekSchedule: Joi.array().items(Joi.object({type: Number, default: 0.0 }))
  };

  return Joi.validate(thermostat, schema);
}

exports.Thermostat = Thermostat;
exports.DayLog = DayLog;
exports.validate = validateThermostat;
