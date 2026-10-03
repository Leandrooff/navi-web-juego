# Modulo 02 Frontend y motor de cuentos

## Objetivo

Crear la parte jugable en React. El modulo debe mostrar cuentos interactivos y permitir que el nino avance segun sus decisiones.

## Herramientas

- React.
- Vite.
- Tailwind CSS.
- JavaScript o TypeScript.
- Datos JSON de prueba.

## Entregables

- Pantalla de biblioteca.
- Pantalla de juego.
- Componente de escena.
- Componente de opciones.
- Reproduccion o simulacion de audio.
- Pantalla de resultado.
- JSON de ejemplo con un cuento completo.

## Datos de prueba recomendados

Crear un archivo:

```text
sample/story-perdido-en-parque.json
```

Debe incluir:

- id del cuento.
- titulo.
- categoria.
- escena inicial.
- escenas.
- opciones.
- destino de cada opcion.
- final bueno, final intermedio o final de refuerzo.

## Contrato esperado con backend

El frontend debe funcionar primero con JSON local. Luego se conectara a estos endpoints:

```text
GET /api/stories
GET /api/stories/{id}
POST /api/game-sessions
POST /api/game-sessions/{id}/decisions
POST /api/game-sessions/{id}/finish
```

## Como trabajar independiente

No deben esperar al backend. Usen JSON local con la misma estructura que esperan recibir de la API.

