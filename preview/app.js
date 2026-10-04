const people = [
  {
    id: "persona-01",
    number: "01",
    name: "Alcides",
    title: "Diseno UI",
    folder: "modules/01-alcides-diseno-ui",
    goal: "Definir identidad visual, colores, pantallas base, botones, tarjetas y experiencia infantil.",
    deliverables: ["Paleta de colores", "Bocetos o Figma", "Componentes visuales", "Capturas de pantallas"]
  },
  {
    id: "persona-02",
    number: "02",
    name: "Benjamin",
    title: "Biblioteca y navegacion",
    folder: "modules/02-benjamin-biblioteca-navegacion",
    goal: "Crear la vista de biblioteca, navegacion principal y seleccion de aventuras.",
    deliverables: ["Pantalla de biblioteca", "Menu de navegacion", "Estados de cuento", "Capturas o codigo"]
  },
  {
    id: "persona-03",
    number: "03",
    name: "Brayan",
    title: "Motor de cuentos",
    folder: "modules/03-brayan-motor-cuentos",
    goal: "Crear la logica de escenas, opciones, rutas, puntaje y finales.",
    deliverables: ["JSON de cuento demo", "Rutas entre escenas", "Puntaje por opcion", "Final del cuento"],
    game: true
  },
  {
    id: "persona-04",
    number: "04",
    name: "Fabian",
    title: "Componentes frontend",
    folder: "modules/04-fabian-componentes-frontend",
    goal: "Crear componentes reutilizables y asegurar que la interfaz funcione bien en diferentes pantallas.",
    deliverables: ["Botones", "Tarjetas", "Layout responsive", "Componentes de escena"]
  },
  {
    id: "persona-05",
    number: "05",
    name: "Josué",
    title: "Backend autenticacion y roles",
    folder: "modules/05-josue-backend-auth-roles",
    goal: "Preparar login, usuarios, roles, permisos y endpoints base.",
    deliverables: ["Login", "Roles", "Middleware", "Pruebas en Postman"]
  },
  {
    id: "persona-06",
    number: "06",
    name: "Luis",
    title: "API de cuentos",
    folder: "modules/06-luis-api-cuentos",
    goal: "Definir endpoints de cuentos, escenas, opciones y registro de decisiones.",
    deliverables: ["GET /api/stories", "GET /api/stories/{id}", "POST decisiones", "JSON de respuesta"]
  },
  {
    id: "persona-07",
    number: "07",
    name: "Oscar",
    title: "Panel administrador",
    folder: "modules/07-oscar-panel-admin",
    goal: "Crear la base del panel para gestionar categorias, cuentos, escenas y opciones.",
    deliverables: ["CRUD categorias", "CRUD cuentos", "CRUD escenas", "Estado borrador/publicado"]
  },
  {
    id: "persona-08",
    number: "08",
    name: "Ruth Mariela",
    title: "Base de datos",
    folder: "modules/08-ruth-mariela-base-datos",
    goal: "Disenar tablas, relaciones, diccionario de datos y datos de prueba.",
    deliverables: ["Diagrama ER", "Diccionario de datos", "SQL o migraciones", "Datos de prueba"]
  },
  {
    id: "persona-09",
    number: "09",
    name: "Ruth Serrano",
    title: "Reportes",
    folder: "modules/09-ruth-serrano-reportes",
    goal: "Crear reportes para tutor y educador sobre progreso, decisiones y temas a reforzar.",
    deliverables: ["Reporte individual", "Reporte grupal", "Temas a reforzar", "Mockups"]
  },
  {
    id: "persona-10",
    number: "10",
    name: "Alejandra Quiroga",
    title: "Logros y recomendaciones",
    folder: "modules/10-alejandra-logros-recomendaciones",
    goal: "Definir estrellas, logros, mensajes positivos y recomendaciones.",
    deliverables: ["Reglas de estrellas", "Lista de logros", "Mensajes positivos", "Recomendaciones"]
  },
  {
    id: "persona-11",
    number: "11",
    name: "Alvaro Rosas",
    title: "QA y pruebas",
    folder: "modules/11-alvaro-qa-pruebas",
    goal: "Probar modulos, crear checklist, registrar bugs y validar avances.",
    deliverables: ["Checklist", "Bugs encontrados", "Capturas", "Observaciones"]
  },
  {
    id: "persona-12",
    number: "12",
    name: "Gabriela Peñaranda",
    title: "Documentacion",
    folder: "modules/12-gabriela-documentacion",
    goal: "Preparar manuales, guias, capturas explicadas y apoyo de presentacion.",
    deliverables: ["Manual de instalacion", "Manual de usuario", "Capturas explicadas", "Guion de presentacion"]
  },
  {
    id: "persona-13",
    number: "13",
    name: "Alejandro",
    title: "Integracion y coordinacion",
    folder: "modules/13-alejandro-integracion",
    goal: "Coordinar, revisar Pull Requests, integrar avances y preparar la version final.",
    deliverables: ["Revision de ramas", "Integracion", "Control de pendientes", "Version final"]
  }
];

