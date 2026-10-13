# Relaciones de la base de datos NAVI

## 1. Descripción general

La base de datos de NAVI está organizada en tres áreas principales: gestión de usuarios, contenido narrativo y seguimiento de interacción. El modelo utiliza MySQL 8 y mantiene sus relaciones mediante claves primarias, claves foráneas y restricciones de integridad.

Las tablas permiten gestionar tutores y perfiles infantiles, estructurar historias con escenas y elecciones, registrar sesiones y decisiones, almacenar puntajes, controlar logros y mantener el progreso de cada niño dentro de las misiones.

## 2. Convenciones

- `PK`: clave primaria que identifica de forma única un registro.
- `FK`: clave foránea que referencia un registro de otra tabla.
- `1:N`: un registro del origen puede relacionarse con varios del destino.
- `N:M`: varios registros de una tabla pueden relacionarse con varios de otra mediante una tabla intermedia.
- `UNIQUE`: evita duplicados en una columna o combinación de columnas.
- `ON DELETE CASCADE`: elimina registros hijos cuando se elimina el registro padre, si así está definido en `schema.sql`.
- `ON DELETE SET NULL`: conserva el registro hijo y establece la clave foránea en `NULL`, si la relación lo permite.

## 3. Tablas y relaciones

### 3.1 `roles`

- Propósito: almacenar los roles disponibles para los usuarios.
- PK: `id`.
- FK: no tiene.
- Relaciones principales: es referenciada por `users.role_id`.
- Cardinalidad: `roles` 1:N `users`.

### 3.2 `users`

- Propósito: almacenar las cuentas de usuario de NAVI.
- PK: `id`.
- FK: `role_id -> roles.id`.
- Relaciones principales: pertenece a un rol y puede actuar como tutor de varios perfiles infantiles.
- Cardinalidad: `roles` 1:N `users`; `users` 1:N `child_profiles`.

### 3.3 `child_profiles`

- Propósito: representar los perfiles infantiles asociados a un tutor.
- PK: `id`.
- FK: `tutor_id -> users.id`.
- Relaciones principales: se relaciona con sesiones, puntajes, logros y progreso.
- Cardinalidad: `users` 1:N `child_profiles`.
- Restricción importante: `age` debe mantenerse entre 6 y 10 años.

### 3.4 `categories`

- Propósito: clasificar las historias por temática.
- PK: `id`.
- FK: no tiene.
- Relaciones principales: una categoría puede contener varias historias.
- Cardinalidad: `categories` 1:N `stories`.

### 3.5 `stories`

- Propósito: representar las historias o misiones de NAVI.
- PK: `id`.
- FK: `category_id -> categories.id`; `initial_scene_id -> scenes.id`.
- Relaciones principales: pertenece a una categoría y contiene varias escenas.
- Cardinalidad: `categories` 1:N `stories`; `stories` 1:N `scenes`.
- Restricción importante: `initial_scene_id` identifica la escena inicial de la historia.

### 3.6 `scenes`

- Propósito: almacenar las escenas que componen cada historia.
- PK: `id`.
- FK: `story_id -> stories.id`.
- Relaciones principales: pertenece a una historia, puede contener varias elecciones y puede ser destino de otras elecciones.
- Cardinalidad: `stories` 1:N `scenes`; `scenes` 1:N `choices`.
- Restricción importante: `scene_type` admite `dialogue`, `preventive_decision`, `comprehension` y `final`.

### 3.7 `choices`

- Propósito: almacenar las opciones disponibles dentro de una escena.
- PK: `id`.
- FK: `scene_id -> scenes.id`; `target_scene_id -> scenes.id`.
- Relaciones principales: se presenta en una escena y puede dirigir a otra escena.
- Cardinalidad: `scenes` 1:N `choices`.
- Restricción importante: `choice_type` admite `preventive` y `comprehension`.
- Aclaración: las decisiones preventivas no se consideran automáticamente correctas o incorrectas.
- `is_expected_answer` se utiliza principalmente en actividades de comprensión.

### 3.8 `game_sessions`

- Propósito: registrar cada ejecución de una historia por un perfil infantil.
- PK: `id`.
- FK: `child_profile_id -> child_profiles.id`; `story_id -> stories.id`.
- Relaciones principales: vincula un niño con una historia y agrupa sus decisiones.
- Cardinalidad: `child_profiles` 1:N `game_sessions`; `stories` 1:N `game_sessions`.
- Restricción importante: `status` admite `in_progress`, `completed` y `abandoned`.

