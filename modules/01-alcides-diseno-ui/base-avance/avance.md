# Avance · Módulo 01 · Diseño visual (entrega final)

## Resumen
Llevé la identidad visual de mi primera entrega (PR #5) al juego real en React, con un enfoque híbrido. La paleta NAVI se usa en acciones, estados, recompensa y foco, y se mantienen las superficies de pergamino y noche y las ilustraciones. Además corregí contraste, jerarquía, textos pequeños, controles táctiles, estado sin ilustración y diseño a 360 px y en escritorio, sin cambiar la lógica del juego.

## Cambios por pantalla
| Pantalla | Antes | Después | Archivo |
|---|---|---|---|
| Global | ~200 colores sueltos; botón principal verde (texto 3,0:1 en la zona clara); foco `#20a9c5` (2,3:1 sobre pergamino) | Tokens del PR #5 en `:root` con alias de los nombres anteriores; botón principal azul (6,19:1); foco de dos tonos, anillo `#16327e` y halo blanco (9,5:1 sobre pergamino y 12,5:1 sobre la noche) | `frontend/src/styles.css` |
| Global | Deshabilitado solo con `opacity:.65` y `cursor:wait` | Gris, texto a 6,65:1, **borde discontinuo** y `cursor:not-allowed` | `frontend/src/styles.css`, `frontend/src/game/journey.css` |
| Global | Aviso de error en tonos beige; 12 px en móvil; fijo abajo, tapaba "¡Comenzar aventura!" a 360 px | Estilos de mensaje positivo, advertencia y error con borde grueso; 14–15 px; arriba al centro, bajo la cabecera | `frontend/src/styles.css` |
| Global | Títulos en Georgia | `'Baloo 2', Georgia, serif` para títulos y `'Nunito', Trebuchet…` para texto, sin `@import` ni archivos de fuentes | `frontend/src/styles.css` |
| Bienvenida | Sin logo en móvil; caja de foco del navegador alrededor del título; textos de 8–11 px; acceso de adultos de 43 px | Logo visible en la cabecera móvil; sin caja de foco en encabezados enfocados por programa; textos ≥12 px; 44 px | `frontend/src/styles.css` |
| Selección de perfil | Edad en 3,83:1; hover solo con movimiento | Edad en `--muted` (5,34:1); hover con borde azul | `frontend/src/styles.css` |
| Mapa | Etiquetas de 7–10 px; imagen del cuaderno sin respaldo; "otras historias" sin alto mínimo | ≥12 px; fondo de respaldo si la imagen falla; 44 px | `frontend/src/styles.css`, `frontend/src/game/World.jsx` |
| HUD (mapa y escena) | Ajustes 33 × 33 px y perfil 34 px de alto a 360 px | 44 × 44 px y 44 px | `frontend/src/styles.css` |
| Escena | "Ver ilustración" flotante, se montaba con títulos largos; número de opción en 1,97:1; etiquetas de 8–11 px; líneas de ~110 caracteres en escritorio | "Ver ilustración" en el flujo del título; número en 5,59:1; ≥12 px; máximo 70 caracteres por línea; textos largos con ajuste y guiones | `frontend/src/game/journey.css`, `frontend/src/game/StoryStage.jsx` |
| Escena cinemática | Opciones verdes, distintas de las demás | Mismo lenguaje que el botón secundario (borde azul) | `frontend/src/game/journey.css` |
| Escena sin ilustración | Aviso en el 30 % superior, montado sobre el título en móvil | Aviso de advertencia con espacio propio entre el título y el diálogo, sobre un fondo de respaldo | `frontend/src/game/journey.css`, `frontend/src/game/StoryStage.jsx` |
| Consecuencia | Sello de recuerdo de 9–12 px | 12–14 px | `frontend/src/game/journey.css` |
| Final | "Guardar mi final" verde; "Regresar a mi mundo" como enlace; icono roto si la imagen no cargaba; etiquetas de 8–11 px | "Guardar mi final" en amarillo de recompensa; "Regresar a mi mundo" como botón secundario; fondo de respaldo sin icono roto; ≥12 px | `frontend/src/game/StoryStage.jsx`, `frontend/src/game/journey.css` |
| Cuaderno | Pestañas y paginación sin estado claro; paginación sin alto mínimo; fechas de 9–10 px | Pestañas y paginación en azul de acción, deshabilitado con borde discontinuo, 44 px, fechas de 12 px | `frontend/src/game/journey.css`, `frontend/src/styles.css` |

## Recursos trasladados del PR #5
- Paleta como tokens (`--navi-blue`, `--navi-blue-ink`, `--navi-blue-soft`, `--sun`, `--sun-soft`, `--mint`, `--amber`, `--coral`, `--violet`, `--ink`, `--muted`, `--line`, `--bg`, `--surface`), más una tinta legible por estado (`--mint-ink`, `--amber-ink`, `--coral-ink`, `--sun-ink`).
- Reglas de botón: principal azul, secundario blanco con borde azul, recompensa amarilla, coral solo para error. Nueva variante `.navi-button--reward`.
- Mensajes positivo, advertencia y error (`.notice--positive`, `.notice--warning`, `.notice--error`).
- Tipografías Baloo 2 y Nunito en la pila de fuentes, con respaldo del sistema.
- Valores ajustados por contraste: `--muted` de `#5e7183` a `#4f5f6e`; deshabilitado de 2,00:1 a 6,65:1; foco azul (2,02:1 sobre la escena) cambiado por foco de dos tonos.
- No trasladados: las pantallas HTML, `guia-estilos.html`, `.card-cuento` (el juego no tiene biblioteca de tarjetas), los iconos SVG (el juego ya dibuja los suyos en `GameUI.jsx`) y el `@import` de Google Fonts (envía datos a un tercero y no funciona sin conexión).

## Tamaños probados
Revisión en Chrome con Playwright, cuenta de prueba inventada (`@example.test`), viewport de 360 × 800 y de 1280 × 800.
- 360 px: sin scroll horizontal, sin controles de menos de 44 px, sin textos de menos de 12 px y sin recortes en bienvenida, perfil, prólogo, escena, consecuencia, final, cuaderno, mapa y capítulo.
- Escritorio: 1280 px, las mismas pantallas, sin solapamientos; diálogo limitado a 70 caracteres por línea.
- Letra grande: las opciones se leen completas, sin desplazamiento horizontal, a 360 px y a 1280 px.
- Movimiento reducido: la ilustración se ve (opacidad 1), sin animaciones ni partículas y con el texto completo; no se pierde información.
- Sin ilustración: escena normal y cinemática con aviso de advertencia que no toca el título ni el diálogo (12 px hasta el diálogo y 79–177 px desde el título); el final y el mapa muestran fondo de respaldo sin icono roto.

## Pruebas ejecutadas
| Comando | Resultado |
|---|---|
| `npm.cmd test` | ✅ 5 de 5 aprobadas |
| `npm.cmd run build` | ✅ Compila (CSS 60,85 kB, JS 285,52 kB) |
| `npm.cmd run test:e2e` | ❌ Falla por tiempo de espera: después de «Crear mi cuenta» el panel de familia no aparece en 5 s |
| `npm.cmd run test:ux` | ❌ Falla por tiempo de espera: al editar el perfil, el alias no se actualiza en 5 s |
| Copia de `e2e/adventure.mjs` con espera de 20 s (solo diagnóstico, no se modificó la prueba) | ✅ Pasa: 5 de 5 comprobaciones, sin errores de página |
| Copia de `e2e/accessibility.mjs` con espera de 20 s (solo diagnóstico, no se modificó la prueba) | ✅ Pasa: 9 de 9 comprobaciones, sin errores de página |

**Por qué fallan e2e y ux:** en el entorno local, el backend (`php artisan serve`) tarda alrededor de 1 s por petición, incluso en un 401 sin lógica, y atiende una petición a la vez. Registrarse o guardar un perfil encadena varias peticiones y supera los 5 s de espera por defecto de Playwright. Los dos fallos ocurren en pantallas de adultos que este módulo no cambió de forma funcional. Las copias idénticas de las pruebas, cambiando solo la espera a 20 s, pasan completas.

## Cómo probarlo
1. Seguir `docs/INSTALACION.md` (backend en http://127.0.0.1:8000 y frontend con `npm.cmd run dev`).
2. Abrir http://127.0.0.1:5173 (no alternar con localhost).
3. Crear una cuenta de familia con datos inventados y un perfil infantil; pulsar «Abrir su mundo».
4. Recorrer bienvenida → perfil → mapa → escena → consecuencia → final → cuaderno.
5. Repetir a 360 px (herramientas de desarrollo del navegador) y en escritorio (1280 px o más).
6. En «Ajustes» activar «Letras más grandes» y «Reducir movimiento» y repetir la escena.
7. Para ver el estado sin ilustración, bloquear `/art/park/*.png` en la pestaña Red del navegador y recargar.
8. Desde `frontend/`: `npm.cmd test` y `npm.cmd run build`.

## Coordinación pendiente
- Con Fabián:
  - `frontend/src/components/componentes.css` no se importa en ninguna parte; el juego toma `.navi-button` y `.navi-choice` solo de `styles.css`. Decidir si se importa o se elimina para no tener dos definiciones.
  - Uso `variant="reward"` y `variant="secondary"` de su `Button` sin modificar el componente.
  - `.eyebrow` sube a 12 px en `styles.css` y afecta un poco a los paneles de adultos.
  - No modifiqué `componentes.css`, `Button.jsx`, `ChoiceButton.jsx` ni `GameUI.jsx`.
- Con Álvaro:
  - El foco de dos tonos lleva `!important` para que ningún componente lo tape.
  - Quité el contorno de foco de los encabezados que `App.jsx` enfoca por programa (`tabindex=-1`); conviene revisarlo con lector de pantalla.
  - El movimiento reducido conserva la información (verificado); las reglas de `prefers-reduced-motion` y `.reduced-motion` siguen siendo las suyas.
  - Las pruebas `test:e2e` y `test:ux` necesitan más espera cuando el backend local es lento.

## Pendientes
- Tomar las capturas listadas en `modules/01-alcides-diseno-ui/capturas/README.md`.
- Repetir `test:e2e` y `test:ux` con un backend más rápido, o acordar con Álvaro y Alejandro una espera mayor en las pruebas.
- Revisar con lector de pantalla el `aria-label` de la barra de progreso de la escena (`.act-track`, un `div` sin rol), junto con Álvaro.
- Las barras de progreso tocan levemente el título largo en escritorio cuando cae en Georgia; es un detalle menor.
