import React, { useState } from "react";
import { reflectionQuestions } from "../data/simulationContent";

const Reflection: React.FC = () => {
  const [oneByOne, setOneByOne] = useState(false);
  const [current, setCurrent]   = useState(0);
  const total = reflectionQuestions.length;

  return (
    <div className="page-content">
      <h2 className="section-title">רפלקציה קבוצתית</h2>
      <div className="section-divider" />

      {/* Mode toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
          {oneByOne ? "מצב הצגה אחת בכל פעם" : `${total} שאלות`}
        </span>
        <button className={oneByOne ? "btn btn-secondary" : "btn btn-ghost"}
          onClick={() => { setOneByOne(!oneByOne); setCurrent(0); }}
          aria-pressed={oneByOne}
          style={{ fontSize: "0.85rem", padding: "8px 18px" }}>
          הצג שאלה אחת בכל פעם
        </button>
      </div>

      {oneByOne ? (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Single card */}
          <div className="card" style={{
            minHeight: 200, display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "clamp(28px,6vw,56px)",
            position: "relative", overflow: "hidden",
            borderColor: "var(--green-mid)",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", top: 0, right: 0,
              width: 80, height: 80,
              background: "var(--green-light)",
              borderRadius: "0 var(--radius-lg) 0 80px",
            }} />
            <span aria-hidden="true" style={{
              position: "absolute", top: 12, right: 20,
              fontSize: "1.4rem", fontWeight: 800, color: "var(--green)",
            }}>{current + 1}</span>

            <p aria-live="polite" style={{
              fontSize: "clamp(1.1rem,3vw,1.4rem)", fontWeight: 700,
              color: "var(--text)", lineHeight: 1.6, textAlign: "center",
            }}>
              {reflectionQuestions[current]}
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
            <button className="btn btn-ghost"
              onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
              disabled={current === total - 1}
              aria-label="שאלה הבאה"
              style={{ opacity: current === total - 1 ? 0.4 : 1, fontSize: "0.88rem" }}>
              הבא ←
            </button>

            {/* Dots */}
            <div role="tablist" aria-label="שאלות" style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 200 }}>
              {reflectionQuestions.map((_, i) => (
                <button key={i} role="tab" aria-selected={i === current}
                  aria-label={`שאלה ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 22 : 8, height: 8, borderRadius: 4,
                    background: i === current ? "var(--green)" : "var(--green-mid)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.2s",
                  }} />
              ))}
            </div>

            <button className="btn btn-ghost"
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              aria-label="שאלה קודמת"
              style={{ opacity: current === 0 ? 0.4 : 1, fontSize: "0.88rem" }}>
              → הקודם
            </button>
          </div>
        </div>
      ) : (
        <ol style={{ listStyle: "none", display: "grid", gap: 14,
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,480px),1fr))" }}
          aria-label="שאלות רפלקציה">
          {reflectionQuestions.map((q, i) => (
            <li key={i}>
              <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div aria-hidden="true" style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "var(--green)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.85rem", color: "#fff", flexShrink: 0,
                }}>{i + 1}</div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>
                  {q}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Reflection;
