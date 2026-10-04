# Instrucciones para Luis - API de cuentos

## Objetivo exacto

Crear funciones o endpoints para que el frontend pida cuentos, escenas, decisiones, puntajes y recomendaciones.

## Estructura que debes seguir

```text
modules/06-luis-api-cuentos/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    api-cuentos.js
    routes.md
  demo/
    respuesta-listar-cuentos.json
    respuesta-detalle-cuento.json
    respuesta-guardar-decision.json
```

## Funciones que debes subir

- Listar cuentos.
- Obtener detalle de cuento.
- Obtener escenas de cuento.
- Guardar decision tomada.
- Guardar avance.
- Guardar puntaje final.
- Devolver recomendacion segun resultado.

## Rutas sugeridas

- `GET /api/stories`
- `GET /api/stories/:id`
- `GET /api/stories/:id/scenes`
- `POST /api/decisions`
- `POST /api/scores`
- `GET /api/recommendations/:userId`

## Datos demo obligatorios

Subir JSON de ejemplo para cada respuesta importante.

## Que escribir en avance.md

- Que rutas hiciste.
- Que JSON devuelve cada ruta.
- Que falta conectar.
