<?php

namespace App\Services;

use App\Models\Scene;
use App\Models\Story;

class StoryPublishValidator
{
    /**
     * Valida que el cuento pueda publicarse de forma jugable de inicio a fin.
     *
     * @return array{valid: bool, errors: array<int, string>}
     */
    public function validate(Story $story): array
    {
        $errors = [];

        $story->loadMissing(['scenes.choices', 'initialScene']);

        /** @var \Illuminate\Support\Collection<int, Scene> $scenes */
        $scenes = $story->scenes;

        if ($scenes->isEmpty()) {
            return [
                'valid' => false,
                'errors' => ['El cuento debe tener al menos una escena antes de publicarse.'],
            ];
        }

        $scenesById = $scenes->keyBy('id');

        // 1. Validar escena inicial válida y perteneciente al mismo cuento
        $initialScene = $story->initialScene;
        if (!$initialScene && $scenes->isNotEmpty()) {
            $initialScene = $scenes->first();
        }

        if (!$initialScene || !$scenesById->has($initialScene->id)) {
            $errors[] = 'Debe existir una escena inicial válida que pertenezca a este cuento.';
        }

        // 2. Validar que cada opción apunte a una escena del mismo cuento (si no es escena final)
        foreach ($scenes as $scene) {
            if ($scene->is_ending) {
                continue;
            }

            if ($scene->choices->isEmpty()) {
                $errors[] = "La escena \"{$scene->title}\" no es final y no tiene opciones de decisión.";
                continue;
            }

            foreach ($scene->choices as $choice) {
                if (!$choice->next_scene_id || !$scenesById->has($choice->next_scene_id)) {
                    $errors[] = "La opción \"{$choice->label}\" en la escena \"{$scene->title}\" apunta a un destino inválido o de otro cuento.";
                }
            }
        }

        // 3. Validar que exista al menos una escena final y que sea alcanzable desde la escena inicial
        $endingIds = $scenes->where('is_ending', true)->pluck('id')->all();
        if (empty($endingIds)) {
            $errors[] = 'El cuento debe tener al menos una escena marcada como final.';
        }

        if ($initialScene && $scenesById->has($initialScene->id) && !empty($endingIds)) {
            $reachableEndingIds = $this->findReachableEndings($initialScene->id, $scenesById);

            if (empty($reachableEndingIds)) {
                $errors[] = 'Ninguna escena final es alcanzable desde la escena inicial (revisa caminos cortados o bucles sin salida).';
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Recorre el grafo de escenas desde la escena inicial y devuelve los IDs de finales alcanzables.
     *
     * @param  \Illuminate\Support\Collection<int, Scene>  $scenesById
     * @return array<int, int>
     */
    private function findReachableEndings(int $startSceneId, $scenesById): array
    {
        $visited = [];
        $queue = [$startSceneId];
        $reachableEndings = [];

        while (!empty($queue)) {
            $currentId = array_shift($queue);

            if (isset($visited[$currentId]) || !$scenesById->has($currentId)) {
                continue;
            }

            $visited[$currentId] = true;

            /** @var Scene $currentScene */
            $currentScene = $scenesById->get($currentId);

            if ($currentScene->is_ending) {
                $reachableEndings[] = $currentScene->id;
                continue;
            }

            foreach ($currentScene->choices as $choice) {
                if ($choice->next_scene_id && $scenesById->has($choice->next_scene_id) && !isset($visited[$choice->next_scene_id])) {
                    $queue[] = $choice->next_scene_id;
                }
            }
        }

        return $reachableEndings;
    }
}