# Evidencia de PR · Benjamín · Módulo 02: Biblioteca y Navegación

> **Corrección según observaciones del Jefe de Grupo:**
> 1. Conexión de la biblioteca al catálogo real sobre la rama integrada del PR #14 (Laravel + MariaDB).
> 2. Corrección del botón «Continuar»: Recupera la sesión guardada del perfil seleccionado y vuelve al punto exacto donde se quedó, incluso después de recargar la página.
> 3. Validación exhaustiva de que cada cuento se pueda terminar: comprobación de grafos (opciones hacia escenas existentes, alcanzabilidad de final desde escena inicial y exclusión automática de cuentos con rutas rotas).
> 4. Soporte multi-perfil: demostración de que un segundo perfil (Sofía) tiene su propio avance independiente sin interferir con el de Alex.

---

## 1. Alcance de la entrega resuelta

- **Base de código unificada con PR #14:** Trabajo realizado directamente sobre la base integrada del PR #14 (`integracion-navi-aventura-mejoras`), integrando el backend Laravel completo, modelos Eloquent (`Story`, `Category`, `Scene`, `Choice`, `GameSession`, `ChildProfile`), migraciones y seeders de MariaDB.
- **Catálogo Real de Laravel y MariaDB:** `StoryController::index` y `StoryController::show` cargan las aventuras publicadas desde MariaDB (`Story::where('status', 'published')->with(...)`), entregando la aventura oficial insignia (*Me perdí en el parque* con 34 escenas y 53 opciones de decisión) y aventuras complementarias.
- **Validación de Cuentos Terminables (`isStoryTerminable`):**
  - Comprueba que todas las opciones (`choices`) apunten a escenas que existen en el cuento (`sceneMap.has(target)`). Si alguna opción apunta a un ID inexistente, se identifica como **ruta rota** y el cuento queda **fuera de la biblioteca**.
  - Comprueba mediante búsqueda de caminos en grafo (BFS) que desde la escena inicial se pueda alcanzar al menos una escena de cierre (`is_final: true`). Si no hay camino a un final, el cuento queda **fuera de la biblioteca**.
  - La validación está implementada tanto en el backend (`StoryController::isStoryTerminable`) como en el cliente frontend (`api.js: isStoryTerminable`).
- **Persistencia y Recuperación de «Continuar» por Perfil:**
  - Al tomar decisiones, se persiste de inmediato el estado de la partida: `{ currentSceneId, score, decisionsHistory, lastFeedback, status }` bajo la clave `navi-session-${profileId}-${storyId}`.
  - Al presionar **«Continuar ▶»** (en biblioteca, mapa o ficha), el juego recupera la sesión guardada y reanuda en la escena donde se quedó, conservando el puntaje acumulado y las decisiones previas, sin reiniciar a la primera escena ni borrar datos.
  - **Persistencia tras recargar:** Al pulsar `F5` o refrescar la página, el estado se mantiene intacto y se puede reanudar exactamente desde la escena guardada.
- **Aislamiento Multi-Perfil (Alex 🦊 y Sofía 🐱):**
  - Se implementó un selector de perfiles accesible desde la barra lateral, cabecera y vista de Perfil.
  - Cada perfil dispone de su propio espacio de almacenamiento de progreso y partidas guardadas. Alex y Sofía pueden jugar la misma historia y cada uno mantiene su propia escena actual y puntaje de forma independiente.

---

## 2. Pasos para probar y reproducir (Demostración requerida en el PR)

### Paso 1: Levantar la aplicación integrada

1. Abrir terminal en la carpeta `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Abrir en el navegador: `http://localhost:5173`.
3. Comprobar que el perfil activo por defecto es **Alex** 🦊 (7 años).

---

### Paso 2: Abrir un cuento del catálogo real y tomar una decisión

1. Ir a la pestaña **Biblioteca** (o en el **Mapa de Aventuras**).
2. Observar el catálogo real publicado (incluye la aventura principal *Me perdí en el parque* y aventuras publicadas como *Cruzar la calle con cuidado*).
3. En la tarjeta de *Cruzar la calle con cuidado* (o *Me perdí en el parque*), presionar **Jugar 🚀** (o abrir **Ficha 📋** y pulsar **¡Comenzar a Jugar!**).
4. El juego inicia en la escena 1: *"Llegando a la esquina transitada"* con 0 puntos.
5. Tomar una decisión: seleccionar la opción 1 (*"Esperar a que el semáforo peatonal esté en verde"*).
6. Observar que el juego avanza a la escena 2: *"Cruce seguro por el paso de cebra"*, sumando **10 puntos** y mostrando el consejo formativo de NAVI.

