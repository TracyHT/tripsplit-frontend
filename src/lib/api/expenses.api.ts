import { apiClient } from "./client";

// ============ Expenses API ============
export const expensesApi = {
  // Create expense (POST /expenses)
  createExpense: async (data: {
    description: string;
    amount: number;
    paid_by: string[];
    paid_for: string[];
    image?: string;
  }) => {
    const response = await apiClient.post("/expenses", data);
    return response.data;
  },

  // Update expense (PUT /expenses/:id)
  updateExpense: async (
    expenseId: string,
    data: {
      description?: string;
      amount?: number;
      paid_by?: string[];
      paid_for?: string[];
    }
  ) => {
    const response = await apiClient.put(`/expenses/${expenseId}`, data);
    return response.data;
  },

  // Delete expense (DELETE /expenses/:id)
  deleteExpense: async (expenseId: string) => {
    const response = await apiClient.delete(`/expenses/${expenseId}`);
    return response.data;
  },
};
