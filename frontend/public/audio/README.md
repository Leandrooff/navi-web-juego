# Voces de NAVI — incorporación futura

No se incluyen ni se generan voces en esta entrega.

Colocar los archivos aprobados en audio/es-BO/park/<dialogue-id>.mp3.
Asignar la ruta /audio/es-BO/park/...mp3 al campo audio_path de la escena o elección
correspondiente, identificado por dialogue_id. Los campos speaker_id y locale
identifican al personaje y el idioma.

useVoice solo acepta rutas locales bajo /audio y no reproduce automáticamente.
El botón aparece únicamente si audio_path contiene una ruta válida.
Detiene la reproducción al cambiar de línea o desmontar la escena.
No utiliza speechSynthesis ni servicios de voz externos.

No prometer sincronización temporal exacta: el texto actualmente se revela por
caracteres. Una futura pista de cues por dialogue_id puede proporcionar marcas
de tiempo sin cambiar los identificadores narrativos.
