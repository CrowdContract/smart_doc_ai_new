import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const FAQS = [
  {
    category: "General",
    items: [
      { q: "What is SmartDocAI?", a: "SmartDocAI is an open-source AI-powered document intelligence platform. It combines OCR, speech recognition, text-to-speech, and resume analysis into one unified tool — all running locally on your machine." },
      { q: "Is my data safe? Does it get uploaded to any server?", a: "All AI processing runs entirely on your local machine using Python. No data is sent to external servers. The FastAPI backend stores minimal metadata in a local SQLite database only you can access." },
      { q: "Is SmartDocAI free to use?", a: "Yes, completely free and open-source. Inspect, self-host, and extend it however you like." },
    ],
  },
  {
    category: "Features",
    items: [
      { q: "How accurate is the Image → Text (OCR)?", a: "SmartDocAI uses EasyOCR which achieves ~99% accuracy on clear, printed text in 80+ languages. Pre-processing the image improves results for low-res scans." },
      { q: "What audio formats does Voice → Text support?", a: "Whisper-based transcription supports MP3, WAV, M4A, OGG and most common audio formats. Files are processed locally with no size limit beyond your machine's RAM." },
      { q: "How does Resume Insights work?", a: "Upload a PDF resume. The FastAPI backend extracts all text via PyPDF2, identifies top keywords, and generates a concise summary. Everything happens locally — no OpenAI API key required." },
      { q: "Can I use multiple languages for OCR and transcription?", a: "Yes. EasyOCR supports 80+ languages. OpenAI Whisper supports 99 languages and can auto-detect the spoken language." },
    ],
  },
  {
    category: "Setup & Technical",
    items: [
      { q: "How do I start the backend?", a: "In the project root: cd backend && python -m uvicorn backend:app --reload --port 8000. Or run .\\start_backend.bat in PowerShell." },
      { q: "How do I start the React frontend?", a: "cd client && npm install && npm run dev. The app will be available at http://localhost:3000." },
      { q: "What is the Streamlit app for?", a: "The Streamlit app (port 8501) runs the Python AI features — EasyOCR, Whisper, and gTTS. Run all three servers together for the full experience." },
      { q: "Why does the React app say 'API offline'?", a: "The FastAPI backend isn't running. Start it with .\\start_backend.bat. Once it's up on port 8000, the navbar indicator turns green." },
    ],
  },
  {
    category: "Contributing",
    items: [
      { q: "Can I contribute to SmartDocAI?", a: "Absolutely. Fork the repo on GitHub, create a feature branch, and open a pull request. Bug reports and feature suggestions via email are also welcome." },
      { q: "How do I report a bug or request a feature?", a: "Email arpit0112ak@gmail.com with the subject 'SmartDocAI Bug' or 'SmartDocAI Feature Request'." },
    ],
  },
];

/* ── Single FAQ accordion item ─────────────────────── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        background: open ? "rgba(10,10,32,0.75)" : "rgba(8,8,28,0.6)",
        border: `1px solid ${open ? "rgba(255,215,0,0.28)" : "rgba(255,255,255,0.09)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px", textAlign: "left",
          background: "transparent", border: "none", cursor: "pointer",
          gap: 12,
        }}
      >
        <span style={{ fontWeight: 600, color: open ? "#fff" : "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.4, flex: 1 }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ flexShrink: 0, color: open ? "var(--gold)" : "rgba(255,255,255,0.3)" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              padding: "0 22px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 16,
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.52)" }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Category group ─────────────────────────────────── */
function FAQGroup({ category, items, groupIndex }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: groupIndex * 0.1, duration: 0.45 }}
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      {/* Category label */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 6,
      }}>
        <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>
          {category}
        </span>
        <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      {items.map((item, i) => (
        <FAQItem key={item.q} {...item} index={i} />
      ))}
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function FAQ() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56, paddingBottom: 40 }}>

      {/* ── Hero header ─────────────────────────────── */}
      <section style={{ textAlign: "center", paddingTop: 40 }}>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 18px", fontSize: 12, marginBottom: 24,
          }}>
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            >
              <HelpCircle size={12} style={{ color: "var(--gold)" }} />
            </motion.span>
            Frequently Asked Questions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            color: "#fff", lineHeight: 1.05, letterSpacing: "-0.02em",
            marginBottom: 18,
          }}
        >
          Got questions?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ fontSize: 16, color: "rgba(255,255,255,0.42)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}
        >
          Everything you need to know about SmartDocAI — setup, features, and how it all works.
        </motion.p>
      </section>

      {/* ── FAQ accordion ───────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 760, margin: "0 auto", width: "100%" }}>
        {FAQS.map(({ category, items }, gi) => (
          <FAQGroup key={category} category={category} items={items} groupIndex={gi} />
        ))}
      </div>

      {/* ── CTA ─────────────────────────────────────── */}
      <ScrollReveal>
        <motion.div
          style={{
            background: "rgba(8,8,28,0.65)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 20,
            padding: "48px 32px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {/* top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.45),transparent)" }} />

          <motion.div
            style={{
              width: 56, height: 56, borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.22)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageSquare size={24} style={{ color: "var(--gold)" }} />
          </motion.div>

          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,4vw,2rem)", color: "#fff", marginBottom: 10 }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", marginBottom: 24, lineHeight: 1.6 }}>
            Can't find what you're looking for? Reach out directly.
          </p>

          <motion.a
            href="mailto:arpit0112ak@gmail.com"
            className="btn-gold"
            style={{ display: "inline-flex", textDecoration: "none" }}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(255,215,0,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Mail size={16} /> arpit0112ak@gmail.com
          </motion.a>
        </motion.div>
      </ScrollReveal>

    </div>
  );
}
