var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var scheduleRouter = require("./routes/schedules");
var thermostatRouter = require("./routes/thermostats");
var logRouter = require("./routes/logs");
var authRouter = require("./routes/auth");

var app = express();

require("./startup/db")();
require("./startup/config")();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/thermostat", thermostatRouter);
app.use("/api/log", logRouter);

module.exports = app;
