const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    let message = `API error: ${res.status} ${res.statusText}`;

    try {
      const errorData = await res.json();
      message = errorData.error || errorData.message || message;
    } catch {
      message = res.status === 401 ? "Invalid Credentials" : message;
    }

    throw new Error(message);
  }

  return res.json();
};
