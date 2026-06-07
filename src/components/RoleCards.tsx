import React, { useState } from "react";
import { roles } from '../data/simulationContent';
import type { Role } from "../data/simulationContent";
import RoleDetail from "./RoleDetail";

const roleBadgeClass: Record<Role["type"], string> = {
  manager: "badge-manager",
  participant: "badge-participant",
  "ai-agent": "badge-ai-agent",
  observer: "badge-observer",
};

const roleBadgeLabel: Record<Role["type"], string> = {
  manager: "מנהל/ת ישיבה",
  participant: "משתתף/ת",
  "ai-agent": "סוכן AI",
  observer: "תצפיתן/ית",
};

const roleIcon: Record<Role["type"], string> = {
  manager: "◆",
  participant: "●",
  "ai-agent": "⬡",
  observer: "◎",
};

const RoleCards: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  const selectedRole = roles.find((r) => r.id === selectedId) ?? null;
  const fullscreenRole = roles.find((r) => r.id === fullscreenId) ?? null;

  return (
    <section
      id="roles"
      aria-labelledby="roles-title"
      style={{
        background: "var(--navy)",
        borderBottom: "1px solid var(--navy-border)",
      }}
    >
      <div className="section">
        <h2 className="section-title" id="roles-title">
          כרטיסיות תפקיד
        </h2>
        <div className="section-divider" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedId
              ? "minmax(300px, 1fr) minmax(0, 1.5fr)"
              : "1fr",
            gap: 28,
            alignItems: "start",
          }}
          className="roles-grid"
        >
          {/* Role list */}
          <div>
            <div
              role="list"
              aria-label="תפקידי הסימולציה"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {roles.map((role) => {
                const isSelected = selectedId === role.id;
                return (
                  <button
                    key={role.id}
                    role="listitem"
                    onClick={() =>
                      setSelectedId(isSelected ? null : role.id)
                    }
                    aria-pressed={isSelected}
                    aria-label={`בחר תפקיד: ${role.title}`}
                    style={{
                      background: isSelected
                        ? "rgba(124,58,237,0.15)"
                        : "var(--gradient-card)",
                      border: isSelected
                        ? "1.5px solid rgba(124,58,237,0.6)"
                        : "1px solid var(--navy-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "16px 20px",
                      cursor: "pointer",
                      textAlign: "right",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      fontFamily: "var(--font)",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(124,58,237,0.25)"
                        : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                      <div
                        aria-hidden="true"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background:
                            role.type === "ai-agent"
                              ? "rgba(6,182,212,0.15)"
                              : role.type === "manager"
                              ? "rgba(245,158,11,0.15)"
                              : role.type === "observer"
                              ? "rgba(124,58,237,0.15)"
                              : "rgba(16,185,129,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          color:
                            role.type === "ai-agent"
                              ? "var(--cyan-light)"
                              : role.type === "manager"
                              ? "#fbbf24"
                              : role.type === "observer"
                              ? "var(--purple-light)"
                              : "#34d399",
                        }}
                      >
                        {roleIcon[role.type]}
                      </div>
                      <div style={{ textAlign: "right", minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: isSelected ? "var(--white)" : "var(--text)",
                            marginBottom: 4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role.title}
                        </div>
                        <span className={`badge ${roleBadgeClass[role.type]}`}>
                          {roleBadgeLabel[role.type]}
                        </span>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      style={{
                        color: isSelected ? "var(--purple-light)" : "var(--muted)",
                        fontSize: "1rem",
                        transform: isSelected ? "rotate(0deg)" : "rotate(180deg)",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      ▲
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role detail panel — desktop */}
          {selectedRole && (
            <div className="role-detail-panel">
              <RoleDetail
                role={selectedRole}
                onFullscreen={() => setFullscreenId(selectedRole.id)}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </div>

        {/* Mobile: show detail below */}
        {selectedRole && (
          <div className="role-detail-mobile" style={{ marginTop: 20 }}>
            <RoleDetail
              role={selectedRole}
              onFullscreen={() => setFullscreenId(selectedRole.id)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
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
          .roles-grid {
            grid-template-columns: 1fr !important;
          }
          .role-detail-panel {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .role-detail-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RoleCards;
