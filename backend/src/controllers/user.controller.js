const userService = require("../services/user.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  sendSuccess(
    res,
    { users, count: users.length },
    "Users fetched successfully",
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, { user }, "User fetched successfully");
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess(res, { user }, "Profile updated successfully");
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, null, "Password changed successfully");
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, null, "User deleted successfully");
});

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteUser,
};