### 3.9 `decision_records`

- Propósito: registrar cada elección realizada durante una sesión.
- PK: `id`.
- FK: `game_session_id -> game_sessions.id`; `scene_id -> scenes.id`; `choice_id -> choices.id`.
- Relaciones principales: conecta una sesión con la escena y la opción seleccionada.
- Cardinalidad: `game_sessions` 1:N `decision_records`; `scenes` 1:N `decision_records`; `choices` 1:N `decision_records`.

### 3.10 `scores`

- Propósito: almacenar el puntaje consolidado de un perfil para una historia.
- PK: `id`.
- FK: `child_profile_id -> child_profiles.id`; `story_id -> stories.id`.
- Relaciones principales: vincula un perfil infantil con una historia.
- Cardinalidad: `child_profiles` 1:N `scores`; `stories` 1:N `scores`.
- Restricción importante: `UNIQUE (child_profile_id, story_id)`.

### 3.11 `achievements`

- Propósito: definir el catálogo de logros disponibles.
- PK: `id`.
- FK: no tiene.
- Relaciones principales: se relaciona con perfiles infantiles mediante `child_achievements`.
- Cardinalidad: participa en la relación N:M entre `child_profiles` y `achievements`.

### 3.12 `child_achievements`

- Propósito: registrar los logros desbloqueados por cada perfil infantil.
- PK: `id`.
- FK: `child_profile_id -> child_profiles.id`; `achievement_id -> achievements.id`.
- Relaciones principales: implementa la relación muchos a muchos entre perfiles y logros.
- Cardinalidad: `child_profiles` N:M `achievements`.
- Restricción importante: `UNIQUE (child_profile_id, achievement_id)`.

### 3.13 `progress`

- Propósito: mantener el estado persistente de avance de un perfil dentro de una historia.
- PK: `id`.
- FK: `child_profile_id -> child_profiles.id`; `story_id -> stories.id`; `last_scene_id -> scenes.id`.
- Relaciones principales: vincula un perfil, una historia y la última escena registrada.
- Cardinalidad: `child_profiles` 1:N `progress`; `stories` 1:N `progress`.
- Restricción importante: `UNIQUE (child_profile_id, story_id)`.
- `status` admite `locked`, `available`, `in_progress` y `completed`.

## 4. Flujo narrativo

El contenido narrativo sigue la relación:

`categories -> stories -> scenes -> choices -> scenes`

Una categoría contiene historias, cada historia contiene escenas y cada escena puede presentar una o varias elecciones. El campo `choices.target_scene_id` indica a qué escena debe continuar la navegación después de seleccionar una opción.

```text
stories
  |
  v
scenes
  |
  v
choices
  |
  +----> target_scene_id ----> scenes
```

Gracias a `target_scene_id`, diferentes elecciones pueden conducir a escenas distintas, permitiendo rutas narrativas ramificadas sin utilizar una secuencia lineal fija.

## 5. Sesiones y decisiones

El seguimiento de interacción utiliza la cadena:

`child_profiles -> game_sessions -> decision_records`

`game_sessions` registra qué perfil infantil ejecutó una historia, qué versión jugó y cuál fue el estado de la sesión. `decision_records` almacena cada selección realizada mediante `game_session_id`, `scene_id`, `choice_id` y `selected_at`.

El recorrido del niño puede reconstruirse consultando los registros de `decision_records` asociados a una sesión y ordenándolos por `selected_at`. Cada registro indica la escena donde ocurrió la decisión y la opción seleccionada.

## 6. Progreso, puntajes y logros

`progress` mantiene un único estado de avance por combinación de perfil infantil e historia mediante `UNIQUE (child_profile_id, story_id)`. También registra `last_scene_id`, `attempts` y las fechas relacionadas con el avance.

`scores` almacena el resultado consolidado mediante `score` y `stars`. Se relaciona únicamente con `child_profiles` y `stories`; no depende de una sesión específica.

`achievements` define los logros disponibles y `child_achievements` registra cuáles fueron desbloqueados por cada perfil. Esta tabla intermedia implementa la relación `child_profiles` N:M `achievements`.

## 7. Integridad referencial

Las claves foráneas mantienen la consistencia entre tablas y evitan referencias a registros inexistentes.

