const express = require("express");

const { signup, login, me } = require("../controllers/authController");

const { authenticate } = require("../middleware/auth");

const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// Đăng ký
router.post("/signup", validateRequest, signup);

// Đăng nhập
router.post("/login", validateRequest, login);

// Lấy thông tin người dùng đang đăng nhập
router.get("/me", authenticate, me);

module.exports = router;
