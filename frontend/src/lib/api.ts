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
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Ignore network aborts
    if (error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // Log only real errors (with a response OR a clear message)
    if (typeof window !== "undefined") {
      const url = error?.config?.url;
      const status = error?.response?.status;
      const message = error?.message;
      // Only log if we have useful info
      if (url || status || message) {
        console.error("[API Error]", { url, status, message });
      }
    }
    return Promise.reject(error);
  }
);