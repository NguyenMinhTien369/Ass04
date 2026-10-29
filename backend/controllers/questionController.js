const Question = require("../models/Question");

// GET /questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /questions/:questionId
const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.questionId || req.params.id;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /questions
const createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswerIndex, keywords } = req.body;
    const newQuestion = new Question({
      text,
      options,
      correctAnswerIndex,
      keywords: keywords || [],
    });

    const savedQuestion = await newQuestion.save();
    return res.status(201).json(savedQuestion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /questions/:questionId
const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId || req.params.id;
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(updatedQuestion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /questions/:questionId
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId || req.params.id;
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
