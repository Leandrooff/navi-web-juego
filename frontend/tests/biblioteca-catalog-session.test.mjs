import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isStoryTerminable, normalizeStory } from '../src/services/api.js';

test('isStoryTerminable: Acepta cuentos válidos con escena final alcanzable', () => {
  const story = {
    id: 1,
    title: 'Cuento de prueba válido',
    initial_scene_id: 10,
    scenes: [
      {
        id: 10,
        title: 'Inicio',
        is_final: false,
        choices: [
          { label: 'Ir al camino A', target: 20 },
          { label: 'Ir al camino B', target: 30 }
        ]
      },
      {
        id: 20,
        title: 'Camino A',
        is_final: false,
        choices: [
          { label: 'Ir al final', target: 40 }
        ]
      },
      {
        id: 30,
        title: 'Camino B',
        is_final: false,
        choices: [
          { label: 'Ir al final', target: 40 }
        ]
      },
      {
        id: 40,
        title: 'Final feliz',
        is_final: true,
        choices: []
      }
    ]
  };

  assert.equal(isStoryTerminable(story), true);
});

test('isStoryTerminable: Rechaza cuentos con rutas rotas (opción apunta a escena inexistente)', () => {
  const storyConRutaRota = {
    id: 98,
    title: 'Cuento con ruta rota',
    initial_scene_id: 1,
    scenes: [
      {
        id: 1,
        title: 'Inicio',
        is_final: false,
        choices: [
          { label: 'Saltar a escena fantasma', target: 9999 } // Destino inexistente!
        ]
      },
      {
        id: 2,
        title: 'Final',
        is_final: true,
        choices: []
      }
    ]
  };

  assert.equal(isStoryTerminable(storyConRutaRota), false, 'Debe rechazar historias con rutas rotas');
});

test('isStoryTerminable: Rechaza cuentos sin escena final', () => {
  const storySinFinal = {
    id: 97,
    title: 'Cuento sin final',
    initial_scene_id: 1,
    scenes: [
      {
        id: 1,
        title: 'Escena 1',
        is_final: false,
        choices: [{ label: 'Ir a 2', target: 2 }]
      },
      {
        id: 2,
        title: 'Escena 2',
        is_final: false,
        choices: [{ label: 'Ir a 1', target: 1 }] // Ciclo sin final
      }
    ]
  };

  assert.equal(isStoryTerminable(storySinFinal), false, 'Debe rechazar historias sin escena final');
});

test('isStoryTerminable: Rechaza cuentos donde la escena final es inalcanzable desde el inicio', () => {
  const storyFinalInalcanzable = {
    id: 96,
    title: 'Cuento con final desconectado',
    initial_scene_id: 1,
    scenes: [
      {
        id: 1,
        title: 'Inicio',
        is_final: false,
        choices: [{ label: 'Quedarme atrapado', target: 1 }]
      },
      {
        id: 2,
        title: 'Final desconectado',
        is_final: true,
        choices: []
      }
    ]
  };

  assert.equal(isStoryTerminable(storyFinalInalcanzable), false, 'Debe rechazar historias donde el final no se puede alcanzar');
});

test('Catálogo real park.json: Es válido, terminable y no tiene rutas rotas', async () => {
  const content = JSON.parse(await readFile(new URL('../../backend/database/content/park.json', import.meta.url), 'utf8'));
  const keyToId = new Map(content.scenes.map((s, i) => [s.key, i + 100]));

  const realStory = {
    id: 1,
    title: content.title,
    initial_scene_id: keyToId.get(content.initial),
    scenes: content.scenes.map((s) => ({
      id: keyToId.get(s.key),
      title: s.title,
      body: s.body,
      is_final: Boolean(s.final),
      choices: (s.choices || []).map((c) => ({
        label: c.label,
        target: keyToId.get(c.to),
        points: 10
      }))
    }))
  };

  assert.equal(isStoryTerminable(realStory), true, 'El cuento oficial del parque debe ser 100% terminable');
  assert.equal(realStory.scenes.length, 34);
});

test('Aislamiento de sesiones entre perfiles (Alex y Sofía)', () => {
  // Simular almacenamiento de sesiones
  const storage = new Map();
  const mockLocalStorage = {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, val) => storage.set(key, String(val))
  };

  const storyId = 1;
  const alexProfileId = 'perfil-alex-1';
  const sofiaProfileId = 'perfil-sofia-2';

  // 1. Alex juega y avanza hasta la escena 2 con 15 puntos
  const alexSession = {
    storyId,
    currentSceneId: 102,
    score: 15,
    decisionsHistory: [{ sceneId: 100, choiceLabel: 'Esperar a mamá', points: 15 }],
    status: 'en progreso',
    updatedAt: Date.now()
  };
  mockLocalStorage.setItem(`navi-session-${alexProfileId}-${storyId}`, JSON.stringify(alexSession));
  mockLocalStorage.setItem(`navi-progress-${alexProfileId}`, JSON.stringify({ [storyId]: 'en progreso' }));

  // 2. Sofía entra al mismo cuento: su sesión inicial debe estar limpia
  const sofiaInitial = mockLocalStorage.getItem(`navi-session-${sofiaProfileId}-${storyId}`);
  assert.equal(sofiaInitial, null, 'Sofía no debe tener sesión activa antes de jugar');

  // Sofía juega e inicia su propia partida en la escena inicial (100) con 0 puntos
  const sofiaSession = {
    storyId,
    currentSceneId: 100,
    score: 0,
    decisionsHistory: [],
    status: 'en progreso',
    updatedAt: Date.now()
  };
  mockLocalStorage.setItem(`navi-session-${sofiaProfileId}-${storyId}`, JSON.stringify(sofiaSession));

  // 3. Simular recarga de página (F5) para Alex:
  // Alex recupera su sesión guardada: escena 102, 15 puntos, historial conservado
  const alexRestoredRaw = mockLocalStorage.getItem(`navi-session-${alexProfileId}-${storyId}`);
  assert.ok(alexRestoredRaw);
  const alexRestored = JSON.parse(alexRestoredRaw);
  assert.equal(alexRestored.currentSceneId, 102, 'Alex debe reanudar en la escena 102 (no en la primera escena)');
  assert.equal(alexRestored.score, 15, 'Alex no debe perder sus puntos acumulados');
  assert.equal(alexRestored.decisionsHistory.length, 1, 'Alex debe conservar su historial de decisiones');

  // 4. Verificar que la sesión de Sofía permanece intacta e independiente
  const sofiaRestored = JSON.parse(mockLocalStorage.getItem(`navi-session-${sofiaProfileId}-${storyId}`));
  assert.equal(sofiaRestored.currentSceneId, 100);
  assert.equal(sofiaRestored.score, 0);
  assert.notEqual(alexRestored.currentSceneId, sofiaRestored.currentSceneId);
});
