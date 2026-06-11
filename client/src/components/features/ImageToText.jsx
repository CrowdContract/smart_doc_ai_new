import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Image, Upload, Download, Volume2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { recordEvent } from "../../api";

export default function ImageToText() {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setText("");
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const clear = () => { setPreview(null); setFileName(""); setText(""); };

  const handleExtract = async () => {
    if (!acceptedFiles[0]) return toast.error("Drop an image first.");
    setLoading(true);
    try {
      await recordEvent("image_to_text", acceptedFiles[0].name);
      setText(
        "ℹ️  OCR processing runs in the Python backend (EasyOCR + OpenCV).\n\n" +
        "Open the Streamlit app at http://localhost:8501\n" +
        "→ Navigate to Features → Image to Text\n\n" +
        "Your upload event has been recorded in analytics."
      );
    } catch {
      toast.error("Backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Drop zone or preview */}
      {!preview ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                 style={{ background: "rgba(255,215,0,0.08)", border: "1px dashed rgba(255,215,0,0.3)" }}>
              <Upload size={24} style={{ color: "rgba(255,215,0,0.6)" }} />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                {isDragActive ? "Drop it here…" : "Drag & drop your image here"}
              </p>
              <p className="text-white/25 text-xs mt-1">or click to browse · JPG, PNG, WEBP</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-white/70 text-xs font-medium truncate max-w-[70%]">{fileName}</span>
            <button onClick={clear} className="skeu-btn py-1 px-2 text-xs flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Action */}
      {preview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="btn-gold w-full justify-center" onClick={handleExtract} disabled={loading}>
            {loading
              ? <><Loader2 size={16} className="spin-slow" /> Extracting…</>
              : <><Image size={16} /> Extract Text</>}
          </button>
        </motion.div>
      )}

      {/* Result */}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs text-white/30 uppercase tracking-wider">Result</p>
          <div className="skeu-input rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap
                          text-white/65 font-mono min-h-[90px]">
            {text}
          </div>
          {!text.startsWith("ℹ️") && (
            <button
              className="flex items-center gap-1.5 text-xs mt-1"
              style={{ color: "rgba(255,215,0,0.65)" }}
              onClick={() => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
                a.download = "extracted_text.txt";
                a.click();
              }}
            >
              <Download size={12} /> Download .txt
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
