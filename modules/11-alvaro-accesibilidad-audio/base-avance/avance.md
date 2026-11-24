# Avance Alvaro

## Que se subió

- Lectura de texto en audio.
- Repetición del último audio.
- Detención del audio.
- Activación y desactivación del sonido.
- Control de volumen.
- Indicador visual de audio.
- Cambio de tamaño de letra.
- Selección de tamaño de letra.
- Modo de alto contraste.
- Ventana de ayuda.
- Cierre de ventana de ayuda.
## Como verlo

Los controles del texto se encuentran dentro de accesibilidad.css y accesibilidad.html junto con audio_control.js gestionan los botones y el audio del cuento.

## Falta

Por el momento falta la conexion con la pagina principal de los cuentos.

## Integración de voces y rutas de audio (Me perdí en el parque)

- Se generaron y subieron los 34 archivos `.mp3` de narración en `frontend/public/audio/es-BO/park/`.
- Se vincularon las 34 rutas `audio_path` en `docs/voice-lines.json` (manteniendo las consecuencias en `null`).
- Se agregaron las 34 rutas `audio_path` en cada escena narrada de `backend/database/content/park.json`.
- **Dependencia:** Este PR requiere integrar previamente el **PR #14** (`integracion-navi-aventura-mejoras`).
