import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Image, Mic, Volume2, FileText, ArrowRight, BarChart2,
  Sparkles, CheckCircle2, Zap, ShieldCheck,
  BookOpen, Headphones, Users, Code2,
  Star, Quote, ChevronDown,
} from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter";
import ScrollReveal from "../components/ScrollReveal";

/* ─── Data ─────────────────────────────────────────── */
const STATS = [
  { value: "4+",   label: "AI Features",   color: "#ffd700" },
  { value: "99%",  label: "OCR Accuracy",  color: "#a78bfa" },
  { value: "<2s",  label: "Response Time", color: "#34d399" },
  { value: "Free", label: "Open Source",   color: "#60a5fa" },
];

const FEATURES = [
  {
    Icon: Image, title: "Image → Text",
    desc: "Extract text from images, scanned docs & screenshots with AI-powered OCR in 80+ languages.",
    color: "#ffd700", tag: "EasyOCR", featured: true,
  },
  {
    Icon: Mic, title: "Voice → Text",
    desc: "Transcribe audio with OpenAI Whisper — 99 languages, auto-detected.",
    color: "#a78bfa", tag: "Whisper",
  },
  {
    Icon: Volume2, title: "Text → Voice",
    desc: "Convert text into natural-sounding speech. Download as MP3.",
    color: "#34d399", tag: "gTTS",
  },
  {
    Icon: FileText, title: "Resume Insights",
    desc: "Upload a PDF and get an AI summary with keyword extraction.",
    color: "#60a5fa", tag: "NLP",
  },
];

const USE_CASES = [
  { title: "Education",     Icon: BookOpen,   color: "#ffd700", items: ["Extract text from slides", "Transcribe lectures", "Summarize papers", "Audio study materials"] },
  { title: "Accessibility", Icon: Headphones, color: "#a78bfa", items: ["Screen reader help", "Voice-to-text input", "Document narration", "Multi-language support"] },
  { title: "Recruitment",   Icon: Users,      color: "#34d399", items: ["Resume screening", "Keyword extraction", "Interview transcription", "Skills analysis"] },
  { title: "Developers",    Icon: Code2,      color: "#60a5fa", items: ["FastAPI REST backend", "Open source & forkable", "SQLite analytics", "Extensible Python"] },
];

const WHY = [
  { Icon: Zap,          label: "Fast",        text: "Results in under 2 seconds." },
  { Icon: ShieldCheck,  label: "Private",     text: "Runs locally. Zero data leaks." },
  { Icon: CheckCircle2, label: "Free",        text: "100% open-source, always." },
  { Icon: Code2,        label: "Extendable",  text: "FastAPI + React. Fork freely." },
];

const TESTIMONIALS = [
  { name: "Anjali S.", role: "PhD Researcher", text: "SmartDocAI cut my digitization time by 80%. The OCR accuracy is genuinely impressive.", stars: 5 },
  { name: "Rohan M.",  role: "HR Manager",     text: "Resume screening used to take hours. Now I get keyword summaries in seconds.", stars: 5 },
  { name: "Priya K.",  role: "Student",        text: "I convert lecture slides to text and listen back while studying. Huge help.", stars: 5 },
];

const SLIDES = [
  { src: "/sld1.jpg", label: "Image OCR",          sub: "Extract text from any image"       },
  { src: "/sld2.jpg", label: "Voice Transcription", sub: "Powered by OpenAI Whisper"          },
  { src: "/sld3.jpg", label: "Resume Analysis",     sub: "AI summaries & keyword extraction" },
];

/* floating orbs config */
const ORBS = [
  { w: 340, h: 340, left: "5%",  top: "0%",  color: "rgba(255,215,0,0.07)",   dur: 6,  delay: 0   },
  { w: 220, h: 220, left: "72%", top: "2%",  color: "rgba(167,139,250,0.08)", dur: 8,  delay: 1   },
  { w: 280, h: 280, left: "58%", top: "55%", color: "rgba(96,165,250,0.06)",  dur: 7,  delay: 0.5 },
  { w: 160, h: 160, left: "18%", top: "68%", color: "rgba(52,211,153,0.06)",  dur: 9,  delay: 1.5 },
  { w: 190, h: 190, left: "82%", top: "38%", color: "rgba(255,215,0,0.04)",   dur: 5,  delay: 0.8 },
  { w: 110, h: 110, left: "42%", top: "82%", color: "rgba(167,139,250,0.07)", dur: 10, delay: 2   },
];

/* spring config for cards */
const SPRING = { type: "spring", stiffness: 280, damping: 22 };

/* ─── Section header ───────────────────────────────── */
function SectionHead({ label, title, sub }) {
  return (
    <ScrollReveal style={{ textAlign: "center", marginBottom: 48 }} className="section-head">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ height: 1, width: 28, background: "rgba(255,215,0,0.45)" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{label}</span>
        <div style={{ height: 1, width: 28, background: "rgba(255,215,0,0.45)" }} />
      </div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,4vw,2.9rem)", color: "#fff", lineHeight: 1.1, marginBottom: sub ? 14 : 0 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 15, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
    </ScrollReveal>
  );
}

