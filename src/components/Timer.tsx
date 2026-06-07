import React, { useState, useEffect, useRef, useCallback } from "react";

type TimerProps = {
  initialMinutes?: number;
};

const PRESETS = [10, 15, 20, 40];

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ initialMinutes = 10 }) => {
  const [totalSecs, setTotalSecs] = useState(initialMinutes * 60);
  const [remaining, setRemaining] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return clear;
  }, [running, clear]);

  const setPreset = (mins: number) => {
    setRunning(false);
    setTotalSecs(mins * 60);
    setRemaining(mins * 60);
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSecs);
  };

  const pct = totalSecs > 0 ? (remaining / totalSecs) * 100 : 0;
  const isLow = remaining <= 60 && remaining > 0;
  const isDone = remaining === 0;

  const timerColor = isDone
    ? "#ef4444"
    : isLow
    ? "#f59e0b"
    : "var(--cyan-light)";

  return (
    <div
      style={{
        background: "var(--gradient-card)",
        border: "1px solid var(--navy-border)",
        borderRadius: "var(--radius-lg)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h3
        style={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "var(--muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        } as React.CSSProperties}
      >
        טיימר
      </h3>

      {/* Presets */}
      <div
        role="group"
        aria-label="בחר זמן"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setPreset(m)}
            aria-label={`הגדר טיימר ל-${m} דקות`}
            style={{
              background:
                totalSecs === m * 60
                  ? "rgba(6,182,212,0.2)"
                  : "rgba(255,255,255,0.05)",
              border:
                totalSecs === m * 60
                  ? "1.5px solid var(--cyan)"
                  : "1px solid var(--navy-border)",
              borderRadius: 8,
              color:
                totalSecs === m * 60 ? "var(--cyan-light)" : "var(--muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "7px 14px",
              cursor: "pointer",
              fontFamily: "var(--font)",
              transition: "all 0.15s",
            }}
          >
            {m}:00
          </button>
        ))}
      </div>

      {/* Progress arc */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            aria-hidden="true"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="90"
              cy="90"
              r="78"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <circle
              cx="90"
              cy="90"
              r="78"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 78}`}
              strokeDashoffset={`${2 * Math.PI * 78 * (1 - pct / 100)}`}
              style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s" }}
            />
          </svg>
          {/* Time display */}
          <div
            aria-live="polite"
            aria-label={`זמן נותר: ${fmt(remaining)}`}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "clamp(2.2rem, 8vw, 3rem)",
                fontWeight: 800,
                color: timerColor,
                letterSpacing: "0.02em",
                transition: "color 0.3s",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(remaining)}
            </span>
            {isDone && (
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#ef4444",
                  marginTop: 2,
                }}
              >
                הסתיים
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          className="btn btn-primary"
          onClick={() => setRunning(!running)}
          disabled={isDone}
          aria-label={running ? "השהה טיימר" : "הפעל טיימר"}
          style={{
            fontSize: "0.95rem",
            padding: "10px 24px",
            opacity: isDone ? 0.5 : 1,
          }}
        >
          {running ? "⏸ השהה" : "▶ הפעל"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={handleReset}
          aria-label="אפס טיימר"
          style={{ fontSize: "0.95rem", padding: "10px 18px" }}
        >
          ↺ אפס
        </button>
      </div>
    </div>
  );
};

export default Timer;
