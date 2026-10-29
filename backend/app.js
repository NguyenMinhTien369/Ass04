var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//1. Connect to MongoDB
const connectDB = require("./connect");
const quizRouter = require("./routes/quizRouter");
const questionRouter = require("./routes/questionRouter");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

//2. Import routers

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

//3. Connect to MongoDB
require("dotenv").config();
connectDB();
if (!process.env.JWT_SECRET) {
  throw new Error("Thiếu JWT_SECRET trong .env");
}
app.use(logger("dev"));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

module.exports = app;
