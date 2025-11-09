import { apiClient } from "./client";

// ============ Groups API ============
export const groupsApi = {
  // Create group
  createGroup: async (name: string, description?: string) => {
    const response = await apiClient.post("/groups", { name, description });
    return response.data;
  },

  // Get all groups for current user
  getUserGroups: async () => {
    const response = await apiClient.get("/groups");
    return response.data;
  },

  // Get group by ID
  getGroupById: async (groupId: string) => {
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId: string, data: { name?: string; description?: string }) => {
    const response = await apiClient.put(`/groups/${groupId}`, data);
    return response.data;
  },

  // Delete group
  deleteGroup: async (groupId: string) => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  },

  // Add user to group (PUT /groups/:id/users)
  addUserToGroup: async (groupId: string, userId: string) => {
    const response = await apiClient.put(`/groups/${groupId}/users`, { userId });
    return response.data;
  },

  // Remove user from group (DELETE /groups/:id/users)
  removeUserFromGroup: async (groupId: string, userId: string) => {
    const response = await apiClient.delete(`/groups/${groupId}/users`, { data: { userId } });
    return response.data;
  },

  // Add expense to group (PUT /groups/:id/expenses)
  addExpenseToGroup: async (groupId: string, expenseId: string) => {
    const response = await apiClient.put(`/groups/${groupId}/expenses`, { expenseId });
    return response.data;
  },

  // Remove expense from group (DELETE /groups/:id/expenses)
  removeExpenseFromGroup: async (groupId: string, expenseId: string) => {
    const response = await apiClient.delete(`/groups/${groupId}/expenses`, { data: { expenseId } });
    return response.data;
  },
};
