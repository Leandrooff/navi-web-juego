const fallbackProfile = {
  nombre: "Sofia Navi",
  rol: "nino",
  avatar: "S",
  edad: 8,
  estrellas: 8,
  cuentosCompletados: 3,
  cuentosEnProgreso: 1,
  ultimaAventura: "Me perdi en el parque",
  logrosRecientes: [
    {
      nombre: "Ayuda segura",
      descripcion: "Eligio pedir ayuda a una persona identificada."
    },
    {
      nombre: "Buena decision",
      descripcion: "Completo una aventura sin perder el hilo."
    },
    {
      nombre: "Exploradora constante",
      descripcion: "Volvio a practicar una historia ya terminada."
    }
  ],
  configuracion: {
    sonido: true,
    tamanoTexto: "normal",
    contraste: "normal"
  },
  actividad: [
    {
      titulo: "Termino una aventura",
      detalle: "Completo Me perdi en el parque con 3 estrellas."
    },
    {
      titulo: "Desbloqueo un logro",
      detalle: "Gano Ayuda segura por elegir una opcion correcta."
    },
    {
      titulo: "Tiene una aventura pendiente",
      detalle: "Puede continuar Alguien ofrece un regalo."
    }
  ],
  cuentos: [
    {
      titulo: "Me perdi en el parque",
      estado: "completado",
      progreso: 100,
      estrellas: 3
    },
    {
      titulo: "Cruzar con cuidado",
      estado: "completado",
      progreso: 100,
      estrellas: 3
    },
    {
      titulo: "Cuidar mis datos",
      estado: "completado",
      progreso: 100,
      estrellas: 2
    },
    {
      titulo: "Alguien ofrece un regalo",
      estado: "en progreso",
      progreso: 45,
      estrellas: 0
    }
  ]
};

const state = {
  profile: fallbackProfile
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function createCard(className, title, text) {
  const item = document.createElement("article");
  item.className = className;
  item.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  return item;
}

async function loadProfile() {
  try {
    const response = await fetch("../demo/perfil-demo.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar el perfil demo");
    state.profile = await response.json();
  } catch {
    state.profile = fallbackProfile;
  }
}

function renderSharedProfile() {
  const profile = state.profile;
  setText("avatar", profile.avatar || profile.nombre.charAt(0));
  setText("profileName", profile.nombre);
  setText("profileRole", profile.rol);
  setText("completedStories", profile.cuentosCompletados);
  setText("totalStars", profile.estrellas);
  setText("lastAdventure", profile.ultimaAventura);
}

function renderAchievements() {
  const list = document.getElementById("achievementList");
  if (!list) return;

  list.innerHTML = "";
  state.profile.logrosRecientes.forEach((logro) => {
    list.appendChild(createCard("achievement", logro.nombre, logro.descripcion));
  });
}

function renderSettings() {
  const settings = state.profile.configuracion;
  setText("soundButton", `Sonido: ${settings.sonido ? "activado" : "desactivado"}`);
  setText("textButton", `Texto: ${settings.tamanoTexto}`);
  setText("contrastButton", `Contraste: ${settings.contraste}`);
}

function setupSettingsButtons() {
  const settings = state.profile.configuracion;
  const soundButton = document.getElementById("soundButton");
  const textButton = document.getElementById("textButton");
  const contrastButton = document.getElementById("contrastButton");

  if (soundButton) {
    soundButton.addEventListener("click", () => {
      settings.sonido = !settings.sonido;
      renderSettings();
    });
  }

  if (textButton) {
    textButton.addEventListener("click", () => {
      settings.tamanoTexto = settings.tamanoTexto === "normal" ? "grande" : "normal";
      renderSettings();
    });
  }

  if (contrastButton) {
    contrastButton.addEventListener("click", () => {
      settings.contraste = settings.contraste === "normal" ? "alto" : "normal";
      renderSettings();
    });
  }
}

function setupContinueButton() {
  const button = document.getElementById("continueButton");
  const message = document.getElementById("continueMessage");
  if (!button || !message) return;

  button.addEventListener("click", () => {
    message.textContent = `Demo: continuaria "${state.profile.ultimaAventura}".`;
  });
}

function renderProgressPage() {
  const profile = state.profile;
  setText("progressName", `Progreso de ${profile.nombre}`);
  setText("progressCompleted", profile.cuentosCompletados);
  setText("progressStars", profile.estrellas);
  setText("progressActive", profile.cuentosEnProgreso);

  const storyList = document.getElementById("storyList");
  if (storyList) {
    storyList.innerHTML = "";
    profile.cuentos.forEach((cuento) => {
      const item = document.createElement("article");
      item.className = "story-item";
      item.innerHTML = `
        <strong>${cuento.titulo}</strong>
        <p>Estado: ${cuento.estado} · Estrellas: ${cuento.estrellas}</p>
        <div class="progress-bar" aria-label="Progreso ${cuento.progreso}%">
          <span style="width: ${cuento.progreso}%"></span>
        </div>
      `;
      storyList.appendChild(item);
    });
  }

  const activityList = document.getElementById("activityList");
  if (activityList) {
    activityList.innerHTML = "";
    profile.actividad.forEach((actividad) => {
      activityList.appendChild(createCard("activity-item", actividad.titulo, actividad.detalle));
    });
  }
}

async function init() {
  await loadProfile();

  if (document.body.dataset.page === "perfil") {
    renderSharedProfile();
    renderAchievements();
    renderSettings();
    setupSettingsButtons();
    setupContinueButton();
  }

  if (document.body.dataset.page === "progreso") {
    renderProgressPage();
  }
}

init();
