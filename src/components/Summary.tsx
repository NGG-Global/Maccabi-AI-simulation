import React from "react";
import { insightCards } from "../data/simulationContent";

const categoryLabels: Record<string, string> = {
  ai: "בינה מלאכותית",
  human: "מנהיגות אנושית",
  combined: "שילוב",
};

const categoryColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  ai: {
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
    text: "var(--cyan-light)",
    dot: "#06b6d4",
  },
  human: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    text: "#fbbf24",
    dot: "#f59e0b",
  },
  combined: {
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
    text: "var(--purple-light)",
    dot: "#7c3aed",
  },
};

const Summary: React.FC = () => {
  const grouped = {
    ai: insightCards.filter((c) => c.category === "ai"),
    human: insightCards.filter((c) => c.category === "human"),
    combined: insightCards.filter((c) => c.category === "combined"),
  };

  return (
    <section
      id="summary"
      aria-labelledby="summary-title"
      style={{
        background: "var(--navy)",
        paddingBottom: 80,
      }}
    >
      <div className="section">
        <h2 className="section-title" id="summary-title">
          סיכום
        </h2>
        <div className="section-divider" />

        {/* Closing headline */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          <h3
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 800,
              background: "var(--gradient-accent)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 16,
            }}
          >
            ניהול בעידן האג'נטי
          </h3>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "var(--text)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            מנהלים עם מודעות חוכמה ואמפתיה ערוכים יותר ניהול בעידן האג'נטי
          </p>
        </div>

        {/* Insight categories */}
        {(["ai", "human", "combined"] as const).map((cat) => {
          const colors = categoryColors[cat];
          return (
            <div key={cat} style={{ marginBottom: 48 }}>
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: colors.dot,
                    flexShrink: 0,
                  }}
                />
                <h3
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: colors.text,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {categoryLabels[cat]}
                </h3>
                <div
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    height: 1,
                    background: colors.border,
                  }}
                />
              </div>

              {/* Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 14,
                }}
              >
                {grouped[cat].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "var(--radius-md)",
                      padding: "20px 22px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${colors.dot}30`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: colors.text,
                        marginBottom: 8,
                      }}
                    >
                      {card.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text)",
                        lineHeight: 1.6,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Citation */}
        <div
          style={{
            borderTop: "1px solid var(--navy-border)",
            paddingTop: 32,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--muted)",
              fontStyle: "italic",
            }}
          >
            Hougaard &amp; Carter, "How AI Can Make Us Better Leaders," Harvard Business Review, 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default Summary;
