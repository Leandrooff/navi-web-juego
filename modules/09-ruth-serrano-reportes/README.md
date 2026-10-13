# Módulo 09 · Ruth Serrano · Reportes de progreso

Pantallas para que tutores y educadores consulten el avance de los niños en NAVI.
Demostración para Casa de la Infancia. Todos los datos incluidos son ficticios.

## Cómo abrirlo

Desde la raíz del repositorio `navi-web-juego`, ejecutar:

```powershell
py -m http.server 5500
```

Abrir en el navegador:

http://localhost:5500/modules/09-ruth-serrano-reportes/src/dashboard-progreso.html

Mantener la terminal del servidor abierta. Se necesita servidor local para que
JavaScript pueda cargar el JSON; no abrir el HTML con doble clic.
El detalle se abre desde el enlace «Ver detalle» de cada cuento.

## Archivos

- `src/dashboard-progreso.html`: resumen, historial, filtros, temas y logros.
- `src/reporte-detalle.html`: decisiones y resultados de un cuento.
- `src/reportes.js`: carga de datos, cálculos y navegación.
- `src/estilos-ui.css`: copia del sistema visual de Alcides (módulo 01, PR #5).
- `src/reportes.css`: distribución y ajustes propios de las pantallas de reportes.
- `demo/progreso-demo.json`: niños, cuentos, decisiones y recomendaciones ficticias.
- `base-avance/avance.md`: funciones entregadas y conexiones pendientes.
- `base-avance/pruebas.md`: casos de prueba reproducibles.

## Diseño compartido

La base visual proviene del código de Alcides compartido para el PR #5:
`modules/01-alcides-diseno-ui/src/estilos-ui.css`.
Se conserva su autoría. Se carga antes de `reportes.css` para reutilizar colores,
tipografías, botones, paneles y logros. La copia dentro del módulo 09 permite probar
los reportes aunque la rama de diseño todavía no esté integrada.

No se modifican archivos de otros integrantes. Durante la integración, Alejandro
puede sustituir esta copia por una referencia al CSS común del proyecto.
Las fuentes de Google requieren Internet; si no hay conexión se usan las fuentes
de respaldo definidas por Alcides.

## Funcionamiento

El avance es el porcentaje de cuentos completados sobre cuentos asignados.
Completar un cuento y acertar sus decisiones son medidas diferentes: un cuento
puede estar completado aunque tenga decisiones incorrectas.

El resumen incluye todos los cuentos del niño. El filtro por cuento afecta al
historial, los temas por reforzar y las recomendaciones. Los logros y estrellas
se muestran desde los datos recibidos; este módulo no define sus reglas de entrega.

## Integración pendiente

En `reportes.js`, `RUTA_DATOS` apunta al JSON demo. Falta acordar con el equipo
la API y su respuesta, los permisos de tutor/educador y la relación entre tutor y
niños. También falta conectar decisiones del motor de cuentos, progreso y logros
reales. Este prototipo no autentica usuarios ni almacena nuevos resultados.
