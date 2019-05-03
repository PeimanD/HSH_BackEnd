const Joi = require("joi");
const mongoose = require("mongoose");

const user = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 50
    },
    isGold: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 5,
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
    phone: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 50
    },
    age: {
      type: Number,
      required: true
    },
    favTemp: {
      type: Number
    }
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(50)
      .required(),
    isGold: Joi.boolean(),
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required(),
    age: Joi.number(),
    favTemp: Joi.number()
  };

  return Joi.validate(user, schema);
}

//Run once to create collection
const initUsers = async () => {
  try {
    await user.createCollection();
    console.log("user collection is successfully created ");
  } catch (e) {
    console.log("user collection cannot be created");
  }
};
initUsers();

exports.User = user;
exports.validate = validateUser;
