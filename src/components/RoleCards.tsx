import React, { useState } from "react";
import { roles } from "../data/simulationContent";
import type { Role } from "../data/simulationContent";
import RoleDetail from "./RoleDetail";

const roleBadgeClass: Record<Role["type"], string> = {
  manager: "badge-manager", participant: "badge-participant",
  "ai-agent": "badge-ai-agent", observer: "badge-observer",
};
const roleBadgeLabel: Record<Role["type"], string> = {
  manager: "מנהל/ת ישיבה", participant: "משתתף/ת",
  "ai-agent": "סוכן AI", observer: "תצפיתן/ית",
};
const roleIcon: Record<Role["type"], string> = {
  manager: "◆", participant: "●", "ai-agent": "⬡", observer: "◎",
};
const roleColor: Record<Role["type"], string> = {
  manager: "var(--role-manager)", participant: "var(--role-participant)",
  "ai-agent": "var(--role-ai)", observer: "var(--role-observer)",
};

const RoleCards: React.FC = () => {
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  const selectedRole  = roles.find(r => r.id === selectedId)  ?? null;
  const fullscreenRole = roles.find(r => r.id === fullscreenId) ?? null;

  return (
    <div className="page-content">
      <h2 className="section-title">כרטיסיות תפקיד</h2>
      <div className="section-divider" />

      <div style={{
        display: "grid",
        gridTemplateColumns: selectedId ? "minmax(260px,1fr) minmax(0,1.6fr)" : "1fr",
        gap: 20, alignItems: "start",
      }} className="roles-grid">

        {/* Role list */}
        <div role="list" aria-label="תפקידי הסימולציה"
          style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {roles.map(role => {
            const isSel = selectedId === role.id;
            const c = roleColor[role.type];
            return (
              <button key={role.id} role="listitem"
                onClick={() => setSelectedId(isSel ? null : role.id)}
                aria-pressed={isSel}
                aria-label={`בחר תפקיד: ${role.title}`}
                style={{
                  background: isSel ? "var(--green-light)" : "#fff",
                  border: `1.5px solid ${isSel ? "var(--green)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "14px 18px",
                  cursor: "pointer", textAlign: "right",
                  fontFamily: "var(--font)",
                  boxShadow: isSel ? "0 0 0 3px var(--green-mid)" : "var(--shadow-sm)",
                  transition: "all 0.18s",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${c}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", color: c, flexShrink: 0,
                  }} aria-hidden="true">{roleIcon[role.type]}</div>
                  <div style={{ textAlign: "right", minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: "0.92rem",
                      color: isSel ? "var(--green-dark)" : "var(--text)",
                      marginBottom: 4, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{role.title}</div>
                    <span className={`badge ${roleBadgeClass[role.type]}`}>{roleBadgeLabel[role.type]}</span>
                  </div>
                </div>
                <span aria-hidden="true" style={{
                  color: isSel ? "var(--green)" : "var(--text-muted)",
                  fontSize: "0.85rem",
                  transform: isSel ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 0.2s", flexShrink: 0,
                }}>▲</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel — desktop */}
        {selectedRole && (
          <div className="role-detail-panel">
            <RoleDetail role={selectedRole}
              onFullscreen={() => setFullscreenId(selectedRole.id)}
              onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      {/* Detail — mobile */}
      {selectedRole && (
        <div className="role-detail-mobile" style={{ marginTop: 20 }}>
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
          .roles-grid { grid-template-columns: 1fr !important; }
          .role-detail-panel { display: none !important; }
        }
        @media (min-width: 861px) {
          .role-detail-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RoleCards;
