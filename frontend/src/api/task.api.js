import api from "./axios";

export const taskApi = {
  getByProject: (projectId, params) =>
    api.get(`/tasks/project/${projectId}`, { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getMyTasks: (params) => api.get("/tasks/my", { params }),
  getOverdue: () => api.get("/tasks/overdue"),
};
