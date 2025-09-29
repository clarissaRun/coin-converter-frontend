/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { isAxiosError } from "axios";

// baseURL: .env > (modo dev => localhost) > fallback prod
const resolved =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://coin-converter-srih.onrender.com");

const baseURL = resolved.replace(/\/+$/, "");

export const api = axios.create({
  baseURL,

  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);
export { isAxiosError };
export default api;
