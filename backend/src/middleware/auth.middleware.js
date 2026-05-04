const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.model");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided. Please log in.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }

  const user = await User.findById(decoded.id).select("_id role name email");
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
});

module.exports = { protect };
