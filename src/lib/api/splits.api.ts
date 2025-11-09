import { apiClient } from "./client";

// ============ Splits API ============
export const splitsApi = {
  // Create split (POST /splits)
  createSplit: async (data: {
    pay_to: Array<{ user: string; amount: number }>;
    get_pay_by: Array<{ user: string; amount: number }>;
  }) => {
    const response = await apiClient.post("/splits", data);
    return response.data;
  },

  // Update split (PUT /splits/:id)
  updateSplit: async (splitId: string, data: {
    pay_to?: Array<{ user: string; amount: number }>;
    get_pay_by?: Array<{ user: string; amount: number }>;
  }) => {
    const response = await apiClient.put(`/splits/${splitId}`, data);
    return response.data;
  },

  // Delete split (DELETE /splits/:id)
  deleteSplit: async (splitId: string) => {
    const response = await apiClient.delete(`/splits/${splitId}`);
    return response.data;
  },
};
