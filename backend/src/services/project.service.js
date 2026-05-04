const Project = require("../models/project.model");
const Task = require("../models/task.model");
const AppError = require("../utils/AppError");

class ProjectService {
  async createProject({ name, description, status }, ownerId) {
    const project = await Project.create({
      name,
      description,
      status,
      owner: ownerId,
    });
    return project.populate("owner", "name email");
  }

  async getAllProjects(userId, userRole) {
    const filter = userRole === "admin" ? {} : { "members.user": userId };

    const projects = await Project.find(filter)
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort("-createdAt");

    return projects;
  }

  async getProjectById(projectId, userId, userRole) {
    const project = await Project.findById(projectId)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!project) throw new AppError("Project not found", 404);

    this._assertMembership(project, userId, userRole);
    return project;
  }

  async updateProject(projectId, updates, userId, userRole) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);

    this._assertAdmin(project, userId, userRole);

    const allowed = ["name", "description", "status"];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) project[field] = updates[field];
    });

    await project.save();
    return project.populate([
      { path: "owner", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);
  }

  async deleteProject(projectId, userId, userRole) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);

    this._assertAdmin(project, userId, userRole);

    await Task.deleteMany({ project: projectId });
    await project.deleteOne();
  }

  async addMember(projectId, memberId, memberRole, requesterId, requesterRole) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);

    this._assertAdmin(project, requesterId, requesterRole);

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === memberId,
    );
    if (alreadyMember) throw new AppError("User is already a member", 409);

    project.members.push({ user: memberId, role: memberRole || "member" });
    await project.save();

    return project.populate("members.user", "name email");
  }

  async removeMember(projectId, memberId, requesterId, requesterRole) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);

    this._assertAdmin(project, requesterId, requesterRole);

    if (project.owner.toString() === memberId) {
      throw new AppError("Cannot remove the project owner", 400);
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== memberId,
    );
    await project.save();

    return project.populate("members.user", "name email");
  }

  async getDashboardStats(userId, userRole) {
    const filter = userRole === "admin" ? {} : { "members.user": userId };

    const projects = await Project.find(filter).select("_id");
    const projectIds = projects.map((p) => p._id);

    const taskFilter =
      userRole === "admin" ? {} : { project: { $in: projectIds } };

    const [total, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: "todo" }),
      Task.countDocuments({ ...taskFilter, status: "in-progress" }),
      Task.countDocuments({ ...taskFilter, status: "done" }),
      Task.countDocuments({
        ...taskFilter,
        status: { $ne: "done" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    return {
      projects: projectIds.length,
      tasks: { total, todo, inProgress, done, overdue },
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  _assertMembership(project, userId, userRole) {
    if (userRole === "admin") return;
    const isMember = project.members.some(
      (m) => m.user._id.toString() === userId.toString(),
    );
    if (!isMember)
      throw new AppError("Access denied: not a project member", 403);
  }

  _assertAdmin(project, userId, userRole) {
    if (userRole === "admin") return;
    const member = project.members.find(
      (m) => m.user.toString() === userId.toString(),
    );
    const isOwner = project.owner.toString() === userId.toString();
    if (!isOwner && (!member || member.role !== "admin")) {
      throw new AppError("Access denied: admin role required", 403);
    }
  }
}

module.exports = new ProjectService();
