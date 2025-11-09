import { apiClient, API_BASE_URL } from "./client";

// ============ Auth API ============
export const authApi = {
  // Register with email/password
  register: async (email: string, password: string, name: string) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  // Login with email/password
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
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
