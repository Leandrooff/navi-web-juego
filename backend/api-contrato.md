# Contrato HTTP de NAVI

Prefijo: `/api`. Todas las respuestas de éxito usan `data`, salvo `204 No Content`.
Los ejemplos son sintéticos; los identificadores y textos reales dependen del contenido
publicado. Las rutas privadas requieren una cuenta activa y una cookie de sesión. El
frontend envía `Accept: application/json`, credenciales same-origin y un token obtenido
de `GET /api/csrf` en cada escritura.

## Historias públicas

### `GET /api/stories`

Devuelve historias `published` ordenadas por `story_order`, con su categoría. No incluye
el grafo de escenas.

```json
{
  "data": [
    {
      "id": 7,
      "slug": "me-perdi-en-el-parque",
      "title": "Me perdí en el parque",
      "status": "published",
      "version": 2
    }
  ]
}
```

### `GET /api/stories/{id}?version={n}`

Devuelve una historia publicada y sus escenas de esa revisión, ordenadas por
`scene_order`, con sus opciones ordenadas por `choice_order`. Si se omite `version`,
se entrega la revisión publicada actual. NAVI debe pedir la revisión que devuelve
la sesión (`session.story_version`) para restaurar el grafo original.

Cada escena incluye `id`, `scene_key`, `title`, `body`, `image_path`, `audio_path`,
`is_final`, `presentation`, `act`, `hint`, `speaker_id`, `locale`, `ending_key`,
`takeaway`, `caption` y `choices`. Cada opción incluye `id`, `label`,
`target_scene_id`, `consequence` y sus datos de diálogo.

```json
{
  "data": {
    "id": 7,
    "version": 2,
    "initial_scene_id": 41,
    "scenes": [
      {
        "id": 41,
        "scene_key": "entrada",
        "title": "La entrada del parque",
        "body": "NAVI te acompaña a mirar el mapa.",
        "is_final": false,
        "presentation": "cinematic",
        "act": 1,
        "hint": null,
        "choices": [
          {
            "id": 92,
            "label": "Mirar el mapa con NAVI",
            "target_scene_id": 42,
            "consequence": "Ahora conocen juntos el camino."
          }
        ]
      }
    ]
  }
}
```

Historia no publicada, revisión inexistente o sin escenas: `404`. Una revisión con
formato inválido: `422`.

## Sesiones y decisiones

Todas estas rutas requieren autenticación. La persona tutora propietaria puede leer y
modificar la partida. Un docente solo puede leer perfiles/sesiones con consentimiento
activo; no puede iniciar, decidir, avanzar, pedir pistas ni cerrar una partida.

### `POST /api/game-sessions`

Inicia una sesión o recupera la sesión activa de ese perfil e historia. El cliente genera
un UUID por intento y lo conserva para reintentar la misma solicitud.

```json
{
  "child_profile_id": 12,
  "story_id": 7,
  "request_key": "f70e5e9f-420e-4e6d-93b1-efdc88d52905"
}
```

Respuesta `201` al crear; `200` al recuperar/repetir. `data` contiene `session`,
`pending`, `marks` y `decisions`. La sesión conserva `story_version`,
`current_scene_id` y `pending_decision_id`. Si hay una consecuencia sin confirmar,
`pending` contiene la misma decisión para reproducirla.

### `GET /api/game-sessions/{id}`

Recupera el mismo sobre (`session`, `pending`, `marks`, `decisions`) para la persona
tutora propietaria o docente con consentimiento activo.

### `POST /api/game-sessions/{id}/decisions`

Registra una elección de la escena actual. `request_key` debe ser un UUID nuevo por
decisión y se reutiliza sin cambios al reintentar.

```json
{
  "scene_id": 41,
  "choice_id": 92,
  "request_key": "db27d823-972b-43f4-9b76-04e6d76de6d9"
}
```

La respuesta confirma la decisión en `pending` y guarda una huella en `marks`. El cliente
no cambia de escena hasta confirmar su consecuencia.

### `POST /api/game-sessions/{id}/continue`

Confirma que se presentó la consecuencia de la decisión pendiente y avanza a su destino.
Repetir la confirmación no vuelve a crear progreso.

```json
{ "decision_id": 155 }
```

### `POST /api/game-sessions/{id}/hint`

Guarda una sola solicitud de pista para la escena actual. Una pista no disponible produce
`422`; una escena que no sea la vigente produce `409`.

```json
{ "scene_id": 42 }
```

### `POST /api/game-sessions/{id}/finish`

Solo termina una sesión activa situada en un final de la revisión guardada y sin una
consecuencia pendiente. Es idempotente: la primera respuesta devuelve
`data.session` y `data.new_star`; posteriores devuelven `new_star: false`.

## Errores

El servidor responde JSON. Los formularios reciben `422` con mensajes por campo; el
cliente muestra el primer mensaje de `errors`:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "request_key": ["El campo request key debe ser un UUID válido."]
  }
}
```

| HTTP | Significado y tratamiento del frontend |
| --- | --- |
| `401` | Sesión adulta no autenticada o vencida; el cliente emite `navi:session-expired`. |
| `403` | Cuenta autenticada sin el rol o permiso necesario; se muestra `message`. |
| `404` | Historia/revisión/perfil/sesión u opción no disponible o no pertenece a la persona usuaria. |
| `409` | Conflicto de estado: escena no vigente, decisión pendiente, destino de otra revisión o sesión cerrada; recuperar la sesión antes de reintentar. |
| `419` | Token CSRF/cookie vencido; el cliente descarta el token y permite volver a intentar. |
| `422` | Validación de campos o regla de negocio, por ejemplo una pista inexistente o un destino inválido. |
| `429` | Límite de solicitudes; esperar antes de intentar de nuevo. |
| `0` (solo cliente) | Error de red; la aventura permanece guardada y se puede reintentar con la misma clave idempotente. |

En una respuesta JSON de error, `message` es el mensaje general y `errors` aparece cuando
hay errores de validación.

## Otras rutas reales

- `GET /api/csrf`: inicia/renueva la cookie de sesión y devuelve `{ "token": "..." }`.
- `POST /api/auth/register`, `POST /api/auth/login`: acceso público con límite de intentos.
- `GET /api/auth/me`, `POST /api/auth/logout`, `PUT /api/auth/password`: autenticación.
- `GET|POST /api/child-profiles`, `PUT /api/child-profiles/{id}`: perfiles de la tutora.
- `GET /api/child-profiles/{id}/progress`, `/history`, `/memories`, `/assignments`:
  progreso, recorridos, recuerdos paginados y tareas.
- `GET|POST /api/classrooms`, `GET /api/classrooms/{id}`,
  `POST /api/classrooms/{id}/rotate-code`, `POST /api/classrooms/{id}/assignments`,
  `DELETE /api/classrooms/{id}/assignments/{assignment}`: aulas y tareas docentes.
- `POST /api/enrollments/lookup`, `POST /api/enrollments`,
  `GET /api/child-profiles/{id}/enrollments`, `DELETE /api/enrollments/{id}`:
  búsqueda, consentimiento, consulta y revocación de matrícula.

Estas rutas requieren sesión salvo `csrf`, registro, login e historias públicas. Sus
validaciones y permisos se aplican en los controladores definidos en `routes/api.php`.
No se deben usar clientes API históricos archivados.

Consulta también [docs/ARQUITECTURA.md](../docs/ARQUITECTURA.md) para reglas narrativas,
privacidad y persistencia.
