const { body } = require("express-validator");

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be 3–150 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid assignee ID"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .toDate(),
];

const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be 3–150 characters"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid assignee ID"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .toDate(),
];

module.exports = { createTaskValidator, updateTaskValidator };
