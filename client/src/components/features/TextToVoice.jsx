import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { recordEvent } from "../../api";

const CHAR_LIMIT = 500;

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) return toast.error("Enter some text first.");
    setLoading(true);
    setDone(false);
    try {
      await recordEvent("text_to_voice", text.slice(0, 80));
      setDone(true);
    } catch {
      toast.error("Backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pct = Math.min((text.length / CHAR_LIMIT) * 100, 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Textarea */}
      <div className="space-y-2">
        <textarea
          className="skeu-input w-full rounded-xl p-4 text-sm leading-relaxed resize-none min-h-[160px]"
          placeholder="Type or paste your text here…"
          value={text}
          onChange={(e) => { setText(e.target.value.slice(0, CHAR_LIMIT)); setDone(false); }}
        />
        {/* Progress bar + counts */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${pct}%`,
                background: pct > 90 ? "#f87171" : pct > 70 ? "#fbbf24" : "#34d399",
              }}
            />
          </div>
          <span className="text-xs text-white/25 shrink-0">
            {text.length}/{CHAR_LIMIT} chars · {words} words
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        className="btn-gold w-full justify-center"
        style={{ background: "linear-gradient(135deg,#34d399,#059669)" }}
        onClick={handleConvert}
        disabled={loading || !text.trim()}
      >
        {loading
          ? <><Loader2 size={16} className="spin-slow" /> Converting…</>
          : <><Volume2 size={16} /> Convert to Voice</>}
      </button>

      {/* Result note */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="skeu-input rounded-xl p-4 text-sm text-white/60 leading-relaxed space-y-2"
        >
          <p className="font-semibold" style={{ color: "#34d399" }}>✓ Event recorded in analytics</p>
          <p className="text-white/40 text-xs">
            Audio generation (gTTS) requires the Python backend.<br />
            Visit <span className="text-yellow-400">http://localhost:8501</span> → Features → Text to Voice
          </p>
        </motion.div>
      )}
    </div>
  );
}
