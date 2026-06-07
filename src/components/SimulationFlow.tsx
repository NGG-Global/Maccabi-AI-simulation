import React, { useState } from "react";
import { roles } from '../data/simulationContent';
import type { Role } from "../data/simulationContent";
import RoleDetail from "./RoleDetail";

const meetingRoles = [
  { id: "meeting-manager", label: "מנהל/ת ישיבה", icon: "◆", color: "#f59e0b" },
  { id: "participant-1", label: "משתתף/ת 1 — חוויית מטופל", icon: "●", color: "#34d399" },
  { id: "participant-2", label: "משתתף/ת 2 — חוסן ועומסים", icon: "●", color: "#34d399" },
  { id: "participant-3", label: "משתתף/ת 3 — ביצועים ותפעול", icon: "●", color: "#34d399" },
  { id: "ai-wellbeing", label: "סוכן חוסן ורווחת עובדים — Well-being", icon: "⬡", color: "#06b6d4" },
  { id: "ai-performance", label: "סוכן תפעול ודאטה — Performance", icon: "⬡", color: "#06b6d4" },
  { id: "observer", label: "תצפיתן/ית", icon: "◎", color: "#a78bfa" },
];

const SimulationFlow: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  const selectedRole: Role | null =
    selectedId ? (roles.find((r) => r.id === selectedId) ?? null) : null;
  const fullscreenRole: Role | null =
    fullscreenId ? (roles.find((r) => r.id === fullscreenId) ?? null) : null;

  return (
    <section
      id="flow"
      aria-labelledby="flow-title"
      style={{
        background: "var(--navy-mid)",
        borderBottom: "1px solid var(--navy-border)",
      }}
    >
      <div className="section">
        <h2 className="section-title" id="flow-title">
          מהלך הישיבה
        </h2>
        <div className="section-divider" />

        {/* Intro text */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--navy-border)",
            borderRadius: "var(--radius-md)",
            padding: "20px 24px",
            marginBottom: 36,
            maxWidth: 700,
          }}
        >
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text)" }}>
            בחלוקה לקבוצות, עליכם לנהל ישיבת צוות.
            <br />
            הישיבה מורכבת מ:
            <br />
            מנהל/ת ישיבה - מוביל/ה את הדיון וקבלת ההחלטות
            <br />
            שלושה מנהלים בדרגי ניהול שונים - מביאים זוויות ניהוליות שונות
            <br />
            סוכן AI Performance - מתמקד בביצועים, תהליכים ותעדוף משימות
            <br />
            סוכן AI Well-being - מתמקד בחוסן ועומסים אישיים
            <br />
            לצורך כך יש לכם כ-15–20 דקות
          </p>
        </div>

        {/* Layout: role grid + detail */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedRole ? "1fr 1.4fr" : "1fr",
            gap: 28,
            alignItems: "start",
          }}
          className="flow-grid"
        >
          {/* Role cards grid */}
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" }}>
              בחרו תפקיד לקריאה
            </p>
            <div
              role="list"
              aria-label="תפקידים בישיבה"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {meetingRoles.map((mr) => {
                const isSelected = selectedId === mr.id;
                return (
                  <button
                    key={mr.id}
                    role="listitem"
                    onClick={() => setSelectedId(isSelected ? null : mr.id)}
                    aria-pressed={isSelected}
                    aria-label={`${mr.label} — לחץ לפרטי תפקיד`}
                    style={{
                      background: isSelected
                        ? `${mr.color}18`
                        : "var(--gradient-card)",
                      border: isSelected
                        ? `1.5px solid ${mr.color}80`
                        : "1px solid var(--navy-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "16px",
                      cursor: "pointer",
                      textAlign: "right",
                      transition: "all 0.2s ease",
                      fontFamily: "var(--font)",
                      boxShadow: isSelected ? `0 0 0 2px ${mr.color}25` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: `${mr.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: mr.color,
                        fontSize: "1rem",
                        marginBottom: 10,
                      }}
                      aria-hidden="true"
                    >
                      {mr.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? "var(--white)" : "var(--text)",
                        lineHeight: 1.35,
                      }}
                    >
                      {mr.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selectedRole && (
            <div className="flow-detail-panel">
              <RoleDetail
                role={selectedRole}
                onFullscreen={() => setFullscreenId(selectedRole.id)}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </div>

        {/* Mobile detail */}
        {selectedRole && (
          <div className="flow-detail-mobile" style={{ marginTop: 20 }}>
            <RoleDetail
              role={selectedRole}
              onFullscreen={() => setFullscreenId(selectedRole.id)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {fullscreenRole && (
        <div
          className="fullscreen-wrapper"
          role="dialog"
          aria-modal="true"
          aria-label={`תפקיד: ${fullscreenRole.title}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullscreenId(null);
          }}
        >
          <div
            style={{
              background: "var(--navy-mid)",
              border: "1px solid var(--navy-border)",
              borderRadius: "var(--radius-xl)",
              padding: "clamp(24px, 4vw, 48px)",
              maxWidth: 720,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setFullscreenId(null)}
              aria-label="סגור מסך מלא"
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "var(--text)",
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              ✕ סגור
            </button>
            <RoleDetail
              role={fullscreenRole}
              onFullscreen={() => {}}
              onClose={() => setFullscreenId(null)}
              isModal
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .flow-grid { grid-template-columns: 1fr !important; }
          .flow-detail-panel { display: none !important; }
        }
        @media (min-width: 901px) {
          .flow-detail-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
};

export default SimulationFlow;
