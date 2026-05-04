import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "../../api/project.api";
import Badge from "../common/Badge";
import { useAuth } from "../../context/AuthContext";

const ProjectCard = ({ project, onEdit }) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: () => projectApi.delete(project._id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });

  const canManage = isAdmin || project.owner?._id === user?._id;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this project and all its tasks?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div
      className="card hover:shadow-md cursor-pointer transition-shadow"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
        <Badge type="status" value={project.status} />
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
        {project.description || "No description"}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{project.members?.length || 0} member(s)</span>
        <span>By {project.owner?.name}</span>
      </div>
      {canManage && (
        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
          <button
            className="btn-secondary btn-sm flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            Edit
          </button>
          <button
            className="btn-danger btn-sm flex-1"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
