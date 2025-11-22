import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, usersApi, groupsApi, expensesApi, splitsApi, settlementApi } from "@/lib/api";
import type { User, Group, Split, UserBalance, SettlementTransaction } from "@/types/api";

// ============ Auth Hooks ============

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login({ email, password }),
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => authApi.register({ email, password, name }),
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.clear();
    },
  });
}

// ============ Users Hooks ============

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersApi.getAllUsers,
  });
}

export function useUser(userId: string) {
  return useQuery<User>({
    queryKey: ["users", userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: { name?: string; email?: string };
    }) => usersApi.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// ============ Groups Hooks ============

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: groupsApi.getUserGroups,
  });
}

export function useGroup(groupId: string) {
  return useQuery<Group>({
    queryKey: ["groups", groupId],
    queryFn: () => groupsApi.getGroupById(groupId),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      groupsApi.createGroup(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: { name?: string; description?: string };
    }) => groupsApi.updateGroup(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupsApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useAddUserToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string | string[] }) =>
      groupsApi.addUserToGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups", variables.groupId] });
    },
  });
}

export function useRemoveUserFromGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupsApi.removeUserFromGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups", variables.groupId] });
    },
  });
}

// ============ Expenses Hooks ============

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      description: string;
      amount: number;
      paid_by: string[];
      paid_for: string[];
      image?: string;
    }) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      // Invalidate all settlement calculations since expenses changed
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      data,
    }: {
      expenseId: string;
      data: {
        description?: string;
        amount?: number;
        paid_by?: string[];
        paid_for?: string[];
      };
    }) => expensesApi.updateExpense(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      // Invalidate all settlement calculations since expenses changed
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expensesApi.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      // Invalidate all settlement calculations since expenses changed
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
    },
  });
}

// ============ Splits Hooks ============

export function useSplitsByGroup(groupId: string) {
  return useQuery<Split[]>({
    queryKey: ["splits", "group", groupId],
    queryFn: () => splitsApi.getSplitsByGroupId(groupId),
    enabled: !!groupId,
  });
}

export function useSplitsByUser(userId: string) {
  return useQuery<Split[]>({
    queryKey: ["splits", "user", userId],
    queryFn: () => splitsApi.getSplitsByUserId(userId),
    enabled: !!userId,
  });
}

export function useCreateSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      group_id: string;
      user_id: string;
      pay_to: Array<{ user_id: string; amount: number }>;
      get_pay_by: Array<{ user_id: string; amount: number }>;
    }) => splitsApi.createSplit(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["splits"] });
      queryClient.invalidateQueries({ queryKey: ["splits", "group", variables.group_id] });
    },
  });
}

export function useUpdateSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      splitId,
      data,
    }: {
      splitId: string;
      data: {
        pay_to?: Array<{ user_id: string; amount: number }>;
        get_pay_by?: Array<{ user_id: string; amount: number }>;
      };
    }) => splitsApi.updateSplit(splitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splits"] });
    },
  });
}

export function useDeleteSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (splitId: string) => splitsApi.deleteSplit(splitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splits"] });
    },
  });
}

// ============ Settlement Hooks ============

export function useBalances(groupId: string) {
  return useQuery<UserBalance[]>({
    queryKey: ["settlements", "balances", groupId],
    queryFn: () => settlementApi.getBalances(groupId),
    enabled: !!groupId,
  });
}

export function useSettlementTransactions(groupId: string) {
  return useQuery<SettlementTransaction[]>({
    queryKey: ["settlements", "transactions", groupId],
    queryFn: () => settlementApi.getSettlementTransactions(groupId),
    enabled: !!groupId,
  });
}

export function useSettleUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => settlementApi.settleUp(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["splits"] });
      queryClient.invalidateQueries({ queryKey: ["splits", "group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["settlements", "balances", groupId] });
      queryClient.invalidateQueries({ queryKey: ["settlements", "transactions", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
