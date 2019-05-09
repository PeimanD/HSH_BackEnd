const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const scheduleRouter = require("./routes/schedules");
const thermostatRouter = require("./routes/thermostats");
const logRouter = require("./routes/logs");
const authRouter = require("./routes/auth");
const cors = require("cors");
const app = express();

require("./startup/db")();
require("./startup/config")();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080"
  })
); //For all requests
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/thermostat", thermostatRouter);
app.use("/api/log", logRouter);

module.exports = app;
