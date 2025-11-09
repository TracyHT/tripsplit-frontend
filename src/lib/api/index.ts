// Export client configuration
export { apiClient, API_BASE_URL } from "./client";

// Export all API modules
export { authApi } from "./auth.api";
export { usersApi } from "./users.api";
export { groupsApi } from "./groups.api";
export { expensesApi } from "./expenses.api";
export { splitsApi } from "./splits.api";

// Legacy function for backward compatibility
export async function fetchTestMessage() {
  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/test`);
  const data = await response.json();
  return data;
}
