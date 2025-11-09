import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, usersApi, groupsApi, expensesApi, splitsApi } from "@/lib/api";
import type { User, Group } from "@/types/api";

// ============ Auth Hooks ============

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
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
    }) => authApi.register(email, password, name),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
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
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
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
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expensesApi.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

// ============ Splits Hooks ============

export function useCreateSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      pay_to: Array<{ user: string; amount: number }>;
      get_pay_by: Array<{ user: string; amount: number }>;
    }) => splitsApi.createSplit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["splits"] });
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
        pay_to?: Array<{ user: string; amount: number }>;
        get_pay_by?: Array<{ user: string; amount: number }>;
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
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}
