import React, { useState, useEffect, useRef } from "react";
import type { Role } from "../data/simulationContent";
import ObservationForm from "./ObservationForm";

const roleBadgeClass: Record<Role["type"], string> = {
  manager: "badge-manager", participant: "badge-participant",
  "ai-agent": "badge-ai-agent", observer: "badge-observer",
};
const roleBadgeLabel: Record<Role["type"], string> = {
  manager: "מנהל/ת ישיבה", participant: "משתתף/ת",
  "ai-agent": "סוכן AI", observer: "תצפיתן/ית",
};
const roleColor: Record<Role["type"], string> = {
  manager: "var(--role-manager)", participant: "var(--role-participant)",
  "ai-agent": "var(--role-ai)", observer: "var(--role-observer)",
};

type Props = {
  role: Role;
  onFullscreen: () => void;
  onClose: () => void;
  isModal?: boolean;
};

const HEADINGS = new Set([
  "התפקיד שלך","אופן הפעולה:","שאלות לדוגמה ל-Copilot:",
  "שאלות לדוגמה:","מקורות מידע לרשותך:","דגש קריטי:","בסיום הסימולציה:",
]);

const RoleDetail: React.FC<Props> = ({ role, onFullscreen, onClose, isModal = false }) => {
  const [copied, setCopied]       = useState(false);
  const [formOpen, setFormOpen]   = useState(false);
  const [formModal, setFormModal] = useState(false);
  const formModalRef = useRef<HTMLDivElement>(null);
  const isObserver = role.id === "observer";
  const accent = roleColor[role.type];

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(role.fullText); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = role.fullText;
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    if (!formModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFormModal(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formModal]);

  useEffect(() => {
    if (formModal) formModalRef.current?.focus();
  }, [formModal]);

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${accent}40`,
      borderRadius: "var(--radius-lg)",
      padding: isModal ? 0 : "24px",
      boxShadow: "var(--shadow-md)",
    }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <span className={`badge ${roleBadgeClass[role.type]}`} style={{ marginBottom: 6, display: "inline-block" }}>
              {roleBadgeLabel[role.type]}
            </span>
            <h3 style={{ fontSize: "clamp(1rem,3vw,1.25rem)", fontWeight: 800, color: "var(--text)", lineHeight: 1.25 }}>
              {role.title}
            </h3>
          </div>
          {!isModal && (
            <button onClick={onClose} aria-label="סגור"
              style={{
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 8, color: "var(--text-muted)",
                padding: "3px 10px", cursor: "pointer", fontFamily: "var(--font)", fontSize: "0.85rem",
              }}>✕</button>
          )}
        </div>
      </div>

      {/* Role text */}
      <div style={{
        marginBottom: 20,
        maxHeight: isModal ? "none" : "340px",
        overflowY: isModal ? "visible" : "auto",
      }}>
        {role.fullText.split("\n").map((line, i) => {
          const isH = HEADINGS.has(line);
          if (!line.trim()) return <div key={i} style={{ height: 7 }} />;
          return (
            <p key={i} style={{
              fontSize: isH ? "0.82rem" : "0.95rem",
              fontWeight: isH ? 700 : 400,
              color: isH ? accent : "var(--text)",
              lineHeight: 1.75,
              marginBottom: isH ? 4 : 3,
              letterSpacing: isH ? "0.02em" : "normal",
              paddingTop: isH ? 6 : 0,
            }}>{line}</p>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: isObserver ? 24 : 0 }}>
        <button className="btn btn-primary" onClick={handleCopy}
          aria-label="העתקת תוכן התפקיד ללוח"
          style={{ fontSize: "0.88rem", padding: "9px 18px" }}>
          {copied ? "✓ הועתק!" : "העתקת התפקיד"}
        </button>
        {!isModal && (
          <button className="btn btn-secondary" onClick={onFullscreen}
            aria-label="פתח במסך מלא"
            style={{ fontSize: "0.88rem", padding: "9px 18px" }}>
            מסך מלא
          </button>
        )}
      </div>

      {/* Observer: observation form */}
      {isObserver && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>
                דף תצפית – התנסות ניהולית עתיד קרוב
              </h4>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>נשמר אוטומטית במכשיר</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setFormModal(true)}
                aria-label="פתח דף תצפית במסך מלא"
                style={{ fontSize: "0.82rem", padding: "8px 14px" }}>מסך מלא</button>
              <button className="btn btn-primary" onClick={() => setFormOpen(o => !o)}
                aria-expanded={formOpen}
                aria-label={formOpen ? "סגור דף תצפית" : "פתיחת דף תצפית דיגיטלי"}
                style={{ fontSize: "0.82rem", padding: "8px 14px" }}>
                {formOpen ? "סגור תצפית" : "פתיחת דף תצפית דיגיטלי"}
              </button>
            </div>
          </div>

          {formOpen && (
            <div style={{
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "clamp(16px,3vw,28px)", marginTop: 4,
            }}>
              <ObservationForm />
            </div>
          )}
        </div>
      )}

      {/* Observation form fullscreen modal */}
      {isObserver && formModal && (
        <div className="fullscreen-wrapper" role="dialog" aria-modal="true"
          aria-label="דף תצפית דיגיטלי"
          onClick={e => { if (e.target === e.currentTarget) setFormModal(false); }}>
          <div ref={formModalRef} tabIndex={-1} style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(20px,4vw,40px)",
            maxWidth: 900, width: "100%", maxHeight: "92vh", overflowY: "auto",
            position: "relative", outline: "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)",
            }}>
              <h2 style={{ fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: "var(--text)" }}>
                דף תצפית – התנסות ניהולית עתיד קרוב
              </h2>
              <button onClick={() => setFormModal(false)} aria-label="סגור"
                style={{
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text-muted)",
                  padding: "7px 16px", cursor: "pointer",
                  fontFamily: "var(--font)", fontWeight: 600, fontSize: "0.88rem",
                }}>✕ סגור</button>
            </div>
            <ObservationForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetail;
