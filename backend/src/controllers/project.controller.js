const projectService = require("../services/project.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user.id);
  sendSuccess(res, { project }, "Project created successfully", 201);
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects(
    req.user.id,
    req.user.role,
  );
  sendSuccess(
    res,
    { projects, count: projects.length },
    "Projects fetched successfully",
  );
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(
    req.params.id,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { project }, "Project fetched successfully");
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { project }, "Project updated successfully");
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, null, "Project deleted successfully");
});

const addMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const project = await projectService.addMember(
    req.params.id,
    userId,
    role,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { project }, "Member added successfully");
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await projectService.removeMember(
    req.params.id,
    req.params.userId,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { project }, "Member removed successfully");
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await projectService.getDashboardStats(
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { stats }, "Dashboard stats fetched successfully");
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getDashboardStats,
};
