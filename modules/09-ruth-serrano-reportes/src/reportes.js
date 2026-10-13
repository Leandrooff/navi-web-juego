"use strict";

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
    lista.appendChild(crearElemento("li", texto));
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

    datos.forEach((dato) => {
      fila.appendChild(crearElemento("td", dato));
    });

    const celdaEnlace = document.createElement("td");
    const enlace = crearElemento("a", "Ver detalle", "boton");

    const parametros = new URLSearchParams({
      nino: String(nino.id),
      cuento: cuento.id
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
    "No se registran decisiones incorrectas en los cuentos seleccionados."
  );

  const recomendaciones = cuentos.map(
    (cuento) => `${cuento.titulo}: ${cuento.recomendacion}`
  );

  mostrarLista(
    "lista-recomendaciones",
    recomendaciones,
    "No hay recomendaciones para mostrar."
  );

  mostrarTexto(
    "mensaje-estado",
    `Reportes de ${nino.nombre} cargados.`
  );
}

async function iniciarReportes() {
  try {
    const respuesta = await fetch("../demo/progreso-demo.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el archivo de datos.");
    }

    const datos = await respuesta.json();

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

    cargarFiltroCuentos(obtenerNino());
    actualizarReportes();

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

    mostrarTexto(
      "mensaje-estado",
      "No se pudieron cargar los reportes. Comprueba el JSON y abre la página con un servidor local."
    );

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

    const respuesta = await fetch("../demo/progreso-demo.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el archivo de datos.");
    }

    const datos = await respuesta.json();

    const nino = datos.ninos.find(
      (item) => String(item.id) === idNino
    );

    const cuento = nino?.cuentosJugados.find(
      (item) => item.id === idCuento
    );

    if (!nino || !cuento) {
      mostrarTexto(
        "mensaje-estado",
        "No se encontró el reporte. Vuelve a reportes y selecciona un cuento."
      );
      return;
    }

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
      "No se registran decisiones incorrectas en este cuento."
    );

    mostrarTexto("detalle-recomendacion", cuento.recomendacion);
    buscar("contenido-detalle").hidden = false;

    mostrarTexto(
      "mensaje-estado",
      `Reporte de ${nino.nombre} cargado.`
    );
  } catch (error) {
    console.error(error);

    mostrarTexto(
      "mensaje-estado",
      "No se pudo cargar el detalle. Comprueba el JSON y abre la página con un servidor local."
    );
  }
}

// Ejecuta la función correspondiente a la pantalla abierta.
if (buscar("selector-nino")) {
  iniciarReportes();
} else if (buscar("contenido-detalle")) {
  iniciarDetalle();
}