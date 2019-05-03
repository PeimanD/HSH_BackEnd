const Joi = require('joi');
const { model, Schema } = require('mongoose');

const User = model('User', new Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  // isGold: {
  //   type: Boolean,
  //   default: false
  // },
  // phone: {
  //   type: String,
  //   required: false,
  //   minlength: 5,
  //   maxlength: 50
  // },
  // age: {
  //   type: Number,
  //   required: true
  // },
  // favTemp: {
  //   type: Number
  // }
}));

function validateUser(user) {
  const schema = {
    username: Joi.string().min(2).max(50).required(), 
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required(),
    age: Joi.number(),
    favTemp: Joi.number()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
