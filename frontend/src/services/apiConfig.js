/**
 * Centralized API Base URL Configuration for Local Development & Vercel Production Deployment.
 * Uses VITE_API_BASE_URL environment variable when available.
 */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.__API_BASE_URL__) {
    return window.__API_BASE_URL__.replace(/\/$/, "");
  }

  // Auto-detect local development vs live deployment
  if (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:5000";
  }

  // Default to deployed Render backend URL
  return "https://volunteer-management-system-qyku.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
