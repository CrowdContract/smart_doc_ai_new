import axios from "axios";

/**
 * Always use /api — works everywhere:
 *  Local dev  → Vite proxies /api → http://localhost:8000
 *  Vercel prod → /api/* hits the Python serverless function directly
 */
const api = axios.create({
  baseURL: "/api",
  timeout: 90_000,
});

export const uploadResume = (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/upload-resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) =>
      onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });
};

export const fetchInsights        = (params = {}) => api.get("/insights", { params });
export const deleteResume         = (id)           => api.delete(`/resumes/${id}`);
export const fetchAnalyticsSummary = ()            => api.get("/analytics/summary");
export const recordEvent          = (type, detail = "") =>
  api.post("/analytics/event", null, { params: { event_type: type, detail } });
export const submitFeedback       = (payload)      => api.post("/feedback", payload);
export const checkHealth          = ()             => api.get("/health");
