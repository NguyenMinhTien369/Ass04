const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// 1. GET /quizzes - Lấy danh sách tất cả các bài quiz, populate questions
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    return res.status(200).json(quizzes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//

const createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const newQuiz = new Quiz({ title, description, questions: [] });
    const savedQuiz = await newQuiz.save();

    return res.status(201).json({
      message: `Added the quiz with id: ${savedQuiz._id}`,
      quiz: savedQuiz,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 3. GET /quizzes/:quizId - Lấy chi tiết quiz theo ID (có populate questions)
const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId || req.params.id;
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 4. DELETE /quizzes/:id - Xóa bài quiz theo ID, trả về null (mã 200 OK)
const deleteQuizById = async (req, res) => {
  try {
    const quizId = req.params.id || req.params.quizId;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({
      message: "Quiz deleted successfully",
      deletedQuiz,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// // 5. GET /quizzes/:quizId/populate (Task 3) - Populate questions có match regex từ 'capital'
// const getQuizPopulateCapital = async (req, res) => {
//   try {
//     const quizId = req.params.quizId || req.params.id;
//     const quiz = await Quiz.findById(quizId).populate({
//       path: 'questions',
//       match: { text: { $regex: /capital/i } }
//     });

//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }

//     return res.status(200).json(quiz);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// 6. POST /quizzes/:quizId/question (Task 4)
const addQuestionToQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId || req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const { text, options, correctAnswerIndex, keywords } = req.body;
    const newQuestion = new Question({
      text,
      options,
      correctAnswerIndex,
      keywords: keywords || [],
    });

    const savedQuestion = await newQuestion.save();

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    return res.status(201).json(savedQuestion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 7. POST /quizzes/:quizId/questions (Task 5) - Thêm nhiều câu hỏi vào quiz
const addManyQuestionsToQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId || req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionsData = req.body;
    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(400).json({
        message: "Request body must be a non-empty array of questions.",
      });
    }

    const savedQuestions = await Question.insertMany(questionsData);
    const questionIds = savedQuestions.map((q) => q._id);

    quiz.questions.push(...questionIds);
    await quiz.save();

    return res.status(200).json({ message: "Questions added successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json(updatedQuiz);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  createQuiz,
  getQuizById,
  deleteQuizById,
  // getQuizPopulateCapital,
  addQuestionToQuiz,
  addManyQuestionsToQuiz,
  updateQuiz,
};
