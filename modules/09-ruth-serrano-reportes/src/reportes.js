"use strict";

// Datos demo: reemplazar esta ruta por la API acordada durante la integración.
const RUTA_DATOS = "../demo/progreso-demo.json";

function informarError(mensaje) {
  mostrarTexto("mensaje-estado", mensaje);
  buscar("mensaje-estado").classList.add("es-error");
  buscar("mensaje-estado").setAttribute("role", "alert");
}

// Evita mostrar totales engañosos si el archivo tiene campos inválidos.
async function cargarDatos() {
  const respuesta = await fetch(RUTA_DATOS);
  if (!respuesta.ok) throw new Error("No se pudo cargar el archivo de datos.");
  const datos = await respuesta.json();
  if (!Array.isArray(datos.ninos)) throw new Error("Falta la lista de niños.");
  const ids = new Set();
  for (const nino of datos.ninos) {
    if (!nino || !Number.isInteger(nino.cuentosAsignados) || nino.cuentosAsignados < 0 ||
        typeof nino.nombre !== "string" || nino.id == null || ids.has(String(nino.id)) ||
        !Array.isArray(nino.logros) || !Array.isArray(nino.cuentosJugados)) {
      throw new Error("Datos de niño incompletos o inválidos.");
    }
    ids.add(String(nino.id));
    const cuentosIds = new Set();
    for (const cuento of nino.cuentosJugados) {
      if (!cuento || typeof cuento.id !== "string" || cuentosIds.has(cuento.id) ||
          typeof cuento.titulo !== "string" || typeof cuento.fecha !== "string" ||
          !["completado", "en-progreso"].includes(cuento.estado) ||
          ![cuento.puntaje, cuento.puntajeMaximo, cuento.estrellas].every(x => Number.isFinite(x) && x >= 0) ||
          cuento.puntaje > cuento.puntajeMaximo || cuento.estrellas > 3 ||
          !Array.isArray(cuento.decisiones) ||
          cuento.decisiones.some(d => !d || typeof d.correcta !== "boolean" || !Number.isFinite(d.puntos))) {
        throw new Error("Datos de cuento incompletos o inválidos.");
      }
      cuentosIds.add(cuento.id);
    }
  }
  return datos;
}

let ninos = [];

const buscar = (id) => document.getElementById(id);

function mostrarTexto(id, texto) {
  const elemento = buscar(id);
  if (elemento) elemento.textContent = texto;
}

// Crea elementos usando texto para mostrar los datos.
function crearElemento(etiqueta, texto, clase = "") {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}

function mostrarLista(id, valores, mensajeVacio) {
  const lista = buscar(id);
  lista.replaceChildren();

  const textos = valores.length ? valores : [mensajeVacio];

  textos.forEach((texto) => {
    lista.appendChild(crearElemento("li", texto, id === "lista-logros" && valores.length ? "logro" : ""));
  });
}

function obtenerNino() {
  return ninos.find(
    (nino) => String(nino.id) === buscar("selector-nino").value
  );
}

// Llena el filtro con los cuentos del niño seleccionado.
function cargarFiltroCuentos(nino) {
  const filtro = buscar("filtro-cuento");
  filtro.replaceChildren(new Option("Todos los cuentos", "todos"));

  nino.cuentosJugados.forEach((cuento) => {
    filtro.add(new Option(cuento.titulo, cuento.id));
  });
}

