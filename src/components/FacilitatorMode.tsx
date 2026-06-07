import React, { useState } from "react";
import { simulationPhases } from "../data/simulationContent";
import Timer from "./Timer";

const FacilitatorMode: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="page-content">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h2 className="section-title" style={{ margin: 0 }}>הנחיית הסימולציה</h2>
        <span className="chip chip-purple" style={{ fontSize: "0.72rem" }}>מנחה בלבד</span>
      </div>
      <div className="section-divider" />

      {/* Overview */}
      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>
          סקירת הסימולציה
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.85, whiteSpace: "pre-line" }}>
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

      {/* Phases + Timer */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 20, alignItems: "start",
      }} className="facilitation-grid">

        <div>
          <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>
            שלבי הסימולציה
          </h3>
          <ol role="list" aria-label="שלבי הסימולציה"
            style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {simulationPhases.map((phase, i) => {
              const isActive = activePhase === i;
              return (
                <li key={phase.id}>
                  <button onClick={() => setActivePhase(i)}
                    aria-pressed={isActive}
                    aria-label={`שלב ${i + 1}: ${phase.title}`}
                    style={{
                      width: "100%", textAlign: "right",
                      background: isActive ? "var(--green-light)" : "#fff",
                      border: `1.5px solid ${isActive ? "var(--green)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)", padding: "14px 16px",
                      cursor: "pointer", fontFamily: "var(--font)",
                      boxShadow: isActive ? "0 0 0 3px var(--green-mid)" : "var(--shadow-sm)",
                      transition: "all 0.18s",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: isActive ? "var(--green)" : "var(--bg)",
                      border: `1.5px solid ${isActive ? "var(--green)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.85rem",
                      color: isActive ? "#fff" : "var(--text-muted)", flexShrink: 0,
                    }} aria-hidden="true">{i + 1}</div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isActive ? "var(--green-dark)" : "var(--text)", marginBottom: 2 }}>
                        {phase.title}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{phase.description}</div>
                    </div>
                    <div style={{
                      background: isActive ? "var(--green)" : "var(--bg)",
                      border: `1px solid ${isActive ? "var(--green)" : "var(--border)"}`,
                      borderRadius: 8, padding: "3px 10px",
                      fontSize: "0.75rem", fontWeight: 700,
                      color: isActive ? "#fff" : "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      {phase.duration} דק'
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="facilitation-timer">
          <Timer initialMinutes={simulationPhases[activePhase].duration} key={activePhase} />
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .facilitation-grid { grid-template-columns: 1fr !important; }
          .facilitation-timer { order: -1; }
        }
      `}</style>
    </div>
  );
};

export default FacilitatorMode;