const story = [
  {
    art: "Parque",
    title: "Me perdi en el parque",
    text: "Estas jugando y de pronto no ves a tu tutor. Hay varias personas cerca. Que deberias hacer?",
    choices: [
      { label: "Buscar a un policia o personal del parque", points: 10 },
      { label: "Irme con una persona que no conozco", points: 0 },
      { label: "Quedarme en un punto visible y pedir ayuda", points: 10 }
    ]
  },
  {
    art: "Ayuda",
    title: "Elegir un adulto seguro",
    text: "Ves una caseta de informacion y una persona con uniforme. Tambien hay un desconocido ofreciendo ayudarte.",
    choices: [
      { label: "Ir a la caseta de informacion", points: 10 },
      { label: "Seguir al desconocido", points: 0 },
      { label: "Llorar y correr sin mirar", points: 3 }
    ]
  },
  {
    art: "Final",
    title: "Buen trabajo",
    text: "Encontraste ayuda segura. Recuerda buscar adultos identificados y quedarte en lugares visibles.",
    choices: []
  }
];

let currentScreen = "inicio";
let currentScene = 0;
let score = 0;

function renderMenu() {
  const menu = document.querySelector("#menu");
  menu.innerHTML = [
    `<button class="${currentScreen === "inicio" ? "active" : ""}" data-go="inicio">Inicio general</button>`,
    ...people.map(
      (person) =>
        `<button class="${person.id === currentScreen ? "active" : ""}" data-go="${person.id}">${person.number} ${person.name}</button>`
    )
  ].join("");
}

function renderPersonGrid() {
  const grid = document.querySelector("#personGrid");
  grid.innerHTML = people
    .map(
      (person) => `
        <article class="person-card" data-go="${person.id}">
          <span>${person.number}</span>
          <h3>${person.name}</h3>
          <p>${person.title}</p>
        </article>
      `
    )
    .join("");
}

function renderPersonScreen(person) {
  const target = document.querySelector("#personScreen");
  const deliverables = person.deliverables.map((item) => `<li>${item}</li>`).join("");
  target.innerHTML = `
    <div class="screen-title">
      <p class="eyebrow">Modulo ${person.number}</p>
      <h2>${person.name}: ${person.title}</h2>
      <p>${person.goal}</p>
    </div>
    <div class="home-layout">
      <article class="summary-panel">
        <h3>Carpeta asignada</h3>
        <code>${person.folder}</code>
        <h3>Entregables</h3>
        <ul>${deliverables}</ul>
      </article>
      <article class="summary-panel">
        <h3>Como avanzar</h3>
        <ol>
          <li>Trabajar en una rama propia.</li>
          <li>Subir avances en <code>base-avance/</code>.</li>
          <li>Explicar como revisar el trabajo.</li>
          <li>Abrir Pull Request cuando este listo.</li>
        </ol>
      </article>
    </div>
    ${person.game ? renderGameMarkup() : ""}
    ${person.id === "persona-13" ? renderIntegrationMarkup() : ""}
  `;
  if (person.game) renderScene();
}

function renderGameMarkup() {
  return `
    <div class="game-layout extra-block">
      <div class="library-panel">
        <h3>Biblioteca demo</h3>
        <button class="story-button active-story">Me perdi en el parque</button>
        <button class="story-button">Alguien ofrece un regalo</button>
        <button class="story-button">Cruzar con cuidado</button>
      </div>
      <div class="game-card">
        <div class="scene-art" id="sceneArt">Parque</div>
        <p class="scene-tag" id="sceneTag">Escena 1 de 3</p>
        <h3 id="sceneTitle">Me perdi en el parque</h3>
        <p id="sceneText"></p>
        <div class="choice-list" id="choiceList"></div>
        <div class="score-row">
          <span id="scoreLabel">Puntos: 0</span>
          <span id="starsLabel">Estrellas: 0</span>
        </div>
      </div>
    </div>
  `;
}

function renderIntegrationMarkup() {
  return `
    <div class="qa-board extra-block">
      ${people
        .filter((person) => person.id !== "persona-13")
        .map((person) => `<article><strong>${person.name}</strong><span>${person.title}</span></article>`)
        .join("")}
    </div>
  `;
}

function showScreen(id) {
  currentScreen = id;
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === (id === "inicio" ? "screen-inicio" : "screen-persona"));
  });
  if (id !== "inicio") {
    const person = people.find((item) => item.id === id);
    renderPersonScreen(person);
  }
  renderMenu();
}

function renderScene() {
  const scene = story[currentScene];
  document.querySelector("#sceneArt").textContent = scene.art;
  document.querySelector("#sceneTag").textContent = `Escena ${currentScene + 1} de ${story.length}`;
  document.querySelector("#sceneTitle").textContent = scene.title;
  document.querySelector("#sceneText").textContent = scene.text;
  document.querySelector("#scoreLabel").textContent = `Puntos: ${score}`;
  document.querySelector("#starsLabel").textContent = `Estrellas: ${Math.min(3, Math.floor(score / 10))}`;

  const choiceList = document.querySelector("#choiceList");
  if (!scene.choices.length) {
    choiceList.innerHTML = `<button class="choice" onclick="restartGame()">Jugar de nuevo</button>`;
    return;
  }

  choiceList.innerHTML = scene.choices
    .map((choice, index) => `<button class="choice" onclick="chooseOption(${index})">${choice.label}</button>`)
    .join("");
}

function chooseOption(index) {
  score += story[currentScene].choices[index].points;
  currentScene += 1;
  renderScene();
}

function restartGame() {
  currentScene = 0;
  score = 0;
  renderScene();
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-go]");
  if (!trigger) return;
  showScreen(trigger.dataset.go);
});

renderMenu();
renderPersonGrid();
