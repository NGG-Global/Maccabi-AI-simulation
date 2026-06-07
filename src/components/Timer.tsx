import React, { useState, useEffect, useRef, useCallback } from "react";

const PRESETS = [10, 15, 20, 40];

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const Timer: React.FC<{ initialMinutes?: number }> = ({ initialMinutes = 10 }) => {
  const [totalSecs, setTotalSecs] = useState(initialMinutes * 60);
  const [remaining, setRemaining] = useState(initialMinutes * 60);
  const [running, setRunning]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => { if (r <= 1) { setRunning(false); return 0; } return r - 1; });
      }, 1000);
    } else { clear(); }
    return clear;
  }, [running, clear]);

  const setPreset = (mins: number) => { setRunning(false); setTotalSecs(mins * 60); setRemaining(mins * 60); };
  const handleReset = () => { setRunning(false); setRemaining(totalSecs); };

  const pct    = totalSecs > 0 ? (remaining / totalSecs) * 100 : 0;
  const isLow  = remaining <= 60 && remaining > 0;
  const isDone = remaining === 0;

  const arcColor = isDone ? "#DC2626" : isLow ? "#D97706" : "var(--green)";
  const r = 72;
  const circ = 2 * Math.PI * r;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
        טיימר
      </h3>

      {/* Presets */}
      <div role="group" aria-label="בחר זמן" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PRESETS.map(m => (
          <button key={m} onClick={() => setPreset(m)}
            aria-label={`הגדר ל-${m} דקות`}
            style={{
              background: totalSecs === m * 60 ? "var(--green-light)" : "var(--bg)",
              border: `1.5px solid ${totalSecs === m * 60 ? "var(--green)" : "var(--border)"}`,
              borderRadius: 8, padding: "5px 12px",
              color: totalSecs === m * 60 ? "var(--green-dark)" : "var(--text-muted)",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              fontFamily: "var(--font)", transition: "all 0.15s",
            }}>{m}:00</button>
        ))}
      </div>

      {/* Arc */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 170, height: 170 }}>
          <svg width="170" height="170" viewBox="0 0 170 170" aria-hidden="true"
            style={{ transform: "rotate(-90deg)" }}>
            <circle cx="85" cy="85" r={r} fill="none" stroke="var(--border-mid)" strokeWidth="8"/>
            <circle cx="85" cy="85" r={r} fill="none" stroke={arcColor} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct / 100)}
              style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s" }}/>
          </svg>
          <div aria-live="polite" aria-label={`זמן נותר: ${fmt(remaining)}`}
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
            <span style={{
              fontSize: "clamp(2rem,7vw,2.6rem)", fontWeight: 800,
              color: arcColor, fontVariantNumeric: "tabular-nums",
              transition: "color 0.3s",
            }}>{fmt(remaining)}</span>
            {isDone && <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#DC2626" }}>הסתיים</span>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={() => setRunning(!running)}
          disabled={isDone}
          aria-label={running ? "השהה" : "הפעל"}
          style={{ fontSize: "0.9rem", padding: "9px 22px", opacity: isDone ? 0.45 : 1 }}>
          {running ? "⏸ השהה" : "▶ הפעל"}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}
          aria-label="אפס טיימר"
          style={{ fontSize: "0.9rem", padding: "9px 16px" }}>
          ↺ אפס
        </button>
      </div>
    </div>
  );
};

export default Timer;
