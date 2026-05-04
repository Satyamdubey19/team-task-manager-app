const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteUser,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");

router.use(protect);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/profile/me", updateProfile);
router.put("/profile/password", changePassword);
router.delete("/:id", restrictTo("admin"), deleteUser);

module.exports = router;
