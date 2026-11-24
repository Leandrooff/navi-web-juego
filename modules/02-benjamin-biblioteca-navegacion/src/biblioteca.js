const demoFallback = [
  { id: 1, titulo: "Me perdí en el parque", categoria: "seguridad", estado: "nuevo", descripcion: "Aprende qué hacer si te separas de tu tutor.", imagen: "🌳" },
  { id: 2, titulo: "Cruzar la calle con cuidado", categoria: "calle", estado: "nuevo", descripcion: "Observa, escucha y espera antes de cruzar.", imagen: "🚦" },
  { id: 3, titulo: "Un desconocido ofrece un regalo", categoria: "seguridad", estado: "en progreso", descripcion: "Practica cómo poner límites ante personas desconocidas.", imagen: "🎁" },
  { id: 4, titulo: "Un día seguro en casa", categoria: "casa", estado: "completado", descripcion: "Descubre normas simples para cuidarte en casa.", imagen: "🏠" },
  { id: 5, titulo: "Nuevo amigo en la escuela", categoria: "escuela", estado: "nuevo", descripcion: "Aprende a presentarte y pedir ayuda a un adulto.", imagen: "🎒" },
  { id: 6, titulo: "La emergencia familiar", categoria: "casa", estado: "nuevo", descripcion: "Conoce cuándo llamar por ayuda y qué decir.", imagen: "☎️" }
];

let stories = [];
let searchText = "";
let category = "todas";

const content = document.querySelector("#mainContent");
const title = document.querySelector("#pageTitle");
const dialog = document.querySelector("#detailDialog");

function savedProgress() {
  try { return JSON.parse(localStorage.getItem("navi-story-progress") || "{}"); }
  catch { return {}; }
}

function getState(story) {
  const progress = savedProgress()[story.id];
  if (progress === "completado") return "completado";
  if (progress === "en progreso") return "en progreso";
  return story.estado;
}

function isStoryTerminable(story) {
  if (!story) return false;
  const scenes = story.scenes || story.escenas;
  if (!Array.isArray(scenes) || scenes.length === 0) return false;

  const sceneMap = new Map();
  const finalIds = new Set();
  for (const s of scenes) {
    if (!s || s.id === undefined) return false;
    sceneMap.set(String(s.id), s);
    if (s.is_final || s.es_final || !s.choices || s.choices.length === 0) {
      finalIds.add(String(s.id));
    }
  }

  if (finalIds.size === 0) return false;

  const initialId = String(story.initial_scene_id !== undefined && story.initial_scene_id !== null ? story.initial_scene_id : scenes[0].id);
  if (!sceneMap.has(initialId)) return false;

  // Comprobar que todas las opciones apunten a escenas que existen
  for (const s of scenes) {
    const choices = s.choices || s.opciones || [];
    for (const c of choices) {
      const target = String(c.target !== undefined ? c.target : c.target_scene_id);
      if (!sceneMap.has(target)) return false; // Ruta rota
    }
  }

  // BFS alcanzabilidad de final
  const queue = [initialId];
  const visited = new Set([initialId]);
  let reachedFinal = false;
  while (queue.length > 0) {
    const cur = queue.shift();
    if (finalIds.has(cur)) { reachedFinal = true; break; }
    const s = sceneMap.get(cur);
    for (const c of (s.choices || s.opciones || [])) {
      const tgt = String(c.target !== undefined ? c.target : c.target_scene_id);
      if (sceneMap.has(tgt) && !visited.has(tgt)) {
        visited.add(tgt);
        queue.push(tgt);
      }
    }
  }
  return reachedFinal;
}

async function loadStories() {
  content.innerHTML = '<div class="loading">Cargando aventuras…</div>';
  try {
    const response = await fetch("../demo/cuentos-demo.json");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo");
    const rawStories = await response.json();
    stories = rawStories.filter(isStoryTerminable);
  } catch (_error) {
    stories = demoFallback;
  }
  renderLibrary();
}

