import api from "./axios";

export const userApi = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put("/users/profile/me", data),
  changePassword: (data) => api.put("/users/profile/password", data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
