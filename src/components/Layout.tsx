import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const PAGES = [
  { path: "/",            label: "פתיחה",           short: "פתיחה" },
  { path: "/background",  label: "רקע לסימולציה",   short: "רקע" },
  { path: "/flow",        label: "מהלך הישיבה",     short: "מהלך" },
  { path: "/roles",       label: "כרטיסיות תפקיד",  short: "תפקידים" },
  { path: "/reflection",  label: "רפלקציה קבוצתית", short: "רפלקציה" },
];

const Logo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="לוגו">
      <rect width="34" height="34" rx="8" fill="#183176"/>
      <path d="M17 7 L27 13 L27 21 C27 25.5 22.5 29 17 30 C11.5 29 7 25.5 7 21 L7 13 Z"
            fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
      <path d="M17 11 L23 14.5 L23 20 C23 23 20.5 25.5 17 26.5 C13.5 25.5 11 23 11 20 L11 14.5 Z"
            fill="rgba(249,95,136,0.75)"/>
      <path d="M17 15 L20 16.8 L20 19.5 C20 21.3 18.8 22.7 17 23.3 C15.2 22.7 14 21.3 14 19.5 L14 16.8 Z"
            fill="white" opacity="0.9"/>
    </svg>
    <div>
      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0E1F4D", lineHeight: 1.1 }}>
        מכבי שירותי בריאות
      </div>
      <div style={{ fontWeight: 500, fontSize: "0.72rem", color: "#44546A", lineHeight: 1 }}>
        AI Master — ניהול בעידן האג'נטי
      </div>
    </div>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate    = useNavigate();
  const { pathname } = useLocation();

  const currentIdx = PAGES.findIndex(p => p.path === pathname);
  const hasPrev    = currentIdx > 0;
  const hasNext    = currentIdx < PAGES.length - 1;

  const goTo = (path: string) => navigate(path);

  return (
    <>
      {/* ── Top bar ───────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0, right: 0, left: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          height: "var(--nav-h)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <button
            onClick={() => goTo("/")}
            aria-label="עמוד הבית"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <Logo />
          </button>

          {/* Step dots — desktop */}
          <nav aria-label="ניווט שלבים" className="step-dots-nav">
            <ol style={{ display: "flex", gap: 6, listStyle: "none", padding: 0, margin: 0, alignItems: "center" }}>
              {PAGES.map((page, idx) => {
                const isActive = idx === currentIdx;
                const isDone   = idx < currentIdx;
                return (
                  <li key={page.path}>
                    <button
                      onClick={() => goTo(page.path)}
                      aria-label={page.label}
                      aria-current={isActive ? "step" : undefined}
                      title={page.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: isActive ? "var(--green)" : isDone ? "var(--green-light)" : "var(--bg)",
                        border: `1.5px solid ${isActive ? "var(--green)" : isDone ? "var(--green-mid)" : "var(--border)"}`,
                        borderRadius: 999,
                        padding: isActive ? "5px 14px" : "5px 10px",
                        cursor: "pointer",
                        fontFamily: "var(--font)",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.78rem",
                        color: isActive ? "#fff" : isDone ? "var(--green-dark)" : "var(--text-muted)",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isDone && <span aria-hidden="true" style={{ fontSize: "0.7rem" }}>✓</span>}
                      {isActive ? page.label : page.short}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Progress fraction — mobile */}
          <div className="step-mobile-label" aria-live="polite">
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--green-dark)" }}>
              {currentIdx + 1} / {PAGES.length}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: 6 }}>
              {PAGES[currentIdx]?.label}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{ position: "absolute", bottom: 0, right: 0, left: 0, height: 3, background: "var(--border-mid)" }}
          aria-hidden="true"
        >
          <div
            style={{
              height: "100%",
              width: `${((currentIdx + 1) / PAGES.length) * 100}%`,
              background: "linear-gradient(to left, var(--accent), var(--green))",
              borderRadius: "0 2px 2px 0",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </header>

      {/* ── Main content ──────────────────────────── */}
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {children}
      </main>

      {/* ── Bottom page navigation ────────────────── */}
      {currentIdx >= 0 && (
        <div className="page-nav" role="navigation" aria-label="ניווט בין עמודים">
          <button
            className="btn btn-ghost"
            onClick={() => hasPrev && goTo(PAGES[currentIdx - 1].path)}
            disabled={!hasPrev}
            aria-label={hasPrev ? `חזרה: ${PAGES[currentIdx - 1].label}` : "אין עמוד קודם"}
            style={{ opacity: hasPrev ? 1 : 0, pointerEvents: hasPrev ? "auto" : "none", fontSize: "0.9rem", padding: "9px 20px" }}
          >
            → {hasPrev ? PAGES[currentIdx - 1].short : ""}
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 3 }}>
              שלב {currentIdx + 1} מתוך {PAGES.length}
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text)" }}>
              {PAGES[currentIdx].label}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => hasNext && goTo(PAGES[currentIdx + 1].path)}
            disabled={!hasNext}
            aria-label={hasNext ? `המשך: ${PAGES[currentIdx + 1].label}` : "זהו השלב האחרון"}
            style={{ fontSize: "0.9rem", padding: "9px 20px", opacity: hasNext ? 1 : 0.4 }}
          >
            {hasNext ? PAGES[currentIdx + 1].short : "סיום"} ←
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 780px) {
          .step-dots-nav     { display: none !important; }
          .step-mobile-label { display: flex; align-items: center; }
        }
        @media (min-width: 781px) {
          .step-mobile-label { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Layout;
