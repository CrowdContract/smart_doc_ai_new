import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { fetchAnalyticsSummary } from "../api";
import { RefreshCw, Database, Activity, Layers } from "lucide-react";
import toast from "react-hot-toast";
import ScrollReveal from "../components/ScrollReveal";

/* ── Custom tooltip ─────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(8,8,28,0.92)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 12, backdropFilter: "blur(12px)" }}>
      <p style={{ color: "var(--gold)", fontWeight: 700, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "rgba(255,255,255,0.7)" }}>{payload[0].value} events</p>
    </div>
  );
};

/* ── Stat card ──────────────────────────────────────── */
function StatCard({ Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5, borderColor: `${color}50` }}
      style={{ position: "relative" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>{label}</p>
        <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: "2.2rem", fontWeight: 900, color, lineHeight: 1 }}>{value ?? "—"}</p>
    </motion.div>
  );
}

/* ── Glass chart panel ──────────────────────────────── */
function ChartPanel({ title, children }) {
  return (
    <div style={{
      background: "rgba(8,8,28,0.62)",
      border: "1px solid rgba(255,255,255,0.09)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      borderRadius: 18,
      padding: "24px 24px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.3),transparent)" }} />
      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>{title}</p>
      {children}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            style={{ height: 100, borderRadius: 16, background: "rgba(255,255,255,0.06)" }}
          />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[1, 2].map(i => (
          <motion.div key={i}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
            style={{ height: 280, borderRadius: 16, background: "rgba(255,255,255,0.06)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAnalyticsSummary();
      setData(res.data);
    } catch {
      toast.error("Could not reach backend. Start the FastAPI server first.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dailyData = data?.daily_activity?.slice().reverse() ?? [];
  const eventData = Object.entries(data?.event_breakdown ?? {}).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 32 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 16, flexWrap: "wrap", gap: 12 }}
           className="analytics-header">
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,4rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Analytics
          </h1>
          <p style={{ marginTop: 10, fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            Live usage metrics for SmartDocAI.
          </p>
        </div>
        <motion.button
          className="btn-ghost"
          style={{ fontSize: 14 }}
          onClick={load}
          disabled={loading}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <RefreshCw size={14} className={loading ? "spin-slow" : ""} />
          Refresh
        </motion.button>
      </div>

      {/* Loading skeletons */}
      {loading && <Skeleton />}

      {/* Content */}
      {!loading && data && (
        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            <StatCard Icon={Database} label="Resumes Uploaded" value={data.total_resumes} color="#ffd700" delay={0}    />
            <StatCard Icon={Activity} label="Total Events"     value={data.total_events}  color="#a78bfa" delay={0.08} />
            <StatCard Icon={Layers}   label="Event Types"      value={Object.keys(data.event_breakdown).length} color="#34d399" delay={0.16} />
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
            <ScrollReveal direction="left">
              <ChartPanel title="Daily Activity (last 7 days)">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#ffd700" stopOpacity={0.22} />
                          <stop offset="95%" stopColor="#ffd700" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="count" stroke="#ffd700" strokeWidth={2} fill="url(#g1)" dot={{ fill: "#ffd700", r: 3, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No activity yet.</div>
                )}
              </ChartPanel>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <ChartPanel title="Event Breakdown">
                {eventData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={eventData} layout="vertical">
                      <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="value" fill="#ffd700" fillOpacity={0.75} radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No events yet.</div>
                )}
              </ChartPanel>
            </ScrollReveal>
          </div>
        </motion.div>
      )}

      {/* Offline state */}
      {!loading && !data && (
        <div style={{ background: "rgba(8,8,28,0.65)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)", borderRadius: 18, padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15, marginBottom: 8 }}>Could not load analytics.</p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, marginBottom: 24 }}>Make sure FastAPI is running on port 8000.</p>
          <button className="btn-gold" onClick={load}>Try Again</button>
        </div>
      )}
    </div>
  );
}
