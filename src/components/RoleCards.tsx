import React from "react";
import { useNavigate } from "react-router-dom";
import { roles } from "../data/simulationContent";
import type { Role } from "../data/simulationContent";

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
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <h2 className="section-title">כרטיסיות תפקיד</h2>
      <div className="section-divider" />

      <p className="section-subtitle">
        לחצו על תפקיד כדי לקרוא את הבריף המלא שלו.
      </p>

      <div role="list" aria-label="תפקידי הסימולציה"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roles.map(role => {
          const c = roleColor[role.type];
          return (
            <button
              key={role.id}
              role="listitem"
              onClick={() => navigate(`/roles/${role.id}`)}
              aria-label={`פתח תפקיד: ${role.title}`}
              style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                cursor: "pointer",
                textAlign: "right",
                fontFamily: "var(--font)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.18s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = c;
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${c}20, var(--shadow-md)`;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${c}14`,
                  border: `1.5px solid ${c}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", color: c, flexShrink: 0,
                }} aria-hidden="true">
                  {roleIcon[role.type]}
                </div>

                {/* Text */}
                <div style={{ textAlign: "right", minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700, fontSize: "0.98rem",
                    color: "var(--text)",
                    marginBottom: 5,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {role.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className={`badge ${roleBadgeClass[role.type]}`}>
                      {roleBadgeLabel[role.type]}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {role.focus}
                    </span>
                    {role.agentUrl && (
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700,
                        color: "var(--role-ai)",
                        background: "#EFF6FF",
                        border: "1px solid #BFDBFE",
                        borderRadius: 999,
                        padding: "1px 8px",
                      }}>
                        סוכן חי ↗
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <span aria-hidden="true" style={{
                color: "var(--text-muted)", fontSize: "1rem", flexShrink: 0,
                transition: "transform 0.18s",
              }}>←</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleCards;
