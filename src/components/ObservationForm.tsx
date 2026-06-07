import React, { useState, useCallback } from "react";
import { observationFormContent } from "../data/simulationContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type MomentRow = { behavior: string; meaning: string };

type FormState = {
  focusNotes: string[];
  ratings: (number | null)[];
  moments: MomentRow[];
  summaryFields: string[];
  overallEvaluation: string | null;
};

const defaultForm = (): FormState => ({
  focusNotes: observationFormContent.focusRows.map(() => ""),
  ratings: observationFormContent.ratingRows.map(() => null),
  moments: [
    { behavior: "", meaning: "" },
    { behavior: "", meaning: "" },
    { behavior: "", meaning: "" },
  ],
  summaryFields: observationFormContent.summaryFields.map(() => ""),
  overallEvaluation: null,
});

// ─── PDF HTML builder ─────────────────────────────────────────────────────────

const buildPrintHTML = (form: FormState): string => {
  const c = observationFormContent;
  const now = new Date().toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });

  const escHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");

  // Rating dots row
  const ratingDots = (rowIdx: number) =>
    [1, 2, 3, 4, 5].map(v => {
      const sel = form.ratings[rowIdx] === v;
      return `<td class="rating-cell">
        <div class="dot${sel ? " dot-selected" : ""}">
          ${sel ? "✓" : v}
        </div>
      </td>`;
    }).join("");

  // Overall pill
  const overallColors: Record<string, string> = { נמוך: "#DC2626", בינוני: "#D97706", גבוה: "#16A34A" };

  const overallPills = c.overallEvaluationOptions.map(opt => {
    const sel = form.overallEvaluation === opt;
    const col = overallColors[opt] ?? "#00A651";
    return `<span class="pill${sel ? " pill-selected" : ""}"
      style="${sel ? `background:${col}18;border-color:${col};color:${col};` : ""}">
      ${sel ? "✓ " : ""}${escHtml(opt)}
    </span>`;
  }).join("");

  // Focus rows
  const focusRows = c.focusRows.map((row, i) => `
    <tr>
      <td class="label-cell"><strong>${escHtml(row.observed)}</strong></td>
      <td class="guide-cell">${escHtml(row.guidingQuestion)}</td>
      <td class="note-cell">${escHtml(form.focusNotes[i] || "")}</td>
    </tr>`).join("");

  // Rating rows
  const ratingRows = c.ratingRows.map((row, ri) => `
    <tr class="${ri % 2 === 0 ? "row-even" : "row-odd"}">
      <td class="label-cell" style="white-space:pre-line">${escHtml(row.label)}</td>
      ${ratingDots(ri)}
    </tr>`).join("");

  // Moments
  const momentsHTML = form.moments
    .map((m) => {
      if (!m.behavior.trim() && !m.meaning.trim()) return "";
      return `
      <tr>
        <td class="note-cell">${escHtml(m.behavior)}</td>
        <td class="note-cell">${escHtml(m.meaning)}</td>
      </tr>`;
    }).join("");

  const hasMoments = form.moments.some(m => m.behavior.trim() || m.meaning.trim());

  // Summary fields
  const summaryHTML = c.summaryFields.map((label, i) => `
    <div class="summary-field">
      <div class="field-label">${escHtml(label)}</div>
      <div class="field-value">${escHtml(form.summaryFields[i] || "")}</div>
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>${c.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      direction: rtl;
      font-family: 'Rubik', Arial, sans-serif;
      font-size: 11pt;
      color: #1A2E22;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page layout ── */
    @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
    body { padding: 0; }

    /* ── Header ── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #00A651;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .logo-block { display: flex; align-items: center; gap: 10px; }
    .logo-circle {
      width: 40px; height: 40px; border-radius: 8px;
      background: #00A651;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-circle svg { display: block; }
    .logo-text-main { font-weight: 800; font-size: 13pt; color: #00703A; line-height: 1.15; }
    .logo-text-sub  { font-size: 8.5pt; color: #5A7A65; }
    .header-date { font-size: 9pt; color: #5A7A65; text-align: left; }

    /* ── Title block ── */
    .title-block {
      background: linear-gradient(135deg, #E6F7EE 0%, #F0FAF4 100%);
      border: 1px solid #C2E8D2;
      border-right: 4px solid #00A651;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin-bottom: 20px;
    }
    .title-block h1 { font-size: 14pt; font-weight: 800; color: #00703A; margin-bottom: 6px; }
    .title-block p  { font-size: 9.5pt; color: #1A2E22; line-height: 1.6; }

    /* ── Section header ── */
    .section-heading {
      background: #E6F7EE;
      border-right: 4px solid #00A651;
      border-radius: 0 6px 6px 0;
      padding: 7px 14px;
      font-size: 10.5pt;
      font-weight: 800;
      color: #00703A;
      margin: 18px 0 10px;
    }

    /* ── Tables ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-bottom: 4px;
    }
    th {
      background: #C2E8D2;
      color: #005C2E;
      font-weight: 800;
      padding: 7px 10px;
      text-align: right;
      font-size: 8.5pt;
      letter-spacing: 0.03em;
      border: 1px solid #A8D8BC;
    }
    td {
      border: 1px solid #D4EDDE;
      padding: 8px 10px;
      vertical-align: top;
      line-height: 1.5;
    }
    tr.row-even td { background: #F8FCF9; }
    tr.row-odd  td { background: #fff; }
    .label-cell  { font-weight: 700; width: 26%; color: #1A2E22; }
    .guide-cell  { width: 30%; color: #5A7A65; font-size: 9pt; }
    .note-cell   { width: 44%; color: #1A2E22; min-height: 40px; }
    .rating-cell {
      width: 44px; text-align: center; vertical-align: middle;
      padding: 6px 4px;
    }

    /* ── Rating dots ── */
    .dot {
      width: 24px; height: 24px; border-radius: 50%;
      border: 2px solid #C2E8D2;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 8pt; font-weight: 700; color: #5A7A65;
      margin: 0 auto;
    }
    .dot-selected {
      background: #00A651; border-color: #00A651;
      color: #fff;
    }

    /* ── Overall pills ── */
    .pills { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
    .pill {
      padding: 7px 20px; border-radius: 999px;
      border: 1.5px solid #C2E8D2;
      font-size: 10pt; font-weight: 700; color: #5A7A65;
      background: #F8FCF9;
    }
    .pill-selected { font-weight: 800; }

    /* ── Summary fields ── */
    .summary-field { margin-bottom: 14px; }
    .field-label {
      font-size: 9pt; font-weight: 700; color: #5A7A65;
      margin-bottom: 4px; letter-spacing: 0.03em;
    }
    .field-value {
      border: 1px solid #D4EDDE; border-radius: 6px;
      padding: 9px 12px; min-height: 56px;
      font-size: 9.5pt; line-height: 1.6;
      color: #1A2E22; background: #F8FCF9;
    }

    /* ── Instruction note ── */
    .instruction-note {
      background: #E6F7EE; border: 1px solid #C2E8D2;
      border-right: 4px solid #00A651;
      border-radius: 0 6px 6px 0;
      padding: 10px 14px;
      font-size: 9.5pt; font-weight: 600;
      color: #00703A; line-height: 1.6;
      margin-top: 18px;
    }

    /* ── Footer ── */
    .page-footer {
      margin-top: 20px;
      border-top: 1px solid #C2E8D2;
      padding-top: 8px;
      font-size: 8pt; color: #5A7A65;
      display: flex; justify-content: space-between;
    }

    /* ── Page breaks ── */
    .avoid-break { page-break-inside: avoid; }

    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="page-header">
    <div class="logo-block">
      <div class="logo-circle">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M13 3 C13 3 6 8 6 15 C6 19.5 9.5 22 13 23 C16.5 22 20 19.5 20 15 C20 8 13 3 13 3Z" fill="white" opacity="0.9"/>
          <path d="M13 7 C13 7 8.5 11 8.5 15.5 C8.5 18.3 10.7 20 13 21 C15.3 20 17.5 18.3 17.5 15.5 C17.5 11 13 7 13 7Z" fill="#00A651"/>
        </svg>
      </div>
      <div>
        <div class="logo-text-main">מכבי שירותי בריאות</div>
        <div class="logo-text-sub">AI Master — ניהול בעידן האג'נטי</div>
      </div>
    </div>
    <div class="header-date">
      <div style="font-weight:700;font-size:9pt;color:#1A2E22;">דף תצפית</div>
      <div>${now}</div>
    </div>
  </div>

  <!-- Title block -->
  <div class="title-block">
    <h1>${escHtml(c.title)}</h1>
    ${c.purpose.split("\n").map(l => `<p>${escHtml(l)}</p>`).join("")}
  </div>

  <!-- Section 1 -->
  <div class="avoid-break">
    <div class="section-heading">${escHtml(c.focusSectionTitle)}</div>
    <table>
      <thead>
        <tr>
          <th>${escHtml(c.focusTableHeaders[0])}</th>
          <th>${escHtml(c.focusTableHeaders[1])}</th>
          <th>${escHtml(c.focusTableHeaders[2])}</th>
        </tr>
      </thead>
      <tbody>${focusRows}</tbody>
    </table>
  </div>

  <!-- Section 2 -->
  <div class="avoid-break">
    <div class="section-heading">${escHtml(c.ratingSectionTitle)}</div>
    <table>
      <thead>
        <tr>
          <th>${escHtml(c.ratingTableHeaders[0])}</th>
          ${c.ratingScale.map(l => `<th style="text-align:center;width:44px">${escHtml(l)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>${ratingRows}</tbody>
    </table>
  </div>

  <!-- Section 3 -->
  ${hasMoments ? `
  <div class="avoid-break">
    <div class="section-heading">${escHtml(c.momentsSectionTitle)}</div>
    <table>
      <thead>
        <tr>
          <th>${escHtml(c.momentHeaders[0])}</th>
          <th>${escHtml(c.momentHeaders[1])}</th>
        </tr>
      </thead>
      <tbody>${momentsHTML}</tbody>
    </table>
  </div>` : ""}

  <!-- Section 4 -->
  <div class="avoid-break">
    <div class="section-heading">${escHtml(c.summarySectionTitle)}</div>
    ${summaryHTML}
    <div style="margin-top:12px">
      <div class="field-label">${escHtml(c.overallEvaluationQuestion)}</div>
      <div class="pills">${overallPills}</div>
    </div>
  </div>

  <!-- Instruction note -->
  <div class="instruction-note">${escHtml(c.observerInstruction)}</div>

  <!-- Footer -->
  <div class="page-footer">
    <span>מכבי שירותי בריאות — AI Master</span>
    <span>${c.title}</span>
    <span>${now}</span>
  </div>

</body>
</html>`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{
    fontSize: "1rem", fontWeight: 800, color: "var(--text)",
    padding: "9px 16px",
    background: "var(--green-light)",
    borderRight: "4px solid var(--green)",
    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
    marginBottom: 16, letterSpacing: "0.01em",
  }}>
    {children}
  </h3>
);

const Textarea: React.FC<{
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; rows?: number; hideLabel?: boolean;
}> = ({ id, label, value, onChange, placeholder = "כתוב/י כאן...", rows = 4, hideLabel = false }) => (
  <div>
    <label htmlFor={id} style={{
      display: hideLabel ? "none" : "block",
      fontSize: "0.82rem", fontWeight: 700,
      color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.03em",
    }}>{label}</label>
    <textarea id={id} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        width: "100%", background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", color: "var(--text)",
        fontFamily: "var(--font)", fontSize: "0.95rem",
        lineHeight: 1.65, padding: "10px 12px",
        resize: "vertical", direction: "rtl",
        transition: "border-color 0.15s", outline: "none", boxSizing: "border-box",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = "var(--green)"; }}
      onBlur={e  => { e.currentTarget.style.borderColor = "var(--border)"; }}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ObservationForm: React.FC = () => {
  const content = observationFormContent;
  const [form, setForm] = useState<FormState>(defaultForm);
  const [copied, setCopied] = useState(false);

  // ── Updaters ────────────────────────────────────────────────────────────────

  const setFocusNote = useCallback((i: number, val: string) => {
    setForm(f => { const notes = [...f.focusNotes]; notes[i] = val; return { ...f, focusNotes: notes }; });
  }, []);

  const setRating = useCallback((rowIdx: number, val: number) => {
    setForm(f => {
      const ratings = [...f.ratings];
      ratings[rowIdx] = ratings[rowIdx] === val ? null : val;
      return { ...f, ratings };
    });
  }, []);

  const setMomentField = useCallback((i: number, field: "behavior" | "meaning", val: string) => {
    setForm(f => {
      const moments = f.moments.map((m, idx) => idx === i ? { ...m, [field]: val } : m);
      return { ...f, moments };
    });
  }, []);

  const addMoment = () => setForm(f => ({ ...f, moments: [...f.moments, { behavior: "", meaning: "" }] }));

  const setSummaryField = useCallback((i: number, val: string) => {
    setForm(f => { const fields = [...f.summaryFields]; fields[i] = val; return { ...f, summaryFields: fields }; });
  }, []);

  const setOverall = useCallback((opt: string) => {
    setForm(f => ({ ...f, overallEvaluation: f.overallEvaluation === opt ? null : opt }));
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleClear = () => {
    if (window.confirm("האם אתה/את בטוח/ה שברצונך לנקות את הטופס? הפעולה אינה ניתנת לביטול.")) {
      setForm(defaultForm());
    }
  };

  const handleCopySummary = async () => {
    const c = content;
    const lines: string[] = [c.title, "", c.purpose, ""];
    lines.push(`=== ${c.focusSectionTitle} ===`);
    c.focusRows.forEach((row, i) => {
      const note = form.focusNotes[i].trim();
      if (note) { lines.push(`${row.observed}:`); lines.push(note); lines.push(""); }
    });
    lines.push(`=== ${c.ratingSectionTitle} ===`);
    c.ratingRows.forEach((row, i) => {
      const r = form.ratings[i];
      if (r !== null) lines.push(`${row.label.replace(/\n/g, " ")}: ${c.ratingScale[r - 1]}`);
    });
    lines.push("");
    lines.push(`=== ${c.momentsSectionTitle} ===`);
    form.moments.forEach((m, i) => {
      if (m.behavior.trim() || m.meaning.trim()) {
        lines.push(`רגע ${i + 1}:`);
        if (m.behavior.trim()) lines.push(`${c.momentHeaders[0]}: ${m.behavior.trim()}`);
        if (m.meaning.trim()) lines.push(`${c.momentHeaders[1]}: ${m.meaning.trim()}`);
        lines.push("");
      }
    });
    lines.push(`=== ${c.summarySectionTitle} ===`);
    c.summaryFields.forEach((label, i) => {
      const val = form.summaryFields[i].trim();
      if (val) { lines.push(`${label}:`); lines.push(val); lines.push(""); }
    });
    if (form.overallEvaluation) lines.push(`${c.overallEvaluationQuestion} ${form.overallEvaluation}`);
    lines.push(""); lines.push(c.observerInstruction);
    const text = lines.join("\n");
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text;
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPDF = () => {
    const html = buildPrintHTML(form);
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { alert("אנא אפשר חלונות קופצים בדפדפן כדי לייצא PDF"); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Wait for fonts to load before printing
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const overallColors: Record<string, string> = { נמוך: "#DC2626", בינוני: "#D97706", גבוה: "#16A34A" };

  return (
    <div style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, var(--green-light) 0%, #fff 100%)",
        border: "1px solid var(--green-mid)", borderRadius: "var(--radius-md)", padding: "18px 20px",
      }}>
        <h2 style={{ fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
          {content.title}
        </h2>
        {content.purpose.split("\n").map((line, i) => (
          <p key={i} style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{line}</p>
        ))}
      </div>

      {/* ── Section 1 ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="obs-s1">
        <SectionTitle><span id="obs-s1">{content.focusSectionTitle}</span></SectionTitle>

        {/* Desktop table */}
        <div className="obs-table-header" aria-hidden="true" style={{
          display: "grid", gridTemplateColumns: "160px 1fr 1.4fr",
          gap: 1, background: "var(--border)",
          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", overflow: "hidden", marginBottom: 1,
        }}>
          {content.focusTableHeaders.map((h, i) => (
            <div key={i} style={{
              background: "var(--green-mid)", padding: "9px 12px",
              fontSize: "0.76rem", fontWeight: 800, color: "var(--green-deeper)", letterSpacing: "0.04em",
            }}>{h}</div>
          ))}
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: "0 0 var(--radius-sm) var(--radius-sm)", overflow: "hidden" }}>
          {content.focusRows.map((row, i) => (
            <div key={i}>
              {/* Desktop */}
              <div className="obs-table-row" style={{
                display: "grid", gridTemplateColumns: "160px 1fr 1.4fr",
                gap: 1, background: "var(--border)",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ background: "var(--green-tint)", padding: "12px", display: "flex", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.87rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.5 }}>{row.observed}</span>
                </div>
                <div style={{ background: "#fff", padding: "12px" }}>
                  {row.guidingQuestion.split("\n").map((line, li) => (
                    <p key={li} style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{line}</p>
                  ))}
                </div>
                <div style={{ background: "#fff", padding: "8px" }}>
                  <Textarea id={`focus-${i}`} label={`תיעוד — ${row.observed}`}
                    value={form.focusNotes[i]} onChange={v => setFocusNote(i, v)} rows={3} hideLabel />
                </div>
              </div>
              {/* Mobile */}
              <div className="obs-mobile-card" style={{
                background: "#fff", borderTop: i > 0 ? "1px solid var(--border)" : "none",
                padding: "14px", display: "none", flexDirection: "column", gap: 8,
              }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>{row.observed}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{row.guidingQuestion}</p>
                <Textarea id={`focus-m-${i}`} label={`תיעוד — ${row.observed}`}
                  value={form.focusNotes[i]} onChange={v => setFocusNote(i, v)} rows={3} hideLabel />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2 ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="obs-s2">
        <SectionTitle><span id="obs-s2">{content.ratingSectionTitle}</span></SectionTitle>

        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          {/* Header */}
          <div className="rating-header" style={{
            display: "grid", gridTemplateColumns: "1fr repeat(5, 64px)",
            gap: 1, background: "var(--border)",
          }}>
            <div style={{ background: "var(--green-mid)", padding: "9px 12px", fontSize: "0.76rem", fontWeight: 800, color: "var(--green-deeper)", letterSpacing: "0.04em" }}>
              {content.ratingTableHeaders[0]}
            </div>
            {content.ratingScale.map((label, i) => (
              <div key={i} style={{
                background: "var(--green-mid)", padding: "9px 4px",
                fontSize: "0.7rem", fontWeight: 800, color: "var(--green-deeper)",
                textAlign: "center", lineHeight: 1.25,
              }}>{label}</div>
            ))}
          </div>

          {/* Rows */}
          {content.ratingRows.map((row, ri) => (
            <div key={ri} className="rating-row" style={{
              display: "grid", gridTemplateColumns: "1fr repeat(5, 64px)",
              gap: 1, background: "var(--border)", borderTop: "1px solid var(--border)",
            }}>
              <div style={{
                background: ri % 2 === 0 ? "var(--green-tint)" : "#fff",
                padding: "10px 12px", display: "flex", alignItems: "center",
              }}>
                <span style={{ fontSize: "0.87rem", fontWeight: 600, color: "var(--text)", whiteSpace: "pre-line", lineHeight: 1.4 }}>
                  {row.label}
                </span>
              </div>
              {[1, 2, 3, 4, 5].map(val => {
                const isSel = form.ratings[ri] === val;
                return (
                  <div key={val} style={{
                    background: isSel ? "var(--green-light)" : ri % 2 === 0 ? "var(--green-tint)" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <button onClick={() => setRating(ri, val)}
                      aria-label={`${row.label.replace(/\n/g, " ")} — ${content.ratingScale[val - 1]}`}
                      aria-pressed={isSel}
                      style={{
                        width: "100%", height: "100%", minHeight: 50,
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font)",
                      }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        border: `2px solid ${isSel ? "var(--green)" : "var(--border)"}`,
                        background: isSel ? "var(--green)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s", color: isSel ? "#fff" : "var(--text-muted)",
                        fontSize: "0.7rem", fontWeight: 800,
                      }}>
                        {isSel ? "✓" : val}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Mobile */}
          <div className="rating-mobile" style={{ display: "none", padding: 14, flexDirection: "column", gap: 18 }}>
            {content.ratingRows.map((row, ri) => (
              <div key={ri}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, whiteSpace: "pre-line" }}>{row.label}</p>
                <div role="radiogroup" aria-label={row.label.replace(/\n/g, " ")} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 5].map(val => {
                    const isSel = form.ratings[ri] === val;
                    return (
                      <button key={val} onClick={() => setRating(ri, val)}
                        aria-label={content.ratingScale[val - 1]} aria-pressed={isSel}
                        style={{
                          minWidth: 60, padding: "8px 10px", borderRadius: 8,
                          border: `1.5px solid ${isSel ? "var(--green)" : "var(--border)"}`,
                          background: isSel ? "var(--green-light)" : "#fff",
                          color: isSel ? "var(--green-dark)" : "var(--text-muted)",
                          fontWeight: 800, fontSize: "0.84rem", cursor: "pointer",
                          fontFamily: "var(--font)", transition: "all 0.15s",
                        }}>{content.ratingScale[val - 1]}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="obs-s3">
        <SectionTitle><span id="obs-s3">{content.momentsSectionTitle}</span></SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Column headers — desktop */}
          <div className="moments-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {content.momentHeaders.map((h, i) => (
              <div key={i} style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--green-deeper)", letterSpacing: "0.04em", padding: "4px 0" }}>{h}</div>
            ))}
          </div>

          {/* Rows — desktop */}
          {form.moments.map((moment, mi) => (
            <div key={mi} className="moment-row" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: 12,
            }}>
              <Textarea id={`moment-b-${mi}`} label={`${content.momentHeaders[0]} — רגע ${mi + 1}`}
                value={moment.behavior} onChange={v => setMomentField(mi, "behavior", v)}
                rows={3} hideLabel placeholder={`רגע / התנהגות ${mi + 1}...`} />
              <Textarea id={`moment-m-${mi}`} label={`${content.momentHeaders[1]} — רגע ${mi + 1}`}
                value={moment.meaning} onChange={v => setMomentField(mi, "meaning", v)}
                rows={3} hideLabel placeholder="מה זה מלמד..." />
            </div>
          ))}

          {/* Mobile stacked */}
          <div className="moments-mobile" style={{ display: "none", flexDirection: "column", gap: 16 }}>
            {form.moments.map((moment, mi) => (
              <div key={mi} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>רגע {mi + 1}</p>
                <Textarea id={`moment-bm-${mi}`} label={content.momentHeaders[0]}
                  value={moment.behavior} onChange={v => setMomentField(mi, "behavior", v)}
                  rows={3} placeholder="רגע / התנהגות שנצפתה..." />
                <Textarea id={`moment-mm-${mi}`} label={content.momentHeaders[1]}
                  value={moment.meaning} onChange={v => setMomentField(mi, "meaning", v)}
                  rows={3} placeholder="מה זה מלמד..." />
              </div>
            ))}
          </div>

          <button onClick={addMoment} aria-label="הוספת רגע משמעותי נוסף" style={{
            alignSelf: "flex-start",
            background: "var(--green-light)", border: "1.5px dashed var(--green)",
            borderRadius: "var(--radius-sm)", color: "var(--green-dark)",
            padding: "9px 18px", cursor: "pointer", fontFamily: "var(--font)",
            fontWeight: 700, fontSize: "0.87rem", transition: "all 0.15s",
          }}>+ הוספת רגע משמעותי</button>
        </div>
      </section>

      {/* ── Section 4 ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="obs-s4">
        <SectionTitle><span id="obs-s4">{content.summarySectionTitle}</span></SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {content.summaryFields.map((label, i) => (
            <Textarea key={i} id={`summary-${i}`} label={label}
              value={form.summaryFields[i]} onChange={v => setSummaryField(i, v)} rows={4} />
          ))}

          <fieldset style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
            <legend style={{ fontSize: "0.87rem", fontWeight: 700, color: "var(--text)", padding: "0 8px" }}>
              {content.overallEvaluationQuestion}
            </legend>
            <div role="radiogroup" aria-label={content.overallEvaluationQuestion}
              style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              {content.overallEvaluationOptions.map(opt => {
                const isSel = form.overallEvaluation === opt;
                const c = overallColors[opt] ?? "var(--green)";
                return (
                  <button key={opt} onClick={() => setOverall(opt)}
                    aria-pressed={isSel} aria-label={`הערכה כוללת: ${opt}`}
                    style={{
                      flex: 1, minWidth: 90, padding: "13px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: `${isSel ? "2px" : "1.5px"} solid ${isSel ? c : "var(--border)"}`,
                      background: isSel ? `${c}18` : "#fff",
                      color: isSel ? c : "var(--text-muted)",
                      fontWeight: 800, fontSize: "0.98rem", cursor: "pointer",
                      fontFamily: "var(--font)", transition: "all 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                    {isSel && <span aria-hidden="true">✓</span>}
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>

      {/* ── Instruction note ────────────────────────────────────────────────── */}
      <div role="note" style={{
        background: "var(--green-light)", border: "1px solid var(--green-mid)",
        borderRight: "4px solid var(--green)",
        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", padding: "12px 16px",
      }}>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--green-deeper)", lineHeight: 1.65 }}>
          {content.observerInstruction}
        </p>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-primary" onClick={handleExportPDF}
          aria-label="ייצוא דף התצפית כקובץ PDF"
          style={{ fontSize: "0.9rem", padding: "10px 22px", gap: 8 }}>
          <span aria-hidden="true">⬇</span> ייצוא PDF
        </button>
        <button className="btn btn-secondary" onClick={handleCopySummary}
          aria-label="העתקת סיכום התצפית ללוח"
          style={{ fontSize: "0.9rem", padding: "10px 22px" }}>
          {copied ? "✓ הועתק!" : "העתקת סיכום התצפית"}
        </button>
        <button className="btn btn-danger" onClick={handleClear}
          aria-label="ניקוי כל שדות הטופס"
          style={{ fontSize: "0.9rem", padding: "10px 22px" }}>
          ניקוי טופס
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          .obs-table-header { display: none !important; }
          .obs-table-row    { display: none !important; }
          .obs-mobile-card  { display: flex !important; }
          .rating-header    { display: none !important; }
          .rating-row       { display: none !important; }
          .rating-mobile    { display: flex !important; }
          .moments-header   { display: none !important; }
          .moment-row       { display: none !important; }
          .moments-mobile   { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default ObservationForm;
