import { NavLink } from "react-router-dom";
import { Brain, Mail, GitFork, MessageCircle, Link, ArrowUpRight } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Home",      to: "/"          },
    { label: "Features",  to: "/features"  },
    { label: "Analytics", to: "/analytics" },
    { label: "FAQ",       to: "/faq"       },
  ],
  Features: [
    { label: "Image → Text",    to: "/features" },
    { label: "Voice → Text",    to: "/features" },
    { label: "Text → Voice",    to: "/features" },
    { label: "Resume Insights", to: "/features" },
  ],
  Resources: [
    { label: "GitHub",          href: "https://github.com"           },
    { label: "FastAPI Docs",    href: "http://localhost:8000/docs"   },
    { label: "Streamlit App",   href: "http://localhost:8501"        },
    { label: "Report an Issue", href: "mailto:arpit0112ak@gmail.com" },
  ],
};

const SOCIALS = [
  { Icon: GitFork,       href: "https://github.com",           label: "GitHub"   },
  { Icon: MessageCircle, href: "https://twitter.com",          label: "Twitter"  },
  { Icon: Link,          href: "https://linkedin.com",         label: "LinkedIn" },
  { Icon: Mail,          href: "mailto:arpit0112ak@gmail.com", label: "Email"    },
];

export default function Footer() {
  return (
    <footer style={{ padding: "48px 24px 32px", marginTop: 64 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          background: "rgba(8,8,28,0.58)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          borderRadius: 20,
          padding: "40px 32px",
        }}>

          {/* ── Main grid ─────────────────────────────
              Desktop: brand(2 col) + 3 link cols = 5 col
              Mobile:  all stacked, fully centered       */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 40,
          }}>

            {/* Brand col */}
            <div style={{
              gridColumn: "1 / -1",           /* full width on mobile */
              display: "flex",
              flexDirection: "column",
              alignItems: "center",           /* center on mobile */
              textAlign: "center",
              gap: 16,
            }}
              className="footer-brand"
            >
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg,#ffd700,#e6b800)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                }}>
                  <Brain size={20} color="#0a0a18" />
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 900 }}>
                  <span style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>Smart</span>
                  <span style={{ color: "#fff" }}>Doc</span>
                  <span style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>AI</span>
                </span>
              </div>

              {/* Desc */}
              <p style={{
                fontSize: 13, lineHeight: 1.7, maxWidth: 300,
                color: "rgba(255,255,255,0.38)",
              }}>
                AI-powered document intelligence — OCR, speech recognition,
                and resume analysis, running locally on your machine.
              </p>

              {/* Socials */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                     aria-label={label}
                     style={{
                       width: 38, height: 38, borderRadius: 10,
                       display: "flex", alignItems: "center", justifyContent: "center",
                       background: "linear-gradient(180deg,#22223a,#14142a)",
                       border: "1px solid rgba(255,255,255,0.1)",
                       color: "rgba(255,255,255,0.4)",
                       boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                       transition: "color 0.18s, border-color 0.18s",
                       textDecoration: "none",
                     }}
                     onMouseOver={e => { e.currentTarget.style.color = "#ffd700"; e.currentTarget.style.borderColor = "rgba(255,215,0,0.35)"; }}
                     onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>

              {/* Email pill */}
              <a href="mailto:arpit0112ak@gmail.com"
                 style={{
                   display: "inline-flex", alignItems: "center", gap: 7,
                   padding: "9px 18px", borderRadius: 10, fontSize: 13,
                   border: "1px solid rgba(255,255,255,0.1)",
                   color: "rgba(255,255,255,0.4)",
                   background: "rgba(255,255,255,0.03)",
                   textDecoration: "none",
                   transition: "color 0.18s, border-color 0.18s",
                 }}
                 onMouseOver={e => { e.currentTarget.style.color = "#ffd700"; e.currentTarget.style.borderColor = "rgba(255,215,0,0.3)"; }}
                 onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <Mail size={13} /> arpit0112ak@gmail.com
              </a>
            </div>

            {/* Link columns — each centered on mobile */}
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", textAlign: "center",
                gap: 14,
              }}
                className="footer-link-col"
              >
                <h4 style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
                }}>
                  {group}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(({ label, to, href }) => (
                    <li key={label}>
                      {to ? (
                        <NavLink to={to} style={{
                          fontSize: 14, color: "rgba(255,255,255,0.45)",
                          textDecoration: "none", transition: "color 0.18s",
                        }}
                          onMouseOver={e => e.currentTarget.style.color = "#ffd700"}
                          onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                        >
                          {label}
                        </NavLink>
                      ) : (
                        <a href={href} target="_blank" rel="noreferrer"
                           style={{
                             fontSize: 14, color: "rgba(255,255,255,0.45)",
                             textDecoration: "none", transition: "color 0.18s",
                             display: "inline-flex", alignItems: "center", gap: 4,
                           }}
                           onMouseOver={e => e.currentTarget.style.color = "#ffd700"}
                           onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                        >
                          {label}
                          <ArrowUpRight size={10} style={{ opacity: 0.4 }} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ─────────────────────────── */}
          <div style={{
            marginTop: 36, paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            textAlign: "center",
            fontSize: 12, color: "rgba(255,255,255,0.22)",
          }}>
            © {new Date().getFullYear()} SmartDocAI · All rights reserved ·{" "}
            <a href="mailto:arpit0112ak@gmail.com"
               style={{ color: "rgba(255,215,0,0.5)", marginLeft: 4, textDecoration: "none" }}
               onMouseOver={e => e.currentTarget.style.color = "#ffd700"}
               onMouseOut={e => e.currentTarget.style.color = "rgba(255,215,0,0.5)"}
            >arpit0112ak@gmail.com</a>
          </div>

        </div>
      </div>

      {/* ── Responsive overrides ─────────────────────── */}
      <style>{`
        /* On tablet+ the brand col only spans 2 cols, links are normal width */
        @media (min-width: 768px) {
          .footer-brand {
            grid-column: span 2 !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
          .footer-link-col {
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
      `}</style>
    </footer>
  );
}
