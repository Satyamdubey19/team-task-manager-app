import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectApi } from "../api/project.api";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";

const Projects = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAll(),
    select: (res) => res.data.projects,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          + New Project
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : projects?.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            No projects yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={setEditingProject}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Project"
      >
        <ProjectForm onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onClose={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Projects;
