import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { taskApi } from "../../api/task.api";
import Badge from "../common/Badge";
import { useAuth } from "../../context/AuthContext";

const TaskCard = ({ task, projectId, onEdit }) => {
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.delete(task._id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      toast.success("Task deleted");
    },
  });

  const isOverdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < new Date();

  const canManage =
    isAdmin ||
    task.createdBy?._id === user?._id ||
    task.assignedTo?._id === user?._id;

  return (
    <div className={`card ${isOverdue ? "border-red-300" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 text-sm leading-snug">
          {task.title}
        </h4>
        <Badge type="priority" value={task.priority} />
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge type="status" value={task.status} />
        {isOverdue && (
          <span className="badge bg-red-100 text-red-700">Overdue</span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {task.assignedTo ? `👤 ${task.assignedTo.name}` : "Unassigned"}
        </span>
        {task.dueDate && (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            📅 {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        )}
      </div>
      {canManage && (
        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
          <button
            className="btn-secondary btn-sm flex-1 text-xs"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            className="btn-danger btn-sm flex-1 text-xs"
            onClick={() => {
              if (window.confirm("Delete this task?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
