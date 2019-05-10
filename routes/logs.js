const { DayLog } = require("../models/log");
const auth = require("../middleware/auth"); //Unsure if we actually need an auth
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Add a daylog
router.post("/day", async (req, res) => {
  // console.log("request get: ", req.body);
  let dayLog = new DayLog(
    _.pick(req.body, ["year", "month", "day", "thermostatId", "masterDevId"])
  );
  // console.log(dayLog);
  try {
    await dayLog.save();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

// Update a daylog
router.put("/day", async (req, res) => {
  let {
    thermostatId,
    day,
    month,
    year,
    index,
    temp,
    ambientTemp,
    isOn,
    minsOn,
    minsSaved
  } = req.body;
  let query = { thermostatId, day, month, year };
  let update = {
    $set: {}
  };
  update.$set[`dayTemps.${index}`] = temp;
  update.$set[`dayAmbientTemps.${index}`] = ambientTemp;
  update.$set[`isOn.${index}`] = isOn;
  update.$set[`minsOn.${index}`] = minsOn;
  update.$set[`minsSaved.${index}`] = minsSaved;

  await DayLog.findOneAndUpdate(query, update, (err, doc) => {
    if (err) {
      res.status(err).send("hmm");
    }
    res.sendStatus(200);
  });
});

/**
 * Dev only, populate data for day log
 */
router.post("/dev/days", async (req, res) => {
  console.log("request datatype: ", req.headers["content-type"]);
  console.log("request get: ", req.body.data.logs[0]);
  // let dayLog = new DayLog(
  //   _.pick(req.body, ["year", "month", "day", "thermostatId"])
  // );
  // // console.log(dayLog);
  // try {
  //   await dayLog.save();
  //   res.sendStatus(200);
  // } catch (e) {
  //   console.error(e);
  //   res.status(400).send(e);
  // }

  res.sendStatus(200);
});

module.exports = router;
