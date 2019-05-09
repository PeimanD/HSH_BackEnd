const {
  Thermostat,
  validateSchedule,
  validateThermostat
} = require("../models/thermostat");
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

/**
 * Create a new thermostat
 */
router.post("/new", [auth], async (req, res) => {
  const { error } = validateThermostat(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const thermostat = new thermostat({});
  await thermostat.save();

  res.send(thermostat);
});

/**
 * Update thermostat schedule
 * {
	"weekSchedule" : {
		"mon" : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		"tue" : [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		"wed" : [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
		"thu" : [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		"fri" : [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
		"sat" : [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
		"sun" : [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
	},
	"thermostatId" : "pre-ree",
	"masterDevId" : "ree"
}

 */
router.put("/schedule", [auth], async (req, res) => {
  const { error } = validateSchedule(req.body.weekSchedule);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let { thermostatId, masterDevId, weekSchedule } = req.body;
  // Build query params
  let query = { thermostatId, masterDevId };
  let update = {
    $set: {
      weekSchedule
    }
  };
  let options = { new: true }; // Returns the updated document instead
  try {
    const thermostat = await Thermostat.findOneAndUpdate(
      query,
      update,
      options
    );
    res.status(200).send(thermostat);
  } catch (e) {
    res.status(400).send(e);
  }
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
