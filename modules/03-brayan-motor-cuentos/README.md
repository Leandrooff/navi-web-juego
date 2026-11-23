# Módulo 03 · Brayan · Motor de cuentos

Entrega funcional de la lógica de escenas, decisiones, consecuencias, puntaje, historial, tres finales y reinicio. Sigue `INSTRUCCIONES.md` y funciona sin dependencias ni backend.

## Ejecutar

Desde la carpeta raíz del proyecto:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Abrir <http://127.0.0.1:5173/modules/03-brayan-motor-cuentos/src/demo-juego.html>.
Si el puerto está ocupado, usar otro y cambiarlo también en la dirección. Es necesario servir por HTTP: abrir el HTML con doble clic puede bloquear la carga del JSON y los módulos JavaScript.

## Archivos

- `src/motor-cuentos.js`: clase reutilizable `MotorCuentos` y función `validarCuento`, independientes del DOM.
- `src/demo-juego.html`, `src/demo-juego.js`, `src/demo-juego.css`: pantalla jugable adaptable a móvil y computadora.
- `demo/cuento-demo.json`: seis escenas, once opciones y tres finales.
- `tests/motor-cuentos.test.mjs`: comprobación de todas las rutas y casos inválidos.
- `base-avance/avance.md`: resumen de entrega y pendientes.

## Cómo jugar

Elegir una opción muestra su consecuencia y suma puntos una sola vez. Pulsar **Continuar aventura** cambia al destino indicado por `siguiente`. El recorrido registra cada decisión. La escena `cierre` termina la partida y selecciona un final según el puntaje. **Reiniciar cuento** limpia el recorrido y el puntaje.

El historial se conserva en memoria durante la partida; recargar la página comienza de nuevo. La persistencia y la continuación de partidas guardadas quedan para la integración con Luis y Gabriela.

## Datos y reglas

Se utilizan `puntos` y `siguiente`, como indica `INSTRUCCIONES.md`; se reemplazan los nombres sugeridos anteriormente en este README (`puntaje` y `siguienteEscena`).

- Cuento: `id`, `titulo`, `escenaInicial`, `escenas`, `finales`.
- Escena: `id`, `texto`, `esFinal`, `opciones`; `titulo` e `icono` son opcionales.
- Opción: `id` único en el cuento, `texto`, `puntos` (entero no negativo), `siguiente` (id de escena), `consecuencia`.
- Escena terminal: `esFinal: true` y `opciones: []`.
- Final: `id`, `tipo` (`bueno`, `intermedio`, `malo`), `minPuntos`, `maxPuntos`, `titulo`, `texto`. `maxPuntos: null` significa sin límite superior.

Rangos de esta demo: 0–9 = malo, 10–19 = intermedio, 20 o más = bueno. El mensaje del final malo se muestra de forma positiva, como **Final para reforzar**. El máximo alcanzable es 30 puntos. Los rangos son reglas del cuento demo, no reglas aprobadas para todo el proyecto.

Antes de cargar se validan identificadores, destinos, escena inicial, consecuencias, puntos, escenas alcanzables y rangos de finales completos sin solapamientos. Esta versión admite grafos sin ciclos: evita partidas infinitas y acumular puntos repitiendo escenas.

Recorridos de ejemplo:

| Final | Opciones elegidas (id) | Puntos |
|---|---|---|
| Bueno | `inicio-caseta`, `caseta-esperar`, `reencuentro-acuerdo` | 25 |
| Intermedio | `inicio-caseta`, `caseta-salir`, `sendero-personal`, `reencuentro-sin-acuerdo` | 15 |
| Malo | `inicio-salir`, `sendero-desconocido` | 0 |

## Integración

La demo ya conecta JSON → motor → pantalla → historial/final. No modifica ni conecta automáticamente `preview/`, `frontend/`, el backend o los módulos de compañeros.

El motor se puede importar desde React o JavaScript:

```js
import { MotorCuentos } from "./motor-cuentos.js";

const motor = new MotorCuentos();
await motor.cargarDesdeURL("/ruta/cuento-demo.json");
// También acepta el objeto JSON que entregue Luis:
// motor.cargarCuento(cuento);
const consecuencia = motor.elegirOpcion("inicio-caseta");
const siguienteEscena = motor.continuar();
const estado = motor.obtenerEstado();
// Al terminar: motor.obtenerResultado();
// Para empezar de nuevo: motor.reiniciar();
```

`obtenerEstado()` devuelve `cuentoId`, `titulo`, `fase`, `escenaActual`, `puntos`, `historial`, `decisionActual` y `final`. Las fases son `sin-cuento`, `jugando`, `consecuencia` y `terminado`. Devuelve copias para que otros módulos no modifiquen el estado interno.

`obtenerResultado()` devuelve `cuentoId`, `completado`, `puntos`, `finalId`, `tipoFinal` e `historial`. Cada decisión incluye `numero`, `escenaId`, `opcionId`, `texto`, `puntos`, `puntajeAcumulado`, `siguiente` y `consecuencia`.

La pantalla demo emite eventos de documento `navi:estado` al actualizarse y `navi:final` al terminar; los datos están en `event.detail`. Estos eventos corresponden a la demo, no a la clase. Un frontend React puede usar directamente los valores devueltos por el motor para actualizar su estado.

Coordinación pendiente:

- Benjamin: seleccionar el cuento e iniciar el motor.
- Luis: suministrar el cuento y guardar decisiones/resultados, asociando el perfil infantil y la sesión; validar el puntaje en el backend real.
- Oscar y Ruth Mariela: convertir el contenido del administrador/base de datos al formato documentado. `esFinal` identifica la escena terminal; `finales` define el resultado narrativo por puntaje.
- Alejandra: consumir puntaje e historial para estrellas, logros y recomendaciones. El motor no calcula estrellas.
- Álvaro: recibir texto al cambiar de escena y controlar lectura/audio.
- Alcides y Fabian: adaptar apariencia y componentes sin modificar las reglas.
- Gabriela: mostrar progreso; la restauración de partidas todavía necesita contrato y función de reanudación.
- Alejandro: integrar las piezas y acordar el contrato final de API y datos.

## Verificar

Con Node.js 22.18 o posterior, desde la raíz:

```bash
node --test modules/03-brayan-motor-cuentos/tests/motor-cuentos.test.mjs
```

No se requiere instalar paquetes.
