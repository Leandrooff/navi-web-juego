import React from "react";
import { Button } from "./Button.jsx";

const statusLabels = { nuevo: "Nueva aventura", enProgreso: "En progreso", completado: "Completado", bloqueado: "Bloqueado" };

export function StoryCard({ title, category, description, age, status = "nuevo", image, onAction, actionLabel, disabled = false }) {
  const locked = status === "bloqueado" || disabled;
  return (
    <article className={`navi-card navi-story-card ${locked ? "is-disabled" : ""}`}>
      <div className="navi-story-art" role="img" aria-label={image?.alt || `Ilustración de ${title}`}>
        {image?.src ? <img src={image.src} alt={image.alt || ""} /> : <span aria-hidden="true">🌳</span>}
        <span className={`navi-badge navi-badge--${status}`}>{statusLabels[status] || status}</span>
      </div>
      <div className="navi-card__body">
        <p className="navi-eyebrow">{category}{age ? ` · ${age}+ años` : ""}</p>
        <h3>{title}</h3>
        <p className="navi-muted">{description}</p>
        <Button disabled={locked} variant="primary" onClick={onAction}>{actionLabel || (status === "enProgreso" ? "Continuar" : "Jugar cuento")}</Button>
      </div>
    </article>
  );
}

export default StoryCard;
