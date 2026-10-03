const menuItems = [
  ["inicio", "Inicio general"],
  ["modulo-01", "01 Diseno UI"],
  ["modulo-02", "02 Juego frontend"],
  ["modulo-03", "03 Backend API"],
  ["modulo-04", "04 Panel admin"],
  ["modulo-05", "05 Base de datos"],
  ["modulo-06", "06 Reportes"],
  ["modulo-07", "07 Integracion"]
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
  menu.innerHTML = menuItems
    .map(
      ([id, label]) =>
        `<button class="${id === currentScreen ? "active" : ""}" data-go="${id}">${label}</button>`
    )
    .join("");
}

function showScreen(id) {
  currentScreen = id;
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${id}`);
  });
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

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-go]");
  if (!trigger) return;
  showScreen(trigger.dataset.go);
});

renderMenu();
renderScene();
