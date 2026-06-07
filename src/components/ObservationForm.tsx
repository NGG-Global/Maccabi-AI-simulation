import React, { useState, useEffect, useCallback, useRef } from "react";
import { observationFormContent } from "../data/simulationContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type MomentRow = { behavior: string; meaning: string };

type FormState = {
  focusNotes: string[];            // one per focusRow
  ratings: (number | null)[];      // one per ratingRow, value 1-5 or null
  moments: MomentRow[];
  summaryFields: string[];         // one per summaryField label
  overallEvaluation: string | null;
};

const STORAGE_KEY = "observer-form-v1";

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

const loadForm = (): FormState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FormState;
  } catch {
    // ignore
  }
  return defaultForm();
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    style={{
      fontSize: "1rem",
      fontWeight: 800,
      color: "var(--text)",
      padding: "10px 16px",
      background: "var(--green-light)",
      borderRight: "4px solid var(--green)",
      borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
      marginBottom: 20,
      letterSpacing: "0.01em",
    }}
  >
    {children}
  </h3>
);

const Textarea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hideLabel?: boolean;
}> = ({ id, label, value, onChange, placeholder = "כתוב/י כאן...", rows = 4, hideLabel = false }) => (
  <div>
    <label
      htmlFor={id}
      style={{
        display: hideLabel ? "none" : "block",
        fontSize: "0.82rem",
        fontWeight: 700,
        color: "var(--text-muted)",
        marginBottom: 6,
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        color: "var(--text)",
        fontFamily: "var(--font)",
        fontSize: "0.95rem",
        lineHeight: 1.65,
        padding: "12px 14px",
        resize: "vertical",
        direction: "rtl",
        transition: "border-color 0.15s",
        outline: "none",
        boxSizing: "border-box",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--purple)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--navy-border)";
      }}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ObservationForm: React.FC = () => {
  const content = observationFormContent;
  const [form, setForm] = useState<FormState>(loadForm);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save to localStorage on every change
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 400);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form]);

  // ── Updaters ──────────────────────────────────────────────────────────────

  const setFocusNote = useCallback((i: number, val: string) => {
    setForm((f) => {
      const notes = [...f.focusNotes];
      notes[i] = val;
      return { ...f, focusNotes: notes };
    });
  }, []);

  const setRating = useCallback((rowIdx: number, val: number) => {
    setForm((f) => {
      const ratings = [...f.ratings];
      ratings[rowIdx] = ratings[rowIdx] === val ? null : val;
      return { ...f, ratings };
    });
  }, []);

  const setMomentField = useCallback(
    (i: number, field: "behavior" | "meaning", val: string) => {
      setForm((f) => {
        const moments = f.moments.map((m, idx) =>
          idx === i ? { ...m, [field]: val } : m
        );
        return { ...f, moments };
      });
    },
    []
  );

  const addMoment = () => {
    setForm((f) => ({
      ...f,
      moments: [...f.moments, { behavior: "", meaning: "" }],
    }));
  };

  const setSummaryField = useCallback((i: number, val: string) => {
    setForm((f) => {
      const fields = [...f.summaryFields];
      fields[i] = val;
      return { ...f, summaryFields: fields };
    });
  }, []);

  const setOverall = useCallback((opt: string) => {
    setForm((f) => ({
      ...f,
      overallEvaluation: f.overallEvaluation === opt ? null : opt,
    }));
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    if (window.confirm("האם אתה/את בטוח/ה שברצונך לנקות את הטופס? הפעולה אינה ניתנת לביטול.")) {
      const fresh = defaultForm();
      setForm(fresh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  };

  const buildSummary = (): string => {
    const lines: string[] = [];
    lines.push(content.title);
    lines.push("");
    lines.push(content.purpose);
    lines.push("");

    // Section 1
    lines.push(`=== ${content.focusSectionTitle} ===`);
    content.focusRows.forEach((row, i) => {
      const note = form.focusNotes[i].trim();
      if (note) {
        lines.push(`${row.observed}:`);
        lines.push(note);
        lines.push("");
      }
    });

    // Section 2
    lines.push(`=== ${content.ratingSectionTitle} ===`);
    content.ratingRows.forEach((row, i) => {
      const r = form.ratings[i];
      if (r !== null) {
        const label = row.label.replace(/\n/g, " ");
        const scaleLbl = content.ratingScale[r - 1];
        lines.push(`${label}: ${scaleLbl}`);
      }
    });
    lines.push("");

    // Section 3
    lines.push(`=== ${content.momentsSectionTitle} ===`);
    form.moments.forEach((m, i) => {
      if (m.behavior.trim() || m.meaning.trim()) {
        lines.push(`רגע ${i + 1}:`);
        if (m.behavior.trim()) lines.push(`${content.momentHeaders[0]}: ${m.behavior.trim()}`);
        if (m.meaning.trim()) lines.push(`${content.momentHeaders[1]}: ${m.meaning.trim()}`);
        lines.push("");
      }
    });

    // Section 4
    lines.push(`=== ${content.summarySectionTitle} ===`);
    content.summaryFields.forEach((label, i) => {
      const val = form.summaryFields[i].trim();
      if (val) {
        lines.push(`${label}:`);
        lines.push(val);
        lines.push("");
      }
    });
    if (form.overallEvaluation) {
      lines.push(`${content.overallEvaluationQuestion} ${form.overallEvaluation}`);
      lines.push("");
    }

    lines.push(content.observerInstruction);
    return lines.join("\n");
  };

  const handleCopySummary = async () => {
    const text = buildSummary();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.1) 100%)",
          border: "1px solid var(--green-mid)",
          borderRadius: "var(--radius-md)",
          padding: "20px 22px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.05rem, 3vw, 1.25rem)",
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          {content.title}
        </h2>
        {content.purpose.split("\n").map((line, i) => (
          <p
            key={i}
            style={{
              fontSize: "0.9rem",
              color: "var(--text)",
              lineHeight: 1.65,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* ── Section 1: מיקוד התצפית ─────────────────────────────────────── */}
      <section aria-labelledby="obs-s1">
        <SectionTitle>
          <span id="obs-s1">{content.focusSectionTitle}</span>
        </SectionTitle>

        {/* Desktop table header */}
        <div
          className="obs-table-header"
          aria-hidden="true"
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 1.4fr",
            gap: 1,
            background: "var(--navy-border)",
            borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
            overflow: "hidden",
            marginBottom: 1,
          }}
        >
          {content.focusTableHeaders.map((h, i) => (
            <div
              key={i}
              style={{
                background: "rgba(124,58,237,0.12)",
                padding: "10px 14px",
                fontSize: "0.78rem",
                fontWeight: 800,
                color: "var(--green-dark)",
                letterSpacing: "0.04em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
            overflow: "hidden",
          }}
        >
          {content.focusRows.map((row, i) => (
            <div key={i}>
              {/* Desktop row */}
              <div
                className="obs-table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr 1.4fr",
                  gap: 1,
                  background: "var(--navy-border)",
                  borderTop: i > 0 ? "1px solid var(--navy-border)" : "none",
                }}
              >
                {/* Observed */}
                <div
                  style={{
                    background: "var(--bg)",
                    padding: "14px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.5,
                    }}
                  >
                    {row.observed}
                  </span>
                </div>
                {/* Guiding question */}
                <div
                  style={{
                    background: "var(--bg)",
                    padding: "14px",
                  }}
                >
                  {row.guidingQuestion.split("\n").map((line, li) => (
                    <p
                      key={li}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                {/* Notes */}
                <div
                  style={{
                    background: "var(--bg)",
                    padding: "10px",
                  }}
                >
                  <Textarea
                    id={`focus-${i}`}
                    label={`תיעוד — ${row.observed}`}
                    value={form.focusNotes[i]}
                    onChange={(v) => setFocusNote(i, v)}
                    rows={3}
                    hideLabel
                  />
                </div>
              </div>

              {/* Mobile card */}
              <div
                className="obs-mobile-card"
                style={{
                  background: "var(--bg)",
                  borderTop: i > 0 ? "1px solid var(--navy-border)" : "none",
                  padding: "16px",
                  display: "none",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {row.observed}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {row.guidingQuestion}
                </p>
                <Textarea
                  id={`focus-m-${i}`}
                  label={`תיעוד — ${row.observed}`}
                  value={form.focusNotes[i]}
                  onChange={(v) => setFocusNote(i, v)}
                  rows={3}
                  hideLabel
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: מדדי הערכה ────────────────────────────────────────── */}
      <section aria-labelledby="obs-s2">
        <SectionTitle>
          <span id="obs-s2">{content.ratingSectionTitle}</span>
        </SectionTitle>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr repeat(5, 64px)",
              gap: 1,
              background: "var(--navy-border)",
            }}
            className="rating-header"
          >
            <div
              style={{
                background: "rgba(124,58,237,0.12)",
                padding: "10px 14px",
                fontSize: "0.78rem",
                fontWeight: 800,
                color: "var(--green-dark)",
                letterSpacing: "0.04em",
              }}
            >
              {content.ratingTableHeaders[0]}
            </div>
            {content.ratingScale.map((label, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(124,58,237,0.12)",
                  padding: "10px 6px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--green-dark)",
                  textAlign: "center",
                  letterSpacing: "0.02em",
                  lineHeight: 1.3,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Rating rows */}
          {content.ratingRows.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr repeat(5, 64px)",
                gap: 1,
                background: "var(--navy-border)",
                borderTop: "1px solid var(--navy-border)",
              }}
              className="rating-row"
            >
              {/* Label */}
              <div
                style={{
                  background: ri % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    whiteSpace: "pre-line",
                    lineHeight: 1.4,
                  }}
                >
                  {row.label}
                </span>
              </div>

              {/* Rating cells */}
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = form.ratings[ri] === val;
                return (
                  <div
                    key={val}
                    style={{
                      background: isSelected
                        ? "rgba(124,58,237,0.25)"
                        : ri % 2 === 0
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.015)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => setRating(ri, val)}
                      aria-label={`${row.label.replace(/\n/g, " ")} — ציון ${content.ratingScale[val - 1]}`}
                      aria-pressed={isSelected}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 52,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font)",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: isSelected
                            ? "2px solid var(--purple-light)"
                            : "2px solid rgba(255,255,255,0.2)",
                          background: isSelected
                            ? "var(--purple)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                          color: "white",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                        }}
                      >
                        {isSelected ? "✓" : val}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Mobile: rating as horizontal pills per row */}
          <div className="rating-mobile" style={{ display: "none", padding: 16, flexDirection: "column", gap: 20 }}>
            {content.ratingRows.map((row, ri) => (
              <div key={ri}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 10,
                    whiteSpace: "pre-line",
                  }}
                >
                  {row.label}
                </p>
                <div
                  role="radiogroup"
                  aria-label={row.label.replace(/\n/g, " ")}
                  style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                >
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSelected = form.ratings[ri] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setRating(ri, val)}
                        aria-label={content.ratingScale[val - 1]}
                        aria-pressed={isSelected}
                        style={{
                          minWidth: 52,
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: isSelected
                            ? "1.5px solid var(--purple)"
                            : "1.5px solid var(--navy-border)",
                          background: isSelected
                            ? "rgba(124,58,237,0.3)"
                            : "rgba(255,255,255,0.04)",
                          color: isSelected ? "var(--green-dark)" : "var(--muted)",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontFamily: "var(--font)",
                          transition: "all 0.15s",
                        }}
                      >
                        {content.ratingScale[val - 1]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: רגעים משמעותיים ──────────────────────────────────── */}
      <section aria-labelledby="obs-s3">
        <SectionTitle>
          <span id="obs-s3">{content.momentsSectionTitle}</span>
        </SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Column headers */}
          <div
            className="moments-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {content.momentHeaders.map((h, i) => (
              <div
                key={i}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: "var(--green-dark)",
                  letterSpacing: "0.04em",
                  padding: "6px 0",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {form.moments.map((moment, mi) => (
            <div
              key={mi}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: 14,
              }}
              className="moment-row"
            >
              <Textarea
                id={`moment-b-${mi}`}
                label={`${content.momentHeaders[0]} — רגע ${mi + 1}`}
                value={moment.behavior}
                onChange={(v) => setMomentField(mi, "behavior", v)}
                rows={3}
                hideLabel
                placeholder={`רגע / התנהגות ${mi + 1}...`}
              />
              <Textarea
                id={`moment-m-${mi}`}
                label={`${content.momentHeaders[1]} — רגע ${mi + 1}`}
                value={moment.meaning}
                onChange={(v) => setMomentField(mi, "meaning", v)}
                rows={3}
                hideLabel
                placeholder="מה זה מלמד..."
              />
            </div>
          ))}

          {/* Mobile: stacked */}
          <div className="moments-mobile" style={{ display: "none", flexDirection: "column", gap: 20 }}>
            {form.moments.map((moment, mi) => (
              <div
                key={mi}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  רגע {mi + 1}
                </p>
                <Textarea
                  id={`moment-bm-${mi}`}
                  label={content.momentHeaders[0]}
                  value={moment.behavior}
                  onChange={(v) => setMomentField(mi, "behavior", v)}
                  rows={3}
                  placeholder="רגע / התנהגות שנצפתה..."
                />
                <Textarea
                  id={`moment-mm-${mi}`}
                  label={content.momentHeaders[1]}
                  value={moment.meaning}
                  onChange={(v) => setMomentField(mi, "meaning", v)}
                  rows={3}
                  placeholder="מה זה מלמד..."
                />
              </div>
            ))}
          </div>

          <button
            onClick={addMoment}
            aria-label="הוספת רגע משמעותי נוסף"
            style={{
              alignSelf: "flex-start",
              background: "var(--green-light)",
              border: "1.5px dashed var(--green)",
              borderRadius: "var(--radius-sm)",
              color: "var(--green-dark)",
              padding: "10px 20px",
              cursor: "pointer",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: "0.88rem",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.1)";
            }}
          >
            + הוספת רגע משמעותי
          </button>
        </div>
      </section>

      {/* ── Section 4: סיכום ─────────────────────────────────────────────── */}
      <section aria-labelledby="obs-s4">
        <SectionTitle>
          <span id="obs-s4">{content.summarySectionTitle}</span>
        </SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {content.summaryFields.map((label, i) => (
            <Textarea
              key={i}
              id={`summary-${i}`}
              label={label}
              value={form.summaryFields[i]}
              onChange={(v) => setSummaryField(i, v)}
              rows={4}
            />
          ))}

          {/* Overall evaluation */}
          <fieldset
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "16px 18px",
            }}
          >
            <legend
              style={{
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "var(--text)",
                padding: "0 8px",
              }}
            >
              {content.overallEvaluationQuestion}
            </legend>
            <div
              role="radiogroup"
              aria-label={content.overallEvaluationQuestion}
              style={{
                display: "flex",
                gap: 12,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {content.overallEvaluationOptions.map((opt) => {
                const isSelected = form.overallEvaluation === opt;
                const colors: Record<string, string> = {
                  נמוך: "#ef4444",
                  בינוני: "#f59e0b",
                  גבוה: "#10b981",
                };
                const c = colors[opt] ?? "var(--purple)";
                return (
                  <button
                    key={opt}
                    onClick={() => setOverall(opt)}
                    aria-pressed={isSelected}
                    aria-label={`הערכה כוללת: ${opt}`}
                    style={{
                      flex: 1,
                      minWidth: 90,
                      padding: "14px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: isSelected ? `2px solid ${c}` : "1.5px solid var(--navy-border)",
                      background: isSelected ? `${c}22` : "rgba(255,255,255,0.04)",
                      color: isSelected ? c : "var(--muted)",
                      fontWeight: 800,
                      fontSize: "1rem",
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {isSelected && (
                      <span aria-hidden="true" style={{ fontSize: "0.85rem" }}>
                        ✓
                      </span>
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>

      {/* ── Observer instruction ─────────────────────────────────────────── */}
      <div
        role="note"
        style={{
          background: "var(--green-light)",
          border: "1px solid var(--green-mid)",
          borderRight: "4px solid var(--green)",
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          padding: "14px 18px",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--green-dark)",
            lineHeight: 1.65,
          }}
        >
          {content.observerInstruction}
        </p>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          paddingTop: 8,
          borderTop: "1px solid var(--navy-border)",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={handleSave}
          aria-label="שמירת התצפית בזיכרון המכשיר"
          style={{ fontSize: "0.9rem", padding: "10px 22px" }}
        >
          {saved ? "✓ נשמר!" : "שמירת תצפית מקומית"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCopySummary}
          aria-label="העתקת סיכום התצפית ללוח"
          style={{ fontSize: "0.9rem", padding: "10px 22px" }}
        >
          {copied ? "✓ הועתק!" : "העתקת סיכום התצפית"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={handleClear}
          aria-label="ניקוי כל שדות הטופס"
          style={{ fontSize: "0.9rem", padding: "10px 22px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
        >
          ניקוי טופס
        </button>
      </div>

      {/* ── Responsive styles ────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 680px) {
          .obs-table-header { display: none !important; }
          .obs-table-row { display: none !important; }
          .obs-mobile-card { display: flex !important; }

          .rating-header { display: none !important; }
          .rating-row { display: none !important; }
          .rating-mobile { display: flex !important; }

          .moments-header { display: none !important; }
          .moment-row { display: none !important; }
          .moments-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default ObservationForm;
