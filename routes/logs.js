const { DayLog } = require("../models/log");
const auth = require("../middleware/auth"); //Unsure if we actually need an auth
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

/**
 * Get a daylog. Authentication is requried.
 *
 * @param master_id master Pi device ID
 * @param thermostat_id thermostat ID
 * @param year the year of the daylog
 * @param month the month of the daylog
 * @param day the day of the daylog
 *
 * @return the daylog or error
 */
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

/**
 * Add a daylog.
 *
 * @param master_id master Pi device ID
 * @param thermostat_id thermostat ID
 * @param year the year of the daylog
 * @param month the month of the daylog
 * @param day the day of the daylog
 */
router.post("/day", async (req, res) => {
  let dayLog = new DayLog(
    _.pick(req.body, ["year", "month", "day", "thermostatId", "masterDevId"])
  );

  try {
    await dayLog.save();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * Update a daylog.
 *
 * @param thermostat_id thermostat ID
 * @param day the day of the daylog to update
 * @param month the month of the daylog to update
 * @param year the year of the daylog to update
 * @param index the time slot index of the daylog to update
 * @param temp the value of the set temperature
 * @param ambientTemp the value of the ambient temperature
 * @param isOn the On/Off status
 * @param minsOn the duration of the on status in the time slot
 * @param minsSaved the value of the saved energy
 */
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
 * Get weekly data.
 *
 * @param master_id master Pi device ID
 * @param thermostat_id thermostat ID
 * @param year the year of the daylog
 * @param month the month of the daylog
 * @param day the day of the daylog
 *
 * @return the weekly log or error
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
    results === undefined || results.length === 0
      ? res.status(404).send("Record not found")
      : res.send(results);
  } catch (e) {
    res.status(404).send(e);
  }
});

/**
 * Get monthly data.
 *
 * @param master_id master Pi device ID
 * @param thermostat_id thermostat ID
 * @param year the year of the daylog
 * @param month the month of the daylog
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
    results === undefined || results.length === 0
      ? res.status(404).send("Record not found")
      : res.send(results);
  } catch (e) {
    res.status(404).send(e);
  }
});

/**
 * Get yearly data.
 *
 * @param master_id master Pi device ID
 * @param thermostat_id thermostat ID
 * @param year the year of the daylog
 */
router.get("/year", async (req, res) => {
  let { year, thermostat_id, master_id } = req.query;
  try {
    let results = await DayLog.find({
      year,
      thermostatId: thermostat_id,
      masterDevId: master_id
    });
    results === undefined || results.length === 0
      ? res.status(404).send("Record not found")
      : res.send(results);
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
