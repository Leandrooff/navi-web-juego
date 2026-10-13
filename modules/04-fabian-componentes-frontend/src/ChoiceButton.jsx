import React from "react";

export default function ChoiceButton({ children, selected = false, state = "normal", disabled = false, onClick, ...props }) {
  return (
    <button type="button" className={`navi-choice ${selected || state === "active" ? "is-active" : ""} ${state === "error" ? "is-error" : ""} ${disabled || state === "disabled" ? "is-disabled" : ""}`.trim()} disabled={disabled || state === "disabled"} onClick={onClick} aria-pressed={selected || state === "active"} {...props}>
      <span className="navi-choice__marker" aria-hidden="true">{selected || state === "active" ? "✓" : ""}</span>{children}
    </button>
  );
}
