# Arte de la misión y voces futuras

## Ilustraciones

La misión incluye 26 PNG originales nuevos en frontend/public/art/park/. Se crearon con la herramienta integrada image_gen, con referencias de identidad y correcciones dirigidas para mantener al protagonista, Mara y la trabajadora Inés.

Dirección: ilustración de aventura 2D con contornos, color por planos, textura suave y paleta turquesa/ocre/salvia. El niño tiene pelo castaño rizado, camiseta crema, peto turquesa y bolso amarillo. Mara lleva chaqueta mostaza; Inés, uniforme turquesa. El farol, la fuente, el árbol y la caseta son referencias narrativas recurrentes.

Cada bloque importante tiene imagen propia: cielo, puente, encuentro, entrada, fuente, peces, cuaderno, separación, respiración, mapa, bifurcación, verja, banco, ayuda, propuesta desconocida, árbol, caseta, identificación, radio, espera, tres reencuentros y tres cierres. Subescenas de conversación comparten escenario para mantener continuidad.

Los prompts definitivos por archivo están en art-park-manifest.json. La UI añade el NAVI animado, partículas, movimiento de cámara y transición de escenas como capas independientes. El alias y color elegidos se aplican a la interfaz y al acompañante; los personajes pintados conservan su diseño.

El mundo y el sprite NAVI de la base recibida se mantienen. También se conservan las seis ilustraciones antiguas, usadas por partidas previas.

## Sin voces producidas

No se incluyen grabaciones, síntesis de voz, peticiones a proveedores de audio ni botones que simulen reproducción. Los campos audio_path permanecen nulos.

Cada narración y consecuencia tiene dialogue_id estable, speaker_id y locale es-BO. docs/voice-lines.json recoge los 87 textos preparados, su escena y su identificador. La narración de apertura corresponde a navi; el resto a narrator. El saludo usa {name}, que habrá que resolver o adaptar editorialmente al producir voces.

Para incorporar una grabación aprobada:
1. Guarda el archivo en frontend/public/audio/ siguiendo su identificador.
2. Asigna la ruta /audio/...mp3, .ogg o .wav en scenes.audio_path o choices.audio_path, localizando la fila por dialogue_id.
3. El seeder conserva audio_path: volver a sembrar no borra rutas de grabaciones.
4. useVoice muestra el control solo con una ruta local válida. Reproduce tras la acción del usuario, permite pausar y limpia el reproductor al cambiar de línea.
5. Al abrir pausa, ajustes, cuaderno o la ilustración, la reproducción se pausa. Un fallo de audio deja disponible el texto y la continuación.

Las pistas actuales son texto opcional. Para narrarlas posteriormente pueden añadirse identificadores y rutas equivalentes; no son necesarias para avanzar en la misión.
