export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchTestMessage() {
  const response = await fetch(`${API_BASE_URL}/api/test`);
  const data = await response.json();
  return data;
}
