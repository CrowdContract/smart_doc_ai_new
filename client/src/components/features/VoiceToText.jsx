import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Mic, Upload, Download, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { recordEvent } from "../../api";

export default function VoiceToText() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setTranscript("");
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".m4a", ".ogg"] },
    maxFiles: 1,
  });

  const clear = () => { setAudioUrl(null); setFileName(""); setTranscript(""); };

  const handleTranscribe = async () => {
    if (!acceptedFiles[0]) return toast.error("Upload an audio file first.");
    setLoading(true);
    try {
      await recordEvent("voice_to_text", acceptedFiles[0].name);
      setTranscript(
        "ℹ️  Whisper transcription runs in the Python backend.\n\n" +
        "Open the Streamlit app at http://localhost:8501\n" +
        "→ Navigate to Features → Voice to Text\n\n" +
        "Your event has been recorded in analytics."
      );
    } catch {
      toast.error("Backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Drop zone */}
      {!audioUrl ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                 style={{ background: "rgba(167,139,250,0.08)", border: "1px dashed rgba(167,139,250,0.3)" }}>
              <Upload size={24} style={{ color: "rgba(167,139,250,0.6)" }} />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                {isDragActive ? "Drop your audio here…" : "Drag & drop an audio file"}
              </p>
              <p className="text-white/25 text-xs mt-1">or click to browse · MP3, WAV, M4A, OGG</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="skeu-input rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm font-medium truncate max-w-[80%]">{fileName}</span>
            <button onClick={clear} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={14} />
            </button>
          </div>
          <audio controls src={audioUrl} className="w-full h-9" />
        </div>
      )}

      {/* Transcribe */}
      {audioUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            className="btn-gold w-full justify-center"
            style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}
            onClick={handleTranscribe}
            disabled={loading}
          >
            {loading
              ? <><Loader2 size={16} className="spin-slow" /> Transcribing…</>
              : <><Mic size={16} /> Transcribe Audio</>}
          </button>
        </motion.div>
      )}

      {/* Result */}
      {transcript && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-white/30 uppercase tracking-wider">Transcript</p>
          <div className="skeu-input rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap
                          text-white/65 font-mono min-h-[90px]">
            {transcript}
          </div>
          {!transcript.startsWith("ℹ️") && (
            <button
              className="flex items-center gap-1.5 text-xs mt-1"
              style={{ color: "rgba(167,139,250,0.7)" }}
              onClick={() => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([transcript], { type: "text/plain" }));
                a.download = "transcript.txt";
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
