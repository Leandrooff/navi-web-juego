import React from "react";

import AchievementCard from "../components/AchievementCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

import {
  obtenerValorMetrica,
  calcularLogrosDesbloqueados,
} from "../utils/logros.js";

export default function Logros({
  perfil,
  progreso,
  datosLogros,
}) {
  const catalogo = datosLogros?.logros ?? [];

  const logrosDesbloqueados =
    calcularLogrosDesbloqueados(
      progreso,
      catalogo,
    );

  const idsDesbloqueados = new Set(
    logrosDesbloqueados.map(
      (logro) => logro.id,
    ),
  );

  return (
    <section className="navi-page-section">
      <header className="navi-section-header">
        <div>
          <p className="navi-eyebrow">
            Mis reconocimientos
          </p>

          <h2>
            Logros de {perfil.nombre}
          </h2>

          <p className="navi-muted">
            Los logros reconocen tu
            participación, constancia y
            aprendizaje durante las aventuras.
          </p>
        </div>

        <div
          className="navi-profile-avatar"
          aria-label="Logros"
        >
          🏆
        </div>
      </header>

      <section className="navi-card">
        <div className="navi-card__body">
          <p className="navi-eyebrow">
            Resumen
          </p>

          <h3>
            {logrosDesbloqueados.length} de{" "}
            {catalogo.length} logros descubiertos
          </h3>

          <ProgressBar
            value={logrosDesbloqueados.length}
            max={catalogo.length || 1}
            label="Logros descubiertos"
          />

          <p className="navi-muted">
            Sigue participando en las aventuras
            para descubrir nuevas insignias.
          </p>
        </div>
      </section>

      <section className="navi-achievements-grid">
        {catalogo.map((logro) => {
          const desbloqueado =
            idsDesbloqueados.has(logro.id);

          const valor =
            obtenerValorMetrica(
              logro,
              progreso,
            );

          return (
            <article
              key={logro.id}
              className={
                desbloqueado
                  ? "navi-achievement-wrapper"
                  : "navi-achievement-wrapper is-locked"
              }
            >
              <AchievementCard
                title={logro.nombre}
                description={logro.descripcion}
                icon={
                  desbloqueado
                    ? logro.icono
                    : "🔒"
                }
                completed={desbloqueado}
              />

              {desbloqueado ? (
                <p className="navi-achievement-earned">
                  ✓ Logro descubierto
                </p>
              ) : (
                <div className="navi-achievement-progress">
                  <ProgressBar
                    value={Math.min(
                      valor,
                      logro.meta,
                    )}
                    max={logro.meta}
                    label={logro.nombre}
                  />

                  <p className="navi-muted">
                    {Math.min(
                      valor,
                      logro.meta,
                    )}{" "}
                    de {logro.meta}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </section>
  );
}