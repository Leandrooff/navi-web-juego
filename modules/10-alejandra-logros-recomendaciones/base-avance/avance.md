# Alejandra Quiroga · Logros y recomendaciones

## Demo de pantallas

La demo de `src/` tiene `resultado.html` (puntaje, estrellas y recomendación final) y `logros.html` (colección y progreso de insignias). Al completar el resultado, guarda el estado de demo en `localStorage`; si hay logros nuevos, muestra una tarjeta modal con su nombre, icono y descripción. Para la sesión demo usa `demo/logros-demo.json`; el cuento puede reemplazarla mediante `sessionStorage.navi_sesion_actual`.

Las estrellas de la demo se calculan por puntaje: de 0 a 9 da 1, de 10 a 19 da 2 y desde 20 da 3. Un puntaje negativo también queda en el mínimo de 1 estrella.

Los logros de demo son: Primer paso (completar un cuento), Estrella brillante (obtener 3 estrellas), Decisión segura (5 decisiones seguras), Pido ayuda (pedir ayuda una vez), Pequeño lector (3 cuentos) y Coleccionista de estrellas (6 estrellas). El catálogo y sus metas están en `demo/logros-demo.json`.

Las recomendaciones de demo reconocen decisiones seguras y ofrecen una sugerencia práctica para reforzar las categorías perderse, desconocidos, cruzar la calle y emergencia. Cierran con un mensaje positivo para seguir practicando o probar otro cuento. No califican al niño como bueno o malo.

## Reglas persistentes verificadas

| Reconocimiento | Evento que lo activa | Dónde se ve | Quién puede verlo |
| --- | --- | --- | --- |
| Primer encuentro | El niño confirma una opción en la escena `encuentro`; `child_achievements` conserva su primer `unlocked_at` | Cuaderno, colección de insignias | El perfil infantil y adultos autorizados del perfil |
| La luz que nos reunió | Cierra el final `farol` | Cuaderno, colección de insignias y hoja de finales | El perfil infantil y adultos autorizados |
| Mi voz encontró un camino | Cierra el final `voz` | Cuaderno, colección de insignias y hoja de finales | El perfil infantil y adultos autorizados |
| Siempre puedo cambiar de rumbo | Cierra el final `regreso` | Cuaderno, colección de insignias y hoja de finales | El perfil infantil y adultos autorizados |
| Primera luz | Completa la primera aventura | Cuaderno, colección de insignias | El perfil infantil y adultos autorizados |
| Huella de participación | Cada decisión confirmada guarda una fila `learning_records` con explicación; inicio, pista y cierre también tienen evento idempotente | Pestaña «Mis huellas» del cuaderno; historial API por partida | El perfil infantil y adultos autorizados |
| Finales descubiertos | Cada cierre persiste `ending_key`; el resumen agrupa los finales por clave | Cuaderno, «Finales que descubrí» | El perfil infantil y adultos autorizados |

La estrella se conserva como una por historia, aunque haya más recorridos. Los cierres repetidos no duplican ni la huella `finish` ni los premios. Las insignias usan inserción idempotente por perfil e insignia; las decisiones se guardan una vez por partida y petición.

## Recomendación conectada al progreso

`GET /api/child-profiles/{id}/progress` devuelve `recommendation` desde las sesiones y finales guardados. Sin recorridos completados propone empezar con NAVI; con uno o dos finales invita a probar otra ruta; tras los tres finales invita a conversar sobre el punto de encuentro y pedir ayuda en un lugar público. El cuaderno infantil muestra el mismo título y texto. No clasifica elecciones como buenas o malas ni inventa puntajes.

Este objeto de progreso es la fuente común para perfil (Gabriela) e informe (Ruth). El informe por partida ya puede usar `history` y sus `memories`; al conectarlo, debe leer `recommendation` del mismo endpoint para que ambos resúmenes coincidan. El acceso está limitado por `Access::child` al tutor/docente con permiso del perfil y al propio ámbito de sesión autenticada.

## Evidencia y reproducción

Prueba automatizada: desde `backend`, ejecutar `php artisan test --filter=JourneyTest` con la base MariaDB de pruebas configurada en `.env.testing`. Recorre las rutas farol, voz y regreso; valida la insignia del primer encuentro, las decisiones como huellas, los tres finales, el reintento de cierre, las recargas del resumen, una nueva vuelta y la estrella única. También comprueba el estado inicial sin historial.

Resultado esperado en la prueba: tres finales distintos y cinco insignias (Primer encuentro, tres finales y Primera luz); cada recorrido tiene una huella de cierre y sus decisiones; después de la nueva vuelta hay cuatro intentos sin sumar estrellas ni duplicar insignias. `recommendation.key` cambia de `start` a `discover-ending` y luego a `practice-plan`. La prueba se amplió en `backend/tests/Feature/JourneyTest.php`. En este entorno no se pudo observar el resultado de PHPUnit porque falta `backend/vendor/autoload.php`; `php -l` sí confirmó sintaxis válida en el controlador y la prueba. No registrar el resultado esperado como ejecución aprobada.

Dependencia: migraciones aplicadas y `NaviStorySeeder` sembrado. No se añadió otra implementación de logros; se completó la recomendación que faltaba en la API y el cuaderno. Las pantallas demo heredadas siguen siendo demostraciones aisladas y no son la fuente persistente de la aplicación.
