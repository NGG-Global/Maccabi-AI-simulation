import React, { useState } from "react";
import { reflectionQuestions } from "../data/simulationContent";

const Reflection: React.FC = () => {
  const [oneByOne, setOneByOne] = useState(false);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(reflectionQuestions.length - 1, c + 1));

  return (
    <section
      id="reflection"
      aria-labelledby="reflection-title"
      style={{
        background: "var(--navy-mid)",
        borderBottom: "1px solid var(--navy-border)",
      }}
    >
      <div className="section">
        <h2 className="section-title" id="reflection-title">
          רפלקציה קבוצתית
        </h2>
        <div className="section-divider" />

        {/* Mode toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            {oneByOne ? "מצב הצגה אחת בכל פעם" : "כל השאלות"}
          </p>
          <button
            className={oneByOne ? "btn btn-secondary" : "btn btn-ghost"}
            onClick={() => {
              setOneByOne(!oneByOne);
              setCurrent(0);
            }}
            aria-pressed={oneByOne}
            aria-label="הצג שאלה אחת בכל פעם"
            style={{ fontSize: "0.88rem", padding: "9px 20px" }}
          >
            הצג שאלה אחת בכל פעם
          </button>
        </div>

        {oneByOne ? (
          /* Single question view */
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "var(--gradient-card)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "var(--radius-xl)",
                padding: "clamp(32px, 6vw, 60px)",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(124,58,237,0.15)",
              }}
            >
              {/* Accent */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 120,
                  height: 120,
                  background:
                    "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                }}
              />

              <span
                aria-hidden="true"
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "rgba(124,58,237,0.15)",
                  position: "absolute",
                  top: 16,
                  left: 24,
                  lineHeight: 1,
                }}
              >
                {current + 1}
              </span>

              <p
                aria-live="polite"
                style={{
                  fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
                  fontWeight: 700,
                  color: "var(--white)",
                  lineHeight: 1.6,
                  textAlign: "center",
                }}
              >
                {reflectionQuestions[current]}
              </p>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
                gap: 12,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={next}
                disabled={current === reflectionQuestions.length - 1}
                aria-label="שאלה הבאה"
                style={{
                  opacity: current === reflectionQuestions.length - 1 ? 0.4 : 1,
                  fontSize: "0.9rem",
                  padding: "10px 20px",
                }}
              >
                הבא ←
              </button>

              {/* Dots */}
              <div
                role="tablist"
                aria-label="שאלות"
                style={{ display: "flex", gap: 8 }}
              >
                {reflectionQuestions.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`שאלה ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background:
                        i === current
                          ? "var(--purple)"
                          : "rgba(255,255,255,0.15)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                className="btn btn-ghost"
                onClick={prev}
                disabled={current === 0}
                aria-label="שאלה קודמת"
                style={{
                  opacity: current === 0 ? 0.4 : 1,
                  fontSize: "0.9rem",
                  padding: "10px 20px",
                }}
              >
                → הקודם
              </button>
            </div>
          </div>
        ) : (
          /* All questions */
          <ol
            style={{
              listStyle: "none",
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 520px), 1fr))",
            }}
            aria-label="שאלות רפלקציה"
          >
            {reflectionQuestions.map((q, i) => (
              <li key={i}>
                <div
                  style={{
                    background: "var(--gradient-card)",
                    border: "1px solid var(--navy-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 28px",
                    display: "flex",
                    gap: 18,
                    alignItems: "flex-start",
                    transition: "border-color 0.2s",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(124,58,237,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--navy-border)";
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--gradient-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--white)",
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {q}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

export default Reflection;
