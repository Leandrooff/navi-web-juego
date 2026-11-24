/** Motor independiente de la interfaz. Solo utiliza el formato de INSTRUCCIONES.md. */
const copiar = (valor) => structuredClone(valor);
const esTexto = (valor) => typeof valor === "string" && valor.trim().length > 0;

export function validarCuento(cuento) {
  const exigir = (condicion, mensaje) => {
    if (!condicion) throw new Error(`Cuento inválido: ${mensaje}`);
  };
  exigir(cuento && esTexto(cuento.id) && esTexto(cuento.titulo), "faltan id o título.");
  exigir(Array.isArray(cuento.escenas) && cuento.escenas.length > 0, "faltan escenas.");
  const escenas = new Map();
  const opciones = new Set();
  for (const escena of cuento.escenas) {
    exigir(escena && esTexto(escena.id) && esTexto(escena.texto), "cada escena necesita id y texto.");
    exigir(!escenas.has(escena.id), `escena repetida: ${escena.id}.`);
    exigir(Array.isArray(escena.opciones), `faltan opciones en ${escena.id}.`);
    exigir(typeof escena.esFinal === "boolean", `falta esFinal en ${escena.id}.`);
    exigir(escena.esFinal ? escena.opciones.length === 0 : escena.opciones.length > 0,
      `la escena ${escena.id} debe tener opciones o ser final sin opciones.`);
    escenas.set(escena.id, escena);
    for (const opcion of escena.opciones) {
      exigir(opcion && esTexto(opcion.id) && esTexto(opcion.texto), "cada opción necesita id y texto.");
      exigir(!opciones.has(opcion.id), `opción repetida: ${opcion.id}.`);
      opciones.add(opcion.id);
      exigir(Number.isSafeInteger(opcion.puntos) && opcion.puntos >= 0, `puntos inválidos en ${opcion.id}.`);
      exigir(esTexto(opcion.siguiente), `falta destino en ${opcion.id}.`);
      exigir(esTexto(opcion.consecuencia), `falta consecuencia en ${opcion.id}.`);
    }
  }
  exigir(escenas.has(cuento.escenaInicial), "la escena inicial no existe.");
  for (const escena of escenas.values()) {
    for (const opcion of escena.opciones) {
      exigir(escenas.has(opcion.siguiente), `destino inexistente: ${opcion.siguiente}.`);
    }
  }
  // Esta primera versión usa cuentos sin ciclos: evita sumar puntos indefinidamente.
  const visitadas = new Set();
  const activas = new Set();
  function visitar(id) {
    exigir(!activas.has(id), `hay un ciclo en ${id}.`);
    if (visitadas.has(id)) return;
    activas.add(id);
    for (const opcion of escenas.get(id).opciones) visitar(opcion.siguiente);
    activas.delete(id);
    visitadas.add(id);
  }
  visitar(cuento.escenaInicial);
  exigir(visitadas.size === escenas.size, "hay escenas que no se pueden alcanzar.");
  exigir(Array.isArray(cuento.finales) && cuento.finales.length === 3, "se requieren tres finales.");
  const tipos = new Set();
  const ids = new Set();
  for (const final of cuento.finales) {
    exigir(final && esTexto(final.id) && esTexto(final.titulo) && esTexto(final.texto), "final incompleto.");
    exigir(!ids.has(final.id), "hay identificadores de final repetidos.");
    ids.add(final.id);
    exigir(["bueno", "intermedio", "malo"].includes(final.tipo) && !tipos.has(final.tipo), "tipos de final inválidos o repetidos.");
    tipos.add(final.tipo);
    exigir(Number.isSafeInteger(final.minPuntos) && final.minPuntos >= 0, "mínimo de puntos inválido.");
    exigir(final.maxPuntos === null || (Number.isSafeInteger(final.maxPuntos) && final.maxPuntos >= final.minPuntos), "máximo de puntos inválido.");
  }
  const rangos = [...cuento.finales].sort((a, b) => a.minPuntos - b.minPuntos);
  exigir(rangos[0].minPuntos === 0 && rangos[2].maxPuntos === null, "los finales deben cubrir desde cero sin límite superior.");
  for (let i = 1; i < rangos.length; i += 1) {
    exigir(rangos[i - 1].maxPuntos !== null && rangos[i].minPuntos === rangos[i - 1].maxPuntos + 1,
      "los rangos de finales se superponen o dejan puntos sin final.");
  }
  return true;
}

