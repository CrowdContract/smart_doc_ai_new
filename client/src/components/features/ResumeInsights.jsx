import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Trash2, Loader2,
  ChevronDown, ChevronUp, X, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadResume, fetchInsights, deleteResume } from "../../api";

/* ── Upload tab ─────────────────────────────────────── */
function UploadTab() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    setFile(accepted[0] ?? null);
    setResult(null);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return toast.error("Upload a PDF first.");
    setLoading(true);
    setProgress(0);
    try {
      const res = await uploadResume(file, setProgress);
      setResult(res.data);
      toast.success("Resume analyzed!");
    } catch (e) {
      toast.error(e.response?.data?.detail ?? "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!file ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                 style={{ background: "rgba(96,165,250,0.08)", border: "1px dashed rgba(96,165,250,0.3)" }}>
              <Upload size={24} style={{ color: "rgba(96,165,250,0.6)" }} />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                {isDragActive ? "Drop the PDF here…" : "Drag & drop your PDF resume"}
              </p>
              <p className="text-white/25 text-xs mt-1">or click to browse · PDF only · max 10 MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="skeu-input rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                 style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.25)" }}>
              <FileText size={14} style={{ color: "#60a5fa" }} />
            </div>
            <span className="text-sm text-white/70 truncate">{file.name}</span>
          </div>
          <button onClick={() => { setFile(null); setResult(null); }}
                  className="text-white/25 hover:text-white/60 transition-colors shrink-0">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Upload progress */}
      {loading && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#60a5fa,#3b82f6)" }}
            />
          </div>
          <p className="text-xs text-white/25 text-right">{progress}% uploaded</p>
        </div>
      )}

      {/* Analyze button */}
      {file && (
        <button
          className="btn-gold w-full justify-center"
          style={{ background: "linear-gradient(135deg,#60a5fa,#2563eb)" }}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={16} className="spin-slow" /> Analyzing…</>
            : <><FileText size={16} /> Analyze Resume</>}
        </button>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="skeu-input rounded-xl p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">#{result.id}</span>
            <span className="text-white/50 text-xs font-medium">{result.filename}</span>
            <span className="text-white/25 text-xs">{result.uploaded_at?.slice(0, 16)}</span>
          </div>

          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2">AI Summary</p>
            <p className="text-sm text-white/65 leading-relaxed">{result.summary}</p>
          </div>

          {result.top_words?.length > 0 && (
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.top_words.map((w) => <span key={w} className="badge">{w}</span>)}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ── History tab ────────────────────────────────────── */
function HistoryTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchInsights({ limit: 50 });
      setItems(Array.isArray(res.data) ? res.data : []);
      setLoaded(true);
    } catch {
      toast.error("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteResume(id);
      setItems((p) => p.filter((r) => r.id !== id));
      if (expanded === id) setExpanded(null);
      toast.success("Deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  if (!loaded) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-white/30 text-sm">Load your upload history from the backend.</p>
        <button className="btn-gold" onClick={load}>
          <RefreshCw size={15} /> Load History
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-white/30">
        <Loader2 size={28} className="spin-slow mx-auto mb-3" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-white/30 text-sm text-center py-12">No resumes uploaded yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="skeu-input rounded-xl overflow-hidden">
          {/* Row */}
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm
                       hover:bg-white/4 transition-colors"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="badge shrink-0">#{item.id}</span>
              <span className="text-white/65 truncate">{item.filename}</span>
              <span className="text-white/25 text-xs hidden sm:block shrink-0">
                {item.uploaded_at?.slice(0, 10)}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="p-1 text-white/20 hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={13} />
              </button>
              {expanded === item.id
                ? <ChevronUp size={14} className="text-white/30" />
                : <ChevronDown size={14} className="text-white/30" />}
            </div>
          </button>

          {/* Expanded */}
          <AnimatePresence>
            {expanded === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-3 border-t border-white/5 space-y-3">
                  <p className="text-sm text-white/55 leading-relaxed">{item.summary}</p>
                  {item.top_words?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.top_words.map((w) => <span key={w} className="badge text-xs">{w}</span>)}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Root ───────────────────────────────────────────── */
export default function ResumeInsights() {
  const [tab, setTab] = useState("upload");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { id: "upload",  emoji: "📤", label: "Upload"  },
          { id: "history", emoji: "📋", label: "History" },
        ].map(({ id, emoji, label }) => {
          const isActive = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.18s ease",
              border: isActive ? "1px solid rgba(255,215,0,0.3)" : "1px solid transparent",
              background: isActive ? "rgba(255,215,0,0.12)" : "transparent",
              color: isActive ? "#ffd700" : "rgba(255,255,255,0.45)",
              backdropFilter: isActive ? "blur(10px)" : "none",
            }}>
              {emoji} {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "upload" ? <UploadTab /> : <HistoryTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
