const API_URL = "http://127.0.0.1:8000/api";

export async function iniciarSesionJuego(
  childProfileId,
  storyId,
) {
  const respuesta = await fetch(
    `${API_URL}/game-sessions`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        child_profile_id:
          childProfileId,

        story_id:
          storyId,
      }),
    },
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo iniciar la sesión de juego.",
    );
  }

  const resultado =
    await respuesta.json();

  return resultado.data;
}

export async function registrarDecision(
  sessionId,
  sceneId,
  choiceId,
) {
  const respuesta = await fetch(
    `${API_URL}/game-sessions/${sessionId}/decisions`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        scene_id:
          sceneId,

        choice_id:
          choiceId,
      }),
    },
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo registrar la decisión.",
    );
  }

  const resultado =
    await respuesta.json();

  return resultado.data;
}

export async function finalizarSesionJuego(
  sessionId,
) {
  const respuesta = await fetch(
    `${API_URL}/game-sessions/${sessionId}/finish`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },
    },
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo finalizar la sesión.",
    );
  }

  const resultado =
    await respuesta.json();

  return resultado.data;
}