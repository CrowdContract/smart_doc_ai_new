import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Cpu, BarChart2, HelpCircle, Menu, X, Brain, WifiOff } from "lucide-react";
import { checkHealth } from "../api";
import Footer from "./Footer";
import HexBackground from "./HexBackground";

const NAV = [
  { to: "/",          label: "Home",      Icon: Home       },
  { to: "/features",  label: "Features",  Icon: Cpu        },
  { to: "/analytics", label: "Analytics", Icon: BarChart2  },
  { to: "/faq",       label: "FAQ",       Icon: HelpCircle },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [healthy, setHealthy]       = useState(null);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);
  useEffect(() => {
    checkHealth().then(() => setHealthy(true)).catch(() => setHealthy(false));
  }, []);

  return (
    <>
      <div className="bg-image" />
      <div className="bg-overlay" />
      <HexBackground />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* ── Navbar ──────────────────────────────────── */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, padding: "14px 20px 0" }}
                className="navbar-wrap">
          <nav className="glass navbar-inner" style={{
            maxWidth: 1400, margin: "0 auto",
            padding: "11px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg,#ffd700,#e6b800)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(255,215,0,0.35)",
              }}>
                <Brain size={18} color="#0a0a18" />
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em" }}>
                <span style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>Smart</span>
                <span style={{ color: "#fff" }}>Doc</span>
                <span style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>AI</span>
              </span>
            </NavLink>

            {/* Desktop links */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="desktop-nav">
              {NAV.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} end={to === "/"}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Icon size={14} />{label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* API status — hidden on mobile via CSS */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
                   className="api-status">
                {healthy === true  && <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} className="pulse-dot" /><span style={{ color: "rgba(52,211,153,0.7)" }}>API online</span></>}
                {healthy === false && <><WifiOff size={12} color="#f87171" /><span style={{ color: "rgba(248,113,113,0.7)" }}>API offline</span></>}
                {healthy === null  && <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffd700", display: "inline-block" }} className="pulse-dot" /><span style={{ color: "rgba(255,255,255,0.3)" }}>…</span></>}
              </div>

              {/* Try Now — desktop */}
              <NavLink to="/features"
                className="btn-gold desktop-nav"
                style={{ padding: "7px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Try Now
              </NavLink>

              {/* Hamburger */}
              <button
                className="skeu-btn mobile-menu-btn"
                style={{ padding: 8, display: "none" }}
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass"
                style={{
                  maxWidth: 1400, margin: "8px auto 0",
                  padding: "10px 14px",
                  display: "flex", flexDirection: "column", gap: 4,
                }}
              >
                {NAV.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} end={to === "/"}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    <Icon size={15} />{label}
                  </NavLink>
                ))}
                {/* Show API status in mobile menu */}
                <div style={{
                  marginTop: 6, paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                  paddingLeft: 4,
                }}>
                  {healthy === true  && <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} className="pulse-dot" /><span style={{ color: "rgba(52,211,153,0.7)" }}>API online</span></>}
                  {healthy === false && <><WifiOff size={12} color="#f87171" /><span style={{ color: "rgba(248,113,113,0.7)" }}>API offline</span></>}
                  {healthy === null  && <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffd700" }} className="pulse-dot" /><span style={{ color: "rgba(255,255,255,0.3)" }}>Connecting…</span></>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Main ────────────────────────────────────── */}
        <main className="main-content"
              style={{ flex: 1, width: "100%", maxWidth: 1400, margin: "0 auto", padding: "36px 28px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  );
}
