const people = [
  {
    id: "persona-01",
    number: "01",
    name: "Alcides",
    title: "Diseno UI",
    folder: "modules/01-alcides-diseno-ui",
    goal: "Crear la base visual del juego: inicio, biblioteca, pantalla de cuento y resultado final.",
    deliverables: ["Pantalla de inicio", "Pantalla de juego", "Botones y tarjetas", "Colores y estados visuales"]
  },
  {
    id: "persona-02",
    number: "02",
    name: "Benjamin",
    title: "Biblioteca y navegacion",
    folder: "modules/02-benjamin-biblioteca-navegacion",
    goal: "Crear la biblioteca donde el nino elige aventuras, filtra categorias y entra al cuento.",
    deliverables: ["Biblioteca de cuentos", "Menu principal", "Filtro por categoria", "Boton iniciar cuento"]
  },
  {
    id: "persona-03",
    number: "03",
    name: "Brayan",
    title: "Motor de cuentos",
    folder: "modules/03-brayan-motor-cuentos",
    goal: "Crear el motor jugable: escenas, opciones, rutas, puntos, finales y reinicio.",
    deliverables: ["JSON de cuento demo", "Funcion avanzar escena", "Puntaje por opcion", "Finales por resultado"],
    game: true
  },
  {
    id: "persona-04",
    number: "04",
    name: "Fabian",
    title: "Componentes frontend",
    folder: "modules/04-fabian-componentes-frontend",
    goal: "Crear componentes frontend reutilizables para que las pantallas se armen mas rapido.",
    deliverables: ["Botones", "Tarjetas", "Barra de progreso", "Layout responsive"]
  },
  {
    id: "persona-05",
    number: "05",
    name: "Josué",
    title: "Login y roles",
    folder: "modules/05-josue-backend-auth-roles",
    goal: "Crear login, registro, cierre de sesion y roles para nino, tutor, educador y admin.",
    deliverables: ["Pantalla login", "Pantalla registro", "Roles", "Usuario activo"]
  },
  {
    id: "persona-06",
    number: "06",
    name: "Luis",
    title: "API de cuentos",
    folder: "modules/06-luis-api-cuentos",
    goal: "Crear funciones o endpoints para cuentos, escenas, decisiones, puntajes y recomendaciones.",
    deliverables: ["Listar cuentos", "Detalle de cuento", "Guardar decision", "Guardar puntaje"]
  },
  {
    id: "persona-07",
    number: "07",
    name: "Oscar",
    title: "Panel administrador",
    folder: "modules/07-oscar-panel-admin",
    goal: "Crear el panel para administrar cuentos, escenas, opciones y estados de publicacion.",
    deliverables: ["Lista de cuentos", "Formulario cuento", "Formulario escena", "Borrador/publicado"]
  },
  {
    id: "persona-08",
    number: "08",
    name: "Ruth Mariela",
    title: "Base de datos y datos",
    folder: "modules/08-ruth-mariela-base-datos",
    goal: "Crear la estructura de datos del juego con usuarios, cuentos, escenas, decisiones y logros.",
    deliverables: ["SQL o migraciones", "Datos demo", "Relaciones", "Tablas principales"]
  },
  {
    id: "persona-09",
    number: "09",
    name: "Ruth Serrano",
    title: "Reportes de progreso",
    folder: "modules/09-ruth-serrano-reportes",
    goal: "Crear dashboard de progreso para ver cuentos completados, decisiones, puntos y temas a reforzar.",
    deliverables: ["Dashboard tutor", "Historial cuentos", "Puntos y estrellas", "Recomendacion"]
  },
  {
    id: "persona-10",
    number: "10",
    name: "Alejandra Quiroga",
    title: "Logros y recomendaciones",
    folder: "modules/10-alejandra-logros-recomendaciones",
    goal: "Crear recompensas del juego: estrellas, logros, mensajes positivos y recomendaciones finales.",
    deliverables: ["Calculo de estrellas", "Pantalla logros", "Mensajes positivos", "Recomendaciones"]
  },
  {
    id: "persona-11",
    number: "11",
    name: "Alvaro Rosas",
    title: "Accesibilidad y audio",
    folder: "modules/11-alvaro-accesibilidad-audio",
    goal: "Crear opciones para que el juego sea facil de usar: audio, lectura, volumen y ayuda.",
    deliverables: ["Leer texto en voz alta", "Repetir escena", "Control volumen", "Modo alto contraste"]
  },
  {
    id: "persona-12",
    number: "12",
    name: "Gabriela Peñaranda",
    title: "Perfil y progreso",
    folder: "modules/12-gabriela-perfil-progreso",
    goal: "Crear la zona personal del nino con perfil, progreso, logros recientes y continuar aventura.",
    deliverables: ["Pantalla perfil", "Progreso personal", "Ultima aventura", "Datos de usuario"]
  },
  {
    id: "persona-13",
    number: "13",
    name: "Alejandro",
    title: "Integracion y fusion final",
    folder: "modules/13-alejandro-integracion",
    goal: "Fusionar lo que suban todos, corregir conflictos y dejar corriendo la version final.",
    deliverables: ["Revision de ramas", "Integracion final", "Control de pendientes", "Version estable"]
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
        <h3>Funciones o pantallas a subir</h3>
        <ul>${deliverables}</ul>
      </article>
      <article class="summary-panel">
        <h3>Como avanzar</h3>
        <ol>
          <li>Trabajar en una rama propia.</li>
          <li>Crear pantallas, funciones o datos dentro de su carpeta.</li>
          <li>Subir una explicacion corta en <code>base-avance/avance.md</code>.</li>
          <li>Alejandro fusionara todo al final.</li>
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
