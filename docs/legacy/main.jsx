import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createRoot } from "react-dom/client";

import "./styles.css";
import "./components/componentes.css";

import {
  MotorCuentos,
} from "./engine/motor-cuentos.js";

import perfilDemo from "./data/profiles/perfil-demo.json";
import logrosDemo from "./data/logros-demo.json";

import {
  obtenerHistorias,
  obtenerHistoria,
} from "./services/storiesApi.js";

import {
  adaptarHistoriaApi,
} from "./services/storyAdapter.js";

import {
  iniciarSesionJuego,
  registrarDecision,
  finalizarSesionJuego,
} from "./services/gameSessionsApi.js";

import {
  obtenerProgresoPerfil,
} from "./services/progressApi.js";

import {
  cargarProgreso,
  guardarProgreso,
  registrarCuentoCompletado,
} from "./utils/progreso.js";

import {
  calcularLogrosDesbloqueados,
} from "./utils/logros.js";

import Button from "./components/Button.jsx";
import ChoiceButton from "./components/ChoiceButton.jsx";
import StoryCard from "./components/StoryCard.jsx";

import Perfil from "./pages/Perfil.jsx";
import Progreso from "./pages/Progreso.jsx";
import Logros from "./pages/Logros.jsx";

const CHILD_PROFILE_ID = 1;

