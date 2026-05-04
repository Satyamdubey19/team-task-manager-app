const User = require("../models/user.model");
const AppError = require("../utils/AppError");

class UserService {
  async getAllUsers() {
    return User.find().select("-password").sort("name");
  }

  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async updateProfile(userId, updates) {
    const allowed = ["name", "avatar"];
    const filtered = {};
    allowed.forEach((k) => {
      if (updates[k] !== undefined) filtered[k] = updates[k];
    });

    const user = await User.findByIdAndUpdate(userId, filtered, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect", 401);

    user.password = newPassword;
    await user.save();
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new AppError("User not found", 404);
  }
}

module.exports = new UserService();
