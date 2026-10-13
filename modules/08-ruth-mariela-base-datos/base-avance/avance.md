# Avance del módulo 08 - Base de datos

## Responsable

Ruth Mariela

## Objetivo del módulo

Diseñar y documentar la estructura de datos de NAVI para gestionar usuarios, perfiles infantiles, historias, escenas, decisiones, puntajes, logros y progreso.

## Tablas creadas

Actualmente se definieron las siguientes tablas en `src/schema.sql`:

- `roles`
- `users`
- `child_profiles`
- `categories`
- `stories`
- `scenes`
- `choices`
- `game_sessions`
- `decision_records`
- `scores`
- `achievements`
- `child_achievements`
- `progress`

## Archivos desarrollados

- `src/schema.sql`: contiene la estructura de la base de datos para MySQL 8.
- `src/relaciones.md`: documenta las relaciones, cardinalidades, claves foráneas y restricciones principales.
- `demo/datos-demo.sql`: contiene datos de prueba para validar el modelo relacional.
- `demo/datos-demo.json`: contiene una representación JSON de los datos demo para integración con frontend o API.

## Relación entre historias, escenas y opciones

La estructura narrativa principal se organiza de la siguiente forma:

`categories -> stories -> scenes -> choices -> scenes`

Cada historia pertenece a una categoría y contiene varias escenas.

Cada escena puede presentar una o varias opciones mediante `choices.scene_id`.

El campo `choices.target_scene_id` permite indicar la siguiente escena a la que conduce una elección, haciendo posible construir rutas narrativas ramificadas.

## Seguimiento de interacción

El recorrido de cada perfil infantil se registra mediante:

`child_profiles -> game_sessions -> decision_records`

`game_sessions` identifica la ejecución de una historia y `decision_records` almacena las opciones seleccionadas dentro de esa sesión.

El avance persistente se mantiene mediante `progress`, mientras que `scores` almacena puntajes y estrellas consolidados.

Los logros se gestionan mediante `achievements` y la tabla intermedia `child_achievements`.

## Estado actual

Completado:

- Estructura inicial de la base de datos.
- Relaciones entre tablas.
- Claves primarias y foráneas.
- Restricciones `UNIQUE`.
- Reglas `ON DELETE CASCADE` y `ON DELETE SET NULL`.
- Control de edad de perfiles infantiles entre 6 y 10 años.
- Tipos de escenas y opciones.
- Registro de sesiones y decisiones.
- Progreso, puntajes y logros.
- Datos demo en SQL.
- Datos demo en JSON.
- Documentación de relaciones.

- Esquema ejecutado correctamente en MariaDB 10.4.32 mediante XAMPP.
- Datos demo insertados sin errores.
- Verificadas las 13 tablas del modelo.
- Probadas relaciones mediante consultas JOIN.
- Validado el recorrido narrativo con `decision_records` y `target_scene_id`.
- Validado el progreso de los perfiles infantiles.
- Validada la relación de logros mediante `child_achievements`.

## Pendiente

- Ejecutar y validar `schema.sql` en MySQL 8.
- Ejecutar `datos-demo.sql` sobre una base vacía.
- Verificar consultas y relaciones con los datos de prueba.
- Ajustar el modelo si durante la integración con backend se requiere algún cambio.
- Coordinar con los módulos de API, autenticación y progreso para validar compatibilidad.

- Realizar una validación final en MySQL 8.
- Ajustar el modelo si durante la integración con backend se requieren cambios.

## Observación

El modelo actual constituye una base funcional para el avance del proyecto. Puede ampliarse durante la integración sin modificar innecesariamente las relaciones principales ya definidas.