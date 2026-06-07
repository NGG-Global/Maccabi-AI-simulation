import React, { useState } from "react";
import { roles } from "../data/simulationContent";
import type { Role } from "../data/simulationContent";
import RoleDetail from "./RoleDetail";

const meetingRoles = [
  { id: "meeting-manager", label: "מנהל/ת ישיבה",                       icon: "◆", color: "var(--role-manager)" },
  { id: "participant-1",   label: "משתתף/ת 1 — חוויית מטופל",           icon: "●", color: "var(--role-participant)" },
  { id: "participant-2",   label: "משתתף/ת 2 — חוסן ועומסים",           icon: "●", color: "var(--role-participant)" },
  { id: "participant-3",   label: "משתתף/ת 3 — ביצועים ותפעול",         icon: "●", color: "var(--role-participant)" },
  { id: "ai-wellbeing",    label: "סוכן חוסן ורווחת עובדים — Well-being",icon: "⬡", color: "var(--role-ai)" },
  { id: "ai-performance",  label: "סוכן תפעול ודאטה — Performance",      icon: "⬡", color: "var(--role-ai)" },
  { id: "observer",        label: "תצפיתן/ית",                           icon: "◎", color: "var(--role-observer)" },
];

const SimulationFlow: React.FC = () => {
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  const selectedRole: Role | null  = selectedId  ? (roles.find(r => r.id === selectedId)  ?? null) : null;
  const fullscreenRole: Role | null = fullscreenId ? (roles.find(r => r.id === fullscreenId) ?? null) : null;

  return (
    <div className="page-content">
      <h2 className="section-title">מהלך הישיבה</h2>
      <div className="section-divider" />

      {/* Intro */}
      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--text)" }}>
          בחלוקה לקבוצות, עליכם לנהל ישיבת צוות.<br />
          הישיבה מורכבת מ:<br />
          מנהל/ת ישיבה - מוביל/ה את הדיון וקבלת ההחלטות<br />
          שלושה מנהלים בדרגי ניהול שונים - מביאים זוויות ניהוליות שונות<br />
          סוכן AI Performance - מתמקד בביצועים, תהליכים ותעדוף משימות<br />
          סוכן AI Well-being - מתמקד בחוסן ועומסים אישיים<br />
          לצורך כך יש לכם כ-15–20 דקות
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: selectedRole ? "minmax(260px,1fr) minmax(0,1.5fr)" : "1fr",
        gap: 20, alignItems: "start",
      }} className="flow-grid">

        {/* Role grid */}
        <div>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            בחרו תפקיד לקריאה
          </p>
          <div role="list" aria-label="תפקידים בישיבה"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 10 }}>
            {meetingRoles.map(mr => {
              const isSel = selectedId === mr.id;
              return (
                <button key={mr.id} role="listitem"
                  onClick={() => setSelectedId(isSel ? null : mr.id)}
                  aria-pressed={isSel}
                  aria-label={`${mr.label} — לחץ לפרטי תפקיד`}
                  style={{
                    background: isSel ? "var(--green-light)" : "#fff",
                    border: `1.5px solid ${isSel ? "var(--green)" : "var(--border)"}`,
                    borderRadius: "var(--radius-md)",
                    padding: "14px",
                    cursor: "pointer",
                    textAlign: "right",
                    fontFamily: "var(--font)",
                    boxShadow: isSel ? "0 0 0 3px var(--green-mid)" : "var(--shadow-sm)",
                    transition: "all 0.18s",
                  }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: `${mr.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: mr.color, fontSize: "0.95rem", marginBottom: 8,
                  }} aria-hidden="true">{mr.icon}</div>
                  <div style={{
                    fontSize: "0.85rem", fontWeight: isSel ? 700 : 600,
                    color: isSel ? "var(--green-dark)" : "var(--text)", lineHeight: 1.35,
                  }}>{mr.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel — desktop */}
        {selectedRole && (
          <div className="flow-detail-panel">
            <RoleDetail role={selectedRole}
              onFullscreen={() => setFullscreenId(selectedRole.id)}
              onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      {/* Detail — mobile */}
      {selectedRole && (
        <div className="flow-detail-mobile" style={{ marginTop: 20 }}>
          <RoleDetail role={selectedRole}
            onFullscreen={() => setFullscreenId(selectedRole.id)}
            onClose={() => setSelectedId(null)} />
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreenRole && (
        <div className="fullscreen-wrapper" role="dialog" aria-modal="true"
          aria-label={`תפקיד: ${fullscreenRole.title}`}
          onClick={e => { if (e.target === e.currentTarget) setFullscreenId(null); }}>
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(24px,4vw,48px)",
            maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto",
            position: "relative",
          }}>
            <button onClick={() => setFullscreenId(null)} aria-label="סגור"
              style={{
                position: "absolute", top: 16, left: 16,
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 8, color: "var(--text-muted)",
                padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font)",
                fontWeight: 600, fontSize: "0.85rem",
              }}>✕ סגור</button>
            <RoleDetail role={fullscreenRole} onFullscreen={() => {}}
              onClose={() => setFullscreenId(null)} isModal />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .flow-grid { grid-template-columns: 1fr !important; }
          .flow-detail-panel { display: none !important; }
        }
        @media (min-width: 861px) {
          .flow-detail-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SimulationFlow;
