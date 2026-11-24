# Modulo 04 Fabian Componentes frontend

## Objetivo

Crear componentes React reutilizables para que las pantallas del proyecto mantengan una experiencia clara, coherente y adaptable.

Leer tambien `INSTRUCCIONES.md` dentro de esta misma carpeta para ver exactamente que debes subir.

## Componentes incluidos

- `Button.jsx`: botón genérico y variantes `PrimaryButton` y `SecondaryButton`.
- `StoryCard.jsx`: tarjeta de cuento con estados nuevo, en progreso, completado y bloqueado.
- `AchievementCard.jsx`: tarjeta de logro desbloqueado o pendiente.
- `ProgressBar.jsx`: barra accesible con valor y máximo configurables.
- `ChoiceButton.jsx`: opción seleccionable para decisiones.
- `Modal.jsx`: diálogo de confirmación, cierre con Escape y clic fuera.
- `Alert.jsx`: mensajes informativos, positivos, de advertencia y error.
- `Layout.jsx`: estructura de navegación, perfil y contenido adaptable.
- `componentes.css`: estilos, estados, tokens de color y reglas responsive.

## Uso rápido en React

Importa los componentes que necesites y carga la hoja de estilos una sola vez:

```jsx
import { Button } from "./src/Button.jsx";
import StoryCard from "./src/StoryCard.jsx";
import ProgressBar from "./src/ProgressBar.jsx";
import "./src/componentes.css";

<Button variant="primary" onClick={iniciar}>Comenzar aventura</Button>
<StoryCard title="Me perdí en el parque" category="Seguridad"
  description="Aprende a pedir ayuda" status="nuevo" onAction={iniciar} />
<ProgressBar value={3} max={5} label="Escenas completadas" />
```

Los componentes reciben contenido y datos por props. Los botones aceptan `variant`, `state`, `disabled` y propiedades nativas de botón; la barra limita el valor mostrado al rango permitido. La galería incluye una versión HTML autónoma para revisar los ejemplos sin instalar dependencias.

## Archivos

- Componentes React en `src/`.
- Galería visual e interactiva en `demo/componentes-demo.html`.
- Resumen del avance en `base-avance/avance.md`.

Los tokens principales usan la paleta de la preview del proyecto: azul `#2356d8`, navy `#102a43`, cielo `#dff3ff`, menta `#dff8ea` y amarillo `#ffe7a8`. Para usar una ilustración propia en `StoryCard`, pasa `image={{ src, alt }}`. `Modal` se muestra con `open` y recibe `onConfirm` y `onCancel`.
