import React, { useEffect } from "react";
import { Button } from "./Button.jsx";

export default function Modal({ open, title = "¿Continuamos?", children, onConfirm, onCancel, confirmLabel = "Sí, continuar", cancelLabel = "Volver", state = "normal" }) {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") onCancel?.(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="navi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel?.(); }}>
      <section className={`navi-modal navi-state--${state}`} role="dialog" aria-modal="true" aria-labelledby="navi-modal-title">
        <h2 id="navi-modal-title">{title}</h2><div className="navi-modal__content">{children}</div>
        <div className="navi-modal__actions"><Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button><Button onClick={onConfirm}>{confirmLabel}</Button></div>
      </section>
    </div>
  );
}
