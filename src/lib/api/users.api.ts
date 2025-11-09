import { apiClient } from "./client";

// ============ Users API ============
export const usersApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId: string, data: { name?: string; email?: string }) => {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },
};
