import { apiClient } from "./client";
import type { Split, UserBalance, SettlementTransaction } from "@/types/api";

// ============ Splits API ============
export const splitsApi = {
  // Get all splits (GET /splits)
  getAllSplits: async () => {
    const response = await apiClient.get("/splits");
    return response.data as Split[];
  },

  // Get split by ID (GET /splits/:id)
  getSplitById: async (splitId: string) => {
    const response = await apiClient.get(`/splits/${splitId}`);
    return response.data as Split;
  },

  // Get splits by group ID (GET /splits/group/:id)
  getSplitsByGroupId: async (groupId: string) => {
    const response = await apiClient.get(`/splits/group/${groupId}`);
    return response.data as Split[];
  },

  // Get splits by user ID (GET /splits/user/:id)
  getSplitsByUserId: async (userId: string) => {
    const response = await apiClient.get(`/splits/user/${userId}`);
    return response.data as Split[];
  },

  // Create split (POST /splits)
  createSplit: async (data: {
    group_id: string;
    user_id: string;
    pay_to: Array<{ user_id: string; amount: number }>;
    get_pay_by: Array<{ user_id: string; amount: number }>;
  }) => {
    const response = await apiClient.post("/splits", data);
    return response.data as Split;
  },

  // Update split (PUT /splits/:id)
  updateSplit: async (splitId: string, data: {
    pay_to?: Array<{ user_id: string; amount: number }>;
    get_pay_by?: Array<{ user_id: string; amount: number }>;
  }) => {
    const response = await apiClient.put(`/splits/${splitId}`, data);
    return response.data as Split;
  },

  // Delete split (DELETE /splits/:id)
  deleteSplit: async (splitId: string) => {
    const response = await apiClient.delete(`/splits/${splitId}`);
    return response.data;
  },
};

// ============ Settlement/Calculation API ============
export const settlementApi = {
  // Get user balances for a group (GET /settlements/balances/:groupId)
  getBalances: async (groupId: string) => {
    const response = await apiClient.get(`/settlements/balances/${groupId}`);
    return response.data as UserBalance[];
  },

  // Get optimized settlement transactions (GET /settlements/split/:groupId)
  getSettlementTransactions: async (groupId: string) => {
    const response = await apiClient.get(`/settlements/split/${groupId}`);
    return response.data as SettlementTransaction[];
  },

  // Save settlement to splits collection (POST /settlements/settle-up/:groupId)
  settleUp: async (groupId: string) => {
    const response = await apiClient.post(`/settlements/settle-up/${groupId}`);
    return response.data as Split[];
  },
};
