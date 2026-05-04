import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { taskApi } from "../api/task.api";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";

const MyTasks = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["myTasks", statusFilter],
    queryFn: () =>
      taskApi.getMyTasks(statusFilter ? { status: statusFilter } : {}),
    select: (res) => res.data.tasks,
  });

  const statuses = [
    { key: "", label: "All" },
    { key: "todo", label: "Todo" },
    { key: "in-progress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>

      {/* Filter */}
      <div className="flex gap-2">
        {statuses.map((s) => (
          <button
            key={s.key}
            className={`btn btn-sm ${statusFilter === s.key ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatusFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loader />
      ) : tasks?.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No tasks assigned to you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks?.map((task) => {
            const isOverdue =
              task.dueDate &&
              task.status !== "done" &&
              new Date(task.dueDate) < new Date();
            return (
              <div
                key={task._id}
                className={`card flex items-start justify-between gap-4 ${
                  isOverdue ? "border-red-300" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {task.title}
                    </h3>
                    {isOverdue && (
                      <span className="badge bg-red-100 text-red-700">
                        Overdue
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Project: {task.project?.name}
                    {task.dueDate && (
                      <span
                        className={isOverdue ? "text-red-600 ml-3" : " ml-3"}
                      >
                        Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge type="status" value={task.status} />
                  <Badge type="priority" value={task.priority} />
                  <button
                    className="btn-secondary btn-sm text-xs"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />
        )}
      </Modal>
    </div>
  );
};

export default MyTasks;
