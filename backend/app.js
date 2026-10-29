var express = require("express");
var logger = require("morgan");

//1. Connect to MongoDB
const connectDB = require("./connect");
const quizRouter = require("./routes/quizRouter");
const questionRouter = require("./routes/questionRouter");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

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
app.use(express.urlencoded({ extended: false }));

// Health check for local development and Vercel.
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Quiz API is running.",
  });
});

// Return JSON for unknown API routes.
app.use(function (req, res) {
  return res.status(404).json({
    message: "API route not found.",
  });
});

// Return JSON for unexpected server errors.
app.use(function (err, req, res, next) {
  console.error(err);

  return res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
});

module.exports = app;
