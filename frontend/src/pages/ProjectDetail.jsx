import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "../api/project.api";
import { userApi } from "../api/user.api";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectApi.getById(id),
    select: (res) => res.data.project,
  });

  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getAll(),
    select: (res) => res.data.users,
    enabled: showAddMember,
  });

  const addMemberMutation = useMutation({
    mutationFn: () => projectApi.addMember(id, { userId: selectedUserId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", id] });
      toast.success("Member added");
      setShowAddMember(false);
      setSelectedUserId("");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId) => projectApi.removeMember(id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", id] });
      toast.success("Member removed");
    },
  });

  if (isLoading) return <Loader />;
  if (!project) return <p className="text-gray-500">Project not found.</p>;

  const canManage = isAdmin || project.owner?._id === user?._id;
  const memberIds = project.members?.map((m) => m.user._id) || [];
  const availableUsers =
    allUsers?.filter((u) => !memberIds.includes(u._id)) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            className="text-sm text-blue-600 hover:underline mb-1"
            onClick={() => navigate("/projects")}
          >
            ← Back to Projects
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 text-sm mt-1">{project.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge type="status" value={project.status} />
            <span className="text-xs text-gray-500">
              Owner: {project.owner?.name}
            </span>
          </div>
        </div>
        <button
          className="btn-primary shrink-0"
          onClick={() => setShowTaskForm(true)}
        >
          + Add Task
        </button>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
          {canManage && (
            <button
              className="btn-secondary btn-sm"
              onClick={() => setShowAddMember(true)}
            >
              + Add Member
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.members?.map((m) => (
            <div
              key={m.user._id}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5"
            >
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {m.user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-700">{m.user.name}</span>
              <span className="text-xs text-gray-400 capitalize">
                ({m.role})
              </span>
              {canManage && m.user._id !== project.owner?._id && (
                <button
                  className="text-red-400 hover:text-red-600 text-xs ml-1"
                  onClick={() => removeMemberMutation.mutate(m.user._id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Tasks</h2>
        <TaskList projectId={id} members={project.members} />
      </div>

      {/* Modals */}
      <Modal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title="New Task"
      >
        <TaskForm
          projectId={id}
          members={project.members}
          onClose={() => setShowTaskForm(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Add Member"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Select User</label>
            <select
              className="input"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Choose a user…</option>
              {availableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="btn-secondary"
              onClick={() => setShowAddMember(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              disabled={!selectedUserId || addMemberMutation.isPending}
              onClick={() => addMemberMutation.mutate()}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
