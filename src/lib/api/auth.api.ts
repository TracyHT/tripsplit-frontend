import { apiClient, API_BASE_URL } from "./client";

export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    return response;
  },

  logout: async () => {
    const response = await apiClient.get("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response;
  },

  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  getFacebookAuthUrl: () => `${API_BASE_URL}/auth/facebook`,
};
