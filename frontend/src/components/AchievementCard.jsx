import React from "react";

export default function AchievementCard({ title, description, icon = "⭐", completed = false, state }) {
  const disabled = state === "disabled" || (!completed && state !== "active");
  return (
    <article className={`navi-card navi-achievement ${completed ? "is-completed" : ""} ${disabled ? "is-disabled" : ""}`} aria-label={`${title}: ${completed ? "desbloqueado" : "bloqueado"}`}>
      <span className="navi-achievement__icon" aria-hidden="true">{icon}</span>
      <div><p className="navi-eyebrow">{completed ? "Logro desbloqueado" : "Sigue jugando"}</p><h3>{title}</h3><p className="navi-muted">{description}</p></div>
    </article>
  );
}
