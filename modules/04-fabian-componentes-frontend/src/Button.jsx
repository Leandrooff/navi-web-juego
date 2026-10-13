import React from "react";

/** Botón reutilizable NAVI. variant: primary | secondary; state: normal | active | error. */
export function Button({ children, variant = "primary", state = "normal", disabled = false, className = "", ...props }) {
  return (
    <button
      className={`navi-button navi-button--${variant} navi-state--${state} ${className}`.trim()}
      disabled={disabled || state === "disabled"}
      aria-invalid={state === "error" || undefined}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton(props) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props) {
  return <Button {...props} variant="secondary" />;
}

export default Button;
