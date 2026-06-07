import React from "react";

const chips = [
  "זמינות תורים",
  "עומסים תפעוליים",
  "חוויית מטופל",
  "חוסן צוותים",
  "סוכני AI",
  "קבלת החלטות",
];

const chipClass = ["chip-green","chip-blue","chip-green","chip-amber","chip-cyan","chip-purple"];

const Overview: React.FC = () => (
  <div className="page-content">
    <h2 className="section-title" id="background-title">רקע לסימולציה</h2>
    <div className="section-divider" />

    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "clamp(28px, 5vw, 48px)",
        boxShadow: "var(--shadow-md)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Green accent stripe */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: 0,
        width: 5, height: "100%",
        background: "linear-gradient(to bottom, var(--green), var(--green-dark))",
        borderRadius: "0 var(--radius-xl) var(--radius-xl) 0",
      }} />

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "var(--green-light)", border: "1px solid var(--green-mid)",
        borderRadius: 8, padding: "4px 14px", marginBottom: 24,
      }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--green-dark)", letterSpacing: "0.04em" }}>
          תרחיש הסימולציה
        </span>
      </div>

      <p style={{
        fontSize: "clamp(1rem, 2.2vw, 1.1rem)",
        color: "var(--text)",
        lineHeight: 1.9,
        marginBottom: 32,
        maxWidth: 720,
      }}>
        בחודשים האחרונים חלה עלייה בביקוש לתורים, בעומסים התפעוליים ובלחץ מצד מטופלים והנהלה.
        <br />
        במקביל נרשמה ירידה בזמינות התורים, בשביעות רצון המטופלים ובחוסן הצוותים.
        <br />
        הנהלת המחוז מבקשת לגבש 2–3 כיווני פעולה לשיפור השירות, זמינות התורים וחוויית המטופל.
        <br />
        הסימולציה מדמה ישיבת צוות ניהולי המתקיימת בעתיד הקרוב, בה מנהלים עובדים לצד סוכני AI כחלק מתהליך קבלת ההחלטות השוטף.
      </p>

      <div role="list" aria-label="נושאי הסימולציה" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {chips.map((chip, i) => (
          <span key={i} role="listitem" className={`chip ${chipClass[i]}`}>{chip}</span>
        ))}
      </div>
    </div>
  </div>
);

export default Overview;
