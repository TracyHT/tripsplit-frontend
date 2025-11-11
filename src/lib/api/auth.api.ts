import { apiClient, API_BASE_URL } from "./client";

// ============ Auth API ============
export const authApi = {
  // Register with email/password
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response;
  },

  // Login with email/password
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // OAuth URLs
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  getFacebookAuthUrl: () => `${API_BASE_URL}/auth/facebook`,
};
