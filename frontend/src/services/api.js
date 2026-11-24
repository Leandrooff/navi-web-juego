const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:8000/api";

/**
 * Realiza peticiones HTTP a la API de Laravel con cabeceras JSON.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options
  });

  if (!response.ok) {
    let message = `Error ${response.status} al consultar ${path}`;
    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch (_error) {
      // Mantener código si no es JSON
    }
    throw new Error(message);
  }

  return response.json();
}

/**
 * Valida de forma exhaustiva que un cuento pueda terminarse y no tenga rutas rotas.
 *
 * Criterios obligatorios:
 * 1. Debe contener al menos una escena válida.
 * 2. Todas las opciones de decisión deben apuntar a escenas que realmente existen en el cuento.
 *    (Cuentos con opciones apuntando a escenas inexistentes son descartados como rutas rotas).
 * 3. Desde la escena inicial, debe existir al menos un camino navegable (grafo dirigido)
 *    que conduzca a una escena final (is_final === true).
 *
 * @param {Object} story
 * @returns {boolean}
 */
export function isStoryTerminable(story) {
  if (!story) return false;

  const rawScenes = story.scenes || story.escenas;
  if (!Array.isArray(rawScenes) || rawScenes.length === 0) {
    return false;
  }

  // Mapa de todas las escenas indexadas por ID (como string para comparación segura)
  const sceneMap = new Map();
  const finalSceneIds = new Set();

  for (const scene of rawScenes) {
    if (!scene || scene.id === undefined || scene.id === null) {
      return false;
    }
    const sceneIdStr = String(scene.id);
    if (sceneMap.has(sceneIdStr)) {
      // Escena con ID duplicado: inconsistencia en el grafo
      return false;
    }
    sceneMap.set(sceneIdStr, scene);

    const isFinal = Boolean(
      scene.is_final ||
      scene.es_final ||
      scene.scene_type === "final" ||
      (!Array.isArray(scene.choices || scene.opciones) || (scene.choices || scene.opciones).length === 0)
    );

    if (isFinal) {
      finalSceneIds.add(sceneIdStr);
    }
  }

  // Si el cuento no contiene ninguna escena final, no es posible terminarlo
  if (finalSceneIds.size === 0) {
    return false;
  }

  // Identificar escena inicial
  const rawInitialId = story.initial_scene_id !== undefined && story.initial_scene_id !== null
    ? story.initial_scene_id
    : rawScenes[0]?.id;

  if (rawInitialId === undefined || rawInitialId === null) {
    return false;
  }

  const initialIdStr = String(rawInitialId);
  if (!sceneMap.has(initialIdStr)) {
    return false;
  }

  // Comprobar que TODAS las opciones apunten a escenas que existen (sin rutas rotas)
  for (const scene of rawScenes) {
    const choices = scene.choices || scene.opciones || [];
    if (Array.isArray(choices)) {
      for (const choice of choices) {
        const target = choice.target !== undefined && choice.target !== null
          ? choice.target
          : choice.target_scene_id !== undefined && choice.target_scene_id !== null
          ? choice.target_scene_id
          : choice.siguiente;

        if (target === undefined || target === null || !sceneMap.has(String(target))) {
          // Ruta rota detectada: la opción apunta a una escena inexistente
          return false;
        }
      }
    }
  }

  // Búsqueda en anchura (BFS) desde la escena inicial para comprobar alcanzabilidad de un final
  const queue = [initialIdStr];
  const visited = new Set([initialIdStr]);
  let reachedFinal = false;

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (finalSceneIds.has(currentId)) {
      reachedFinal = true;
      break;
    }

    const currentScene = sceneMap.get(currentId);
    const choices = currentScene?.choices || currentScene?.opciones || [];
    if (Array.isArray(choices)) {
      for (const choice of choices) {
        const target = choice.target !== undefined && choice.target !== null
          ? choice.target
          : choice.target_scene_id !== undefined && choice.target_scene_id !== null
          ? choice.target_scene_id
          : choice.siguiente;

        const targetStr = String(target);
        if (sceneMap.has(targetStr) && !visited.has(targetStr)) {
          visited.add(targetStr);
          queue.push(targetStr);
        }
      }
    }
  }

  return reachedFinal;
}

