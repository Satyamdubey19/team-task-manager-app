const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

class AuthService {
  async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken({ id: user._id, role: user.role });

    return { user: user.toPublicJSON(), token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({ id: user._id, role: user.role });
    return { user: user.toPublicJSON(), token };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user.toPublicJSON();
  }
}

module.exports = new AuthService();
