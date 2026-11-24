# Módulo 04 · Componentes frontend

## Integración

Los componentes React están integrados en el frontend activo (`frontend/src/components/`) y se usan desde las pantallas de juego (`frontend/src/game/StoryStage.jsx`), familia y aula (`frontend/src/adult/`). La app conserva `Layout`, `Button`, `StoryCard`, `AchievementCard`, `ProgressBar`, `ChoiceButton`, `Alert` y `Modal`, y sus estilos compartidos.

El guardado de avance bloquea el botón mientras procesa, anuncia el estado ocupado y evita envíos repetidos. Almacena el progreso localmente; si el navegador rechaza el almacenamiento, muestra un error recuperable que permite volver a intentar. El modal tiene nombre accesible, captura el foco, mantiene la navegación con Tab, cierra con Escape o clic fuera y devuelve el foco al control que lo abrió.

## Reproducción y evidencia

Desde `frontend/`:

```bash
npm install
npm test
npm run build
npm run dev
```

Resultado observado en esta entrega: `npm test` pasó 2/2 comprobaciones y `npm run build` terminó correctamente con Vite. Para revisar con teclado, abre «Salir de la aventura» desde Inicio; Tab y Mayús+Tab recorren los botones del diálogo, Escape lo cierra y el foco regresa al botón de apertura. También se puede cerrar con clic en el fondo.

En la interfaz prueba «Aventuras» para seleccionar una respuesta y guardar, «Mi progreso» para el resumen familiar y «Aula» para ver el avance del grupo. «Guardar progreso» anuncia Guardando…, se deshabilita durante la operación y termina con confirmación o error recuperable.

El guardado de esta demo usa `localStorage` como persistencia local; una integración con API remota puede sustituir esa función sin cambiar la API visual de los componentes.
