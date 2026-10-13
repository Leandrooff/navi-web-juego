import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MotorCuentos, validarCuento } from "../src/motor-cuentos.js";

const cuento = JSON.parse(await readFile(new URL("../demo/cuento-demo.json", import.meta.url), "utf8"));
const nuevoMotor = () => {
  const motor = new MotorCuentos();
  motor.cargarCuento(cuento);
  return motor;
};
function jugar(opciones) {
  const motor = nuevoMotor();
  for (const opcion of opciones) {
    motor.elegirOpcion(opcion);
    motor.continuar();
  }
  return motor;
}

test("carga la escena inicial con cero puntos y sin historial", () => {
  const estado = nuevoMotor().obtenerEstado();
  assert.equal(estado.escenaActual.id, "inicio");
  assert.equal(estado.fase, "jugando");
  assert.equal(estado.puntos, 0);
  assert.deepEqual(estado.historial, []);
});

test("la decisión registra puntos y consecuencia una sola vez; después avanza por destino", () => {
  const motor = nuevoMotor();
  const estado = motor.elegirOpcion("inicio-esperar");
  assert.equal(estado.fase, "consecuencia");
  assert.equal(estado.puntos, 5);
  assert.equal(estado.historial[0].siguiente, "punto-visible");
  assert.equal(estado.historial[0].puntajeAcumulado, 5);
  assert.ok(estado.decisionActual.consecuencia);
  assert.throws(() => motor.elegirOpcion("inicio-esperar"));
  assert.equal(motor.obtenerEstado().puntos, 5);
  assert.equal(motor.continuar().escenaActual.id, "punto-visible");
});

test("todas las rutas terminan y los tres finales son alcanzables", () => {
  const escenas = new Map(cuento.escenas.map((escena) => [escena.id, escena]));
  const rutas = [];
  function recorrer(id, ruta = [], puntos = 0) {
    const escena = escenas.get(id);
    if (escena.esFinal) {
      rutas.push({ ruta, puntos });
      return;
    }
    for (const opcion of escena.opciones) recorrer(opcion.siguiente, [...ruta, opcion.id], puntos + opcion.puntos);
  }
  recorrer(cuento.escenaInicial);
  const finales = new Set();
  for (const { ruta, puntos } of rutas) {
    const motor = jugar(ruta);
    const resultado = motor.obtenerResultado();
    assert.equal(resultado.puntos, puntos);
    assert.equal(resultado.historial.length, ruta.length);
    assert.equal(motor.obtenerEstado().fase, "terminado");
    assert.equal(resultado.tipoFinal, puntos >= 20 ? "bueno" : puntos >= 10 ? "intermedio" : "malo");
    finales.add(resultado.tipoFinal);
  }
  assert.equal(Math.max(...rutas.map((ruta) => ruta.puntos)), 30);
  assert.deepEqual([...finales].sort(), ["bueno", "intermedio", "malo"]);
  console.log(`Verificadas ${rutas.length} rutas completas del cuento demo.`);
});

test("reiniciar limpia la partida tanto durante una consecuencia como al terminar", () => {
  const motor = nuevoMotor();
  motor.elegirOpcion("inicio-caseta");
  for (const instancia of [motor, jugar(["inicio-salir", "sendero-desconocido"])]) {
    const estado = instancia.reiniciar();
    assert.equal(estado.escenaActual.id, "inicio");
    assert.equal(estado.puntos, 0);
    assert.equal(estado.fase, "jugando");
    assert.equal(estado.decisionActual, null);
    assert.equal(estado.final, null);
    assert.deepEqual(estado.historial, []);
  }
});

test("los datos recibidos y devueltos no permiten modificar el estado del motor", () => {
  const datos = structuredClone(cuento);
  const motor = new MotorCuentos();
  motor.cargarCuento(datos);
  datos.escenas[0].opciones[0].puntos = 1000;
  const estado = motor.obtenerEstado();
  estado.escenaActual.opciones[0].puntos = 1000;
  motor.elegirOpcion("inicio-caseta");
  const elegido = motor.obtenerEstado();
  elegido.historial[0].puntos = 1000;
  assert.equal(motor.obtenerEstado().puntos, 10);
  assert.equal(motor.obtenerEstado().historial[0].puntos, 10);
});

test("rechaza opciones ajenas y acciones fuera de fase sin alterar la partida", () => {
  const motor = nuevoMotor();
  assert.throws(() => motor.continuar());
  assert.throws(() => motor.elegirOpcion("caseta-esperar"));
  assert.throws(() => motor.obtenerResultado());
  assert.equal(motor.obtenerEstado().historial.length, 0);
  const terminado = jugar(["inicio-salir", "sendero-desconocido"]);
  assert.throws(() => terminado.elegirOpcion("inicio-caseta"));
  assert.throws(() => terminado.continuar());
});

test("valida destinos, ciclos, escenas aisladas, identificadores, puntos y rangos", () => {
  const cambios = [
    (datos) => { datos.escenaInicial = "no-existe"; },
    (datos) => { datos.escenas[0].opciones[0].siguiente = "no-existe"; },
    (datos) => { datos.escenas[0].opciones[0].siguiente = "inicio"; },
    (datos) => { datos.escenas.push({ id: "aislada", texto: "Aislada", esFinal: true, opciones: [] }); },
    (datos) => { datos.escenas[1].id = "inicio"; },
    (datos) => { datos.escenas[0].opciones[1].id = "inicio-caseta"; },
    (datos) => { datos.escenas[0].opciones[0].puntos = -1; },
    (datos) => { datos.escenas[0].opciones[0].puntos = "10"; },
    (datos) => { datos.escenas[0].opciones = []; },
    (datos) => { datos.escenas[0].opciones[0].consecuencia = ""; },
    (datos) => { datos.finales[1].minPuntos = 9; },
    (datos) => { datos.finales[1].minPuntos = 11; },
    (datos) => { datos.finales[2].tipo = "malo"; }
  ];
  for (const cambiar of cambios) {
    const datos = structuredClone(cuento);
    cambiar(datos);
    assert.throws(() => validarCuento(datos), /Cuento inválido/);
  }
  const motor = nuevoMotor();
  assert.throws(() => motor.cargarCuento({}));
  assert.equal(motor.obtenerEstado().escenaActual.id, "inicio");
});

test("carga JSON por URL y comunica errores HTTP y JSON sin perder la partida", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(cuento), { status: 200 });
    const motor = new MotorCuentos();
    const estado = await motor.cargarDesdeURL("http://demo.local/cuento.json");
    assert.equal(estado.cuentoId, "cuento-parque");
    globalThis.fetch = async () => new Response("No encontrado", { status: 404 });
    await assert.rejects(motor.cargarDesdeURL("http://demo.local/no-existe.json"), /HTTP 404/);
    globalThis.fetch = async () => new Response("JSON incompleto", { status: 200 });
    await assert.rejects(motor.cargarDesdeURL("http://demo.local/roto.json"));
    assert.equal(motor.obtenerEstado().escenaActual.id, "inicio");
  } finally {
    globalThis.fetch = original;
  }
});
