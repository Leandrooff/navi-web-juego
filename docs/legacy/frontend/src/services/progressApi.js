const API_URL = "http://127.0.0.1:8000/api";

export async function obtenerProgresoPerfil(
  childProfileId,
) {
  const respuesta = await fetch(
    `${API_URL}/child-profiles/${childProfileId}/progress`,
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo cargar el progreso del perfil.",
    );
  }

  const resultado =
    await respuesta.json();

  return resultado.data;
}