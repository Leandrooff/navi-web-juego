# Pruebas de la misión completa

Verificación local sobre Windows con PHP 8.2.34, Laravel 12, MariaDB 10.4.32, Node 24 y Chrome. Fecha: 13 de octubre de 2026.

## Resultados

- Backend: **13 pruebas aprobadas, 613 aserciones**. Registro/login, roles, propietario, consentimiento, revocación, sesión, idempotencia, pistas, primer encuentro, tres finales y compatibilidad de partidas.
- Motor frontend: **5 pruebas aprobadas**. Grafo de 34 escenas y 53 elecciones; los **2.784 recorridos** terminan, con 12–21 elecciones por recorrido. Reanudación de consecuencias, rechazo de historial alterado, ilustraciones existentes, recuerdos completos y protagonismo infantil.
- Actualización del esquema original: aprobada en una base nueva aislada. Se conservan las seis escenas y once elecciones antiguas y se añaden 34 escenas y 53 elecciones. Se preservan cuenta, perfil, IDs, texto histórico, sesión y recuerdo de la decisión previa.
- Navegador: tres recorridos completos, apertura directa, primer encuentro, pista opcional, error de red, recarga con consecuencia pendiente, colección de tres finales, paginación de recuerdos, familia, aula, consentimiento, asignación y revocación.
- Accesibilidad: texto gradual/completo, letra grande, movimiento reducido, teclado, Escape, devolución de foco y móvil de 360 px.
- Seguridad web: POST sin CSRF rechazado, cookie HttpOnly, datos persistentes sin localStorage de juego.
- Voces: **cero solicitudes de audio**, sin controles de reproducción ficticios.
- Compilación de producción con Vite: correcta.

Las capturas y resultados del navegador se encuentran en evidencias-mision/. Los archivos browser-results.json y ux-results.json contienen las comprobaciones reales y su estado.

## Qué se probó y qué no

Los recorridos completos se verificaron tanto en el motor como mediante la API real. En navegador se recorrieron rutas representativas de los tres finales y de la recuperación tras decisiones inseguras; no se automatizaron las 2.784 combinaciones completas en el navegador.

Se usaron bases separadas navi_mission_test, navi_mission_browser y navi_mission_upgrade_test, con cuentas sintéticas. No se modificó ni se inspeccionó el contenido de ninguna base personal de la usuaria. No se publicó la aplicación en Internet ni se hicieron pruebas con niños reales.

## Repetir

Ver INSTALACION.md. Desde frontend: npm test, npm run build, npm run test:e2e y npm run test:ux. Desde backend, con base independiente terminada en _test: php artisan test. Para inspeccionar el grafo cargado: php scripts/verify-content.php.
