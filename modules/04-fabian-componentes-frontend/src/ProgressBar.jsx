import React from "react";

export default function ProgressBar({ value = 0, max = 100, label = "Progreso de la aventura", state = "normal" }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const percent = Math.min(100, Math.max(0, (Number(value) / safeMax) * 100 || 0));
  return (
    <div className={`navi-progress navi-state--${state}`}>
      <div className="navi-progress__label"><span>{label}</span><strong>{Math.round(percent)}%</strong></div>
      <div className="navi-progress__track" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax={safeMax} aria-valuenow={Math.min(safeMax, Math.max(0, Number(value) || 0))}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