function App() {
  const [vista, setVista] =
    useState("inicio");

  const [cuentoActivo, setCuentoActivo] =
    useState(null);

  const [estado, setEstado] =
    useState(null);

  const [sesionActiva, setSesionActiva] =
    useState(null);

  const [historias, setHistorias] =
    useState([]);

  const [
    progresoServidor,
    setProgresoServidor,
  ] = useState([]);

  const [
    cargandoHistorias,
    setCargandoHistorias,
  ] = useState(true);

  const [
    cargandoProgreso,
    setCargandoProgreso,
  ] = useState(true);

  const [
    cargandoJuego,
    setCargandoJuego,
  ] = useState(false);

  const [
    procesandoDecision,
    setProcesandoDecision,
  ] = useState(false);

  const [errorApi, setErrorApi] =
    useState("");

  /*
   * TEMPORAL:
   * localStorage todavía conserva
   * estrellas y logros.
   */
  const [
    progresoLocal,
    setProgresoLocal,
  ] = useState(() =>
    cargarProgreso(),
  );

  const motor = useMemo(
    () => new MotorCuentos(),
    [],
  );

  /*
  ============================================================
  PROGRESO REAL DESDE LARAVEL
  ============================================================
  */

  const cuentosCompletadosServidor =
    progresoServidor.filter(
      (item) =>
        item.status === "completed",
    ).length;

  const progresoVisible = {
    ...progresoLocal,

    cuentosCompletados:
      cuentosCompletadosServidor,
  };

  /*
  ============================================================
  LOGROS
  ============================================================
  */

  const logrosDesbloqueados =
    calcularLogrosDesbloqueados(
      progresoVisible,
      logrosDemo.logros,
    );

  const perfilActual = {
    ...perfilDemo,

    estrellas:
      progresoVisible.estrellas,

    cuentosCompletados:
      progresoVisible
        .cuentosCompletados,

    logros:
      logrosDesbloqueados,
  };

  /*
  ============================================================
  FUNCIONES DE PROGRESO DEL SERVIDOR
  ============================================================
  */

  function buscarProgresoHistoria(
    storyId,
  ) {
    return progresoServidor.find(
      (item) =>
        Number(item.story_id) ===
        Number(storyId),
    );
  }

  function historiaEstaCompletada(
    storyId,
  ) {
    const registro =
      buscarProgresoHistoria(
        storyId,
      );

    return (
      registro?.status ===
      "completed"
    );
  }

  async function refrescarProgresoServidor() {
    try {
      const datos =
        await obtenerProgresoPerfil(
          CHILD_PROFILE_ID,
        );

      setProgresoServidor(
        datos,
      );

      return datos;
    } catch (error) {
      console.error(error);

      setErrorApi(
        "No se pudo actualizar el progreso.",
      );

      return [];
    }
  }

  /*
  ============================================================
  CARGA INICIAL
  ============================================================
  */

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargandoHistorias(true);
        setCargandoProgreso(true);
        setErrorApi("");

        const [
          datosHistorias,
          datosProgreso,
        ] = await Promise.all([
          obtenerHistorias(),

          obtenerProgresoPerfil(
            CHILD_PROFILE_ID,
          ),
        ]);

        setHistorias(
          datosHistorias,
        );

        setProgresoServidor(
          datosProgreso,
        );
      } catch (error) {
        console.error(error);

        setErrorApi(
          "No se pudo conectar con el servidor de NAVI.",
        );
      } finally {
        setCargandoHistorias(false);
        setCargandoProgreso(false);
      }
    }

    cargarDatos();
  }, []);

  /*
  ============================================================
  CATÁLOGO
  ============================================================
  */

  const catalogo = historias.map(
    (historia) => {
      const progresoHistoria =
        buscarProgresoHistoria(
          historia.id,
        );

      const completado =
        progresoHistoria?.status ===
        "completed";

      const enProgreso =
        progresoHistoria?.status ===
        "in_progress";

      return {
        id: historia.id,

        titulo:
          historia.title,

        categoria:
          historia.category?.name ??
          "Aventura",

        descripcion:
          historia.description ?? "",

        imagen:
          null,

        progreso:
          progresoHistoria ?? null,

        intentos:
          progresoHistoria?.attempts ??
          0,

        estado:
          completado
            ? "completado"
            : enProgreso
              ? "en_progreso"
              : "nuevo",

        jugable:
          historia.status ===
          "published",
      };
    },
  );

  /*
  ============================================================
  NAVEGACIÓN
  ============================================================
  */

  function cambiarVista(
    nuevaVista,
  ) {
    setVista(
      nuevaVista,
    );
  }

  /*
  ============================================================
  ABRIR CUENTO
  ============================================================
  */

  async function abrirCuento(
    cuento,
  ) {
    if (
      !cuento?.jugable ||
      cargandoJuego
    ) {
      return;
    }

    try {
      setCargandoJuego(true);
      setErrorApi("");

      /*
       * Historia desde Laravel.
       */
      const historiaApi =
        await obtenerHistoria(
          cuento.id,
        );

      /*
       * Adaptamos al motor.
       */
      const historiaAdaptada =
        adaptarHistoriaApi(
          historiaApi,
        );

      /*
       * Creamos una nueva
       * game_session.
       */
      const datosSesion =
        await iniciarSesionJuego(
          CHILD_PROFILE_ID,
          Number(cuento.id),
        );

      setSesionActiva(
        datosSesion.session,
      );

      /*
       * Cargamos el motor.
       */
      motor.cargarCuento(
        historiaAdaptada,
      );

      setEstado(
        motor.obtenerEstado(),
      );

      setCuentoActivo({
        ...cuento,

        titulo:
          historiaAdaptada.titulo,

        descripcion:
          historiaAdaptada.descripcion,

        /*
         * Guardamos cómo estaba
         * antes de iniciar esta
         * nueva sesión.
         *
         * Así sabemos si debemos
         * entregar la estrella
         * local por primera vez.
         */
        estabaCompletado:
          historiaEstaCompletada(
            cuento.id,
          ),
      });

      setVista("juego");
    } catch (error) {
      console.error(error);

      setErrorApi(
        "No se pudo iniciar la aventura.",
      );
    } finally {
      setCargandoJuego(false);
    }
  }

  /*
  ============================================================
  CONTINUAR / JUGAR AVENTURA
  ============================================================
  */

  async function continuarUltimaAventura() {
    if (!catalogo.length) {
      return;
    }

    const progresoReciente =
      [...progresoServidor]
        .sort((a, b) => {
          const fechaA =
            new Date(
              a.updated_at ??
                0,
            );

          const fechaB =
            new Date(
              b.updated_at ??
                0,
            );

          return (
            fechaB - fechaA
          );
        })[0];

    const cuento =
      progresoReciente
        ? catalogo.find(
            (item) =>
              Number(item.id) ===
              Number(
                progresoReciente
                  .story_id,
              ),
          )
        : catalogo[0];

    if (cuento) {
      await abrirCuento(
        cuento,
      );
    }
  }

  /*
  ============================================================
  ELEGIR OPCIÓN
  ============================================================
  */

  async function elegir(
    opcionId,
  ) {
    if (
      procesandoDecision ||
      !sesionActiva
    ) {
      return;
    }

    try {
      setProcesandoDecision(true);
      setErrorApi("");

      const escenaActual =
        estado?.escenaActual;

      if (!escenaActual) {
        throw new Error(
          "No existe una escena activa.",
        );
      }

      /*
       * Primero guardamos
       * en MariaDB.
       */
      await registrarDecision(
        sesionActiva.id,

        Number(
          escenaActual.id,
        ),

        Number(
          opcionId,
        ),
      );

      /*
       * Luego avanzamos
       * en MotorCuentos.
       */
      const nuevoEstado =
        motor.elegirOpcion(
          opcionId,
        );

      setEstado(
        nuevoEstado,
      );
    } catch (error) {
      console.error(error);

      setErrorApi(
        "No se pudo guardar tu decisión. Inténtalo nuevamente.",
      );
    } finally {
      setProcesandoDecision(false);
    }
  }

  /*
  ============================================================
  CONTINUAR DESPUÉS DE LA CONSECUENCIA
  ============================================================
  */

  async function continuar() {
    if (
      procesandoDecision
    ) {
      return;
    }

    try {
      setProcesandoDecision(true);
      setErrorApi("");

      const nuevoEstado =
        motor.continuar();

      setEstado(
        nuevoEstado,
      );

      /*
       * Si terminó la historia,
       * cerramos la sesión.
       */
      if (
        nuevoEstado.fase ===
          "terminado" &&
        cuentoActivo &&
        sesionActiva
      ) {
        await finalizarSesionJuego(
          sesionActiva.id,
        );

        /*
         * Refrescamos el progreso
         * directamente desde MariaDB.
         */
        await refrescarProgresoServidor();

        /*
         * TEMPORAL:
         *
         * Las estrellas siguen en
         * localStorage.
         *
         * Solo entregamos la estrella
         * si esta historia no había
         * sido completada antes.
         */
        if (
          !cuentoActivo
            .estabaCompletado
        ) {
          const nuevoProgresoLocal =
            registrarCuentoCompletado(
              progresoLocal,

              String(
                cuentoActivo.id,
              ),
            );

          guardarProgreso(
            nuevoProgresoLocal,
          );

          setProgresoLocal(
            nuevoProgresoLocal,
          );
        }
      }
    } catch (error) {
      console.error(error);

      setErrorApi(
        "No se pudo actualizar el progreso de la aventura.",
      );
    } finally {
      setProcesandoDecision(false);
    }
  }

  /*
  ============================================================
  REINICIAR / NUEVO INTENTO
  ============================================================
  */

  async function reiniciar() {
    if (
      !cuentoActivo ||
      cargandoJuego
    ) {
      return;
    }

    try {
      setCargandoJuego(true);
      setErrorApi("");

      /*
       * Cada intento genera
       * una sesión nueva.
       */
      const datosSesion =
        await iniciarSesionJuego(
          CHILD_PROFILE_ID,

          Number(
            cuentoActivo.id,
          ),
        );

      setSesionActiva(
        datosSesion.session,
      );

      const nuevoEstado =
        motor.reiniciar();

      setEstado(
        nuevoEstado,
      );
    } catch (error) {
      console.error(error);

      setErrorApi(
        "No se pudo iniciar un nuevo intento.",
      );
    } finally {
      setCargandoJuego(false);
    }
  }

  /*
  ============================================================
  VOLVER A BIBLIOTECA
  ============================================================
  */

  async function volverBiblioteca() {
    setCuentoActivo(null);
    setEstado(null);
    setSesionActiva(null);

    await refrescarProgresoServidor();

    setVista(
      "biblioteca",
    );
  }

  /*
  ============================================================
  NAVEGACIÓN SUPERIOR
  ============================================================
  */

  function Navegacion() {
    return (
      <header className="navi-main-nav">

        <button
          type="button"
          className="navi-nav-brand"
          onClick={() =>
            cambiarVista(
              "inicio",
            )
          }
        >
          <span className="navi-nav-logo">
            ✦
          </span>

          <span>
            <strong>
              NAVI
            </strong>

            <small>
              Navegación y Aprendizaje
              para la Vida Infantil
            </small>
          </span>
        </button>

        <nav
          className="navi-nav-links"
          aria-label="Navegación principal"
        >

          <button
            type="button"
            className={
              vista === "inicio"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarVista(
                "inicio",
              )
            }
          >
            Inicio
          </button>

          <button
            type="button"
            className={
              vista === "biblioteca"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarVista(
                "biblioteca",
              )
            }
          >
            Aventuras
          </button>

          <button
            type="button"
            className={
              vista === "progreso"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarVista(
                "progreso",
              )
            }
          >
            Progreso
          </button>

          <button
            type="button"
            className={
              vista === "logros"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarVista(
                "logros",
              )
            }
          >
            Logros
          </button>

          <button
            type="button"
            className={
              vista === "perfil"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarVista(
                "perfil",
              )
            }
          >
            Perfil
          </button>

        </nav>

        <button
          type="button"
          className="navi-nav-profile"
          onClick={() =>
            cambiarVista(
              "perfil",
            )
          }
        >

          <span className="navi-nav-avatar">
            {perfilActual.avatar}
          </span>

          <span>
            <strong>
              {perfilActual.nombre}
            </strong>

            <small>
              {perfilActual.edad} años
            </small>
          </span>

        </button>

      </header>
    );
  }

  /*
  ============================================================
  ERRORES
  ============================================================
  */

  function renderEstadoApi() {
    if (!errorApi) {
      return null;
    }

    return (
      <section className="navi-card">

        <div className="navi-card__body">

          <p className="navi-eyebrow">
            Conexión
          </p>

          <h3>
            Ocurrió un problema
          </h3>

          <p className="navi-muted">
            {errorApi}
          </p>

        </div>

      </section>
    );
  }

  /*
  ============================================================
  INICIO
  ============================================================
  */

  function renderInicio() {
    const primeraHistoria =
      catalogo[0];

    return (
      <main className="navi-page">

        <section className="navi-shell">

          {renderEstadoApi()}

          <section className="navi-home-hero">

            <div className="navi-home-copy">

              <p className="navi-eyebrow">
                Hola,{" "}
                {perfilActual.nombre} 👋
              </p>

              <h1>
                Aprende a cuidarte

                <span>
                  {" "}
                  mientras vives
                  aventuras
                </span>
              </h1>

              <p className="navi-home-description">
                En NAVI descubrirás
                historias donde tus
                decisiones cambian lo que
                ocurre. Observa, piensa y
                descubre nuevas formas de
                actuar ante situaciones
                de la vida cotidiana.
              </p>

              <div className="navi-home-actions">

                <Button
                  onClick={() =>
                    cambiarVista(
                      "biblioteca",
                    )
                  }
                >
                  Explorar aventuras
                </Button>

                <Button
                  variant="secondary"
                  disabled={
                    !primeraHistoria ||
                    cargandoJuego
                  }
                  onClick={
                    continuarUltimaAventura
                  }
                >
                  Jugar aventura
                </Button>

              </div>

            </div>

            <div className="navi-home-mascot">

              <div className="navi-mascot-glow">
                <span>
                  ✦
                </span>
              </div>

              <p>
                NAVI
              </p>

              <small>
                Tu compañero de aventuras
              </small>

            </div>

          </section>

          {primeraHistoria && (
            <section className="navi-home-section">

              <div className="navi-home-section-heading">

                <div>

                  <p className="navi-eyebrow">
                    Continúa aprendiendo
                  </p>

                  <h2>
                    Aventura disponible
                  </h2>

                </div>

                <Button
                  variant="secondary"
                  onClick={() =>
                    cambiarVista(
                      "biblioteca",
                    )
                  }
                >
                  Ver todas
                </Button>

              </div>

              <article className="navi-card navi-current-adventure">

                <div className="navi-current-icon">
                  🌳
                </div>

                <div className="navi-current-copy">

                  <p className="navi-eyebrow">

                    {primeraHistoria.estado ===
                    "completado"
                      ? "Completada"
                      : primeraHistoria.estado ===
                          "en_progreso"
                        ? "En progreso"
                        : "Disponible"}

                  </p>

                  <h3>
                    {
                      primeraHistoria
                        .titulo
                    }
                  </h3>

                  <p className="navi-muted">
                    {
                      primeraHistoria
                        .descripcion
                    }
                  </p>

                  {primeraHistoria.intentos >
                    0 && (
                    <p className="navi-muted">
                      Intentos:{" "}
                      {
                        primeraHistoria
                          .intentos
                      }
                    </p>
                  )}

                </div>

                <Button
                  disabled={
                    cargandoJuego
                  }
                  onClick={() =>
                    abrirCuento(
                      primeraHistoria,
                    )
                  }
                >

                  {cargandoJuego
                    ? "Cargando..."
                    : primeraHistoria
                          .estado ===
                        "completado"
                      ? "Jugar nuevamente"
                      : "Comenzar"}

                </Button>

              </article>

            </section>
          )}

          <section className="navi-home-stats">

            <article className="navi-card">

              <div className="navi-card__body">

                <span className="navi-stat-icon">
                  ⭐
                </span>

                <p className="navi-eyebrow">
                  Estrellas
                </p>

                <h3>
                  {
                    progresoVisible
                      .estrellas
                  }
                </h3>

                <p className="navi-muted">
                  Acumuladas hasta ahora
                </p>

              </div>

            </article>

            <article className="navi-card">

              <div className="navi-card__body">

                <span className="navi-stat-icon">
                  📖
                </span>

                <p className="navi-eyebrow">
                  Aventuras
                </p>

                <h3>
                  {
                    progresoVisible
                      .cuentosCompletados
                  }
                </h3>

                <p className="navi-muted">
                  Misiones completadas
                </p>

              </div>

            </article>

            <article className="navi-card">

              <div className="navi-card__body">

                <span className="navi-stat-icon">
                  🏆
                </span>

                <p className="navi-eyebrow">
                  Logros
                </p>

                <h3>
                  {
                    logrosDesbloqueados
                      .length
                  }
                </h3>

                <p className="navi-muted">
                  Descubrimientos
                  realizados
                </p>

              </div>

            </article>

          </section>

        </section>

      </main>
    );
  }

  /*
  ============================================================
  BIBLIOTECA
  ============================================================
  */

  function renderBiblioteca() {
    return (
      <main className="navi-page">

        <section className="navi-shell">

          <header className="navi-header">

            <p className="navi-eyebrow">
              Camino de aventuras
            </p>

            <h1>
              Biblioteca de aventuras
            </h1>

            <p className="navi-muted">
              Tus aventuras y su progreso
              se sincronizan con NAVI.
            </p>

          </header>

          {renderEstadoApi()}

          {cargandoHistorias ||
          cargandoProgreso ? (
            <section className="navi-card">

              <div className="navi-card__body">

                <h3>
                  Cargando aventuras...
                </h3>

                <p className="navi-muted">
                  Estamos consultando el
                  servidor de NAVI.
                </p>

              </div>

            </section>
          ) : (
            <section className="navi-library-grid">

              {catalogo.map(
                (cuento) => (
                  <div
                    key={cuento.id}

                    className={
                      cuento.jugable
                        ? "navi-story-wrapper is-playable"
                        : "navi-story-wrapper"
                    }

                    onClick={() =>
                      abrirCuento(
                        cuento,
                      )
                    }

                    role={
                      cuento.jugable
                        ? "button"
                        : undefined
                    }

                    tabIndex={
                      cuento.jugable
                        ? 0
                        : -1
                    }

                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        cuento.jugable &&
                        (event.key ===
                          "Enter" ||
                          event.key ===
                            " ")
                      ) {
                        event.preventDefault();

                        abrirCuento(
                          cuento,
                        );
                      }
                    }}
                  >

                    <StoryCard
                      title={
                        cuento.titulo
                      }

                      category={
                        cuento.categoria
                      }

                      description={
                        cuento.descripcion
                      }

                      status={
                        cuento.estado
                      }

                      image={
                        cuento.imagen
                          ? {
                              src:
                                cuento.imagen,

                              alt:
                                cuento.titulo,
                            }
                          : undefined
                      }

                      actionLabel={
                        cargandoJuego
                          ? "Cargando..."
                          : cuento.estado ===
                              "completado"
                            ? "Jugar nuevamente"
                            : cuento.estado ===
                                "en_progreso"
                              ? "Continuar"
                              : "Jugar aventura"
                      }

                      disabled={
                        !cuento.jugable ||
                        cargandoJuego
                      }

                      onAction={(
                        event,
                      ) => {
                        if (event) {
                          event.stopPropagation();
                        }

                        abrirCuento(
                          cuento,
                        );
                      }}
                    />

                    {cuento.intentos >
                      0 && (
                      <p className="navi-muted">
                        Intentos:{" "}
                        {
                          cuento.intentos
                        }
                      </p>
                    )}

                  </div>
                ),
              )}

            </section>
          )}

        </section>

      </main>
    );
  }

  /*
  ============================================================
  JUEGO
  ============================================================
  */

  function renderJuego() {
    const escena =
      estado?.escenaActual;

    return (
      <main className="navi-page">

        <section className="navi-shell">

          <header className="navi-game-top">

            <div>

              <p className="navi-eyebrow">
                Aventura NAVI
              </p>

              <h1>
                {
                  cuentoActivo?.titulo
                }
              </h1>

            </div>

            <Button
              variant="secondary"
              onClick={
                volverBiblioteca
              }
            >
              Volver a biblioteca
            </Button>

          </header>

          {renderEstadoApi()}

          <section className="navi-card navi-game-card">

            <div className="navi-card__body">

              <p className="navi-eyebrow">

                {estado?.fase ===
                  "jugando" &&
                  "Escena"}

                {estado?.fase ===
                  "consecuencia" &&
                  "Consecuencia"}

                {estado?.fase ===
                  "terminado" &&
                  "Final"}

              </p>

              <h2>
                {escena?.titulo}
              </h2>

              <p className="navi-story-text">
                {escena?.texto}
              </p>

              {estado?.fase ===
                "jugando" && (
                <div className="navi-options">

                  {escena?.opciones.map(
                    (opcion) => (
                      <ChoiceButton
                        key={
                          opcion.id
                        }

                        disabled={
                          procesandoDecision
                        }

                        onClick={() =>
                          elegir(
                            opcion.id,
                          )
                        }
                      >

                        {
                          procesandoDecision
                            ? "Guardando..."
                            : opcion.texto
                        }

                      </ChoiceButton>
                    ),
                  )}

                </div>
              )}

              {estado?.fase ===
                "consecuencia" && (
                <div className="navi-consequence">

                  <p className="navi-eyebrow">
                    Tu decisión cambió
                    la historia
                  </p>

                  <h3>
                    ¿Qué ocurrió?
                  </h3>

                  <p>
                    {
                      estado
                        .decisionActual
                        ?.consecuencia
                    }
                  </p>

                  <Button
                    disabled={
                      procesandoDecision
                    }
                    onClick={
                      continuar
                    }
                  >

                    {procesandoDecision
                      ? "Guardando..."
                      : "Continuar"}

                  </Button>

                </div>
              )}

              {estado?.fase ===
                "terminado" && (
                <div className="navi-finish">

                  <p className="navi-eyebrow">
                    Aventura completada
                  </p>

                  <h3>
                    {
                      estado.final
                        ?.titulo
                    }
                  </h3>

                  <p>
                    {
                      estado.final
                        ?.texto
                    }
                  </p>

                  <div className="navi-finish-actions">

                    <Button
                      disabled={
                        cargandoJuego
                      }
                      onClick={
                        reiniciar
                      }
                    >

                      {cargandoJuego
                        ? "Preparando..."
                        : "Jugar nuevamente"}

                    </Button>

                    <Button
                      variant="secondary"
                      onClick={
                        volverBiblioteca
                      }
                    >
                      Volver a biblioteca
                    </Button>

                  </div>

                </div>
              )}

            </div>

          </section>

          <section className="navi-card">

            <div className="navi-card__body">

              <p className="navi-eyebrow">
                Tu aventura
              </p>

              <h3>
                Progreso de la misión
              </h3>

              <p className="navi-muted">
                Decisiones tomadas:{" "}
                {
                  estado?.historial
                    ?.length ?? 0
                }
              </p>

              {sesionActiva && (
                <p className="navi-muted">
                  Sesión #{sesionActiva.id}
                </p>
              )}

              {estado?.fase ===
                "jugando" && (
                <p className="navi-muted">
                  Observa la situación
                  y elige cómo quieres
                  continuar.
                </p>
              )}

              {estado?.fase ===
                "consecuencia" && (
                <p className="navi-muted">
                  Observa qué ocurrió
                  antes de continuar.
                </p>
              )}

              {estado?.fase ===
                "terminado" && (
                <p className="navi-muted">
                  Tu aventura fue
                  registrada en NAVI.
                </p>
              )}

            </div>

          </section>

        </section>

      </main>
    );
  }

  /*
  ============================================================
  VISTAS
  ============================================================
  */

  function renderContenido() {
    switch (vista) {
      case "inicio":
        return renderInicio();

      case "biblioteca":
        return renderBiblioteca();

      case "progreso":
        return (
          <main className="navi-page">

            <section className="navi-shell">

              <Progreso
                perfil={
                  perfilActual
                }
              />

            </section>

          </main>
        );

      case "logros":
        return (
          <main className="navi-page">

            <section className="navi-shell">

              <Logros
                perfil={
                  perfilActual
                }

                progreso={
                  progresoVisible
                }

                datosLogros={
                  logrosDemo
                }
              />

            </section>

          </main>
        );

      case "perfil":
        return (
          <main className="navi-page">

            <section className="navi-shell">

              <Perfil
                perfil={
                  perfilActual
                }

                onContinue={
                  continuarUltimaAventura
                }
              />

            </section>

          </main>
        );

      case "juego":
        return renderJuego();

      default:
        return renderInicio();
    }
  }

  return (
    <div className="navi-app">

      {vista !== "juego" && (
        <Navegacion />
      )}

      {renderContenido()}

    </div>
  );
}

createRoot(
  document.getElementById("root"),
).render(<App />);