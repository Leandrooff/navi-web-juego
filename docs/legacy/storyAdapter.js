export function adaptarHistoriaApi(story) {
  if (!story) {
    throw new Error("Historia inválida.");
  }

  const escenasApi = story.scenes ?? [];

  const sceneMap = new Map(
    escenasApi.map((scene) => [
      Number(scene.id),
      scene,
    ]),
  );

  const escenas = escenasApi.map((scene) => ({
    id: String(scene.id),

    titulo: scene.title,

    texto: scene.body,

    icono: obtenerIconoEscena(scene),

    esFinal: Boolean(scene.is_final),

    opciones: (scene.choices ?? []).map(
      (choice) => ({
        id: String(choice.id),

        texto: choice.label,

        puntos: Number(
          choice.points ?? 0,
        ),

        siguiente:
          choice.target_scene_id !== null &&
          choice.target_scene_id !== undefined
            ? String(
                choice.target_scene_id,
              )
            : null,

        consecuencia:
          choice.consequence ??
          "Tu decisión cambia el recorrido de la historia.",
      }),
    ),
  }));

  const initialSceneId =
    story.initial_scene_id ??
    story.initial_scene?.id ??
    escenas[0]?.id;

  const finalScene = escenas.find(
    (scene) => scene.esFinal,
  );

  /*
   * Compatibilidad con MotorCuentos.
   *
   * El motor original requiere tres tipos
   * de final según puntaje.
   *
   * NAVI NO mostrará estas categorías como
   * correcto/incorrecto. Los tres finales
   * usan el mismo cierre narrativo.
   */

  const tituloFinal =
    finalScene?.titulo ??
    "Aventura completada";

  const textoFinal =
    finalScene?.texto ??
    "Terminaste esta aventura.";

  const finales = [
    {
      id: "final-reforzar",
      tipo: "malo",
      minPuntos: 0,
      maxPuntos: 9,
      titulo: tituloFinal,
      texto: textoFinal,
    },
    {
      id: "final-aprendiendo",
      tipo: "intermedio",
      minPuntos: 10,
      maxPuntos: 19,
      titulo: tituloFinal,
      texto: textoFinal,
    },
    {
      id: "final-completado",
      tipo: "bueno",
      minPuntos: 20,
      maxPuntos: null,
      titulo: tituloFinal,
      texto: textoFinal,
    },
  ];

  /*
   * Comprobamos que todos los destinos
   * realmente existan.
   */

  for (const scene of escenas) {
    for (const option of scene.opciones) {
      if (
        option.siguiente !== null &&
        !sceneMap.has(
          Number(option.siguiente),
        )
      ) {
        throw new Error(
          `La opción ${option.id} apunta a una escena inexistente.`,
        );
      }
    }
  }

  return {
    id: String(story.id),

    titulo: story.title,

    descripcion:
      story.description ?? "",

    escenaInicial:
      String(initialSceneId),

    escenas,

    finales,
  };
}

function obtenerIconoEscena(scene) {
  if (scene.is_final) {
    return "🌈";
  }

  switch (scene.scene_type) {
    case "preventive_decision":
      return "🧭";

    case "comprehension":
      return "💡";

    case "dialogue":
      return "💬";

    default:
      return "✨";
  }
}