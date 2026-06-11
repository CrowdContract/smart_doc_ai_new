import axios from "axios";

/**
 * In local dev:  VITE_API_URL=http://localhost:8000  → proxy via Vite
 * In Vercel prod: requests go to /api/... which Vercel rewrites to Render
 */
const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 90_000,
});

// ── Resume ──────────────────────────────────────────────
export const uploadResume = (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/upload-resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) =>
      onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });
};

export const fetchInsights = (params = {}) => api.get("/insights", { params });
export const deleteResume  = (id)           => api.delete(`/resumes/${id}`);

// ── Analytics ────────────────────────────────────────────
export const fetchAnalyticsSummary = () => api.get("/analytics/summary");
export const recordEvent = (event_type, detail = "") =>
  api.post("/analytics/event", null, { params: { event_type, detail } });

// ── Feedback ─────────────────────────────────────────────
export const submitFeedback = (payload) => api.post("/feedback", payload);

// ── Health ───────────────────────────────────────────────
export const checkHealth = () => api.get("/health");
