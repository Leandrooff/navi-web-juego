# Instrucciones para Brayan - Motor de cuentos

## Objetivo exacto

Crear la logica jugable: escenas, opciones, decisiones, puntos y finales.

## Estructura que debes seguir

```text
modules/03-brayan-motor-cuentos/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    motor-cuentos.js
    demo-juego.html
  demo/
    cuento-demo.json
```

## Pantallas que debes subir

- Escena actual del cuento.
- Opciones de decision.
- Resultado despues de elegir una opcion.
- Final del cuento.

## Funciones que debe tener

- Cargar cuento desde JSON.
- Mostrar escena actual.
- Mostrar opciones disponibles.
- Detectar opcion seleccionada.
- Cambiar a la siguiente escena.
- Sumar puntos.
- Guardar decisiones tomadas.
- Calcular final bueno, intermedio o malo.
- Reiniciar cuento.

## Datos demo obligatorios

Crear `demo/cuento-demo.json` con:

- `id`
- `titulo`
- `escenaInicial`
- `escenas`
- `opciones`
- `puntos`
- `siguiente`
- `finales`

## Que escribir en avance.md

- Como se ejecuta el demo.
- Cuantas escenas tiene.
- Como calcula puntos.
- Que falta conectar.
