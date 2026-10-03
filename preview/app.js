const modules = [
  {
    id: "01",
    name: "Diseno UI y experiencia de juego",
    owner: "Grupo de 2",
    goal: "Definir pantallas, estilo visual, botones, avatares y flujo infantil.",
    output: "Figma, capturas, paleta y mapa de pantallas."
  },
  {
    id: "02",
    name: "Frontend y motor de cuentos",
    owner: "Grupo de 2",
    goal: "Crear la parte jugable: escenas, opciones y avance segun decisiones.",
    output: "React, JSON demo, pantalla de biblioteca y juego."
  },
  {
    id: "03",
    name: "Backend API autenticacion y roles",
    owner: "Grupo de 2",
    goal: "Preparar login, roles, permisos y endpoints principales.",
    output: "Laravel API, Sanctum y pruebas en Postman."
  },
  {
    id: "04",
    name: "Panel administrador de contenidos",
    owner: "Grupo de 2",
    goal: "Permitir crear categorias, cuentos, escenas, opciones, imagenes y audios.",
    output: "Panel Filament y validacion de rutas completas."
  },
  {
    id: "05",
    name: "Base de datos y modelo",
    owner: "Grupo de 2",
    goal: "Definir tablas, relaciones, migraciones y datos de prueba.",
    output: "Diagrama ER, SQL y diccionario de datos."
  },
  {
    id: "06",
    name: "Reportes seguimiento y recomendaciones",
    owner: "Grupo de 2",
    goal: "Calcular puntos, estrellas, logros y recomendaciones.",
    output: "Reglas, reportes tutor/docente y datos demo."
  },
  {
    id: "07",
    name: "Integracion pruebas y documentacion",
    owner: "Leandrooff",
    goal: "Revisar avances, integrar modulos y preparar entrega final.",
    output: "Checklist, pruebas, documentacion y version final."
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

let currentScene = 0;
let score = 0;

function renderModules() {
  const grid = document.querySelector("#moduleGrid");
  grid.innerHTML = modules
    .map(
      (module) => `
        <article class="module-card">
          <span>Modulo ${module.id}</span>
          <h3>${module.name}</h3>
          <p>${module.goal}</p>
          <strong>Responsable: ${module.owner}</strong>
          <p>${module.output}</p>
        </article>
      `
    )
    .join("");
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
    .map(
      (choice, index) =>
        `<button class="choice" onclick="chooseOption(${index})">${choice.label}</button>`
    )
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

document.querySelector("#startGame").addEventListener("click", restartGame);
renderModules();
renderScene();