/* ─── Staggered list items for use-cases ───────────── */
function StaggerList({ items, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <ul ref={ref} style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((item, j) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: j * 0.07, duration: 0.4 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.48)" }}
        >
          <motion.span
            style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 5 }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.35 }}
          />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════ */
export default function Home() {
  const nav = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 96 }} className="home-sections">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section style={{ textAlign: "center", padding: "56px 0 16px", position: "relative" }}
               className="hero-section">

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Badge — rotates sparkle icon */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 18px", fontSize: 12, marginBottom: 24 }}>
              <motion.span animate={{ rotate: [0, 18, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}>
                <Sparkles size={12} style={{ color: "var(--gold)" }} />
              </motion.span>
              AI-Powered Accessibility Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(3rem,9vw,7.5rem)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 20, whiteSpace: "nowrap" }}
          >
            <span className="shimmer-text">SmartDoc</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>AI</span>
          </motion.h1>

          {/* Value prop — better hierarchy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(1rem,2.2vw,1.2rem)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 32px" }}
          >
            Convert <strong style={{ color: "rgba(255,255,255,0.82)" }}>Images, Audio &amp; Documents</strong> into
            Actionable Information — all running locally on your machine.
          </motion.p>

          {/* CTAs with whileHover/whileTap */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginBottom: 28 }}
          >
            <motion.button
              className="btn-gold"
              style={{ fontSize: 16, padding: "14px 36px" }}
              onClick={() => nav("/features")}
              whileHover={{ scale: 1.05, boxShadow: "0 14px 40px rgba(255,215,0,0.55)" }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              Try Free <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="btn-ghost"
              style={{ fontSize: 16, padding: "13px 32px" }}
              onClick={() => nav("/analytics")}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(255,215,0,0.09)" }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <BarChart2 size={17} /> View Analytics
            </motion.button>
          </motion.div>

          {/* Trust pills — stagger in */}
          <motion.div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
            {["Open Source", "Runs Locally", "No Data Stored", "Free Forever"].map((t, i) => (
              <motion.div key={t}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.09 }}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.3)" }}
              >
                <CheckCircle2 size={13} style={{ color: "#34d399" }} /> {t}
              </motion.div>
            ))}
          </motion.div>

          {/* Bouncing scroll arrow */}
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginTop: 52, display: "flex", justifyContent: "center", color: "rgba(255,255,255,0.18)" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS — animated counters + card lift
      ══════════════════════════════════════════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}
               className="stats-grid">
        {STATS.map(({ value, label, color }, i) => (
          <ScrollReveal key={label} delay={i * 0.08}>
            <motion.div
              className="metric-card"
              style={{ textAlign: "center", padding: "32px 20px" }}
              whileHover={{ y: -6, scale: 1.03, borderColor: `${color}55` }}
              transition={SPRING}
            >
              <p style={{ fontSize: "clamp(2.2rem,4.5vw,3.5rem)", fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
                <AnimatedCounter value={value} color={color} />
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>{label}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES — BENTO GRID
          First card spans 2 columns (featured)
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHead
          label="What you can do"
          title="Four tools. One platform."
          sub="Every feature runs on your machine — no API keys, no cloud uploads."
        />
        <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {FEATURES.map(({ Icon, title, desc, color, tag, featured }, i) => (
            <ScrollReveal key={title} delay={i * 0.09}
              style={featured ? { gridColumn: "span 2" } : {}}>
              <motion.div
                className="feature-card"
                style={{
                  display: "flex", flexDirection: "column", height: "100%",
                  ...(featured
                    ? { background: `linear-gradient(135deg,rgba(8,8,28,0.7) 0%,${color}10 100%)` }
                    : {}),
                }}
                onClick={() => nav("/features")}
                whileHover={{ y: -7, boxShadow: `0 22px 60px rgba(0,0,0,0.5), 0 0 0 1px ${color}40` }}
                transition={SPRING}
              >
                {/* Featured top accent */}
                {featured && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color}80,transparent)` }} />
                )}

                <motion.div
                  style={{ width: featured ? 60 : 52, height: featured ? 60 : 52, borderRadius: 16, marginBottom: featured ? 22 : 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}14`, border: `1px solid ${color}28` }}
                  whileHover={{ rotate: [-5, 5, 0], scale: 1.12 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon size={featured ? 28 : 22} style={{ color }} />
                </motion.div>

                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 5, marginBottom: 12, alignSelf: "flex-start", background: `${color}14`, color, border: `1px solid ${color}22` }}>{tag}</span>
                <h3 style={{ fontWeight: 800, color: "#fff", fontSize: featured ? 19 : 16, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.42)", flex: 1 }}>{desc}</p>

                <motion.div
                  style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color }}
                  whileHover={{ x: 5 }}
                  transition={SPRING}
                >
                  Try it <ArrowRight size={13} />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SHOWCASE
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHead label="See it in action" title="Real tools. Real results." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {SLIDES.map(({ src, label, sub }, i) => (
            <ScrollReveal key={src} delay={i * 0.1} direction="scale">
              <motion.div
                className="showcase-card"
                onClick={() => nav("/features")}
                whileHover={{ y: -7, boxShadow: "0 24px 64px rgba(0,0,0,0.55)" }}
                transition={SPRING}
              >
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/10" }}>
                  <motion.img src={src} alt={label}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 60%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>{sub}</span>
                  </div>
                </div>
                <div style={{ padding: "13px 16px" }}>
                  <p style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{label}</p>
                  <motion.p
                    style={{ fontSize: 12, marginTop: 3, color: "rgba(255,215,0,0.55)", display: "flex", alignItems: "center", gap: 3 }}
                    whileHover={{ gap: 7 }}
                  >
                    Open feature <ArrowRight size={11} />
                  </motion.p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          USE CASES
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHead
          label="Use cases"
          title="Built for every workflow"
          sub="From students to senior developers — SmartDocAI fits how you already work."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
          {USE_CASES.map(({ title, Icon, color, items }, i) => (
            <ScrollReveal key={title} delay={i * 0.08}>
              <motion.div
                className="usecase-card"
                style={{ padding: "26px" }}
                whileHover={{ y: -5, borderColor: `${color}45`, boxShadow: `0 14px 44px rgba(0,0,0,0.42), 0 0 0 1px ${color}25` }}
                transition={SPRING}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <motion.div
                    style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}14`, border: `1px solid ${color}28` }}
                    whileHover={{ rotate: 12, scale: 1.12 }}
                    transition={SPRING}
                  >
                    <Icon size={18} style={{ color }} />
                  </motion.div>
                  <h3 style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>{title}</h3>
                </div>
                <StaggerList items={items} color={color} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY — cursor glow + stagger pills
      ══════════════════════════════════════════════ */}
      <section>
        <ScrollReveal>
          <motion.div
            className="why-banner"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            style={{
              background: "rgba(8,8,28,0.52)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              borderRadius: 24, padding: "56px 48px",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}
          >
            {/* top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.5),transparent)" }} />
            {/* cursor-following glow */}
            <div style={{
              position: "absolute", pointerEvents: "none", zIndex: 0,
              width: 420, height: 420, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(255,215,0,0.07) 0%,transparent 70%)",
              left: mousePos.x - 210, top: mousePos.y - 210,
              transition: "left 0.12s ease, top 0.12s ease",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.span className="badge"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18, padding: "5px 16px", fontSize: 11 }}
                animate={{ boxShadow: ["0 0 0 0 rgba(255,215,0,0.25)", "0 0 0 7px rgba(255,215,0,0)", "0 0 0 0 rgba(255,215,0,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Zap size={11} style={{ color: "var(--gold)" }} /> Why choose SmartDocAI
              </motion.span>

              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#fff", marginBottom: 14, lineHeight: 1.1 }}>
                Private. Fast. Open Source.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 15, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
                No subscriptions. No cloud uploads. Every byte stays on your machine.
              </p>

              {/* Animated pills stagger */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
                {WHY.map(({ Icon, label }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.1)" }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", cursor: "default" }}
                  >
                    <Icon size={14} style={{ color: "var(--gold)" }} /> {label}
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="btn-gold"
                style={{ fontSize: 16, padding: "13px 38px" }}
                onClick={() => nav("/features")}
                whileHover={{ scale: 1.05, boxShadow: "0 14px 40px rgba(255,215,0,0.55)" }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
              >
                Start Using SmartDocAI <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — star animation
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHead label="Testimonials" title="Loved by users" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
          {TESTIMONIALS.map(({ name, role, text, stars }, i) => (
            <ScrollReveal key={name} delay={i * 0.1} direction="up">
              <motion.div
                className="glass-sm"
                style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}
                whileHover={{ y: -6, boxShadow: "0 18px 52px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,215,0,0.15)" }}
                transition={SPRING}
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.65, 0.3] }}
                  transition={{ duration: 3.2, repeat: Infinity }}
                >
                  <Quote size={22} style={{ color: "rgba(255,215,0,0.38)" }} />
                </motion.div>
                <p style={{ fontSize: 14, lineHeight: 1.78, color: "rgba(255,255,255,0.58)", flex: 1 }}>"{text}"</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{role}</p>
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: stars }).map((_, j) => (
                      <motion.span key={j}
                        initial={{ opacity: 0, scale: 0.2 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + j * 0.08, type: "spring", stiffness: 400 }}
                      >
                        <Star size={13} fill="#ffd700" style={{ color: "#ffd700" }} />
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bento grid responsive */}
      <style>{`
        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > * { grid-column: span 1 !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .bento-grid { grid-template-columns: repeat(2,1fr) !important; }
          .bento-grid > *:first-child { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
}
