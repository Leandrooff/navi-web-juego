# Segundo avance · Ruth Serrano · Reportes de progreso

Fecha: 13 de octubre de 2026.
Entrega preparada para la revisión del avance del 80 %. El porcentaje definitivo
corresponde a la evaluación de la docente; las conexiones reales siguen pendientes.

## Reportes disponibles

- Dashboard con porcentaje de avance, cuentos completados, puntaje y estrellas.
- Conteo de decisiones correctas e incorrectas.
- Historial con fecha, estado, puntaje y enlace al detalle.
- Detalle con situaciones, respuestas elegidas y puntos por decisión.
- Temas por reforzar derivados de las decisiones incorrectas.
- Recomendaciones para el tutor y lista de logros.
- Mensajes para niños sin actividad, cuentos sin decisiones y errores de carga.

## Diseño aplicado

Se reutiliza el sistema de diseño de Alcides (módulo 01, PR #5): azul NAVI,
estrellas amarillas, logros violetas, Nunito y Baloo 2, botones y tarjetas
redondeados. Los ajustes de reportes están separados en `src/reportes.css`.
Ambas pantallas tienen distribución adaptable y enlace para saltar al contenido.

## Filtros y navegación

- Selección de niño.
- Filtro por cuento: historial, temas y recomendaciones.
- Botón para volver a mostrar todos los cuentos.
- Al volver del detalle se conserva el niño y el filtro seleccionados.
- El resumen general siempre considera todos los cuentos del niño.

## Datos demo

En `demo/progreso-demo.json` hay tres niños ficticios:
Sofía (cuentos completados y un tema por reforzar), Mateo (un cuento completado
y otro en progreso sin decisiones) y Valentina (sin actividad ni logros).
Los datos originales de Sofía y el cuento completado de Mateo se conservan.

## Cómo verlo

Ejecutar `py -m http.server 5500` desde la raíz del repositorio y abrir:
http://localhost:5500/modules/09-ruth-serrano-reportes/src/dashboard-progreso.html

## Pruebas realizadas

Se comprobaron cálculos, filtros, navegación al detalle, retorno con selección,
niños sin actividad y errores de carga en Chromium. Se revisó el diseño en
escritorio y móvil. Los casos reproducibles están en `base-avance/pruebas.md`.

## Falta conectar

- API y base de datos reales: acordar ruta y formato de respuesta.
- Login, roles y autorización para consultar los niños asignados al tutor.
- Resultados del motor de cuentos y progreso del módulo 12.
- Estrellas, logros y recomendaciones del módulo 10.
- Navegación general y CSS compartido durante la integración final.
- Pruebas con los servicios integrados y revisión de la institución.

No se ha implementado autenticación ni guardado de resultados en este módulo.
