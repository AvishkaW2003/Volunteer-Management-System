/**
 * Centralized API Base URL Configuration for Local Development & Vercel Production Deployment.
 * Uses VITE_API_BASE_URL environment variable when available, or defaults to http://localhost:5000.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export const API_BASE_URL = BASE_URL;
export default BASE_URL;
