import { MotorCuentos } from "./motor-cuentos.js";

const motor = new MotorCuentos();
const elemento = (id) => document.getElementById(id);
const etiquetas = { bueno: "Final bueno", intermedio: "Final intermedio", malo: "Final para reforzar" };

function mostrarError(error) {
  elemento("error").textContent = error.message;
  elemento("error").hidden = false;
}

function ejecutar(accion) {
  try {
    accion();
    elemento("error").hidden = true;
    renderizar(true);
  } catch (error) {
    mostrarError(error);
  }
}

function renderizar(enfocar = false) {
  const estado = motor.obtenerEstado();
  const escena = estado.escenaActual;
  elemento("cuento-titulo").textContent = estado.titulo;
  elemento("escena-icono").textContent = escena.icono || "📖";
  elemento("escena-titulo").textContent = escena.titulo || estado.titulo;
  elemento("escena-texto").textContent = escena.texto;
  elemento("puntaje").textContent = estado.puntos;
  elemento("decisiones").textContent = `${estado.historial.length} ${estado.historial.length === 1 ? "decisión" : "decisiones"}`;
  elemento("fase").textContent = { jugando: "Elige tu camino", consecuencia: "Mira qué sucede", terminado: "Aventura completada" }[estado.fase];
  elemento("consecuencia").hidden = estado.fase !== "consecuencia";
  elemento("final").hidden = estado.fase !== "terminado";
  elemento("opciones").hidden = estado.fase !== "jugando";
  elemento("opciones").replaceChildren();
  if (estado.fase === "jugando") {
    for (const [index, opcion] of escena.opciones.entries()) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "choice";
      const numero = document.createElement("span");
      numero.className = "choice-number";
      numero.setAttribute("aria-hidden", "true");
      numero.textContent = index + 1;
      boton.append(numero, document.createTextNode(opcion.texto));
      boton.addEventListener("click", () => ejecutar(() => motor.elegirOpcion(opcion.id)));
      elemento("opciones").append(boton);
    }
  }
  if (estado.decisionActual) {
    elemento("eleccion-texto").textContent = estado.decisionActual.texto;
    elemento("consecuencia-texto").textContent = estado.decisionActual.consecuencia;
    elemento("puntos-eleccion").textContent = `+${estado.decisionActual.puntos} puntos · Total: ${estado.puntos}`;
  }
  if (estado.final) {
    elemento("final-tipo").textContent = etiquetas[estado.final.tipo];
    elemento("final-titulo").textContent = estado.final.titulo;
    elemento("final-texto").textContent = estado.final.texto;
  }
  elemento("historial-vacio").hidden = estado.historial.length > 0;
  elemento("historial").replaceChildren();
  for (const decision of estado.historial) {
    const item = document.createElement("li");
    const texto = document.createElement("p");
    const puntos = document.createElement("span");
    texto.textContent = decision.texto;
    puntos.textContent = `+${decision.puntos} puntos`;
    item.append(texto, puntos);
    elemento("historial").append(item);
  }
  if (enfocar) {
    const destino = estado.fase === "consecuencia" ? elemento("continuar") : elemento("escena-titulo");
    destino.focus({ preventScroll: true });
    elemento("escena-contenido").scrollIntoView({ block: "nearest" });
  }
  // Puntos de integración: los otros módulos pueden escuchar sin acceder al motor.
  document.dispatchEvent(new CustomEvent("navi:estado", { detail: motor.obtenerEstado() }));
  if (estado.fase === "terminado") {
    document.dispatchEvent(new CustomEvent("navi:final", { detail: motor.obtenerResultado() }));
  }
}

elemento("continuar").addEventListener("click", () => ejecutar(() => motor.continuar()));
elemento("reiniciar").addEventListener("click", () => ejecutar(() => motor.reiniciar()));
try {
  await motor.cargarDesdeURL(new URL("../demo/cuento-demo.json", import.meta.url));
  elemento("juego").hidden = false;
  renderizar();
} catch (error) {
  mostrarError(new Error(`${error.message} Ejecuta la demo con el servidor local indicado en README.md.`));
} finally {
  elemento("cargando").hidden = true;
}