---

### Paso 3: Recargar la página y verificar «Continuar»

1. **Recargar la página** en el navegador (`F5` o botón refrescar).
2. Observar que:
   - Si estabas en la partida, se restaura inmediatamente en la escena 2 con los 10 puntos y el consejo conservados.
   - Si vuelves a la **Biblioteca**, la tarjeta del cuento muestra ahora el botón **Continuar ▶** y estado `en progreso`.
3. Hacer clic en **Continuar ▶**:
   - **Resultado esperado verificado:** La aventura **NO vuelve a la primera escena** ni borra los puntos. Se reanuda exactamente en la escena 2 (*"Cruce seguro por el paso de cebra"*) con los **10 puntos** intactos.

---

### Paso 4: Comprobar el avance independiente de un segundo perfil (Sofía)

1. En la barra lateral izquierda (o en la pestaña **Perfil**), hacer clic en el perfil de **Sofía** 🐱 (8 años).
2. Observar que el perfil activo cambia a Sofía.
3. Ir a la **Biblioteca**:
   - Para Sofía, el cuento *Cruzar la calle con cuidado* está en estado `nuevo` con el botón **Jugar 🚀** (el avance de Alex no afectó a Sofía).
4. Presionar **Jugar 🚀** con Sofía:
   - Sofía inicia su propia partida desde la escena 1 con 0 puntos.
   - Sofía elige una opción diferente (ej. opción 2: *"Correr rápido entre los autos"*).
   - Sofía avanza a la escena 3 (*"Decisión prudente a tiempo"*).
5. Cambiar nuevamente al perfil de **Alex** 🦊:
   - Ir a la biblioteca: Alex sigue teniendo el botón **Continuar ▶**.
   - Al pulsar **Continuar ▶**, Alex reanuda en la escena 2 con sus 10 puntos.
   - **Resultado comprobado:** Cada perfil tiene su propio avance y partidas 100% aisladas.

---

### Paso 5: Comprobar la exclusión de cuentos con rutas rotas

1. En el backend (`StoryController.php`) y en `demo/cuentos-demo.json` existen cuentos de prueba con anomalías:
   - Cuento ID 98: Opción que apunta a una escena inexistente (`target: 9999` o `escena-inexistente-404`).
   - Cuento ID 99: Borrador incompleto sin escenas ni cierre.
2. Comprobar en la **Biblioteca** y en el **Mapa**:
   - Ni el cuento ID 98 ni el ID 99 aparecen en el listado ni en los filtros de la biblioteca.
   - Fueron descartados automáticamente por `isStoryTerminable()`, garantizando que **solo historias 100% terminables y sin rutas rotas lleguen al niño**.

---

## 3. Pruebas automatizadas ejecutadas

Se implementó una suite de pruebas unitarias y de integración en `frontend/tests/biblioteca-catalog-session.test.mjs` y `frontend/tests/adventure.test.mjs`.

Comando de ejecución:
```bash
cd frontend
npm test
```

### Resultados observados:
```text
Recorridos posibles: 2784 · Longitud: 12 a 21 elecciones
✔ La historia ampliada tiene un grafo válido, tres finales y todos sus destinos
✔ Cada recorrido termina, muestra cada consecuencia y reconoce participación sin puntuación
✔ Reanudar una consecuencia no la salta y rechaza historiales alterados
✔ Cada escena usa una ilustración local real; voces opcionales ausentes
✔ Cada elección tiene recuerdo propio y NAVI solo narra el prólogo
✔ isStoryTerminable: Acepta cuentos válidos con escena final alcanzable
✔ isStoryTerminable: Rechaza cuentos con rutas rotas (opción apunta a escena inexistente)
✔ isStoryTerminable: Rechaza cuentos sin escena final
✔ isStoryTerminable: Rechaza cuentos donde la escena final es inalcanzable desde el inicio
✔ Catálogo real park.json: Es válido, terminable y no tiene rutas rotas
✔ Aislamiento de sesiones entre perfiles (Alex y Sofía)
Total: 11 tests pasados (0 fallos)
```

Compilación de producción validada:
```bash
npm run build
# ✓ 32 modules transformed.
# dist/index.html                   0.53 kB
# dist/assets/index-CAt4ecGx.css   14.31 kB
# dist/assets/index-CO5sPLYe.js   255.38 kB
# ✓ built in 826ms
```
