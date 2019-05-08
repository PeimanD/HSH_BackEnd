const { Thermostat, validateSchedule } = require("../models/thermostat");
const auth = require("../middleware/auth");
//const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

/**
 * Gets all thermostats for the user with provided JWT token
 */
router.get("/", [auth], async (req, res) => {
  console.log("grabbing ", req.user._id, " thermostats...");
  const thermostats = await Thermostat.find({
    authedUsers: req.user._id
  }).sort("thermostatId");
  console.log(thermostats);
  res.send({ thermostats });
});

//create a thermostat
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const thermostat = new thermostat({
    //add thermostat new
    // title: req.body.title,
    // genre: {
    //   _id: genre._id,
    //   name: genre.name
    // },
    // numberInStock: req.body.numberInStock,
    // dailyRentalRate: req.body.dailyRentalRate,
    // publishDate: moment().toJSON()
  });
  await thermostat.save();

  res.send(thermostat);
});

/**
 * Update thermostat schedule
 */
router.put("/schedule", [auth], async (req, res) => {
  const { error } = validateSchedule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const thermostat = await thermostat.findByIdAndUpdate(
    req.params.id,
    // {
    //   manual: req.body.title,
    //   ther: {
    //     _id: genre._id,
    //     name: genre.name
    //   },
    //   numberInStock: req.body.numberInStock,
    //   dailyRentalRate: req.body.dailyRentalRate
    // },
    { new: true }
  );

  if (!thermostat)
    return res
      .status(404)
      .send("The thermostat with the given ID was not found.");

  res.send(thermostat);
});

//delete a thermostat
router.delete("/:id", [auth], async (req, res) => {
  const thermostat = await thermostat.findByIdAndRemove(req.params.id);

  if (!thermostat)
    return res
      .status(404)
      .send("The thermostat with the given ID was not found.");

  res.send(thermostat);
});

//get a thermostat
router.get("/:id", [auth], async (req, res) => {
  const thermostat = await thermostat.findById(req.params.id).select("-__v");

  if (!thermostat)
    return res
      .status(404)
      .send("The thermostat with the given ID was not found.");

  res.send(thermostat);
});

module.exports = router;
