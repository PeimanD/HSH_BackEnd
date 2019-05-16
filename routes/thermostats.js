const {
  Thermostat,
  validateSchedule,
  validateMode,
  validateStatus,
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
 * Get a thermostat
 */
router.get("/", [auth], async (req, res) => {
  const masterDevId = req.query.master_id;
  const thermostatId = req.query.thermostat_id;

  if (!(masterDevId && thermostatId)) {
    return res.status(404).send("Missing parameters.");
  }

  const thermostat = await Thermostat.findOne({
    masterDevId: masterDevId,
    thermostatId: thermostatId
  });

  if (!thermostat) {
    return res
      .status(404)
      .send("The thermostat with the given IDs was not found.");
  }

  return res.status(200).send(thermostat);
});

/**
 * Gets all thermostats for the user with provided JWT token
 */
router.get("/all", [auth], async (req, res) => {
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
  req.body : {
    "weekSchedule" : {
      "mon" : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      "tue" : [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      "wed" : [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      "thu" : [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
      "fri" : [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
      "sat" : [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
      "sun" : [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    },
    "thermostatId" : "xxxxxx",
    "masterDevId" : "yyyyyy"
  }
 */
router.put("/schedule", [auth], async (req, res) => {
  const error =
    validateSchedule(req.body.weekSchedule).error ||
    validateMode(_.pick(req.body, ["thermostatId", "masterDevId", "mode"]))
      .error ||
    validateStatus(_.pick(req.body, ["thermostatId", "masterDevId", "status"]))
      .error;

  console.log("schedule update error: ", error);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let { thermostatId, masterDevId, weekSchedule, mode, status } = req.body;
  // Build query params
  let query = { thermostatId, masterDevId };
  let update = {
    $set: {
      weekSchedule,
      mode,
      status
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

/**
 * Update status of a specific thermostat
 */
router.put("/status", [auth], async (req, res) => {
  const { error } = validateStatus(req.body.weekSchedule);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let { thermostatId, masterDevId, status } = req.body;
});

/**
 * Update mode of a specific thermostat
 */
router.put("/mode", [auth], async (req, res) => {
  const { error } = validateMode(req.body.weekSchedule);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let { thermostatId, masterDevId, mode } = req.body;
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
// router.get("/:id", [auth], async (req, res) => {
//   const thermostat = await thermostat.findById(req.params.id).select("-__v");

//   if (!thermostat)
//     return res
//       .status(404)
//       .send("The thermostat with the given ID was not found.");

//   res.send(thermostat);
// });

module.exports = router;
