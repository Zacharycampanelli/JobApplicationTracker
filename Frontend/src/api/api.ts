const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};
