import React, { useState, useEffect } from "react";

/**
 * World / Map Component (El Mundo de Aventuras de NAVI)
 *
 * Requirements:
 * - Flow: mapa → ficha → jugar o continuar → final → mapa
 * - Preserves the prologue on first visit (prólogo de la primera visita)
 * - Highlights classroom assignments (asignaciones del aula)
 * - Identifies started and completed stories based on active profile progress
 * - Prominently displays main adventure and extra published adventures
 */
export default function World({
  stories,
  activeProfile,
  profileProgress,
  onOpenStoryDetail,
  onPlayStory
}) {
  const [showPrologue, setShowPrologue] = useState(false);

  // Check if first visit for the active profile
  useEffect(() => {
    if (!activeProfile?.id) return;
    const storageKey = `navi-prologue-seen-${activeProfile.id}`;
    const alreadySeen = localStorage.getItem(storageKey);
    if (!alreadySeen) {
      setShowPrologue(true);
    }
  }, [activeProfile?.id]);

  const closePrologue = () => {
    if (activeProfile?.id) {
      localStorage.setItem(`navi-prologue-seen-${activeProfile.id}`, "true");
    }
    setShowPrologue(false);
  };

  const getStoryState = (storyId) => {
    return profileProgress[storyId] || "nuevo";
  };

  const mainStory = stories.find((s) => s.is_main) || stories[0];
  const extraStories = stories.filter((s) => s.id !== mainStory?.id);

  // Classroom assignments
  const assignedStories = stories.filter((s) => s.asignacion_aula);

  return (
    <div className="world-container">
      {/* Prólogo de la primera visita */}
      {showPrologue && (
        <div className="prologue-banner" role="region" aria-label="Prólogo de bienvenida">
          <div className="prologue-content">
            <div className="prologue-badge">¡Bienvenido a tu Mundo NAVI! 🗺️</div>
            <h2>¡Hola, {activeProfile.nombre}! Tu aventura segura comienza hoy</h2>
            <p>
              Explora las diferentes zonas de la ciudad en este mapa interactivo. En cada lugar vivirás
              situaciones del día a día donde deberás tomar decisiones inteligentes para cuidarte y ayudar a otros.
              ¡Acepta las misiones del aula y gana estrellas en cada cuento!
            </p>
            <div className="prologue-actions">
              <button type="button" className="primary" onClick={closePrologue}>
                ¡Comenzar a explorar! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classroom assignments bar */}
      {assignedStories.length > 0 && (
        <section className="classroom-bar" aria-label="Asignaciones del aula">
          <div className="classroom-header">
            <span className="classroom-icon" aria-hidden="true">🏫</span>
            <div>
              <h3>Asignaciones de tu aula escolar</h3>
              <p>Tu educador seleccionó estas aventuras prioritarias para ti:</p>
            </div>
          </div>
          <div className="classroom-cards">
            {assignedStories.map((story) => {
              const state = getStoryState(story.id);
              return (
                <div key={story.id} className="assigned-chip" onClick={() => onOpenStoryDetail(story)}>
                  <span className="assigned-img">{story.imagen}</span>
                  <div className="assigned-info">
                    <strong>{story.titulo}</strong>
                    <span className={`status-pill ${state.replace(" ", "-")}`}>
                      {state === "en progreso" ? "Continuando" : state === "completado" ? "Listo" : "Pendiente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Interactive Map Section */}
      <section className="world-map" aria-label="Mapa interactivo de aventuras">
        <div className="map-legend">
          <span className="legend-title">🗺️ Mapa de Aventuras</span>
          <div className="legend-items">
            <span className="legend-item"><span className="dot nuevo"></span> No iniciado</span>
            <span className="legend-item"><span className="dot en-progreso"></span> En progreso</span>
            <span className="legend-item"><span className="dot completado"></span> Completado</span>
          </div>
          {!showPrologue && (
            <button
              type="button"
              className="text-btn"
              onClick={() => setShowPrologue(true)}
              aria-label="Volver a leer el prólogo"
            >
              📖 Leer prólogo
            </button>
          )}
        </div>

        {/* Main Adventure Card / Center of Map */}
        {mainStory && (
          <div className="main-adventure-hero">
            <div className="hero-badge">🌟 AVENTURA PRINCIPAL RECOMENDADA</div>
            <div className="hero-content">
              <div className="hero-art">{mainStory.imagen}</div>
              <div className="hero-details">
                <div className="hero-tags">
                  <span className="category-tag">{mainStory.categoria}</span>
                  {mainStory.asignacion_aula && <span className="assigned-tag">🏫 Asignación de aula</span>}
                  <span className={`status ${getStoryState(mainStory.id).replace(" ", "-")}`}>
                    {getStoryState(mainStory.id)}
                  </span>
                </div>
                <h2>{mainStory.titulo}</h2>
                <p>{mainStory.descripcion}</p>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="primary hero-play"
                    onClick={() => onPlayStory(mainStory)}
                  >
                    {getStoryState(mainStory.id) === "en progreso"
                      ? "Continuar aventura ▶"
                      : getStoryState(mainStory.id) === "completado"
                      ? "Volver a jugar 🔄"
                      : "Jugar ahora 🚀"}
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onOpenStoryDetail(mainStory)}
                  >
                    Ver ficha detallada 📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extra Published Stories on the Map */}
        <div className="map-nodes-header">
          <h3>Otras aventuras en el mapa ({extraStories.length})</h3>
          <p>Toca cualquier zona para ver su ficha y comenzar a jugar:</p>
        </div>

        <div className="map-nodes-grid">
          {extraStories.map((story) => {
            const state = getStoryState(story.id);
            return (
              <article
                key={story.id}
                className={`map-node-card node-${story.categoria} state-${state.replace(" ", "-")}`}
                onClick={() => onOpenStoryDetail(story)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenStoryDetail(story);
                  }
                }}
                aria-label={`Abrir ficha de ${story.titulo}`}
              >
                <div className="node-icon-wrapper">
                  <span className="node-icon">{story.imagen}</span>
                  {story.asignacion_aula && <span className="node-assigned-badge" title="Asignación del aula">🏫</span>}
                </div>
                <div className="node-body">
                  <span className="category-tag">{story.categoria}</span>
                  <h4>{story.titulo}</h4>
                  <div className="node-footer">
                    <span className={`status ${state.replace(" ", "-")}`}>{state}</span>
                    <button
                      type="button"
                      className="node-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayStory(story);
                      }}
                    >
                      {state === "en progreso" ? "Continuar" : state === "completado" ? "Repetir" : "Jugar"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
