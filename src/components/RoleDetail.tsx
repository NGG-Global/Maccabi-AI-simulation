import React, { useState, useEffect, useRef } from "react";
import type { Role } from "../data/simulationContent";
import ObservationForm from "./ObservationForm";

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
  const [formOpen, setFormOpen] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const formModalRef = useRef<HTMLDivElement>(null);

  const isObserver = role.id === "observer";

  const accentColor =
    role.type === "ai-agent"
      ? "var(--cyan)"
      : role.type === "manager"
      ? "#f59e0b"
      : role.type === "observer"
      ? "var(--purple)"
      : "var(--emerald)";

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

  // Close form modal on Escape key
  useEffect(() => {
    if (!formModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFormModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formModal]);

  // Trap focus inside form modal
  useEffect(() => {
    if (!formModal) return;
    const el = formModalRef.current;
    if (!el) return;
    el.focus();
  }, [formModal]);

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
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
            <span
              className={`badge ${roleBadgeClass[role.type]}`}
              style={{ marginBottom: 8, display: "inline-block" }}
            >
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

      {/* ── Full role text ──────────────────────────────────────────────── */}
      <div
        style={{
          marginBottom: 24,
          maxHeight: isModal ? "none" : "340px",
          overflowY: isModal ? "visible" : "auto",
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

          if (!line.trim()) return <div key={i} style={{ height: 8 }} />;

          return (
            <p
              key={i}
              style={{
                fontSize: isHeading ? "0.88rem" : "0.97rem",
                fontWeight: isHeading ? 700 : 400,
                color: isHeading ? accentColor : "var(--text)",
                lineHeight: 1.75,
                marginBottom: isHeading ? 6 : 4,
                letterSpacing: isHeading ? "0.02em" : "normal",
                paddingTop: isHeading ? 8 : 0,
              }}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* ── Role action buttons ─────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: isObserver ? 28 : 0 }}>
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

      {/* ── Observer: Observation form section ─────────────────────────── */}
      {isObserver && (
        <div
          style={{
            borderTop: "1px solid var(--navy-border)",
            paddingTop: 24,
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--white)",
                  marginBottom: 4,
                }}
              >
                דף תצפית – התנסות ניהולית עתיד קרוב
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                טופס תצפית דיגיטלי אינטראקטיבי — נשמר אוטומטית
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setFormModal(true)}
                aria-label="פתיחת דף תצפית במסך מלא"
                style={{ fontSize: "0.85rem", padding: "9px 16px" }}
              >
                מסך מלא
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setFormOpen((o) => !o)}
                aria-expanded={formOpen}
                aria-controls="obs-form-inline"
                aria-label={formOpen ? "סגור דף תצפית" : "פתיחת דף תצפית דיגיטלי"}
                style={{ fontSize: "0.85rem", padding: "9px 16px" }}
              >
                {formOpen ? "סגור תצפית" : "פתיחת דף תצפית דיגיטלי"}
              </button>
            </div>
          </div>

          {/* Inline form */}
          {formOpen && (
            <div
              id="obs-form-inline"
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(16px, 3vw, 28px)",
                marginTop: 4,
              }}
            >
              <ObservationForm />
            </div>
          )}
        </div>
      )}

      {/* ── Fullscreen observation form modal ──────────────────────────── */}
      {isObserver && formModal && (
        <div
          className="fullscreen-wrapper"
          role="dialog"
          aria-modal="true"
          aria-label="דף תצפית דיגיטלי"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFormModal(false);
          }}
        >
          <div
            ref={formModalRef}
            tabIndex={-1}
            style={{
              background: "var(--navy-mid)",
              border: "1px solid var(--navy-border)",
              borderRadius: "var(--radius-xl)",
              padding: "clamp(20px, 4vw, 40px)",
              maxWidth: 900,
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              position: "relative",
              outline: "none",
            }}
          >
            {/* Modal close */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "1px solid var(--navy-border)",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  fontWeight: 800,
                  color: "var(--white)",
                }}
              >
                דף תצפית – התנסות ניהולית עתיד קרוב
              </h2>
              <button
                onClick={() => setFormModal(false)}
                aria-label="סגור דף תצפית"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  color: "var(--text)",
                  padding: "7px 16px",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                ✕ סגור
              </button>
            </div>

            <ObservationForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetail;
