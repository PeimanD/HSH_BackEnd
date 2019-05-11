const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("config");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const passport = require("passport");

/**
 * Logs the user in, returns the jwt with 1h expiry, as an onject in the http response
 */
router.post("/", async (req, res) => {
  const { error } = validateLogin(req);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  /**
   * Either let front-end populate either email or _id field, or figure it out here.
   * Right now we'll default to the generated _id from mongoDB
   */
  // let user = await User.findOne({ email: req.body.email });
  try {
    console.log("finding user: ", req.body._id);
    let user = await User.findOne({ _id: req.body._id });
    if (!user) return res.status(400).send("Invalid id/email or password.");
    console.log("found user");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid password.");

    console.log("password ok");

    // Finally generate token for use
    const payload = {
      _id: user._id,
      email: user.email,
      userName: user.userName
    };
    jwt.sign(
      payload,
      config.get("jwtPrivateKey"),
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          res.send(err);
        } else {
          res.status(200).send({ token });
        }
      }
    );
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Uses mongoDB _id and unhashed password to login
 * @param {the actual http request} req
 */
function validateLogin(req) {
  const filteredReq = _.pick(req.body, ["_id", "password"]);
  console.log(filteredReq);
  const schema = {
    _id: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(filteredReq, schema);
}

module.exports = router;
