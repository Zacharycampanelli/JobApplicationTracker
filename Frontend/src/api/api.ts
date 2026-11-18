export const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const api = async (endpoint: string, options?: RequestInit) => {
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    credentials: "include",
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

    throw new ApiError(message, res.status);
  }

  return res.json();
};
