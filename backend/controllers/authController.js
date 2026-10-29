const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Chỉ trả những thông tin được phép công khai.
const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  admin: user.admin,
});

const signup = async (req, res) => {
  try {
    const { username, password, admin = false } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Tên đăng nhập đã tồn tại.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      passwordHash,
      admin,
    });

    return res.status(201).json({
      message: "Đăng ký thành công.",
      user: publicUser(user),
    });
  } catch (error) {
    // Xử lý cả trường hợp hai request đăng ký cùng lúc.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Tên đăng nhập đã tồn tại.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Không thể đăng ký tài khoản.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // passwordHash có select: false, nên phải lấy rõ ràng.
    const user = await User.findOne({ username }).select("+passwordHash");

    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Tên đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user._id.toString(),
      algorithm: "HS256",
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể đăng nhập.",
    });
  }
};

const me = (req, res) => {
  return res.status(200).json({
    user: publicUser(req.user),
  });
};

module.exports = {
  signup,
  login,
  me,
};
