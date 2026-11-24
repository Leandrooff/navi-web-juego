import React, { useState, useEffect, useCallback } from "react";
import World from "./game/World";
import { getStories, normalizeStory, isStoryTerminable } from "./services/api";
import fallbackCatalogData from "../../modules/02-benjamin-biblioteca-navegacion/demo/cuentos-demo.json";
import "./styles.css";

const navItems = [
  { id: "mapa", label: "Mapa del Mundo", icon: "🗺️" },
  { id: "biblioteca", label: "Biblioteca", icon: "📚" },
  { id: "progreso", label: "Mi Progreso", icon: "⭐" },
  { id: "perfil", label: "Perfil", icon: "👤" }
];

export const AVAILABLE_PROFILES = [
  {
    id: "perfil-alex-1",
    nombre: "Alex",
    edad: 7,
    avatar: "🦊",
    rol: "explorador"
  },
  {
    id: "perfil-sofia-2",
    nombre: "Sofía",
    edad: 8,
    avatar: "🐱",
    rol: "exploradora"
  }
];

// Helper para leer la sesión guardada de una partida de cuento por perfil
function getStorySession(profileId, storyId) {
  try {
    const raw = localStorage.getItem(`navi-session-${profileId}-${storyId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

// Helper para persistir la sesión de una partida por perfil
function saveStorySession(profileId, storyId, sessionData) {
  try {
    localStorage.setItem(`navi-session-${profileId}-${storyId}`, JSON.stringify(sessionData));
  } catch (_e) {
    // Ignore storage quota errors
  }
}

export default function App() {
  // Perfil activo con persistencia entre recargas
  const [activeProfile, setActiveProfile] = useState(() => {
    try {
      const savedProfileId = localStorage.getItem("navi-active-profile-id");
      const matched = AVAILABLE_PROFILES.find((p) => p.id === savedProfileId);
      return matched || AVAILABLE_PROFILES[0];
    } catch (_e) {
      return AVAILABLE_PROFILES[0];
    }
  });

  const [view, setView] = useState("mapa");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Búsqueda y Filtros de la Biblioteca
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");

  // Ficha / Modal de detalle
  const [selectedStory, setSelectedStory] = useState(null);

  // Sesión de Juego activa
  const [activeStory, setActiveStory] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [score, setScore] = useState(0);
  const [decisionsHistory, setDecisionsHistory] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);

  // Progreso del perfil activo (estados: nuevo, en progreso, completado)
  const [profileProgress, setProfileProgress] = useState({});

  // Cargar progreso del perfil activo
  const loadProfileProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(`navi-progress-${activeProfile.id}`);
      setProfileProgress(stored ? JSON.parse(stored) : {});
    } catch (_err) {
      setProfileProgress({});
    }
  }, [activeProfile.id]);

  useEffect(() => {
    loadProfileProgress();
  }, [loadProfileProgress]);

  // Actualizar progreso por cuento para el perfil activo
  const updateStoryProgress = (storyId, newStatus) => {
    setProfileProgress((prev) => {
      const updated = { ...prev, [storyId]: newStatus };
      try {
        localStorage.setItem(`navi-progress-${activeProfile.id}`, JSON.stringify(updated));
      } catch (_err) {
        // ignore
      }
      return updated;
    });
  };

  // Cargar catálogo publicado desde Laravel API (o fallback de cuentos reales si está desconectado)
  const loadCatalog = async () => {
    setLoading(true);
    setError("");

    try {
      const apiStories = await getStories();
      if (!Array.isArray(apiStories) || apiStories.length === 0) {
        // Fallback a los cuentos demo verificados si la API no está corriendo
        const validFallbacks = Array.isArray(fallbackCatalogData)
          ? fallbackCatalogData.map(normalizeStory).filter(isStoryTerminable)
          : [];
        setStories(validFallbacks);
      } else {
        setStories(apiStories);
      }
    } catch (reason) {
      // Si la API falla por conexión local, cargamos el catálogo del proyecto filtrando rutas rotas
      if (Array.isArray(fallbackCatalogData)) {
        const validFallbacks = fallbackCatalogData.map(normalizeStory).filter(isStoryTerminable);
        setStories(validFallbacks);
      } else {
        setError(reason.message || "Error al conectar con el servidor de cuentos de Laravel.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Restaurar partida activa tras recargar la página (F5) si el usuario estaba jugando
  useEffect(() => {
    if (stories.length > 0 && !activeStory) {
      try {
        const savedView = localStorage.getItem(`navi-active-view-${activeProfile.id}`);
        const savedStoryId = localStorage.getItem(`navi-active-story-id-${activeProfile.id}`);

        if (savedView === "jugar" && savedStoryId) {
          const targetStory = stories.find((s) => String(s.id) === String(savedStoryId));
          if (targetStory) {
            const savedSession = getStorySession(activeProfile.id, targetStory.id);
            if (savedSession && savedSession.currentSceneId) {
              setActiveStory(targetStory);
              setCurrentSceneId(savedSession.currentSceneId);
              setScore(Number(savedSession.score || 0));
              setDecisionsHistory(Array.isArray(savedSession.decisionsHistory) ? savedSession.decisionsHistory : []);
              setLastFeedback(savedSession.lastFeedback || null);
              setView("jugar");
            }
          }
        }
      } catch (_e) {
        // Ignore restoration error
      }
    }
  }, [stories, activeProfile.id, activeStory]);

  // Filtros de la biblioteca
  const categories = ["todas", ...new Set(stories.map((s) => s.categoria))];
  const filteredStories = stories.filter((story) => {
    const matchName = story.titulo.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "todas" || story.categoria === category;
    return matchName && matchCategory;
  });

  // Abrir Ficha / Modal
  const handleOpenFicha = (story) => {
    setSelectedStory(story);
  };

  // Iniciar o Continuar aventura:
  // RECUPERA LA SESIÓN GUARDADA DEL PERFIL SELECCIONADO Y VUELVE AL PUNTO DONDE SE QUEDÓ
  const handleStartPlay = (story) => {
    setActiveStory(story);
    setSelectedStory(null);

    const savedSession = getStorySession(activeProfile.id, story.id);
    const currentProgress = profileProgress[story.id];

    // Verificar si es una continuación legítima con avance guardado
    const isContinuing = savedSession && savedSession.currentSceneId && currentProgress === "en progreso";

    if (isContinuing) {
      // RECUPERAR SESIÓN: escena guardada, puntaje e historial sin borrar avance
      setCurrentSceneId(savedSession.currentSceneId);
      setScore(Number(savedSession.score || 0));
      setDecisionsHistory(Array.isArray(savedSession.decisionsHistory) ? savedSession.decisionsHistory : []);
      setLastFeedback(savedSession.lastFeedback || null);
    } else {
      // Iniciar nueva partida desde la escena inicial
      const initialScene = story.scenes?.find((s) => String(s.id) === String(story.initial_scene_id)) || story.scenes?.[0];
      const initialId = initialScene ? initialScene.id : null;

      setCurrentSceneId(initialId);
      setScore(0);
      setDecisionsHistory([]);
      setLastFeedback(null);

      // Guardar sesión inicial
      saveStorySession(activeProfile.id, story.id, {
        storyId: story.id,
        currentSceneId: initialId,
        score: 0,
        decisionsHistory: [],
        lastFeedback: null,
        status: "en progreso",
        updatedAt: Date.now()
      });

      if (currentProgress !== "completado") {
        updateStoryProgress(story.id, "en progreso");
      }
    }

    // Persistir estado de vista para recarga (F5)
    try {
      localStorage.setItem(`navi-active-view-${activeProfile.id}`, "jugar");
      localStorage.setItem(`navi-active-story-id-${activeProfile.id}`, String(story.id));
    } catch (_e) {}

    setView("jugar");
  };

  // Tomar una decisión en la escena actual
  const handleChooseOption = (choice) => {
    const pointsGained = Number(choice.points || 0);
    const newScore = score + pointsGained;
    setScore(newScore);

    const updatedHistory = [
      ...decisionsHistory,
      {
        sceneId: currentSceneId,
        choiceLabel: choice.label,
        points: pointsGained,
        feedback: choice.feedback
      }
    ];
    setDecisionsHistory(updatedHistory);
    setLastFeedback(choice.feedback || null);

    // Avanzar a la escena destino
    if (choice.target !== undefined && choice.target !== null) {
      setCurrentSceneId(choice.target);

      const targetScene = activeStory?.scenes?.find((s) => String(s.id) === String(choice.target));
      const isTargetFinal = Boolean(
        targetScene?.is_final ||
        targetScene?.es_final ||
        targetScene?.scene_type === "final" ||
        (!Array.isArray(targetScene?.choices) || targetScene.choices.length === 0)
      );

      // PERSISTIR LA SESIÓN GUARDADA CON LA NUEVA ESCENA, PUNTAJE E HISTORIAL
      saveStorySession(activeProfile.id, activeStory.id, {
        storyId: activeStory.id,
        currentSceneId: choice.target,
        score: newScore,
        decisionsHistory: updatedHistory,
        lastFeedback: choice.feedback || null,
        status: isTargetFinal ? "completado" : "en progreso",
        updatedAt: Date.now()
      });

      if (isTargetFinal) {
        updateStoryProgress(activeStory.id, "completado");
      } else {
        updateStoryProgress(activeStory.id, "en progreso");
      }
    }
  };

  // Volver al Mapa de aventuras
  const handleReturnToMap = () => {
    const currentScene = activeStory?.scenes?.find((s) => String(s.id) === String(currentSceneId));
    const isFinal = Boolean(
      currentScene?.is_final ||
      currentScene?.es_final ||
      currentScene?.scene_type === "final" ||
      (!Array.isArray(currentScene?.choices) || currentScene.choices.length === 0)
    );

    if (activeStory && isFinal) {
      updateStoryProgress(activeStory.id, "completado");
    }

    // Limpiar estado volátil de la vista de juego y el indicador de juego activo
    setActiveStory(null);
    setCurrentSceneId(null);
    setScore(0);
    setDecisionsHistory([]);
    setLastFeedback(null);

    try {
      localStorage.removeItem(`navi-active-view-${activeProfile.id}`);
      localStorage.removeItem(`navi-active-story-id-${activeProfile.id}`);
    } catch (_e) {}

    setView("mapa");
  };

  // Cambio de pestaña de navegación
  const handleNavigate = (nextView) => {
    setView(nextView);
    setSelectedStory(null);
    if (nextView !== "jugar") {
      setActiveStory(null);
      setCurrentSceneId(null);
      setScore(0);
      setDecisionsHistory([]);
      setLastFeedback(null);
      try {
        localStorage.removeItem(`navi-active-view-${activeProfile.id}`);
        localStorage.removeItem(`navi-active-story-id-${activeProfile.id}`);
      } catch (_e) {}
    }
  };

  // Cambiar entre perfiles (Alex / Sofía) para demostrar aislamiento de avance
  const handleSwitchProfile = (profile) => {
    if (profile.id === activeProfile.id) return;

    // Reset de estado en memoria
    setActiveStory(null);
    setCurrentSceneId(null);
    setScore(0);
    setDecisionsHistory([]);
    setLastFeedback(null);
    setSelectedStory(null);
    setView("mapa");

    setActiveProfile(profile);
    try {
      localStorage.setItem("navi-active-profile-id", profile.id);
    } catch (_e) {}
  };

  // Calcular estrellas ganadas al terminar
  const calculateStars = (currentScore) => {
    if (currentScore >= 20) return 3;
    if (currentScore >= 10) return 2;
    return 1;
  };

  // Escena activa
  const activeScene = activeStory?.scenes?.find((s) => String(s.id) === String(currentSceneId)) || activeStory?.scenes?.[0];
  const isFinalScene = Boolean(
    activeScene?.is_final ||
    activeScene?.es_final ||
    activeScene?.scene_type === "final" ||
    (!Array.isArray(activeScene?.choices) || activeScene.choices.length === 0)
  );

  return (
    <div className="app-shell">
      {/* Barra lateral de navegación */}
      <aside className="sidebar">
        <div className="brand">
          <span>N</span>
          <strong>NAVI</strong>
        </div>
        <nav className="menu" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? "active" : ""}
              onClick={() => handleNavigate(item.id)}
            >
              <span className="menu-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Selector rápido de perfiles en la barra lateral */}
        <div className="profile-switcher-sidebar">
          <span className="switcher-title">Perfil activo:</span>
          <div className="profile-pills">
            {AVAILABLE_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`profile-pill ${activeProfile.id === p.id ? "active" : ""}`}
                onClick={() => handleSwitchProfile(p)}
                title={`Cambiar a ${p.nombre}`}
              >
                <span>{p.avatar}</span> {p.nombre}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Área de contenido principal */}
      <main className="main">
        {/* Cabecera superior */}
        <header className="topbar">
          <div>
            <p>¡Hola, {activeProfile.nombre}! 🌟</p>
            <h1>
              {view === "mapa" && "Mapa de Aventuras"}
              {view === "biblioteca" && "Biblioteca de Cuentos"}
              {view === "progreso" && "Mi Progreso y Estrellas"}
              {view === "perfil" && "Perfil del Explorador"}
              {view === "jugar" && (activeStory ? activeStory.titulo : "Aventura")}
            </h1>
          </div>
          <div className="topbar-profile-controls">
            <span className="profile-active-badge">
              {activeProfile.avatar} <strong>{activeProfile.nombre}</strong>
            </span>
            <button
              type="button"
              className="avatar"
              aria-label="Abrir vista de perfiles"
              onClick={() => handleNavigate("perfil")}
            >
              {activeProfile.avatar}
            </button>
          </div>
        </header>

        {/* Estado de carga */}
        {loading && (
          <div className="state-card loading-state">
            <div className="spinner">⏳</div>
            <h2>Cargando aventuras del mundo NAVI…</h2>
            <p>Conectando con el catálogo oficial de cuentos desde Laravel y MariaDB.</p>
          </div>
        )}

        {/* Estado de error con reintento */}
        {!loading && error && (
          <div className="state-card error">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <h2>No pudimos cargar el catálogo</h2>
            <p>{error}</p>
            <button type="button" className="primary" onClick={loadCatalog}>
              🔄 Reintentar conexión
            </button>
          </div>
        )}

        {/* VISTA 1: MAPA DE AVENTURAS */}
        {!loading && !error && view === "mapa" && (
          <World
            stories={stories}
            activeProfile={activeProfile}
            profileProgress={profileProgress}
            onOpenStoryDetail={handleOpenFicha}
            onPlayStory={handleStartPlay}
          />
        )}

        {/* VISTA 2: BIBLIOTECA DE CUENTOS */}
        {!loading && !error && view === "biblioteca" && (
          <section className="library-view" aria-label="Biblioteca de cuentos">
            {/* Buscador en tiempo real y Filtro por categoría */}
            <div className="filters">
              <label className="search-box">
                <span aria-hidden="true">🔍</span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar un cuento por nombre…"
                  aria-label="Buscar cuento"
                />
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "todas" ? "Todas las categorías" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Catálogo vacío */}
            {stories.length === 0 && (
              <div className="state-card empty-catalog">
                <span className="empty-icon">📭</span>
                <h2>El catálogo publicado está vacío</h2>
                <p>No se encontraron aventuras publicadas válidas en este momento.</p>
                <button type="button" className="secondary" onClick={loadCatalog}>
                  Actualizar catálogo
                </button>
              </div>
            )}

            {/* Búsqueda sin coincidencias */}
            {stories.length > 0 && filteredStories.length === 0 && (
              <div className="state-card no-matches">
                <span className="empty-icon">🔎</span>
                <h2>Sin coincidencias en la búsqueda</h2>
                <p>No encontramos cuentos con "{search}" en la categoría seleccionada.</p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("todas");
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Cuadrícula de cuentos de la biblioteca */}
            {filteredStories.length > 0 && (
              <div className="story-grid">
                {filteredStories.map((story) => {
                  const state = profileProgress[story.id] || "nuevo";
                  const actionText =
                    state === "en progreso"
                      ? "Continuar ▶"
                      : state === "completado"
                      ? "Volver a jugar 🔄"
                      : "Jugar 🚀";

                  return (
                    <article className="story-card" key={story.id}>
                      <div className={`story-art category-${story.categoria}`} role="img" aria-label={story.titulo}>
                        <span>{story.imagen}</span>
                      </div>
                      <div className="story-body">
                        <div className="card-meta">
                          <span className="category-tag">{story.categoria}</span>
                          {story.asignacion_aula && <span className="assigned-tag">🏫 Aula</span>}
                          <span className={`status ${state.replace(" ", "-")}`}>{state}</span>
                        </div>
                        <h2>{story.titulo}</h2>
                        <p>{story.descripcion}</p>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="primary"
                            onClick={() => handleStartPlay(story)}
                          >
                            {actionText}
                          </button>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => handleOpenFicha(story)}
                          >
                            Ficha 📋
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* VISTA 3: JUGAR (Motor jugable de escenas, decisiones y cierre) */}
        {view === "jugar" && activeStory && activeScene && (
          <section className="game-stage-container" aria-label="Escena de la aventura">
            <div className="game-stage-header">
              <span className="category-tag">{activeStory.categoria}</span>
              <h2>{activeStory.titulo}</h2>
              <div className="score-badge">⭐ Puntos: {score}</div>
            </div>

            {/* Mensaje de feedback o consejo formativo */}
            {lastFeedback && (
              <div className="feedback-alert" role="status">
                💡 <strong>Consejo NAVI:</strong> {lastFeedback}
              </div>
            )}

            {/* Pantalla de Escena Actual */}
            <div className="scene-card">
              <div className="scene-art">{activeStory.imagen}</div>
              <h3>{activeScene.title}</h3>
              <p className="scene-body">{activeScene.body}</p>

              {/* Opciones de decisión en escena intermedia */}
              {!isFinalScene && activeScene.choices && activeScene.choices.length > 0 && (
                <div className="choices-container">
                  <p className="choices-label">¿Qué decides hacer?</p>
                  <div className="choices-list">
                    {activeScene.choices.map((choice, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="choice-btn"
                        onClick={() => handleChooseOption(choice)}
                      >
                        <span className="choice-number">{idx + 1}</span>
                        <span className="choice-text">{choice.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Escena Final / Celebración con estrellas */}
              {isFinalScene && (
                <div className="final-screen">
                  <div className="celebration-badge">🎉 ¡Aventura Completada!</div>
                  <div className="stars-awarded">
                    {"⭐".repeat(calculateStars(score))}
                  </div>
                  <p className="final-summary">
                    ¡Gran trabajo, {activeProfile.nombre}! Has tomado decisiones responsables y completaste esta aventura con {score} puntos.
                  </p>
                  <div className="final-actions">
                    <button
                      type="button"
                      className="primary big-btn"
                      onClick={handleReturnToMap}
                    >
                      🗺️ Volver al mapa de aventuras
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleNavigate("biblioteca")}
                    >
                      📚 Ir a la biblioteca
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón para pausar sin perder avance */}
            {!isFinalScene && (
              <div className="game-footer">
                <button
                  type="button"
                  className="secondary small-btn"
                  onClick={handleReturnToMap}
                >
                  ← Pausar y volver al mapa (avance guardado)
                </button>
              </div>
            )}
          </section>
        )}

        {/* VISTA 4: MI PROGRESO */}
        {view === "progreso" && (
          <section className="state-card progress-view">
            <h2>Progreso de {activeProfile.nombre} {activeProfile.avatar}</h2>
            <p>Monitorea los cuentos comenzados y completados del perfil activo.</p>
            <div className="progress-stats">
              <div className="stat-box">
                <span className="stat-number">
                  {Object.values(profileProgress).filter((s) => s === "completado").length}
                </span>
                <span className="stat-label">Completados</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">
                  {Object.values(profileProgress).filter((s) => s === "en progreso").length}
                </span>
                <span className="stat-label">En Progreso</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{stories.length}</span>
                <span className="stat-label">Total en Catálogo</span>
              </div>
            </div>
            <button type="button" className="primary" onClick={() => handleNavigate("mapa")}>
              Ir al Mapa de Aventuras
            </button>
          </section>
        )}

        {/* VISTA 5: PERFIL */}
        {view === "perfil" && (
          <section className="state-card profile-view">
            <div className="profile-header-card">
              <span className="profile-large-avatar">{activeProfile.avatar}</span>
              <h2>{activeProfile.nombre}</h2>
              <p>Rol: {activeProfile.rol} · Edad: {activeProfile.edad} años</p>
            </div>

            {/* Selector de perfiles para demostrar avance independiente */}
            <div className="profiles-selection-section">
              <h3>Seleccionar Perfil del Explorador</h3>
              <p>Cada perfil mantiene su propio progreso y sus propias partidas guardadas de forma independiente:</p>
              <div className="profile-cards-grid">
                {AVAILABLE_PROFILES.map((p) => {
                  const isCurrent = p.id === activeProfile.id;
                  let pProgress = {};
                  try {
                    const pSaved = localStorage.getItem(`navi-progress-${p.id}`);
                    pProgress = pSaved ? JSON.parse(pSaved) : {};
                  } catch (_e) {}
                  const completedCount = Object.values(pProgress).filter((s) => s === "completado").length;
                  const inProgressCount = Object.values(pProgress).filter((s) => s === "en progreso").length;

                  return (
                    <div
                      key={p.id}
                      className={`profile-select-card ${isCurrent ? "selected" : ""}`}
                      onClick={() => handleSwitchProfile(p)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="p-card-avatar">{p.avatar}</span>
                      <div className="p-card-info">
                        <strong>{p.nombre}</strong>
                        <span>{p.edad} años · {completedCount} completados · {inProgressCount} en curso</span>
                      </div>
                      <span className="p-card-btn">
                        {isCurrent ? "✓ Activo" : "Seleccionar"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="profile-actions-box">
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  if (window.confirm(`¿Deseas reiniciar el progreso local de ${activeProfile.nombre}?`)) {
                    localStorage.removeItem(`navi-progress-${activeProfile.id}`);
                    localStorage.removeItem(`navi-prologue-seen-${activeProfile.id}`);
                    localStorage.removeItem(`navi-active-view-${activeProfile.id}`);
                    localStorage.removeItem(`navi-active-story-id-${activeProfile.id}`);
                    // Limpiar sesiones guardadas del perfil
                    stories.forEach((st) => {
                      localStorage.removeItem(`navi-session-${activeProfile.id}-${st.id}`);
                    });
                    setProfileProgress({});
                    alert(`Progreso de ${activeProfile.nombre} reiniciado.`);
                  }
                }}
              >
                🔄 Reiniciar progreso de {activeProfile.nombre}
              </button>
              <button type="button" className="primary" onClick={() => handleNavigate("mapa")}>
                Continuar explorando el mapa
              </button>
            </div>
          </section>
        )}
      </main>

      {/* MODAL FICHA DETALLADA */}
      {selectedStory && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedStory(null);
          }}
        >
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="ficha-title">
            <button
              type="button"
              className="modal-close"
              aria-label="Cerrar ficha"
              onClick={() => setSelectedStory(null)}
            >
              ×
            </button>
            <div className="modal-header-tags">
              <span className="category-tag">{selectedStory.categoria}</span>
              {selectedStory.asignacion_aula && <span className="assigned-tag">🏫 Asignación de aula</span>}
              <span className={`status ${(profileProgress[selectedStory.id] || "nuevo").replace(" ", "-")}`}>
                {profileProgress[selectedStory.id] || "nuevo"}
              </span>
            </div>
            <h2 id="ficha-title">{selectedStory.titulo}</h2>
            <div className="detail-art">{selectedStory.imagen}</div>
            <p className="ficha-desc">{selectedStory.descripcion}</p>

            <div className="ficha-info-grid">
              <div className="info-item">
                <strong>Escenas jugables:</strong> {selectedStory.scenes?.length || "Verificado"}
              </div>
              <div className="info-item">
                <strong>Tipo:</strong> {selectedStory.is_main ? "Aventura Principal" : "Aventura Secundaria"}
              </div>
            </div>

            <div className="ficha-actions">
              <button
                type="button"
                className="primary full"
                onClick={() => handleStartPlay(selectedStory)}
              >
                {profileProgress[selectedStory.id] === "en progreso"
                  ? "Continuar Aventura ▶"
                  : profileProgress[selectedStory.id] === "completado"
                  ? "Volver a Jugar 🔄"
                  : "¡Comenzar a Jugar! 🚀"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
