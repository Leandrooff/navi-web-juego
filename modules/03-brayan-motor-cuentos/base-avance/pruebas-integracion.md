# Pruebas locales del motor de cuentos integrado

Validación del 24 de noviembre de 2026 en la rama `brayan-motor-cuentos`, que incorpora `653fd91` de `integracion-navi-aventura-mejoras`. Se usaron Chrome, Node 26.5.0, PHP 8.5.9 y dos bases MariaDB 12.3.3 aisladas con datos sintéticos.

## Guardado y reanudación

El motor reconstruye la fase y la escena a partir del cuento y del historial guardado. Laravel registra la elección y devuelve la consecuencia pendiente. Al pulsar «Continuar», Laravel confirma el destino y el motor muestra la siguiente escena. En el final, Laravel guarda el cierre y la recompensa antes de que la interfaz muestre el resultado.

## Defecto reproducido y corrección

1. Llegar a la escena `encuentro`, que tiene dos opciones.
2. Elegir la primera opción e interrumpir la respuesta después de que Laravel guarde la decisión. La prueba deja que Laravel procese la petición real y corta únicamente la respuesta al navegador.
3. Elegir la segunda opción. Laravel responde `409` porque la primera decisión sigue pendiente. Antes de la corrección, la escena permanecía en fase de elección y la consecuencia guardada quedaba fuera de pantalla.
4. Con la corrección, el frontend consulta esa sesión con `GET /api/game-sessions/{id}` y muestra la consecuencia de la primera elección. Al volver del mapa se conserva la misma sesión. Al pulsar «Continuar» se llega al destino de la primera decisión y se mantienen los mismos IDs de historial.

La regresión utiliza la ruta de sesión que ya existe en Laravel. Los cambios de esta rama se concentran en el frontend.

## Resultados

| Prueba | Resultado |
| --- | --- |
| Demo independiente | 8 pruebas aprobadas, con 16 rutas completas. |
| Motor integrado | 5 pruebas aprobadas, con 2.784 rutas terminadas, tres finales e ilustraciones comprobadas. |
| Regresión de navegador | Falló antes de la corrección y pasó después. Verificó doble clic, pérdida de la respuesta tras guardar, recuperación al elegir otra opción, regreso desde el mapa y avance sin duplicar decisiones. |
| Recorridos y accesibilidad en Chrome | `npm run test:e2e` y `npm run test:ux` pasaron. Incluyen recarga con una consecuencia pendiente, los tres finales y controles de teclado y móvil. |
| Laravel | 13 pruebas aprobadas y 613 aserciones, incluidos cierre repetido y persistencia de los tres finales. |
| Compilación | Vite completó `npm run build`. |

## Cómo repetir

Prepara el entorno local con la [guía de instalación](../../../docs/INSTALACION.md). Mantén Laravel y Vite en ejecución para la regresión de navegador y usa una base de desarrollo de prueba, ya que la regresión crea una cuenta y un perfil sintéticos.

```sh
node --test modules/03-brayan-motor-cuentos/tests/motor-cuentos.test.mjs
cd frontend
npm test
npm run test:motor:e2e
npm run build
```

La regresión usa `http://127.0.0.1:5173` por defecto. `NAVI_TEST_URL` permite usar otro puerto y `NAVI_BROWSER_PATH` permite indicar el ejecutable de Chrome. También se puede instalar Chromium con `npx playwright install chromium` desde `frontend`.
