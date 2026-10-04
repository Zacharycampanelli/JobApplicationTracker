export const API_URL = import.meta.env.VITE_API_URL || "";

export const api = async (endpoint: string, options?: RequestInit) => {
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers
    }
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