export class MotorCuentos {
  #cuento = null;
  #escenas = new Map();
  #escenaId = null;
  #puntos = 0;
  #historial = [];
  #fase = "sin-cuento";
  #decision = null;
  #final = null;

  async cargarDesdeURL(url, { signal } = {}) {
    const respuesta = await fetch(url, { signal });
    if (!respuesta.ok) throw new Error(`No se pudo cargar el cuento (HTTP ${respuesta.status}).`);
    return this.cargarCuento(await respuesta.json());
  }

  cargarCuento(cuento) {
    validarCuento(cuento);
    this.#cuento = copiar(cuento);
    this.#escenas = new Map(this.#cuento.escenas.map((escena) => [escena.id, escena]));
    return this.reiniciar();
  }

  obtenerEstado() {
    return copiar({
      cuentoId: this.#cuento?.id ?? null,
      titulo: this.#cuento?.titulo ?? "",
      fase: this.#fase,
      escenaActual: this.#escenas.get(this.#escenaId) ?? null,
      puntos: this.#puntos,
      historial: this.#historial,
      decisionActual: this.#decision,
      final: this.#final
    });
  }

  elegirOpcion(opcionId) {
    if (this.#fase !== "jugando") throw new Error("Debes estar en una escena y continuar después de cada decisión.");
    const opcion = this.#escenas.get(this.#escenaId).opciones.find((item) => item.id === opcionId);
    if (!opcion) throw new Error("La opción no pertenece a la escena actual.");
    const total = this.#puntos + opcion.puntos;
    if (!Number.isSafeInteger(total)) throw new Error("El puntaje excede el límite permitido.");
    this.#puntos = total;
    this.#decision = {
      numero: this.#historial.length + 1,
      escenaId: this.#escenaId,
      opcionId: opcion.id,
      texto: opcion.texto,
      puntos: opcion.puntos,
      puntajeAcumulado: this.#puntos,
      siguiente: opcion.siguiente,
      consecuencia: opcion.consecuencia
    };
    this.#historial.push(copiar(this.#decision));
    this.#fase = "consecuencia";
    return this.obtenerEstado();
  }

  continuar() {
    if (this.#fase !== "consecuencia") throw new Error("Primero debes elegir una opción.");
    this.#escenaId = this.#decision.siguiente;
    this.#decision = null;
    this.#entrarEnEscena();
    return this.obtenerEstado();
  }

  reiniciar() {
    if (!this.#cuento) throw new Error("Primero debes cargar un cuento.");
    this.#escenaId = this.#cuento.escenaInicial;
    this.#puntos = 0;
    this.#historial = [];
    this.#decision = null;
    this.#final = null;
    this.#entrarEnEscena();
    return this.obtenerEstado();
  }

  #entrarEnEscena() {
    const escena = this.#escenas.get(this.#escenaId);
    this.#fase = escena.esFinal ? "terminado" : "jugando";
    if (escena.esFinal) {
      this.#final = this.#cuento.finales.find((final) =>
        this.#puntos >= final.minPuntos && (final.maxPuntos === null || this.#puntos <= final.maxPuntos));
    }
  }

  /** Paquete para Luis/Alejandra/Gabriela. Guardarlo en servidor corresponde a la API. */
  obtenerResultado() {
    if (this.#fase !== "terminado") throw new Error("El cuento todavía no terminó.");
    return copiar({
      cuentoId: this.#cuento.id,
      completado: true,
      puntos: this.#puntos,
      finalId: this.#final.id,
      tipoFinal: this.#final.tipo,
      historial: this.#historial
    });
  }
}
