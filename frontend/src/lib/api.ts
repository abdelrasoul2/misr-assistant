import axios from "axios";

/**
 * Axios client for the Misr Assistant backend API.
 */
export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignore canceled requests (React Strict Mode double-invokes in dev)
    if (axios.isCancel(error) || error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // Silently ignore 401 from /auth/me (guest users)
    const url = error?.config?.url as string | undefined;
    const status = error?.response?.status;

    if (status === 401 && url?.includes("/auth/me")) {
      return Promise.reject(error);
    }

    // Log other real HTTP errors
    if (typeof window !== "undefined" && status) {
      console.error("[API Error]", {
        url,
        status,
        detail: error.response?.data?.detail,
      });
    }
    return Promise.reject(error);
  }
);