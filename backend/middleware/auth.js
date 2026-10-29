const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    // Header có dạng: Authorization: Bearer TOKEN
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Bạn cần đăng nhập.",
      });
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Authorization không hợp lệ.",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub).select(
      "_id username admin",
    );

    if (!user) {
      return res.status(401).json({
        message: "Tài khoản không tồn tại.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).json({
      message: "Chỉ admin được thực hiện thao tác này.",
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin,
};
