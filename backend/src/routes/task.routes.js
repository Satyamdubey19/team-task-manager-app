const router = require("express").Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  getOverdueTasks,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createTaskValidator,
  updateTaskValidator,
} = require("../validators/task.validator");

router.use(protect);

router.get("/my", getMyTasks);
router.get("/overdue", getOverdueTasks);
router.get("/project/:projectId", getTasksByProject);

router.route("/").post(createTaskValidator, validate, createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(updateTaskValidator, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
