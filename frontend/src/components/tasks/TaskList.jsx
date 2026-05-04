import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../api/task.api";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Modal from "../common/Modal";
import Loader from "../common/Loader";

const STATUSES = [
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const TaskList = ({ projectId, members }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId, statusFilter],
    queryFn: () =>
      taskApi.getByProject(
        projectId,
        statusFilter ? { status: statusFilter } : {},
      ),
    select: (res) => res.data.tasks,
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${!statusFilter ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setStatusFilter("")}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            className={`btn btn-sm ${statusFilter === s.key ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatusFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {data?.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          No tasks found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              projectId={projectId}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            members={members}
            onClose={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
