import React from "react";

const Hero: React.FC = () => {
  const scrollToBackground = () => {
    document.getElementById("background")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      aria-label="פתיחה"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 70% 40%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.12) 0%, transparent 50%), var(--gradient-hero)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 820,
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Program label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: 999,
            padding: "6px 18px",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--purple-light)",
              display: "inline-block",
              animation: "pulse 2s ease infinite",
            }}
          />
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--purple-light)" }}>
            תכנית מנהיגות בעידן הבינה המלאכותית
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            fontWeight: 800,
            color: "var(--white)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          AI Master
        </h1>

        {/* Subtitle */}
        <h2
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontWeight: 700,
            background: "var(--gradient-accent)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
          }}
        >
          ניהול בעידן האג'נטי
        </h2>

        {/* Session / experience labels */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <span className="chip chip-cyan">מפגש 1</span>
          <span
            style={{ color: "var(--navy-border)", fontSize: "1.2rem", userSelect: "none" }}
            aria-hidden="true"
          >
            |
          </span>
          <span className="chip chip-purple">התנסות ניהולית עתיד קרוב</span>
        </div>

        {/* Duration block */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-lg)",
            padding: "24px 32px",
            marginBottom: 40,
            textAlign: "right",
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--white)",
              marginBottom: 16,
            }}
          >
            75 דקות
          </p>
          {[
            { time: "(10 דקות)", desc: "פתיחה והסבר המשימה (מליאה)" },
            { time: "40 דקות)", desc: "המשחק והסימולציה בשולחנות" },
            { time: "(15 דקות)", desc: "עיבוד ורפלקציה בשולחנות הקטנים" },
            { time: "(10 דקות)", desc: "אינטגרציה קצרה וסגירה" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "6px 0",
                borderBottom:
                  i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--cyan-light)",
                  minWidth: 90,
                  textAlign: "center",
                  background: "rgba(6,182,212,0.1)",
                  borderRadius: 6,
                  padding: "2px 8px",
                  flexShrink: 0,
                }}
              >
                {item.time}
              </span>
              <span style={{ fontSize: "0.92rem", color: "var(--text)" }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary"
          onClick={scrollToBackground}
          aria-label="התחל את הסימולציה - מעבר לרקע"
          style={{ fontSize: "1.05rem", padding: "14px 36px" }}
        >
          התחלת הסימולציה
          <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>↓</span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
