/**
 * Centralized API Base URL Configuration for Local Development & Vercel Production Deployment.
 * Uses VITE_API_BASE_URL environment variable when available.
 */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }

  // If running on a live domain (like Vercel) and environment variable is not set
  if (typeof window !== "undefined" && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    console.warn(
      "[VolunteerHub API Warning] VITE_API_URL / VITE_API_BASE_URL environment variable is missing on Vercel.\n" +
      "Falling back to default Render backend production URL."
    );
    if (window.__API_BASE_URL__) {
      return window.__API_BASE_URL__.replace(/\/$/, "");
    }
    return "https://volunteer-management-system-qyku.onrender.com";
  }

  return "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
