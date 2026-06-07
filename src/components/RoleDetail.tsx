import React, { useState } from "react";
import type { Role } from "../data/simulationContent";

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

type Props = {
  role: Role;
  onFullscreen: () => void;
  onClose: () => void;
  isModal?: boolean;
};

const RoleDetail: React.FC<Props> = ({
  role,
  onFullscreen,
  onClose,
  isModal = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(role.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = role.fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const accentColor =
    role.type === "ai-agent"
      ? "var(--cyan)"
      : role.type === "manager"
      ? "#f59e0b"
      : role.type === "observer"
      ? "var(--purple)"
      : "var(--emerald)";

  return (
    <div
      style={{
        background: "var(--gradient-card)",
        border: `1px solid ${accentColor}40`,
        borderRadius: "var(--radius-lg)",
        padding: isModal ? 0 : "28px",
        boxShadow: `0 4px 32px ${accentColor}20`,
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--navy-border)",
          paddingBottom: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className={`badge ${roleBadgeClass[role.type]}`} style={{ marginBottom: 8, display: "inline-block" }}>
              {roleBadgeLabel[role.type]}
            </span>
            <h3
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                fontWeight: 800,
                color: "var(--white)",
                lineHeight: 1.25,
              }}
            >
              {role.title}
            </h3>
          </div>
          {!isModal && (
            <button
              onClick={onClose}
              aria-label="סגור פרטי תפקיד"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "var(--muted)",
                padding: "4px 10px",
                cursor: "pointer",
                fontFamily: "var(--font)",
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Full text */}
      <div
        style={{
          marginBottom: 24,
          maxHeight: isModal ? "60vh" : "420px",
          overflowY: "auto",
          paddingLeft: 4,
        }}
      >
        {role.fullText.split("\n").map((line, i) => {
          const isHeading =
            line === "התפקיד שלך" ||
            line === "אופן הפעולה:" ||
            line === "שאלות לדוגמה ל-Copilot:" ||
            line === "שאלות לדוגמה:" ||
            line === "מקורות מידע לרשותך:" ||
            line === "דגש קריטי:" ||
            line === "בסיום הסימולציה:";

          if (!line.trim()) {
            return <div key={i} style={{ height: 8 }} />;
          }

          return (
            <p
              key={i}
              style={{
                fontSize: isHeading ? "0.88rem" : "0.97rem",
                fontWeight: isHeading ? 700 : 400,
                color: isHeading ? accentColor : "var(--text)",
                lineHeight: 1.75,
                marginBottom: isHeading ? 6 : 4,
                textTransform: isHeading ? "none" : "none",
                letterSpacing: isHeading ? "0.02em" : "normal",
                paddingTop: isHeading ? 8 : 0,
              }}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="btn btn-primary"
          onClick={handleCopy}
          aria-label="העתקת תוכן התפקיד ללוח"
          style={{ fontSize: "0.9rem", padding: "10px 20px" }}
        >
          {copied ? "✓ הועתק!" : "העתקת התפקיד"}
        </button>
        {!isModal && (
          <button
            className="btn btn-secondary"
            onClick={onFullscreen}
            aria-label="פתח תפקיד במסך מלא"
            style={{ fontSize: "0.9rem", padding: "10px 20px" }}
          >
            פתח במסך מלא
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleDetail;
