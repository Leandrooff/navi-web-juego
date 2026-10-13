import React from "react";

const icons = { success: "✓", warning: "!", error: "×", info: "i" };
export default function Alert({ type = "info", title, children, onDismiss }) {
  return <div className={`navi-alert navi-alert--${type}`} role={type === "error" ? "alert" : "status"}>
    <span className="navi-alert__icon" aria-hidden="true">{icons[type] || icons.info}</span>
    <div className="navi-alert__copy">{title && <strong>{title}</strong>}<span>{children}</span></div>
    {onDismiss && <button className="navi-alert__dismiss" type="button" aria-label="Cerrar aviso" onClick={onDismiss}>×</button>}
  </div>;
}
