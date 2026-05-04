const { body } = require("express-validator");

const createProjectValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be 3–100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Invalid status"),
];

const updateProjectValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be 3–100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Invalid status"),
];

const addMemberValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
};
