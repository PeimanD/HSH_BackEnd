// This module is not used. Schedule endpoints are in the thermostat.js now.

//const { Schedule, validate } = require("../models/schedule");
const auth = require("../middleware/auth");
//const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//get all schedules
router.get("/", [auth], async (req, res) => {
  const schedules = await schedule.find().sort("name");
  res.send(schedules);
});

//create a schedule
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  const schedule = new schedule({
  //add schedule new
  // title: req.body.title,
  // genre: {
  //   _id: genre._id,
  //   name: genre.name
  // },
  // numberInStock: req.body.numberInStock,
  // dailyRentalRate: req.body.dailyRentalRate,
  // publishDate: moment().toJSON()
  //  });
  //  await schedule.save();

  //  res.send(schedule);
  res.send("hello");
});

//edit a schedule
router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const schedule = await schedule.findByIdAndUpdate(
    req.params.id,
    // {
    //   title: req.body.title,
    //   genre: {
    //     _id: genre._id,
    //     name: genre.name
    //   },
    //   numberInStock: req.body.numberInStock,
    //   dailyRentalRate: req.body.dailyRentalRate
    // },
    { new: true }
  );

  if (!schedule)
    return res
      .status(404)
      .send("The schedule with the given ID was not found.");

  res.send(schedule);
});

//delete a schedule
router.delete("/:id", [auth], async (req, res) => {
  const schedule = await schedule.findByIdAndRemove(req.params.id);

  if (!schedule)
    return res
      .status(404)
      .send("The schedule with the given ID was not found.");

  res.send(schedule);
});

//get a schedule
router.get("/:id", [auth], async (req, res) => {
  const schedule = await schedule.findById(req.params.id);

  if (!schedule)
    return res
      .status(404)
      .send("The schedule with the given ID was not found.");

  res.send(schedule);
});

module.exports = router;
