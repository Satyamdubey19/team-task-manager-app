const Task = require("../models/task.model");
const Project = require("../models/project.model");
const AppError = require("../utils/AppError");

class TaskService {
  async createTask(data, creatorId) {
    const project = await Project.findById(data.project);
    if (!project) throw new AppError("Project not found", 404);

    this._assertProjectAccess(project, creatorId);

    const task = await Task.create({ ...data, createdBy: creatorId });
    return task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email" },
    ]);
  }

  async getTasksByProject(projectId, userId, userRole, filters = {}) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);

    if (userRole !== "admin") {
      this._assertProjectAccess(project, userId);
    }

    const query = { project: projectId };
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .sort(filters.sort || "-createdAt");

    return tasks;
  }

  async getTaskById(taskId, userId, userRole) {
    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) throw new AppError("Task not found", 404);

    if (userRole !== "admin") {
      const project = await Project.findById(task.project._id);
      this._assertProjectAccess(project, userId);
    }

    return task;
  }

  async updateTask(taskId, updates, userId, userRole) {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    if (userRole !== "admin") {
      const project = await Project.findById(task.project);
      this._assertProjectAccess(project, userId);
    }

    const allowed = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "assignedTo",
      "tags",
    ];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) task[field] = updates[field];
    });

    await task.save();
    return task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email" },
    ]);
  }

  async deleteTask(taskId, userId, userRole) {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    if (userRole !== "admin") {
      const project = await Project.findById(task.project);
      const member = project.members.find((m) => m.user.toString() === userId);
      const isCreator = task.createdBy.toString() === userId;
      if (!isCreator && (!member || member.role !== "admin")) {
        throw new AppError("Access denied", 403);
      }
    }

    await task.deleteOne();
  }

  async getMyTasks(userId, filters = {}) {
    const query = { assignedTo: userId };
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("createdBy", "name email")
      .sort(filters.sort || "-createdAt");

    return tasks;
  }

  async getOverdueTasks(userId, userRole) {
    const now = new Date();
    const query = {
      dueDate: { $lt: now },
      status: { $ne: "done" },
    };

    if (userRole !== "admin") {
      query.assignedTo = userId;
    }

    return Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .sort("dueDate");
  }

  _assertProjectAccess(project, userId) {
    const isMember = project.members.some(
      (m) => m.user.toString() === userId.toString(),
    );
    if (!isMember)
      throw new AppError("Access denied: not a project member", 403);
  }
}

module.exports = new TaskService();
