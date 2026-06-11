import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roles } from "../data/simulationContent";
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
const roleIcon: Record<Role["type"], string> = {
  manager: "◆", participant: "●", "ai-agent": "⬡", observer: "◎",
};

const HEADINGS = new Set([
  "התפקיד שלך", "אופן הפעולה:", "שאלות לדוגמה ל-Copilot:",
  "שאלות לדוגמה:", "מקורות מידע לרשותך:", "דגש קריטי:", "בסיום הסימולציה:",
]);

const RolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate   = useNavigate();
  const role       = roles.find(r => r.id === roleId);

  const [copied, setCopied]       = useState(false);
  const [formModal, setFormModal] = useState(false);
  const formModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFormModal(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formModal]);

  useEffect(() => {
    if (formModal) formModalRef.current?.focus();
  }, [formModal]);

  if (!role) {
    return (
      <div className="page-content" style={{ textAlign: "center", paddingTop: 80 }}>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>תפקיד לא נמצא.</p>
        <button className="btn btn-primary" onClick={() => navigate("/roles")}>
          ← חזרה לרשימת התפקידים
        </button>
      </div>
    );
  }

  const accent     = roleColor[role.type];
  const isObserver = role.id === "observer";

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

  /* sibling roles for prev / next navigation */
  const idx      = roles.findIndex(r => r.id === roleId);
  const prevRole = idx > 0 ? roles[idx - 1] : null;
  const nextRole = idx < roles.length - 1 ? roles[idx + 1] : null;

  return (
    <div className="page-content">
      {/* Back link */}
      <button
        onClick={() => navigate("/roles")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          color: "var(--text-muted)", fontFamily: "var(--font)",
          fontSize: "0.85rem", fontWeight: 600,
          padding: 0, marginBottom: 24,
        }}
        aria-label="חזרה לרשימת התפקידים"
      >
        → כל התפקידים
      </button>

      {/* Role header card */}
      <div style={{
        background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "clamp(28px, 5vw, 48px)",
        color: "#fff",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(24,49,118,0.25)",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: -40, left: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: -20, right: 60,
          width: 100, height: 100, borderRadius: "50%",
          background: `${accent}30`,
        }} />

        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem", color: "#fff", flexShrink: 0,
          }} aria-hidden="true">
            {roleIcon[role.type]}
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <span className={`badge ${roleBadgeClass[role.type]}`}
                style={{ background: "rgba(255,255,255,0.22)", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}>
                {roleBadgeLabel[role.type]}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
              {role.title}
            </h1>
            <p style={{ opacity: 0.85, fontSize: "0.95rem" }}>{role.focus}</p>
          </div>
        </div>
      </div>

      {/* AI agent launch card */}
      {role.agentUrl && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #EEF1F9 100%)",
          border: "1.5px solid var(--role-ai)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "var(--role-ai)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", flexShrink: 0,
            }} aria-hidden="true">⬡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 3 }}>
                הסוכן מוכן לפעולה
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                לחצו להפעלת סוכן ה-AI בחלון חדש
              </div>
            </div>
          </div>
          <a
            href={role.agentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ background: "var(--role-ai)", boxShadow: "0 2px 8px rgba(19,155,254,0.30)", whiteSpace: "nowrap" }}
            aria-label={`פתח את סוכן ה-AI — ${role.title}`}
          >
            פתח את הסוכן ↗
          </a>
        </div>
      )}

      {/* Role content */}
      <div style={{
        background: "#fff",
        border: `1.5px solid ${accent}30`,
        borderRadius: "var(--radius-xl)",
        padding: "clamp(24px, 4vw, 40px)",
        boxShadow: "var(--shadow-md)",
        marginBottom: 24,
      }}>
        <div style={{ marginBottom: 28 }}>
          {role.fullText.split("\n").map((line, i) => {
            const isH = HEADINGS.has(line);
            if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
            return (
              <p key={i} style={{
                fontSize: isH ? "0.82rem" : "1rem",
                fontWeight: isH ? 700 : 400,
                color: isH ? accent : "var(--text)",
                lineHeight: 1.8,
                marginBottom: isH ? 4 : 3,
                letterSpacing: isH ? "0.03em" : "normal",
                paddingTop: isH ? 8 : 0,
              }}>{line}</p>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 20, borderTop: "1px solid var(--border-mid)" }}>
          <button className="btn btn-primary" onClick={handleCopy}
            aria-label="העתקת תוכן התפקיד ללוח">
            {copied ? "✓ הועתק!" : "העתקת התפקיד"}
          </button>
        </div>
      </div>

      {/* Observer: observation form */}
      {isObserver && (
        <div style={{
          background: "#fff",
          border: "1.5px solid var(--green-mid)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(24px, 4vw, 40px)",
          boxShadow: "var(--shadow-md)",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                דף תצפית — התנסות ניהולית עתיד קרוב
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                מלאו את הטופס במהלך הסימולציה
              </p>
            </div>
            <button className="btn btn-ghost" onClick={() => setFormModal(true)}
              aria-label="פתח דף תצפית במסך מלא"
              style={{ fontSize: "0.85rem" }}>
              מסך מלא ↗
            </button>
          </div>
          <ObservationForm />
        </div>
      )}

      {/* Role navigation */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
        <button
          className="btn btn-ghost role-nav-btn"
          onClick={() => prevRole && navigate(`/roles/${prevRole.id}`)}
          disabled={!prevRole}
          style={{ opacity: prevRole ? 1 : 0, pointerEvents: prevRole ? "auto" : "none" }}
        >
          <span aria-hidden="true">→</span>
          <span className="role-nav-label">{prevRole?.title ?? ""}</span>
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/roles")}>
          כל התפקידים
        </button>
        <button
          className="btn btn-ghost role-nav-btn"
          onClick={() => nextRole && navigate(`/roles/${nextRole.id}`)}
          disabled={!nextRole}
          style={{ opacity: nextRole ? 1 : 0, pointerEvents: nextRole ? "auto" : "none" }}
        >
          <span className="role-nav-label">{nextRole?.title ?? ""}</span>
          <span aria-hidden="true">←</span>
        </button>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .role-nav-label { display: none; }
          .role-nav-btn   { padding: 9px 16px !important; }
        }
      `}</style>

      {/* Observation form fullscreen modal */}
      {isObserver && formModal && (
        <div className="fullscreen-wrapper" role="dialog" aria-modal="true"
          aria-label="דף תצפית דיגיטלי"
          onClick={e => { if (e.target === e.currentTarget) setFormModal(false); }}>
          <div ref={formModalRef} tabIndex={-1} style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(20px, 4vw, 40px)",
            maxWidth: 900, width: "100%", maxHeight: "92vh", overflowY: "auto",
            position: "relative", outline: "none",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)",
            }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>
                דף תצפית — התנסות ניהולית עתיד קרוב
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

export default RolePage;
