# Arquitectura de la misión

## Flujo infantil

App carga la cuenta y las historias publicadas. Al abrir un perfil sin la insignia Primer encuentro, inicia o recupera su sesión del parque y entra directamente en el prólogo. El prólogo, el encuentro y la aventura pertenecen al mismo grafo persistido. No hay salto a un menú entre encuentro y parque.

StoryStage interpreta escenas con presentation=cinematic o story, act, hint, speaker_id, ending_key y takeaway. NAVI narra únicamente las tres escenas iniciales. Las demás usan narrador; las pistas se abren a petición del niño. El personaje permanece como acompañante visual.

La capa de ilustración incluye precarga de destinos, fundido, movimiento suave, indicador de carga y recuperación de error. Una imagen precargada se reconoce también cuando llega desde caché. Las opciones de accesibilidad permiten texto completo, letra grande y movimiento reducido. Los diálogos gestionan foco y Escape. El cuaderno admite teclado con flechas, Inicio y Fin.

## Guardado y seguridad

MariaDB es la fuente de verdad. localStorage contiene únicamente preferencias visuales. Las rutas privadas usan cookies HttpOnly, CSRF y las comprobaciones de propietario/consentimiento existentes.

Cada mutación de partida bloquea primero el perfil y después la sesión dentro de una transacción. Una decisión comprueba sesión activa, escena actual, opción perteneciente a ella y destino dentro de la misma historia y revisión. request_key hace idempotente un reintento. El cliente no avanza hasta recibir confirmación.

decision_records conserva elección, consecuencia, título, destino, secuencia, selected_at y acknowledged_at. Mientras la consecuencia no se confirma, pending_decision_id permanece en la sesión. Al recargar, el motor reproduce exactamente el historial y recupera ese estado.

learning_records guarda:
- child_profile_id, story_id, game_session_id, scene_id y decision_record_id.
- event_key, título y explicación pedagógica congelados al decidir.
- kind: discovery, care, learning, support o ending.
- earned_at en UTC, presentado en America/La_Paz.

Hay una huella por elección y eventos idempotentes de inicio, pista solicitada por escena y cierre. Continuar una consecuencia registra acknowledged_at de la misma elección; no inventa una segunda decisión. Abrir menús, leer ajustes o contemplar una imagen no se trata como decisión pedagógica.

Primer encuentro se desbloquea al responder al saludo, con fecha de primer desbloqueo. Cada final añade su insignia una sola vez; cada recorrido conserva su propio evento final. La estrella se mantiene en una por historia. No hay restas, rankings ni finales punitivos.

## Compatibilidad del contenido

stories.version ya existía; la migración añade scenes.content_version con valor inicial 1. Las sesiones conservan game_sessions.story_version.

La edición ampliada tiene versión interna 2 y órdenes de escena 2001 en adelante. Las escenas antiguas mantienen IDs, opciones y textos. GET /stories/{id}?version=1 permite restaurar su grafo. El cliente inicia o recupera la sesión primero y luego pide exactamente su revisión. El seeder puede repetirse sin duplicar contenido.

La migración transforma también las decisiones históricas existentes en huellas, conservando su fecha original. No elimina datos y evita rollback destructivo.

## Rutas nuevas y ampliadas

- GET /api/stories/{id}?version=N: solo escenas de esa revisión publicada.
- POST /api/game-sessions/{id}/hint, cuerpo scene_id: pista de la escena actual, guardada una vez.
- GET /api/child-profiles/{id}/memories?page=N: recuerdos paginados de 20 en 20.
- GET /api/child-profiles/{id}/progress: añade memories_count, últimos recuerdos y finales desbloqueados.
- GET /api/child-profiles/{id}/history: conserva el contrato anterior y añade recuerdos por recorrido.
- Las respuestas de partida añaden marks; finish guarda ending_key.

Todas las rutas de recuerdos reutilizan Access::child. Un docente solo lee perfiles con consentimiento activo y nunca puede jugar o modificar sus sesiones.

## Añadir historias y revisiones

La fuente narrativa del parque es backend/database/content/park.json. Cada escena contiene key, texto, imagen, acto, speaker, kind, pista opcional y opciones. Cada opción tiene destino, consecuencia y marca. Los finales no tienen opciones y declaran ending y takeaway. La escena inicial se coloca primero y se referencia en initial.

Para una historia nueva, crea su contenido y un seeder con slug propio, escenas y opciones. Para cambiar el grafo de una historia que ya tiene partidas, incrementa la revisión y usa órdenes nuevos; conserva la revisión anterior. No reasignes IDs antiguos a otro momento narrativo.

El motor exige grafo sin ciclos, sin escenas inalcanzables, con destinos válidos y finales sin opciones. Las pruebas recorren todos los caminos del parque.