function renderLibrary() {
  const categories = ["todas", ...new Set(stories.map(story => story.categoria))];
  const filtered = stories.filter(story => {
    const matchesName = story.titulo.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = category === "todas" || story.categoria === category;
    return matchesName && matchesCategory;
  });

  content.innerHTML = `
    <div class="filters">
      <input class="search" id="storySearch" type="search" placeholder="Buscar un cuento por nombre…" value="${searchText}" aria-label="Buscar cuento">
      <select class="category" id="categoryFilter" aria-label="Filtrar por categoría">
        ${categories.map(item => `<option value="${item}" ${item === category ? "selected" : ""}>${item === "todas" ? "Todas las categorías" : item[0].toUpperCase() + item.slice(1)}</option>`).join("")}
      </select>
    </div>
    ${filtered.length ? `<div class="grid">${filtered.map(renderCard).join("")}</div>` : '<div class="empty"><h2>Sin coincidencias</h2><p>Prueba otro nombre o categoría.</p></div>'}
  `;

  document.querySelector("#storySearch").addEventListener("input", event => { searchText = event.target.value; renderLibrary(); });
  document.querySelector("#categoryFilter").addEventListener("change", event => { category = event.target.value; renderLibrary(); });
  content.querySelectorAll("[data-detail]").forEach(button => button.addEventListener("click", () => openDetail(Number(button.dataset.detail))));
  content.querySelectorAll("[data-play]").forEach(button => button.addEventListener("click", () => playStory(Number(button.dataset.play))));
}

function renderCard(story) {
  const state = getState(story);
  const buttonText = state === "en progreso" ? "Continuar" : state === "completado" ? "Volver a jugar" : "Jugar";
  return `<article class="card">
    <div class="card-art" role="img" aria-label="Ilustración de ${story.titulo}">${story.imagen}</div>
    <div class="card-body">
      <div class="card-top"><span class="category-tag">${story.categoria}</span><span class="status ${state.replace(" ", "-")}">${state}</span></div>
      <h2>${story.titulo}</h2>
      <p class="description">${story.descripcion}</p>
      <div class="card-actions">
        <button class="primary" type="button" data-play="${story.id}">${buttonText}</button>
        <button class="secondary" type="button" data-detail="${story.id}" aria-label="Ver detalle de ${story.titulo}">Detalle</button>
      </div>
    </div>
  </article>`;
}

function openDetail(id) {
  const story = stories.find(item => item.id === id);
  if (!story) return;
  const state = getState(story);
  document.querySelector("#detailContent").innerHTML = `
    <p class="eyebrow">${story.categoria}</p><h2 id="detailTitle">${story.titulo}</h2>
    <div class="detail-art" role="img" aria-label="Ilustración">${story.imagen}</div>
    <p>${story.descripcion}</p>
    <span class="status ${state.replace(" ", "-")}">${state}</span>
    <div class="card-actions" style="margin-top:18px"><button class="primary" type="button" id="detailPlay">${state === "en progreso" ? "Continuar" : "Jugar"}</button></div>`;
  document.querySelector("#detailPlay").addEventListener("click", () => { dialog.close(); playStory(id); });
  dialog.showModal();
}

function playStory(id) {
  const progress = savedProgress();
  progress[id] = "en progreso";
  localStorage.setItem("navi-story-progress", JSON.stringify(progress));
  const story = stories.find(item => item.id === id);
  content.innerHTML = `<section class="panel"><p class="eyebrow">Aventura seleccionada</p><h2>${story.titulo}</h2><div class="detail-art">${story.imagen}</div><p>La partida quedó iniciada. El motor de cuentos debe continuar desde esta escena.</p><button class="primary" type="button" id="backLibrary">Volver a la biblioteca</button></section>`;
  document.querySelector("#backLibrary").addEventListener("click", renderLibrary);
}

function renderSimpleView(view) {
  title.textContent = view === "inicio" ? "Inicio" : view === "progreso" ? "Mi progreso" : "Mi perfil";
  content.innerHTML = `<section class="panel"><h2>${title.textContent}</h2><p>${view === "progreso" ? "El progreso se identifica a partir del perfil activo y se guarda localmente." : "Esta sección está lista para conectar con el módulo correspondiente."}</p><button class="primary" type="button" data-back>Ir a biblioteca</button></section>`;
  content.querySelector("[data-back]").addEventListener("click", () => { title.textContent = "Biblioteca de aventuras"; document.querySelector('[data-view="biblioteca"]').click(); });
}

document.querySelectorAll(".menu button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".menu button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const view = button.dataset.view;
  if (view === "biblioteca") { title.textContent = "Biblioteca de aventuras"; renderLibrary(); }
  else renderSimpleView(view);
}));

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
loadStories();
