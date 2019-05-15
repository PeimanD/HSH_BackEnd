const { DayLog } = require("../models/log");
const auth = require("../middleware/auth"); //Unsure if we actually need an auth
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Get a daylog
router.get("/day", [auth], async (req, res) => {
  const masterDevId = req.query.master_id;
  const thermostatId = req.query.thermostat_id;
  const year = req.query.year;
  const month = req.query.month;
  const day = req.query.day;

  if (!(masterDevId && thermostatId && year && month && day)) {
    return res.status(404).send("Missing parameters.");
  }

  const dayLog = await DayLog.findOne({
    masterDevId: masterDevId,
    thermostatId: thermostatId,
    year: year,
    month: month,
    day: day
  });

  if (!dayLog) {
    return res.status(404).send("No record found.");
  }

  return res.status(200).send(dayLog);
});

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
 * Get weekly data
 */
router.get("/week", async (req, res) => {
  let { year, month, day, thermostat_id, master_id } = req.query;
  let curr = new Date(year, month - 1, day);
  console.log("montH: ", month);
  let query = {
    $or: [],
    masterDevId: master_id,
    thermostatId: thermostat_id
  };
  // Over
  for (let i = 0; i < 7; i++) {
    query.$or.push({
      month: curr.getMonth() + 1,
      year: curr.getFullYear(),
      day: curr.getDate()
    });
    curr.setDate(curr.getDate() + 1);
  }
  try {
    let results = await DayLog.find(query);
    console.log(results);
    (results === undefined || results.length == 0) ? 
      res.send(results) : res.status(404).send("Record not found");
  } catch (e) {
    res.status(404).send(e);
  }
});

/**
 * Get monthly data
 */
router.get("/month", async (req, res) => {
  let { year, month, thermostat_id, master_id } = req.query;
  try {
    let results = await DayLog.find({
      year,
      month,
      masterDevId: master_id,
      thermostatId: thermostat_id
    });
    res.send(results);
  } catch (e) {
    res.status(404).send(e);
  }
});

/**
 * Get yearly data
 */
router.get("/year", async (req, res) => {
  let { year, thermostat_id, master_id } = req.query;
  try {
    let results = await DayLog.find({
      year,
      thermostatId: thermostat_id,
      masterDevId: master_id
    });
    res.send(results);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Dev only, populate data for day log
 */
router.post("/dev/days", async (req, res) => {
  // console.log("request datatype: ", req.headers["content-type"]);
  let { logs } = req.body.data;
  // logs.forEach(e => {
  //   console.log(
  //     `thermoId: ${e.thermostatId} masterDevId: ${e.masterDevId} month: ${
  //       e.month
  //     } day: ${e.day}`
  //   );
  // });
  DayLog.collection.insert(logs, (err, docs) => {
    if (err) {
      res.status(400).send(e);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
