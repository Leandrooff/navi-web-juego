import React from "react";
import ProgressBar from "../components/ProgressBar.jsx";

export default function Progreso({ perfil }) {
  const progresoGeneral = perfil.cuentosCompletados > 0 ? 20 : 0;

  return (
    <section className="navi-page-section">
      <header className="navi-section-header">
        <div>
          <p className="navi-eyebrow">Progreso</p>
          <h2>Tu avance en NAVI</h2>
          <p className="navi-muted">
            Revisa cómo avanzas en tus aventuras y actividades.
          </p>
        </div>
      </header>

      <article className="navi-card">
        <div className="navi-card__body">
          <h3>Progreso general</h3>

          <ProgressBar
            value={progresoGeneral}
            max={100}
            label="Misiones completadas"
          />

          <p className="navi-muted">
            Has completado {perfil.cuentosCompletados} aventura.
          </p>
        </div>
      </article>

      <div className="navi-stats-grid">
        <article className="navi-card">
          <div className="navi-card__body">
            <p className="navi-eyebrow">Estrellas</p>
            <h3>{perfil.estrellas}</h3>
            <p className="navi-muted">Total acumulado</p>
          </div>
        </article>

        <article className="navi-card">
          <div className="navi-card__body">
            <p className="navi-eyebrow">Logros</p>
            <h3>{perfil.logros.length}</h3>
            <p className="navi-muted">Logros recientes</p>
          </div>
        </article>
      </div>

      <article className="navi-card">
        <div className="navi-card__body">
          <p className="navi-eyebrow">Actividad reciente</p>
          <h3>{perfil.ultimaAventura.titulo}</h3>
          <p className="navi-muted">
            Actualmente: {perfil.ultimaAventura.estado}
          </p>
        </div>
      </article>
    </section>
  );
}