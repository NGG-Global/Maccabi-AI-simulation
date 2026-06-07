import React from "react";
import { insightCards } from "../data/simulationContent";

const categoryMeta = {
  ai:       { label: "בינה מלאכותית", color: "var(--role-ai)",          bg: "#EFF6FF", border: "#BFDBFE", dot: "#0EA5E9" },
  human:    { label: "מנהיגות אנושית", color: "var(--role-manager)",     bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
  combined: { label: "שילוב",          color: "var(--role-participant)",  bg: "var(--green-light)", border: "var(--green-mid)", dot: "var(--green)" },
} as const;

const Summary: React.FC = () => {
  const grouped = {
    ai:       insightCards.filter(c => c.category === "ai"),
    human:    insightCards.filter(c => c.category === "human"),
    combined: insightCards.filter(c => c.category === "combined"),
  };

  return (
    <div className="page-content">
      <h2 className="section-title">סיכום</h2>
      <div className="section-divider" />

      {/* Headline */}
      <div className="card" style={{
        textAlign: "center", marginBottom: 40,
        background: "linear-gradient(145deg, var(--green-light), #fff)",
        borderColor: "var(--green-mid)",
        padding: "clamp(28px,5vw,48px)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--green)", display: "flex",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: "1.4rem",
        }} aria-hidden="true">✦</div>
        <h3 style={{
          fontSize: "clamp(1.3rem,4vw,1.9rem)", fontWeight: 800,
          color: "var(--green-dark)", marginBottom: 12,
        }}>
          ניהול בעידן האג'נטי
        </h3>
        <p style={{ fontSize: "clamp(0.95rem,2vw,1.05rem)", color: "var(--text)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
          מנהלים עם מודעות חוכמה ואמפתיה ערוכים יותר ניהול בעידן האג'נטי
        </p>
      </div>

      {/* Insight categories */}
      {(["ai","human","combined"] as const).map(cat => {
        const meta = categoryMeta[cat];
        return (
          <div key={cat} style={{ marginBottom: 36 }}>
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div aria-hidden="true" style={{
                width: 10, height: 10, borderRadius: "50%",
                background: meta.dot, flexShrink: 0,
              }} />
              <h3 style={{
                fontSize: "0.78rem", fontWeight: 700, color: meta.dot,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>{meta.label}</h3>
              <div aria-hidden="true" style={{ flex: 1, height: 1, background: meta.border }} />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
              gap: 12,
            }}>
              {grouped[cat].map((card, i) => (
                <div key={i} style={{
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                >
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: meta.dot, marginBottom: 6 }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.6 }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Citation */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Hougaard &amp; Carter, "How AI Can Make Us Better Leaders," Harvard Business Review, 2024
        </p>
      </div>
    </div>
  );
};

export default Summary;
