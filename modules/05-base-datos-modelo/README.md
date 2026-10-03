# Modulo 05 Base de datos y modelo de informacion

## Objetivo

Disenar la estructura de datos completa del sistema NAVI Web Juego.

## Herramientas

- MySQL Workbench, Draw.io, dbdiagram.io o equivalente.
- Laravel migrations.
- SQL.

## Entregables

- Diagrama entidad relacion.
- Diccionario de datos.
- Migraciones propuestas.
- Datos de prueba.
- Explicacion de relaciones.

## Tablas minimas

- users
- roles
- child_profiles
- categories
- stories
- scenes
- choices
- game_sessions
- decision_records
- achievements
- recommendations

## Relaciones importantes

- Un tutor puede tener varios perfiles infantiles.
- Una categoria puede tener varios cuentos.
- Un cuento tiene varias escenas.
- Una escena puede tener varias opciones.
- Una opcion apunta a otra escena o a un final.
- Una sesion pertenece a un perfil infantil y a un cuento.
- Una decision pertenece a una sesion.

## Como trabajar independiente

No necesitan backend terminado. Deben entregar el modelo para que backend y panel puedan implementarlo.

