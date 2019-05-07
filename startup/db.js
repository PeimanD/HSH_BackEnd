const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  const db = config.get("db");
  mongoose.Promise = global.Promise;
  mongoose
    .connect(db, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(() => {
      console.log("failed to connect");
    });
};
