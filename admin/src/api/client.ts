import axios from "axios";

/**
 * Axios client pre-configured for the Misr Assistant backend.
 * The /api path is proxied to http://127.0.0.1:8000 by Vite (see vite.config.ts).
 */
export const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Log errors in dev
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      detail: error.response?.data,
    });
    return Promise.reject(error);
  }
);