// Alias de retrocompatibilidad
export const isStoryPlayable = isStoryTerminable;

/**
 * Normaliza un objeto de cuento crudo (de Laravel API o demo) al modelo estándar de la interfaz.
 */
export function normalizeStory(story) {
  const rawState = story.estado || story.status || "nuevo";
  const state = rawState === "published" || rawState === "publicado" ? "nuevo" : rawState;

  const rawScenes = story.scenes || story.escenas || [];
  const scenes = Array.isArray(rawScenes)
    ? rawScenes.map((scene, idx) => ({
        id: scene.id !== undefined ? scene.id : `escena-${idx + 1}`,
        title: scene.title || scene.titulo || `Escena ${idx + 1}`,
        body: scene.body || scene.texto || scene.descripcion || "",
        image: scene.image || scene.imagen || scene.image_path || null,
        choices: Array.isArray(scene.choices || scene.opciones)
          ? (scene.choices || scene.opciones).map((c) => ({
              id: c.id,
              label: c.label || c.texto || c.titulo || "Continuar",
              target: c.target !== undefined ? c.target : (c.target_scene_id !== undefined ? c.target_scene_id : c.siguiente),
              points: Number(c.points || c.puntos || 0),
              feedback: c.feedback || c.consequence || null
            }))
          : [],
        is_final: Boolean(
          scene.is_final ||
          scene.es_final ||
          scene.scene_type === "final" ||
          (!Array.isArray(scene.choices || scene.opciones) || (scene.choices || scene.opciones).length === 0)
        )
      }))
    : [];

  // Mapear imagen/avatar representativo
  let imagen = story.imagen || story.image;
  if (!imagen || imagen.startsWith("/")) {
    const cat = (story.categoria || story.category?.name || story.category || "").toLowerCase();
    if (cat.includes("seguridad")) imagen = "🌳";
    else if (cat.includes("calle")) imagen = "🚦";
    else if (cat.includes("escuela")) imagen = "🎒";
    else if (cat.includes("casa")) imagen = "🏠";
    else imagen = "📚";
  }

  const categoryName = typeof story.category === "object" && story.category !== null
    ? story.category.name
    : story.categoria || story.category || "general";

  return {
    id: story.id,
    slug: story.slug || `cuento-${story.id}`,
    titulo: story.titulo || story.title || story.name || `Aventura ${story.id}`,
    categoria: categoryName.toLowerCase(),
    estado: state,
    descripcion: story.descripcion || story.description || "Aventura educativa para aprender jugando.",
    imagen: imagen,
    is_main: Boolean(story.is_main || story.es_principal || story.id === 1 || story.slug === "me-perdi-en-el-parque"),
    asignacion_aula: Boolean(story.asignacion_aula || story.is_assigned),
    initial_scene_id: story.initial_scene_id !== undefined ? story.initial_scene_id : (scenes[0] ? scenes[0].id : null),
    estimated_minutes: story.estimated_minutes || 5,
    scenes
  };
}

/**
 * Obtiene la lista de cuentos publicados del catálogo real de Laravel y MariaDB.
 * Filtra automáticamente cualquier cuento con rutas rotas o que no se pueda terminar.
 */
export async function getStories() {
  const payload = await request("/stories");
  const rawList = Array.isArray(payload) ? payload : (payload.data || []);
  const normalized = rawList.map(normalizeStory);

  // Excluir de la biblioteca cuentos con rutas rotas o sin final alcanzable
  return normalized.filter(isStoryTerminable);
}

/**
 * Obtiene el detalle de un cuento específico por su ID.
 */
export async function getStory(id) {
  const payload = await request(`/stories/${encodeURIComponent(id)}`);
  const normalized = normalizeStory(payload.data || payload);

  if (!isStoryTerminable(normalized)) {
    throw new Error("La aventura solicitada contiene rutas rotas o no se puede terminar.");
  }

  return normalized;
}
