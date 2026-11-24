import React, { useEffect, useId, useRef } from "react";
import { Button } from "./Button.jsx";

export default function Modal({ open, title = "¿Continuamos?", children, onConfirm, onCancel, confirmLabel = "Sí, continuar", cancelLabel = "Volver", state = "normal" }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])')];
    focusable()[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onCancel?.(); }
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) { event.preventDefault(); dialog.focus(); return; }
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => { dialog.removeEventListener("keydown", onKeyDown); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="navi-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel?.(); }}>
      <section ref={dialogRef} tabIndex={-1} className={`navi-modal navi-state--${state}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2><div className="navi-modal__content">{children}</div>
        <div className="navi-modal__actions"><Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button><Button type="button" onClick={onConfirm}>{confirmLabel}</Button></div>
      </section>
    </div>
  );
}
