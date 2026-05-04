import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { projectApi } from "../api/project.api";
import { taskApi } from "../api/task.api";
import StatsCard from "../components/dashboard/StatsCard";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => projectApi.getDashboardStats(),
    select: (res) => res.data.stats,
  });

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdueTasks"],
    queryFn: () => taskApi.getOverdue(),
    select: (res) => res.data.tasks,
  });

  const { data: recentProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAll(),
    select: (res) => res.data.projects.slice(0, 5),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      {statsLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard
            label="Projects"
            value={statsData?.projects}
            color="purple"
            icon="📁"
          />
          <StatsCard
            label="Total Tasks"
            value={statsData?.tasks?.total}
            color="blue"
            icon="📋"
          />
          <StatsCard
            label="Todo"
            value={statsData?.tasks?.todo}
            color="gray"
            icon="📌"
          />
          <StatsCard
            label="In Progress"
            value={statsData?.tasks?.inProgress}
            color="yellow"
            icon="⚡"
          />
          <StatsCard
            label="Completed"
            value={statsData?.tasks?.done}
            color="green"
            icon="✅"
          />
          <StatsCard
            label="Overdue"
            value={statsData?.tasks?.overdue}
            color="red"
            icon="⚠️"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Overdue Tasks</h2>
          {overdueLoading ? (
            <Loader size="sm" />
          ) : overdueTasks?.length === 0 ? (
            <p className="text-sm text-gray-500">
              No overdue tasks. Great job!
            </p>
          ) : (
            <div className="space-y-3">
              {overdueTasks?.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {task.project?.name} ·{" "}
                      {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge type="priority" value={task.priority} />
                    <p className="text-xs text-red-600 mt-1">
                      {format(new Date(task.dueDate), "MMM d")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {projectsLoading ? (
            <Loader size="sm" />
          ) : recentProjects?.length === 0 ? (
            <p className="text-sm text-gray-500">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProjects?.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded px-1"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.members?.length} member(s)
                    </p>
                  </div>
                  <Badge type="status" value={p.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
