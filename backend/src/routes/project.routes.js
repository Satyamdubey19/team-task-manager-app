const router = require("express").Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getDashboardStats,
} = require("../controllers/project.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require("../validators/project.validator");

router.use(protect);

router.get("/dashboard/stats", getDashboardStats);

router
  .route("/")
  .get(getAllProjects)
  .post(createProjectValidator, validate, createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProjectValidator, validate, updateProject)
  .delete(deleteProject);

router.route("/:id/members").post(addMemberValidator, validate, addMember);

router.route("/:id/members/:userId").delete(removeMember);

module.exports = router;
