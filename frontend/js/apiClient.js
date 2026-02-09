import API from "./config.js";

/**
 * Wrapper around fetch that:
 *  - Adds Authorization header
 *  - Parses JSON
 *  - Throws real errors
 */
export default async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    console.error("Unauthorized — redirecting to login");
    localStorage.clear();
    window.location.href = "./login.html";
    throw new Error("Unauthorized");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    const msg = data?.detail || response.statusText;
    throw new Error(msg);
  }

  return data;
}