`ON DELETE CASCADE` elimina automáticamente los registros dependientes cuando se elimina su registro padre.

En el esquema actual se utiliza en:

- `scenes.story_id -> stories.id`
- `choices.scene_id -> scenes.id`
- `decision_records.game_session_id -> game_sessions.id`
- `child_achievements.child_profile_id -> child_profiles.id`
- `child_achievements.achievement_id -> achievements.id`
- `progress.child_profile_id -> child_profiles.id`
- `progress.story_id -> stories.id`

`ON DELETE SET NULL` conserva el registro hijo y elimina únicamente la referencia al registro padre.

En el esquema actual se utiliza en:

- `choices.target_scene_id -> scenes.id`
- `progress.last_scene_id -> scenes.id`
- `stories.initial_scene_id -> scenes.id`

Las restricciones `UNIQUE` evitan duplicados en:

- `roles.name`
- `users.email`
- `categories.name`
- `stories.story_order`
- `scenes(story_id, scene_order)`
- `choices(scene_id, choice_order)`
- `achievements.name`
- `scores(child_profile_id, story_id)`
- `child_achievements(child_profile_id, achievement_id)`
- `progress(child_profile_id, story_id)`

## 8. Resumen de cardinalidades

| Origen | Relación | Destino |
|---|---|---|
| `roles` | 1:N | `users` |
| `users` | 1:N | `child_profiles` |
| `categories` | 1:N | `stories` |
| `stories` | 1:N | `scenes` |
| `scenes` | 1:N | `choices` |
| `child_profiles` | 1:N | `game_sessions` |
| `stories` | 1:N | `game_sessions` |
| `game_sessions` | 1:N | `decision_records` |
| `scenes` | 1:N | `decision_records` |
| `choices` | 1:N | `decision_records` |
| `child_profiles` | 1:N | `scores` |
| `stories` | 1:N | `scores` |
| `child_profiles` | N:M | `achievements` |
| `child_profiles` | 1:N | `progress` |
| `stories` | 1:N | `progress` |

## 9. Resumen de claves foráneas

| Tabla | Campo FK | Referencia |
|---|---|---|
| `users` | `role_id` | `roles.id` |
| `child_profiles` | `tutor_id` | `users.id` |
| `stories` | `category_id` | `categories.id` |
| `stories` | `initial_scene_id` | `scenes.id` |
| `scenes` | `story_id` | `stories.id` |
| `choices` | `scene_id` | `scenes.id` |
| `choices` | `target_scene_id` | `scenes.id` |
| `game_sessions` | `child_profile_id` | `child_profiles.id` |
| `game_sessions` | `story_id` | `stories.id` |
| `decision_records` | `game_session_id` | `game_sessions.id` |
| `decision_records` | `scene_id` | `scenes.id` |
| `decision_records` | `choice_id` | `choices.id` |
| `scores` | `child_profile_id` | `child_profiles.id` |
| `scores` | `story_id` | `stories.id` |
| `child_achievements` | `child_profile_id` | `child_profiles.id` |
| `child_achievements` | `achievement_id` | `achievements.id` |
| `progress` | `child_profile_id` | `child_profiles.id` |
| `progress` | `story_id` | `stories.id` |
| `progress` | `last_scene_id` | `scenes.id` |

## 10. Modelo relacional simplificado

```text
roles
  |
  v
users
  |
  v
child_profiles
  |  | \----> game_sessions ----> decision_records
  |              |                    |       |
  |              v                    v       v
  |           stories <------------ scenes <- choices
  |              ^                    ^
  |              |                    |
  |         categories         target_scene_id
  |
  +----> scores ---------> stories
  |
  +----> progress -------> stories
  |         |
  |         +-----------> scenes
  |
  +----> child_achievements ----> achievements

stories.initial_scene_id --------------------> scenes
```

## 11. Conclusión

El modelo relacional de NAVI separa de forma clara la gestión de usuarios, el contenido narrativo y el seguimiento de interacción. Las claves foráneas permiten mantener consistencia entre las entidades y las restricciones `UNIQUE` evitan duplicados en datos consolidados.

La combinación de `scenes`, `choices` y `target_scene_id` permite construir rutas narrativas ramificadas, mientras que `game_sessions`, `decision_records`, `scores`, `progress` y `child_achievements` permiten registrar y consultar la actividad de cada perfil infantil.
