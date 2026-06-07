import React, { useState } from "react";
import { simulationPhases } from "../data/simulationContent";
import Timer from "./Timer";

const FacilitatorMode: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section
      id="facilitation"
      aria-labelledby="facilitation-title"
      style={{
        background: "var(--navy)",
        borderBottom: "1px solid var(--navy-border)",
      }}
    >
      <div className="section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <h2 className="section-title" id="facilitation-title" style={{ margin: 0 }}>
            הנחיית הסימולציה
          </h2>
          <span
            style={{
              background: "rgba(192,38,211,0.15)",
              border: "1px solid rgba(192,38,211,0.4)",
              borderRadius: 999,
              padding: "3px 12px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#e879f9",
              letterSpacing: "0.04em",
            }}
          >
            מנחה בלבד
          </span>
        </div>
        <div className="section-divider" />

        {/* Overview */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--navy-border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px 28px",
            marginBottom: 40,
          }}
        >
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            סקירת הסימולציה
          </h3>
          <p style={{ fontSize: "0.97rem", color: "var(--text)", lineHeight: 1.85, whiteSpace: "pre-line" }}>
{`בחלוקה לקבוצות, המשתתפים ידמו סימולציה המדמה ישיבת צוות ניהולית העוסקת בניתוח תהליכי עבודה, תעדוף משימות וקבלת החלטות ניהוליות בסביבה המשלבת עבודה לצד AI.
במהלך ההתנסות יתמודדו המשתתפים עם תרחישים ניהוליים המדמים עומסים, פערי מידע, ריבוי משימות ואתגרי תעדוף, תוך שילוב סוכני AI  הפועלים כמכפילי כוח ניהוליים ותומכים בניתוח מידע, הצפת תובנות והצעת כיווני פעולה.
ההתנסות תשלב עבודה עם Copilot  לצורך:
ניתוח מידע ותהליכים
סיכום והפקת תובנות
גיבוש המלצות ופתרונות
תעדוף משימות וקבלת החלטות
שיפור אפקטיביות בפגישות ובשגרות ניהוליות
לאורך הסימולציה יידרשו המשתתפים להפעיל שיקול דעת ניהולי, לבחון את איכות ההמלצות המתקבלות, ולהבין כיצד ניתן לשלב AI באופן אפקטיבי ואחראי בתהליכי העבודה והניהול.
עיבוד ורפלקציה
דיון מונחה בקבוצות קטנות סביב חוויית העבודה לצד AI והמשמעויות הניהוליות שעלו במהלך ההתנסות.`}
          </p>
        </div>

        {/* Phase navigator + timer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 28,
            alignItems: "start",
          }}
          className="facilitation-grid"
        >
          {/* Phases */}
          <div>
            <h3
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              שלבי הסימולציה
            </h3>
            <ol
              role="list"
              aria-label="שלבי הסימולציה"
              style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}
            >
              {simulationPhases.map((phase, i) => {
                const isActive = activePhase === i;
                return (
                  <li key={phase.id}>
                    <button
                      onClick={() => setActivePhase(i)}
                      aria-pressed={isActive}
                      aria-label={`שלב ${i + 1}: ${phase.title}`}
                      style={{
                        width: "100%",
                        textAlign: "right",
                        background: isActive
                          ? "rgba(124,58,237,0.12)"
                          : "var(--gradient-card)",
                        border: isActive
                          ? "1.5px solid rgba(124,58,237,0.5)"
                          : "1px solid var(--navy-border)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px 20px",
                        cursor: "pointer",
                        fontFamily: "var(--font)",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      {/* Step number */}
                      <div
                        aria-hidden="true"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: isActive
                            ? "var(--gradient-accent)"
                            : "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          color: isActive ? "white" : "var(--muted)",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>

                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: isActive ? "var(--white)" : "var(--text)",
                            marginBottom: 4,
                          }}
                        >
                          {phase.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "var(--muted)",
                          }}
                        >
                          {phase.description}
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div
                        style={{
                          flexShrink: 0,
                          background: isActive
                            ? "rgba(6,182,212,0.15)"
                            : "rgba(255,255,255,0.05)",
                          border: isActive
                            ? "1px solid rgba(6,182,212,0.4)"
                            : "1px solid transparent",
                          borderRadius: 8,
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: isActive ? "var(--cyan-light)" : "var(--muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {phase.duration} דק'
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Timer */}
          <div className="facilitation-timer">
            <Timer
              initialMinutes={simulationPhases[activePhase].duration}
              key={activePhase}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .facilitation-grid {
            grid-template-columns: 1fr !important;
          }
          .facilitation-timer {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
};

export default FacilitatorMode;
