const API_URL = "http://127.0.0.1:8000/api";

export async function obtenerHistorias() {
  const respuesta = await fetch(
    `${API_URL}/stories`,
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron cargar las aventuras.",
    );
  }

  const resultado = await respuesta.json();

  return resultado.data;
}

export async function obtenerHistoria(id) {
  const respuesta = await fetch(
    `${API_URL}/stories/${id}`,
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo cargar la aventura.",
    );
  }

  const resultado = await respuesta.json();

  return resultado.data;
}