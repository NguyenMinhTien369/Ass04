const express = require("express");
const router = express.Router();

const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

const { authenticate, requireAdmin } = require("../middleware/auth");

// Admin lấy danh sách câu hỏi
router.get("/", authenticate, requireAdmin, getAllQuestions);

// Admin tạo câu hỏi
router.post("/", authenticate, requireAdmin, createQuestion);

// Admin xem chi tiết câu hỏi
router.get("/:questionId", authenticate, requireAdmin, getQuestionById);

// Admin cập nhật câu hỏi
router.put("/:questionId", authenticate, requireAdmin, updateQuestion);

// Admin xóa câu hỏi
router.delete("/:questionId", authenticate, requireAdmin, deleteQuestion);

module.exports = router;
