import React from "react";

const chips = [
  "זמינות תורים",
  "עומסים תפעוליים",
  "חוויית מטופל",
  "חוסן צוותים",
  "סוכני AI",
  "קבלת החלטות",
];

const Overview: React.FC = () => {
  return (
    <section
      id="background"
      aria-labelledby="background-title"
      style={{
        background: "var(--navy-mid)",
        borderTop: "1px solid var(--navy-border)",
        borderBottom: "1px solid var(--navy-border)",
      }}
    >
      <div className="section">
        <h2 className="section-title" id="background-title">
          רקע לסימולציה
        </h2>
        <div className="section-divider" />

        {/* Scenario card */}
        <div
          style={{
            background: "var(--gradient-card)",
            border: "1px solid var(--navy-border)",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(28px, 5vw, 48px)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Accent stripe */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 4,
              height: "100%",
              background: "var(--gradient-accent)",
              borderRadius: "0 var(--radius-xl) var(--radius-xl) 0",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "4px 14px",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cyan-light)", letterSpacing: "0.04em" }}>
              תרחיש הסימולציה
            </span>
          </div>

          <p
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
              color: "var(--text)",
              lineHeight: 1.9,
              marginBottom: 32,
              maxWidth: 760,
            }}
          >
            בחודשים האחרונים חלה עלייה בביקוש לתורים, בעומסים התפעוליים ובלחץ מצד מטופלים והנהלה.
            <br />
            במקביל נרשמה ירידה בזמינות התורים, בשביעות רצון המטופלים ובחוסן הצוותים.
            <br />
            הנהלת המחוז מבקשת לגבש 2–3 כיווני פעולה לשיפור השירות, זמינות התורים וחוויית המטופל.
            <br />
            הסימולציה מדמה ישיבת צוות ניהולי המתקיימת בעתיד הקרוב, בה מנהלים עובדים לצד סוכני AI כחלק מתהליך קבלת ההחלטות השוטף.
          </p>

          {/* Chips */}
          <div
            role="list"
            aria-label="נושאי הסימולציה"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {chips.map((chip, i) => (
              <span
                key={i}
                role="listitem"
                className={`chip ${
                  i % 3 === 0
                    ? "chip-cyan"
                    : i % 3 === 1
                    ? "chip-purple"
                    : "chip-magenta"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