// El resumen general siempre muestra todos los cuentos del niño.
function mostrarResumen(nino) {
  const cuentos = nino.cuentosJugados;
  const completados = cuentos.filter(
    (cuento) => cuento.estado === "completado"
  ).length;

  const porcentaje = nino.cuentosAsignados > 0
    ? Math.min(
        100,
        Math.round((completados / nino.cuentosAsignados) * 100)
      )
    : 0;

  const puntaje = cuentos.reduce(
    (total, cuento) => total + cuento.puntaje,
    0
  );

  const estrellas = cuentos.reduce(
    (total, cuento) => total + cuento.estrellas,
    0
  );

  const decisiones = cuentos.flatMap((cuento) => cuento.decisiones);
  const correctas = decisiones.filter(
    (decision) => decision.correcta === true
  ).length;

  const incorrectas = decisiones.filter(
    (decision) => decision.correcta === false
  ).length;

  mostrarTexto("nombre-nino", `Resumen de ${nino.nombre}`);
  mostrarTexto("porcentaje-avance", `${porcentaje} %`);

  buscar("barra-progreso").value = porcentaje;
  buscar("barra-progreso").textContent = `${porcentaje} %`;

  mostrarTexto(
    "detalle-avance",
    `${completados} de ${nino.cuentosAsignados} cuentos asignados completados.`
  );

  mostrarTexto("cuentos-completados", completados);
  mostrarTexto("puntaje-total", puntaje);
  mostrarTexto("estrellas-total", estrellas);
  mostrarTexto("decisiones-correctas", correctas);
  mostrarTexto("decisiones-incorrectas", incorrectas);

  mostrarLista(
    "lista-logros",
    nino.logros,
    "Todavía no hay logros registrados."
  );
}

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Muestra el historial y crea un enlace al detalle de cada cuento.
function mostrarHistorial(nino, cuentos) {
  const tabla = buscar("historial-cuentos");
  tabla.replaceChildren();

  buscar("historial-vacio").hidden = cuentos.length > 0;

  cuentos.forEach((cuento) => {
    const fila = document.createElement("tr");

    const datos = [
      cuento.titulo,
      formatearFecha(cuento.fecha),
      cuento.estado === "completado" ? "Completado" : "En progreso",
      `${cuento.puntaje} / ${cuento.puntajeMaximo}`,
      cuento.estrellas
    ];

    datos.forEach((dato, indice) => {
      const celda = crearElemento("td", indice === 2 ? "" : dato);
      if (indice === 2) {
        celda.appendChild(crearElemento("span", dato, `estado-reporte ${cuento.estado}`));
      }
      fila.appendChild(celda);
    });

    const celdaEnlace = document.createElement("td");
    const enlace = crearElemento("a", "Ver detalle", "btn btn--secondary");

    const parametros = new URLSearchParams({
      nino: String(nino.id),
      cuento: cuento.id,
      filtro: buscar("filtro-cuento").value
    });

    enlace.href = `reporte-detalle.html?${parametros}`;
    enlace.setAttribute(
      "aria-label",
      `Ver detalle de ${cuento.titulo}`
    );

    celdaEnlace.appendChild(enlace);
    fila.appendChild(celdaEnlace);
    tabla.appendChild(fila);
  });
}

// El filtro se aplica al historial, temas y recomendaciones.
function actualizarReportes() {
  const nino = obtenerNino();
  if (!nino) return;

  const filtro = buscar("filtro-cuento").value;

  const cuentos = nino.cuentosJugados.filter(
    (cuento) => filtro === "todos" || cuento.id === filtro
  );

  mostrarResumen(nino);
  mostrarHistorial(nino, cuentos);

  const temas = cuentos
    .flatMap((cuento) => cuento.decisiones)
    .filter((decision) => decision.correcta === false)
    .map((decision) => decision.tema);

  mostrarLista(
    "temas-reforzar",
    [...new Set(temas)],
    cuentos.some(c => c.decisiones.length)
      ? "No se registran decisiones incorrectas en los cuentos seleccionados."
      : "Todavía no hay decisiones registradas para evaluar."
  );

  const recomendaciones = cuentos.map(
    (cuento) => `${cuento.titulo}: ${cuento.recomendacion}`
  );

  mostrarLista(
    "lista-recomendaciones",
    recomendaciones,
    "No hay recomendaciones para mostrar."
  );

  buscar("limpiar-filtro").disabled = filtro === "todos";
  const parametros = new URLSearchParams({ nino: String(nino.id), cuento: filtro });
  window.history.replaceState(null, "", `?${parametros}`);
  mostrarTexto("mensaje-estado", `Reportes de ${nino.nombre} cargados.`);
}

async function iniciarReportes() {
  try {
    const datos = await cargarDatos();

    if (!Array.isArray(datos.ninos) || datos.ninos.length === 0) {
      throw new Error("No hay niños en los datos de demostración.");
    }

    ninos = datos.ninos;

    const selector = buscar("selector-nino");
    selector.replaceChildren();

    ninos.forEach((nino) => {
      selector.add(new Option(nino.nombre, String(nino.id)));
    });

    selector.disabled = false;
    buscar("filtro-cuento").disabled = false;

    const parametros = new URLSearchParams(window.location.search);
    if (ninos.some(n => String(n.id) === parametros.get("nino"))) {
      selector.value = parametros.get("nino");
    }
    cargarFiltroCuentos(obtenerNino());
    const cuentoInicial = parametros.get("cuento");
    if ([...buscar("filtro-cuento").options].some(o => o.value === cuentoInicial)) {
      buscar("filtro-cuento").value = cuentoInicial;
    }
    actualizarReportes();
    buscar("limpiar-filtro").addEventListener("click", () => {
      buscar("filtro-cuento").value = "todos";
      actualizarReportes();
    });

    selector.addEventListener("change", () => {
      cargarFiltroCuentos(obtenerNino());
      actualizarReportes();
    });

    buscar("filtro-cuento").addEventListener(
      "change",
      actualizarReportes
    );
  } catch (error) {
    console.error(error);

    informarError("No se pudieron cargar los reportes. Comprueba el archivo de datos y abre la página con un servidor local.");

    buscar("selector-nino").disabled = true;
    buscar("filtro-cuento").disabled = true;
  }
}






