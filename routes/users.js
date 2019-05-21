const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

/**
 * Get a user information. Authentication is required.
 *
 * @return the user information associated with the token
 */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  console.log(user);
  res.send(user);
});

/**
 * Register new user.
 *
 * @param email the email address of the new user
 *
 * @return access token or error
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["userName", "email", "password"]));
  try {
    console.log("Salting start");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log("Waiting user to save: ", user);
    await user.save();
    console.log("User saved!");

    res
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "userName", "email"]));
  } catch (e) {
    return res.status(400);
  }
});

module.exports = router;
