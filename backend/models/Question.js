const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: "__v",
  },
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
