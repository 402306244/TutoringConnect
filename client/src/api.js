// Shared fetch helper used by all React components to talk to the backend API
// and automatically attach the current JWT when the user is logged in.
const API_URL = "http://localhost:5001/api";

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // The JWT saved after login is sent to protected endpoints.
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API_URL + path, {...options, headers});
  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
