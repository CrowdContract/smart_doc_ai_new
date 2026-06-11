import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Mic, Volume2, FileText } from "lucide-react";
import ImageToText from "../components/features/ImageToText";
import VoiceToText from "../components/features/VoiceToText";
import TextToVoice from "../components/features/TextToVoice";
import ResumeInsights from "../components/features/ResumeInsights";

const TABS = [
  { id: "image",  label: "Image → Text",    Icon: Image,    color: "#ffd700" },
  { id: "voice",  label: "Voice → Text",    Icon: Mic,      color: "#a78bfa" },
  { id: "tts",    label: "Text → Voice",    Icon: Volume2,  color: "#34d399" },
  { id: "resume", label: "Resume Insights", Icon: FileText, color: "#60a5fa" },
];

/* Frosted glass panel wrapper */
function FrostPanel({ children }) {
  return (
    <div style={{
      background: "rgba(8,8,28,0.5)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      borderRadius: 20,
      padding: "32px 32px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top shine */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
      }} />
      {children}
    </div>
  );
}

export default function Features() {
  const [active, setActive] = useState("image");
  const activeTab = TABS.find(t => t.id === active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ paddingTop: 16 }}>
        <h1 style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 900,
          fontSize: "clamp(2.5rem,6vw,4rem)", color: "#fff",
          letterSpacing: "-0.02em", lineHeight: 1,
        }}>Features</h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "rgba(255,255,255,0.4)" }}>
          Select a tool below. All AI runs locally — no API keys needed.
        </p>
      </div>

      {/* Tab bar — frosted glass */}
      <div style={{
        background: "rgba(8,8,28,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 16,
        padding: 8,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
      }}>
        {TABS.map(({ id, label, Icon, color }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "all 0.18s ease",
                border: isActive ? `1px solid ${color}45` : "1px solid transparent",
                background: isActive ? `${color}18` : "transparent",
                color: isActive ? color : "rgba(255,255,255,0.45)",
                backdropFilter: isActive ? "blur(8px)" : "none",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <FrostPanel>
            {/* Panel header with color accent */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${activeTab.color}18`,
                border: `1px solid ${activeTab.color}30`,
              }}>
                <activeTab.Icon size={22} style={{ color: activeTab.color }} />
              </div>
              <div>
                <h2 style={{ fontWeight: 800, color: "#fff", fontSize: 18 }}>{activeTab.label}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                  {active === "image"  && "Upload an image to extract all text via AI OCR"}
                  {active === "voice"  && "Upload audio and transcribe with OpenAI Whisper"}
                  {active === "tts"    && "Convert any text into natural-sounding speech"}
                  {active === "resume" && "Upload a PDF resume for AI summary + keywords"}
                </p>
              </div>
            </div>

            {/* Content */}
            {active === "image"  && <ImageToText />}
            {active === "voice"  && <VoiceToText />}
            {active === "tts"    && <TextToVoice />}
            {active === "resume" && <ResumeInsights />}
          </FrostPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
