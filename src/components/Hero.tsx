import React from "react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content" style={{ paddingTop: 56, paddingBottom: 120 }}>
      {/* Hero card */}
      <div
        style={{
          background: "linear-gradient(145deg, var(--green) 0%, var(--green-dark) 100%)",
          borderRadius: 24,
          padding: "clamp(40px, 7vw, 72px) clamp(28px, 5vw, 64px)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          marginBottom: 32,
          boxShadow: "0 8px 40px rgba(24,49,118,0.35)",
        } as React.CSSProperties}
      >
        {/* Decorative elements */}
        <div aria-hidden="true" style={{
          position: "absolute", top: -60, left: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: -40, right: 40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(249,95,136,0.18)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", top: 30, left: 120,
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(249,95,136,0.10)",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)", borderRadius: 999,
            padding: "5px 16px", marginBottom: 24,
          }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em" }}>
              תכנית מנהיגות בעידן הבינה המלאכותית
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}>
            AI Master
          </h1>

          <h2 style={{
            fontSize: "clamp(1.2rem, 3.5vw, 1.9rem)",
            fontWeight: 600,
            opacity: 0.92,
            marginBottom: 28,
          }}>
            ניהול בעידן האג'נטי
          </h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
            {["מפגש 1", "התנסות ניהולית עתיד קרוב"].map((t) => (
              <span key={t} style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.32)",
                borderRadius: 999, padding: "5px 14px",
                fontSize: "0.82rem", fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>

          <button
            className="btn"
            onClick={() => navigate("/background")}
            aria-label="התחלת הסימולציה"
            style={{
              background: "#fff",
              color: "var(--green-dark)",
              fontWeight: 800,
              fontSize: "1rem",
              padding: "13px 32px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              border: "none",
            }}
          >
            התחלת הסימולציה ←
          </button>
        </div>
      </div>

    </div>
  );
};

export default Hero;
