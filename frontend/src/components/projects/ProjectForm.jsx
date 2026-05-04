import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "../../api/project.api";

const ProjectForm = ({ project, onClose }) => {
  const isEdit = Boolean(project);
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? projectApi.update(project._id, data) : projectApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success(isEdit ? "Project updated" : "Project created");
      onClose();
    },
    onError: (err) => {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const map = {};
        apiErrors.forEach((e) => {
          map[e.path] = e.msg;
        });
        setErrors(map);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Project Name *</label>
        <input
          className={`input ${errors.name ? "border-red-400" : ""}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="My Awesome Project"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="input resize-none"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What is this project about?"
        />
      </div>
      {isEdit && (
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
