require("./config/dbConfig");
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cron = require("node-cron");
var indexRouter = require("./routes/index.routes");
var usersRouter = require("./routes/users.routes");
const contractsRouter = require("./routes/contracts.routes");
const authRouter = require("./routes/auth.routes");
const Contract = require("./models/Contract.model");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/contracts", contractsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Runs everyday at 01h00 to check the start date of contracts and change the status
cron.schedule(" 0 1 * * * ", async () => {
  const today = new Date().toISOString();
  await Contract.findOneAndUpdate(
    {
      status: "pending",
      start_date: { $lt: today },
    },
    { $set: { status: "active" } },
    { returnNewDocument: true },
    (err, data) => {
      if (err) {
        return errorHandler(dbError, res);
      }
    }
  );
});
// Runs everyday at 01h00 to check the end date of contracts and change the status
cron.schedule(" 0 1 * * * ", async () => {
  const today = new Date().toISOString();
  await Contract.findOneAndUpdate(
    {
      status: "active",
      end_date: { $gte: today },
    },
    { $set: { status: "finished" } },
    { returnNewDocument: true },
    (err, data) => {
      if (err) {
        return errorHandler(dbError, res);
      }
    }
  );
});

// custom error handler
require("./error-handling/index")(app);

module.exports = app;
