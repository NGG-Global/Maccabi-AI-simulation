import React from "react";
import { simulationPhases } from "../data/simulationContent";

const phaseColors = ["var(--accent)", "var(--green)", "var(--role-ai)", "var(--role-observer)", "var(--role-manager)"];

const SimulationFlow: React.FC = () => {
  const totalMinutes = simulationPhases.reduce((s, p) => s + p.duration, 0);

  return (
    <div className="page-content">
      <h2 className="section-title">מהלך הישיבה</h2>
      <div className="section-divider" />

      {/* Intro */}
      <div
        style={{
          background: "var(--green)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(28px, 5vw, 44px)",
          color: "#fff",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(24,49,118,0.25)",
        }}
      >
        <div aria-hidden="true" style={{
          position: "absolute", top: -50, left: -50,
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: -30, right: 30,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(249,95,136,0.18)",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)", borderRadius: 999,
            padding: "4px 14px", marginBottom: 20,
            fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em",
          }}>
            סימולציה ניהולית — {totalMinutes} דקות
          </div>

          <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.9, opacity: 0.95, maxWidth: 640 }}>
            בחלוקה לקבוצות, עליכם לנהל ישיבת צוות המדמה עתיד קרוב שבו מנהלים עובדים לצד סוכני AI.
            <br />
            הישיבה כוללת מנהל/ת ישיבה, שלושה מנהלים, שני סוכני AI ותצפיתן/ית.
          </p>
        </div>
      </div>

      {/* Phases timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {simulationPhases.map((phase, idx) => {
          const color = phaseColors[idx % phaseColors.length];
          const isLast = idx === simulationPhases.length - 1;
          return (
            <div key={phase.id} style={{ display: "flex", gap: 0, position: "relative" }}>
              {/* Timeline line + dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `${color}18`,
                  border: `2.5px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.82rem", color,
                  flexShrink: 0, zIndex: 1,
                }}>
                  {idx + 1}
                </div>
                {!isLast && (
                  <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 24, marginTop: 2 }} />
                )}
              </div>

              {/* Content card */}
              <div style={{
                flex: 1,
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "18px 20px",
                marginBottom: isLast ? 0 : 12,
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                    {phase.description}
                  </div>
                </div>
                <div style={{
                  background: `${color}12`,
                  border: `1px solid ${color}40`,
                  borderRadius: 10,
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {phase.duration} דק'
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div style={{
        marginTop: 24,
        padding: "14px 20px",
        background: "var(--green-light)",
        border: "1px solid var(--green-mid)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.88rem" }}>
          סה"כ זמן הסימולציה
        </span>
        <span style={{ fontWeight: 800, color: "var(--green-dark)", fontSize: "1.1rem" }}>
          {totalMinutes} דקות
        </span>
      </div>
    </div>
  );
};

export default SimulationFlow;
