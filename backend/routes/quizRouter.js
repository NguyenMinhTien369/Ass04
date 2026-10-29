const express = require("express");
const router = express.Router();

const {
  getAllQuizzes,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuizById,
  addQuestionToQuiz,
  addManyQuestionsToQuiz,
} = require("../controllers/quizController");

const { authenticate, requireAdmin } = require("../middleware/auth");

// User và admin lấy danh sách quiz
router.get("/", authenticate, getAllQuizzes);

// Chỉ admin được tạo quiz
router.post("/", authenticate, requireAdmin, createQuiz);

// Chỉ admin được thêm một câu hỏi vào quiz
router.post("/:quizId/question", authenticate, requireAdmin, addQuestionToQuiz);

// Chỉ admin được thêm nhiều câu hỏi vào quiz
router.post(
  "/:quizId/questions",
  authenticate,
  requireAdmin,
  addManyQuestionsToQuiz,
);

// User và admin xem chi tiết quiz
router.get("/:quizId", authenticate, getQuizById);

// Chỉ admin được cập nhật quiz
router.put("/:quizId", authenticate, requireAdmin, updateQuiz);

// Chỉ admin được xóa quiz
router.delete("/:quizId", authenticate, requireAdmin, deleteQuizById);

module.exports = router;
