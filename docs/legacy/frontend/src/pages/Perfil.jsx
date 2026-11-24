import React from "react";
import Button from "../components/Button.jsx";
import AchievementCard from "../components/AchievementCard.jsx";

export default function Perfil({ perfil, onContinue }) {
  return (
    <section className="navi-page-section">
      <header className="navi-section-header">
        <div>
          <p className="navi-eyebrow">Perfil infantil</p>
          <h2>{perfil.nombre}</h2>
          <p className="navi-muted">
            {perfil.rol} · {perfil.edad} años
          </p>
        </div>

        <div className="navi-profile-avatar" aria-label={`Avatar de ${perfil.nombre}`}>
          {perfil.avatar}
        </div>
      </header>

      <div className="navi-stats-grid">
        <article className="navi-card">
          <div className="navi-card__body">
            <p className="navi-eyebrow">Estrellas</p>
            <h3>{perfil.estrellas}</h3>
            <p className="navi-muted">Estrellas acumuladas</p>
          </div>
        </article>

        <article className="navi-card">
          <div className="navi-card__body">
            <p className="navi-eyebrow">Misiones</p>
            <h3>{perfil.cuentosCompletados}</h3>
            <p className="navi-muted">Aventuras completadas</p>
          </div>
        </article>
      </div>

      <article className="navi-card">
        <div className="navi-card__body">
          <p className="navi-eyebrow">Última aventura</p>
          <h3>{perfil.ultimaAventura.titulo}</h3>
          <p className="navi-muted">
            Estado: {perfil.ultimaAventura.estado}
          </p>

          <Button onClick={onContinue}>
            Continuar aventura
          </Button>
        </div>
      </article>

      <section>
        <p className="navi-eyebrow">Logros recientes</p>

        <div className="navi-achievements-grid">
          {perfil.logros.map((logro) => (
            <AchievementCard
              key={logro.id}
              title={logro.nombre}
              description={logro.descripcion}
              icon={logro.icono}
              completed
            />
          ))}
        </div>
      </section>
    </section>
  );
}