// Carga el cuento indicado en el enlace "Ver detalle".
async function iniciarDetalle() {
  try {
    const parametros = new URLSearchParams(window.location.search);
    const idNino = parametros.get("nino");
    const idCuento = parametros.get("cuento");

    const datos = await cargarDatos();

    const nino = datos.ninos.find(
      (item) => String(item.id) === idNino
    );

    const cuento = nino?.cuentosJugados.find(
      (item) => item.id === idCuento
    );

    if (!nino || !cuento) {
      informarError("No se encontró el reporte. Vuelve a reportes y selecciona un cuento.");
      return;
    }

    const retorno = new URLSearchParams({ nino: String(nino.id), cuento: parametros.get("filtro") || "todos" });
    buscar("volver-reportes").href = `dashboard-progreso.html?${retorno}`;
    mostrarTexto("titulo-cuento", cuento.titulo);
    mostrarTexto("detalle-nino", nino.nombre);
    mostrarTexto("detalle-categoria", cuento.categoria);
    mostrarTexto("detalle-fecha", formatearFecha(cuento.fecha));

    mostrarTexto(
      "detalle-estado",
      cuento.estado === "completado" ? "Completado" : "En progreso"
    );

    mostrarTexto(
      "detalle-puntaje",
      `${cuento.puntaje} / ${cuento.puntajeMaximo}`
    );

    mostrarTexto("detalle-estrellas", cuento.estrellas);

    const correctas = cuento.decisiones.filter(
      (decision) => decision.correcta === true
    ).length;

    const incorrectas = cuento.decisiones.filter(
      (decision) => decision.correcta === false
    ).length;

    mostrarTexto("detalle-correctas", correctas);
    mostrarTexto("detalle-incorrectas", incorrectas);

    const lista = buscar("lista-decisiones");
    lista.replaceChildren();

    cuento.decisiones.forEach((decision, indice) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "decision";

      tarjeta.appendChild(
        crearElemento("h3", `Decisión ${indice + 1}`)
      );

      tarjeta.appendChild(
        crearElemento("p", `Situación: ${decision.situacion}`)
      );

      tarjeta.appendChild(
        crearElemento("p", `Respuesta elegida: ${decision.respuesta}`)
      );

      tarjeta.appendChild(
        crearElemento(
          "p",
          decision.correcta
            ? "Decisión correcta"
            : "Decisión incorrecta: tema por reforzar",
          decision.correcta ? "correcta" : "incorrecta"
        )
      );

      tarjeta.appendChild(
        crearElemento("p", `Puntos obtenidos: ${decision.puntos}`)
      );

      lista.appendChild(tarjeta);
    });

    if (cuento.decisiones.length === 0) {
      lista.appendChild(
        crearElemento("p", "Todavía no hay decisiones registradas.")
      );
    }

    const temas = cuento.decisiones
      .filter((decision) => decision.correcta === false)
      .map((decision) => decision.tema);

    mostrarLista(
      "temas-reforzar",
      [...new Set(temas)],
      cuento.decisiones.length
        ? "No se registran decisiones incorrectas en este cuento."
        : "Todavía no hay decisiones registradas para evaluar."
    );

    mostrarTexto("detalle-recomendacion", cuento.recomendacion);
    buscar("contenido-detalle").hidden = false;

    mostrarTexto(
      "mensaje-estado",
      `Reporte de ${nino.nombre} cargado.`
    );
  } catch (error) {
    console.error(error);

    informarError("No se pudo cargar el detalle. Comprueba el archivo de datos y abre la página con un servidor local.");
  }
}

// Ejecuta la función correspondiente a la pantalla abierta.
if (buscar("selector-nino")) {
  iniciarReportes();
} else if (buscar("contenido-detalle")) {
  iniciarDetalle();
}