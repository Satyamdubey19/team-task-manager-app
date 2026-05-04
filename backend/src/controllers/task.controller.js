const taskService = require("../services/task.service");
const { sendSuccess } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  sendSuccess(res, { task }, "Task created successfully", 201);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    priority: req.query.priority,
    assignedTo: req.query.assignedTo,
    sort: req.query.sort,
  };
  const tasks = await taskService.getTasksByProject(
    req.params.projectId,
    req.user.id,
    req.user.role,
    filters,
  );
  sendSuccess(
    res,
    { tasks, count: tasks.length },
    "Tasks fetched successfully",
  );
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    req.params.id,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { task }, "Task fetched successfully");
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role,
  );
  sendSuccess(res, { task }, "Task updated successfully");
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, null, "Task deleted successfully");
});

const getMyTasks = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    priority: req.query.priority,
    sort: req.query.sort,
  };
  const tasks = await taskService.getMyTasks(req.user.id, filters);
  sendSuccess(
    res,
    { tasks, count: tasks.length },
    "My tasks fetched successfully",
  );
});

const getOverdueTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getOverdueTasks(req.user.id, req.user.role);
  sendSuccess(
    res,
    { tasks, count: tasks.length },
    "Overdue tasks fetched successfully",
  );
});

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  getOverdueTasks,
};
