const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    headers: {
      ...headers,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
