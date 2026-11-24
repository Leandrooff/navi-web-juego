<?php

namespace App\Http\Controllers;

use App\Models\Choice;
use App\Models\Scene;
use App\Models\Story;
use App\Services\StoryPublishValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminStoryController extends Controller
{
    public function __construct(
        private readonly StoryPublishValidator $validator
    ) {}

    public function index(): JsonResponse
    {
        $stories = Story::query()
            ->withCount('scenes')
            ->with('initialScene:id,title')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'data' => $stories,
        ]);
    }

    public function storeStory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:2000'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'status' => ['sometimes', Rule::in([Story::STATUS_DRAFT, Story::STATUS_PUBLISHED, Story::STATUS_INACTIVE])],
        ], [
            'title.required' => 'El título del cuento es obligatorio.',
            'category.required' => 'La categoría del cuento es obligatoria.',
        ]);

        $story = Story::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'cover_image' => $validated['cover_image'] ?? null,
            'status' => Story::STATUS_DRAFT,
            'revision' => 1,
        ]);

        return response()->json([
            'message' => 'Cuento creado como borrador.',
            'data' => $story->load('scenes.choices'),
        ], 201);
    }

    public function updateStory(Request $request, Story $story): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:2000'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'initial_scene_id' => [
                'nullable',
                'integer',
                Rule::exists('scenes', 'id')->where(fn ($q) => $q->where('story_id', $story->id)),
            ],
        ], [
            'title.required' => 'El título del cuento es obligatorio.',
            'category.required' => 'La categoría del cuento es obligatoria.',
            'initial_scene_id.exists' => 'La escena inicial debe pertenecer a este mismo cuento.',
        ]);

        $story->update($validated);

        return response()->json([
            'message' => 'Cuento actualizado.',
            'data' => $story->fresh()->load('scenes.choices'),
        ]);
    }

    public function preview(Story $story): JsonResponse
    {
        $story->load(['scenes.choices.nextScene', 'initialScene']);
        $validation = $this->validator->validate($story);

        $totalChoices = $story->scenes->sum(fn (Scene $scene) => $scene->choices->count());
        $endingCount = $story->scenes->where('is_ending', true)->count();

        return response()->json([
            'story' => $story,
            'summary' => [
                'scenes_count' => $story->scenes->count(),
                'choices_count' => $totalChoices,
                'endings_count' => $endingCount,
                'can_publish' => $validation['valid'],
            ],
            'validation' => $validation,
        ]);
    }

    public function publish(Story $story): JsonResponse
    {
        $story->load(['scenes.choices', 'initialScene']);
        $validation = $this->validator->validate($story);

        if (!$validation['valid']) {
            return response()->json([
                'message' => 'No se puede publicar el cuento porque no cumple las reglas de validación.',
                'errors' => $validation['errors'],
            ], 422);
        }

        $targetStory = DB::transaction(function () use ($story) {
            $initialId = $story->initial_scene_id ?? $story->scenes->first()?->id;

            // Si ya estaba publicado, creamos una nueva revisión para proteger partidas guardadas en curso
            if ($story->status === Story::STATUS_PUBLISHED) {
                $nextRevision = Story::query()
                    ->where(function ($q) use ($story) {
                        $q->where('id', $story->id)
                            ->orWhere('parent_story_id', $story->parent_story_id ?? $story->id);
                    })
                    ->max('revision') + 1;

                $clone = Story::create([
                    'title' => $story->title,
                    'category' => $story->category,
                    'description' => $story->description,
                    'cover_image' => $story->cover_image,
                    'status' => Story::STATUS_PUBLISHED,
                    'revision' => $nextRevision,
                    'parent_story_id' => $story->parent_story_id ?? $story->id,
                ]);

                $sceneIdMap = [];
                foreach ($story->scenes as $scene) {
                    $newScene = Scene::create([
                        'story_id' => $clone->id,
                        'title' => $scene->title,
                        'body' => $scene->body,
                        'sort_order' => $scene->sort_order,
                        'is_ending' => $scene->is_ending,
                    ]);
                    $sceneIdMap[$scene->id] = $newScene->id;
                }

                foreach ($story->scenes as $scene) {
                    $clonedSceneId = $sceneIdMap[$scene->id];
                    foreach ($scene->choices as $choice) {
                        Choice::create([
                            'scene_id' => $clonedSceneId,
                            'next_scene_id' => $choice->next_scene_id ? ($sceneIdMap[$choice->next_scene_id] ?? null) : null,
                            'label' => $choice->label,
                            'points' => $choice->points,
                        ]);
                    }
                }

                if ($initialId && isset($sceneIdMap[$initialId])) {
                    $clone->update(['initial_scene_id' => $sceneIdMap[$initialId]]);
                }

                return $clone->load('scenes.choices');
            }

            $story->update([
                'initial_scene_id' => $initialId,
                'status' => Story::STATUS_PUBLISHED,
            ]);

            return $story->fresh()->load('scenes.choices');
        });

        return response()->json([
            'message' => 'Cuento publicado correctamente.',
            'data' => $targetStory,
        ]);
    }

    public function setStatus(Request $request, Story $story): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([Story::STATUS_DRAFT, Story::STATUS_PUBLISHED, Story::STATUS_INACTIVE])],
        ], [
            'status.required' => 'Debes indicar el estado del cuento.',
            'status.in' => 'Estado no válido. Usa draft, published o inactive.',
        ]);

        if ($validated['status'] === Story::STATUS_PUBLISHED) {
            return $this->publish($story);
        }

        $story->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Estado del cuento actualizado.',
            'data' => $story->fresh(),
        ]);
    }

    public function storeScene(Request $request, Story $story): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_ending' => ['sometimes', 'boolean'],
            'set_as_initial' => ['sometimes', 'boolean'],
        ], [
            'title.required' => 'El título de la escena es obligatorio.',
            'body.required' => 'El contenido narrativo de la escena es obligatorio.',
        ]);

        $nextOrder = $validated['sort_order'] ?? ((int) $story->scenes()->max('sort_order') + 1);

        $scene = $story->scenes()->create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'sort_order' => $nextOrder,
            'is_ending' => (bool) ($validated['is_ending'] ?? false),
        ]);

        if (!empty($validated['set_as_initial']) || $story->initial_scene_id === null) {
            $story->update(['initial_scene_id' => $scene->id]);
        }

        return response()->json([
            'message' => 'Escena creada.',
            'data' => $scene->load('choices'),
        ], 201);
    }

    public function updateScene(Request $request, Scene $scene): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'body' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_ending' => ['sometimes', 'boolean'],
            'set_as_initial' => ['sometimes', 'boolean'],
        ], [
            'title.required' => 'El título de la escena es obligatorio.',
            'body.required' => 'El contenido narrativo de la escena es obligatorio.',
        ]);

        $scene->update([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'sort_order' => $validated['sort_order'] ?? $scene->sort_order,
            'is_ending' => array_key_exists('is_ending', $validated) ? (bool) $validated['is_ending'] : $scene->is_ending,
        ]);

        if (!empty($validated['set_as_initial'])) {
            $scene->story()->update(['initial_scene_id' => $scene->id]);
        }

        return response()->json([
            'message' => 'Escena actualizada.',
            'data' => $scene->fresh()->load('choices'),
        ]);
    }

    public function reorderScenes(Request $request, Story $story): JsonResponse
    {
        $validated = $request->validate([
            'scene_ids' => ['required', 'array', 'min:1'],
            'scene_ids.*' => [
                'integer',
                Rule::exists('scenes', 'id')->where(fn ($q) => $q->where('story_id', $story->id)),
            ],
        ], [
            'scene_ids.required' => 'Debes enviar el orden de escenas.',
            'scene_ids.*.exists' => 'Todas las escenas deben pertenecer al cuento.',
        ]);

        DB::transaction(function () use ($story, $validated) {
            foreach ($validated['scene_ids'] as $index => $sceneId) {
                Scene::where('id', $sceneId)
                    ->where('story_id', $story->id)
                    ->update(['sort_order' => $index + 1]);
            }
        });

        return response()->json([
            'message' => 'Orden de escenas guardado.',
            'data' => $story->fresh()->scenes,
        ]);
    }

    public function storeChoice(Request $request, Scene $scene): JsonResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:200'],
            'points' => ['required', 'integer'],
            'next_scene_id' => [
                'nullable',
                'integer',
                Rule::exists('scenes', 'id')->where(fn ($q) => $q->where('story_id', $scene->story_id)),
            ],
        ], [
            'label.required' => 'El texto de la opción es obligatorio.',
            'points.required' => 'El puntaje de la opción es obligatorio.',
            'next_scene_id.exists' => 'La escena destino debe pertenecer al mismo cuento.',
        ]);

        $choice = $scene->choices()->create([
            'label' => $validated['label'],
            'points' => $validated['points'],
            'next_scene_id' => $validated['next_scene_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Opción de decisión creada.',
            'data' => $choice->load('nextScene:id,title'),
        ], 201);
    }
}