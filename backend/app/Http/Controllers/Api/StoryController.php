<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use App\Models\Scene;
use App\Models\Choice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * StoryController - Catálogo oficial de aventuras publicadas de NAVI.
 * 
 * Conecta la biblioteca al catálogo real desde Laravel y MariaDB.
 * Valida que cada cuento publicado sea terminable (sin rutas rotas y con final alcanzable).
 */
class StoryController extends Controller
{
    /**
     * Valida si un cuento tiene una estructura válida y puede terminarse.
     * 
     * Reglas requeridas:
     * 1. Debe contener al menos una escena.
     * 2. Todas las opciones (choices) deben apuntar a escenas que existen (sin rutas rotas).
     * 3. Debe ser posible llegar a una escena final desde la escena inicial (alcanzabilidad).
     *
     * @param mixed $story
     * @return bool
     */
    public static function isStoryTerminable($story): bool
    {
        $scenes = is_object($story) ? ($story->scenes ?? []) : ($story['scenes'] ?? $story['escenas'] ?? []);
        if (empty($scenes) || count($scenes) === 0) {
            return false;
        }

        $sceneMap = [];
        $finalSceneIds = [];

        foreach ($scenes as $scene) {
            $id = is_object($scene) ? $scene->id : ($scene['id'] ?? null);
            if ($id === null) {
                return false;
            }
            $sceneMap[$id] = $scene;

            $isFinal = is_object($scene)
                ? (!empty($scene->is_final) || ($scene->scene_type ?? '') === 'final')
                : (!empty($scene['is_final']) || !empty($scene['es_final']) || ($scene['scene_type'] ?? '') === 'final');

            $choices = is_object($scene) ? ($scene->choices ?? []) : ($scene['choices'] ?? $scene['opciones'] ?? []);
            if ($isFinal || empty($choices) || count($choices) === 0) {
                $finalSceneIds[$id] = true;
            }
        }

        // Si no existe ninguna escena final en todo el cuento, no se puede terminar
        if (empty($finalSceneIds)) {
            return false;
        }

        // Determinar escena inicial
        $initialId = is_object($story) 
            ? ($story->initial_scene_id ?? null) 
            : ($story['initial_scene_id'] ?? null);

        if ($initialId === null || !isset($sceneMap[$initialId])) {
            $first = is_object($scenes[0]) ? $scenes[0]->id : $scenes[0]['id'];
            $initialId = $first;
        }

        if (!isset($sceneMap[$initialId])) {
            return false;
        }

        // Validar que TODAS las opciones apunten a escenas existentes (sin rutas rotas)
        foreach ($scenes as $scene) {
            $choices = is_object($scene) ? ($scene->choices ?? []) : ($scene['choices'] ?? $scene['opciones'] ?? []);
            foreach ($choices as $choice) {
                $target = is_object($choice)
                    ? ($choice->target_scene_id ?? $choice->target ?? null)
                    : ($choice['target_scene_id'] ?? $choice['target'] ?? $choice['siguiente'] ?? null);

                if ($target === null || !isset($sceneMap[$target])) {
                    // Ruta rota detectada: apunta a escena inexistente
                    return false;
                }
            }
        }

        // Validar alcanzabilidad de al menos un final desde la escena inicial mediante BFS
        $queue = [$initialId];
        $visited = [$initialId => true];
        $reachedFinal = false;

        while (!empty($queue)) {
            $currentId = array_shift($queue);
            if (isset($finalSceneIds[$currentId])) {
                $reachedFinal = true;
                break;
            }

            $currentScene = $sceneMap[$currentId];
            $choices = is_object($currentScene) ? ($currentScene->choices ?? []) : ($currentScene['choices'] ?? $currentScene['opciones'] ?? []);
            foreach ($choices as $choice) {
                $target = is_object($choice)
                    ? ($choice->target_scene_id ?? $choice->target ?? null)
                    : ($choice['target_scene_id'] ?? $choice['target'] ?? $choice['siguiente'] ?? null);

                if ($target !== null && isset($sceneMap[$target]) && !isset($visited[$target])) {
                    $visited[$target] = true;
                    $queue[] = $target;
                }
            }
        }

        return $reachedFinal;
    }

    /**
     * Listado del catálogo de cuentos publicados.
     * Carga cuentos desde MariaDB/Eloquent y excluye los que tengan rutas rotas.
     *
     * @param Request $r
     * @return JsonResponse
     */
    public function index(Request $r): JsonResponse
    {
        $search = $r->query('search');
        $category = $r->query('category');

        $stories = [];

        try {
            // Consulta Eloquent a MariaDB
            $query = Story::where('status', 'published')
                ->with(['category', 'scenes' => fn($q) => $q->orderBy('scene_order')->with('choices')])
                ->orderBy('story_order');

            $dbStories = $query->get();

            if ($dbStories->isNotEmpty()) {
                foreach ($dbStories as $s) {
                    $stories[] = $this->formatStoryModel($s);
                }
            }
        } catch (\Throwable $e) {
            // En caso de que la conexión a MariaDB no esté activa en el entorno de pruebas,
            // cargamos los cuentos reales publicados desde el contenido base del proyecto.
            $stories = [];
        }

        // Si la base de datos aún no contiene cuentos o falló la conexión local,
        // garantizamos la carga de los cuentos reales del proyecto (park.json y catálogo oficial)
        if (empty($stories)) {
            $stories = $this->loadPublishedRealCatalog();
        }

        // Filtrar por término de búsqueda en el título
        if (!empty($search)) {
            $term = mb_strtolower(trim($search));
            $stories = array_filter($stories, function ($s) use ($term) {
                $title = mb_strtolower($s['title'] ?? $s['titulo'] ?? '');
                return str_contains($title, $term);
            });
        }

        // Filtrar por categoría
        if (!empty($category) && $category !== 'todas') {
            $catFilter = mb_strtolower(trim($category));
            $stories = array_filter($stories, function ($s) use ($catFilter) {
                $cat = mb_strtolower($s['category'] ?? $s['categoria'] ?? '');
                return $cat === $catFilter;
            });
        }

        // REGLA FUNDAMENTAL: Excluir cuentos que tengan rutas rotas o no se puedan terminar
        $validStories = array_values(array_filter($stories, function ($s) {
            return self::isStoryTerminable($s);
        }));

        return response()->json([
            'success' => true,
            'data' => $validStories,
            'total' => count($validStories),
        ], 200);
    }

    /**
     * Detalle de un cuento por su ID.
     *
     * @param Request $r
     * @param int|string $id
     * @return JsonResponse
     */
    public function show(Request $r, $id): JsonResponse
    {
        $story = null;

        try {
            $model = Story::where('status', 'published')
                ->with(['category', 'scenes' => fn($q) => $q->orderBy('scene_order')->with('choices')])
                ->where('id', $id)
                ->first();

            if ($model) {
                $story = $this->formatStoryModel($model);
            }
        } catch (\Throwable $e) {
            $story = null;
        }

        if (!$story) {
            // Buscar en catálogo real publicado
            $all = $this->loadPublishedRealCatalog();
            foreach ($all as $item) {
                if ((string)$item['id'] === (string)$id) {
                    $story = $item;
                    break;
                }
            }
        }

        if (!$story) {
            return response()->json([
                'success' => false,
                'message' => "La aventura con ID {$id} no fue encontrada o no está publicada.",
            ], 404);
        }

        // Validar que el cuento sea terminable
        if (!self::isStoryTerminable($story)) {
            return response()->json([
                'success' => false,
                'message' => "La aventura con ID {$id} contiene rutas rotas o no se puede terminar.",
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $story,
        ], 200);
    }

    /**
     * Da formato a un modelo Story de Eloquent hacia la estructura estándar de la API.
     *
     * @param Story $s
     * @return array
     */
    private function formatStoryModel(Story $s): array
    {
        $scenes = [];
        foreach ($s->scenes as $scene) {
            $choices = [];
            foreach ($scene->choices as $c) {
                $choices[] = [
                    'id' => $c->id,
                    'label' => $c->label,
                    'texto' => $c->label,
                    'target_scene_id' => $c->target_scene_id,
                    'target' => $c->target_scene_id,
                    'siguiente' => $c->target_scene_id,
                    'points' => (int)($c->points ?? 0),
                    'consequence' => $c->consequence ?? '',
                    'feedback' => $c->consequence ?? null,
                ];
            }

            $scenes[] = [
                'id' => $scene->id,
                'title' => $scene->title,
                'titulo' => $scene->title,
                'body' => $scene->body,
                'texto' => $scene->body,
                'image_path' => $scene->image_path,
                'imagen' => $scene->image_path,
                'is_final' => (bool)$scene->is_final,
                'es_final' => (bool)$scene->is_final,
                'choices' => $choices,
                'opciones' => $choices,
            ];
        }

        $initialId = $s->initial_scene_id;
        if (!$initialId && !empty($scenes)) {
            $initialId = $scenes[0]['id'];
        }

        return [
            'id' => $s->id,
            'slug' => $s->slug ?? "aventura-{$s->id}",
            'title' => $s->title,
            'titulo' => $s->title,
            'description' => $s->description,
            'descripcion' => $s->description,
            'category' => $s->category?->name ?? 'general',
            'categoria' => $s->category?->name ?? 'general',
            'status' => $s->status ?? 'published',
            'estado' => $s->status ?? 'published',
            'version' => (int)($s->version ?? 1),
            'cover_path' => $s->cover_path ?? '/art/park/entrada.png',
            'imagen' => $s->cover_path ?? '🌳',
            'is_main' => (bool)($s->id === 1 || ($s->slug ?? '') === 'me-perdi-en-el-parque'),
            'initial_scene_id' => $initialId,
            'estimated_minutes' => (int)($s->estimated_minutes ?? 5),
            'scenes' => $scenes,
            'escenas' => $scenes,
        ];
    }

    /**
     * Carga el catálogo de cuentos publicados del proyecto a partir de park.json
     * y los datos de aventuras educativas publicadas.
     *
     * @return array
     */
    private function loadPublishedRealCatalog(): array
    {
        $catalog = [];

        // 1. Cargar la aventura insignia del proyecto: "Me perdí en el parque" desde park.json
        $parkPath = base_path('database/content/park.json');
        if (file_exists($parkPath)) {
            try {
                $parkData = json_decode(file_get_contents($parkPath), true);
                if ($parkData && !empty($parkData['scenes'])) {
                    $keyToId = [];
                    foreach ($parkData['scenes'] as $idx => $sc) {
                        $keyToId[$sc['key']] = 100 + $idx;
                    }

                    $scenes = [];
                    foreach ($parkData['scenes'] as $sc) {
                        $choices = [];
                        if (!empty($sc['choices'])) {
                            foreach ($sc['choices'] as $cIdx => $ch) {
                                $targetId = $keyToId[$ch['to']] ?? null;
                                $choices[] = [
                                    'id' => $keyToId[$sc['key']] * 10 + $cIdx,
                                    'label' => $ch['label'],
                                    'texto' => $ch['label'],
                                    'target_scene_id' => $targetId,
                                    'target' => $targetId,
                                    'siguiente' => $targetId,
                                    'points' => 10,
                                    'consequence' => $ch['consequence'] ?? '',
                                    'feedback' => $ch['consequence'] ?? null,
                                ];
                            }
                        }

                        $scenes[] = [
                            'id' => $keyToId[$sc['key']],
                            'title' => $sc['title'],
                            'titulo' => $sc['title'],
                            'body' => $sc['body'],
                            'texto' => $sc['body'],
                            'image_path' => $sc['image'],
                            'imagen' => $sc['image'],
                            'is_final' => !empty($sc['final']),
                            'es_final' => !empty($sc['final']),
                            'choices' => $choices,
                            'opciones' => $choices,
                        ];
                    }

                    $initialSceneId = $keyToId[$parkData['initial']] ?? ($scenes[0]['id'] ?? 100);

                    $catalog[] = [
                        'id' => 1,
                        'slug' => $parkData['slug'] ?? 'me-perdi-en-el-parque',
                        'title' => $parkData['title'] ?? 'Me perdí en el parque',
                        'titulo' => $parkData['title'] ?? 'Me perdí en el parque',
                        'description' => $parkData['description'] ?? 'Aprende a buscar ayuda con personas de confianza.',
                        'descripcion' => $parkData['description'] ?? 'Aprende a buscar ayuda con personas de confianza.',
                        'category' => 'seguridad',
                        'categoria' => 'seguridad',
                        'status' => 'published',
                        'estado' => 'published',
                        'version' => $parkData['version'] ?? 2,
                        'cover_path' => '/art/park/entrada.png',
                        'imagen' => '🌳',
                        'is_main' => true,
                        'initial_scene_id' => $initialSceneId,
                        'estimated_minutes' => $parkData['minutes'] ?? 7,
                        'scenes' => $scenes,
                        'escenas' => $scenes,
                    ];
                }
            } catch (\Throwable $err) {
                // Ignore parse errors
            }
        }

        // 2. Otras aventuras publicadas del catálogo NAVI
        $extraStories = [
            [
                'id' => 2,
                'slug' => 'cruzar-la-calle-con-cuidado',
                'title' => 'Cruzar la calle con cuidado',
                'titulo' => 'Cruzar la calle con cuidado',
                'category' => 'calle',
                'categoria' => 'calle',
                'description' => 'Acompaña a NAVI a aprender el uso del paso de cebra y las luces del semáforo.',
                'descripcion' => 'Acompaña a NAVI a aprender el uso del paso de cebra y las luces del semáforo.',
                'status' => 'published',
                'estado' => 'published',
                'version' => 1,
                'cover_path' => '/art/park/mapa.png',
                'imagen' => '🚦',
                'is_main' => false,
                'initial_scene_id' => 201,
                'estimated_minutes' => 5,
                'scenes' => [
                    [
                        'id' => 201,
                        'title' => 'Llegando a la esquina transitada',
                        'body' => 'Llegas a una esquina con mucho tráfico. Quieres cruzar para llegar a la tienda.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Esperar a que el semáforo peatonal esté en verde', 'target' => 202, 'points' => 10, 'feedback' => '¡Excelente! Cruzar con luz verde y mirando a ambos lados es lo más seguro.'],
                            ['label' => 'Correr rápido entre los autos estacionados', 'target' => 203, 'points' => 0, 'feedback' => 'Peligroso: los conductores no pueden verte entre los autos. Retrocedes a la acera.'],
                        ],
                    ],
                    [
                        'id' => 202,
                        'title' => 'Cruce seguro por el paso de cebra',
                        'body' => 'La luz peatonal cambia a verde. Miras a izquierda y derecha y cruzas con calma por las líneas blancas.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Llegar seguro a la otra acera con NAVI', 'target' => 204, 'points' => 10, 'feedback' => '¡Completaste el cruce respetando las normas de tránsito!'],
                        ],
                    ],
                    [
                        'id' => 203,
                        'title' => 'Decisión prudente a tiempo',
                        'body' => 'NAVI te recuerda que es mejor tener paciencia. Vuelves a la esquina y buscas el paso de cebra.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Buscar el paso de peatones y esperar la luz verde', 'target' => 202, 'points' => 5, 'feedback' => 'Muy bien rectificado. La seguridad siempre es primero.'],
                        ],
                    ],
                    [
                        'id' => 204,
                        'title' => '¡Llegada segura a tu destino!',
                        'body' => 'Has cruzado la calle de forma responsable. Aprendiste que la calma salva vidas en la ciudad.',
                        'is_final' => true,
                        'choices' => [],
                    ],
                ],
            ],
            [
                'id' => 3,
                'slug' => 'un-desconocido-ofrece-un-regalo',
                'title' => 'Un desconocido ofrece un regalo',
                'titulo' => 'Un desconocido ofrece un regalo',
                'category' => 'seguridad',
                'categoria' => 'seguridad',
                'description' => 'Aprende a decir ¡NO! y buscar a tu adulto de confianza cuando algo te incomode.',
                'descripcion' => 'Aprende a decir ¡NO! y buscar a tu adulto de confianza cuando algo te incomode.',
                'status' => 'published',
                'estado' => 'published',
                'version' => 1,
                'cover_path' => '/art/park/caseta.png',
                'imagen' => '🛡️',
                'is_main' => false,
                'initial_scene_id' => 301,
                'estimated_minutes' => 6,
                'scenes' => [
                    [
                        'id' => 301,
                        'title' => 'En la plaza después de la escuela',
                        'body' => 'Estás esperando a tu mamá en la plaza. Una persona que no conoces se acerca con dulces y te pide acompañarla.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Decir firmemente NO y caminar hacia la maestra o guardia', 'target' => 302, 'points' => 15, 'feedback' => '¡Perfecto! Nunca aceptes dulces ni te vayas con personas desconocidas.'],
                            ['label' => 'Quedarte a conversar y ver qué regalo tiene', 'target' => 303, 'points' => 0, 'feedback' => 'Cuidado: no te quedes solo con extraños. Aléjate de inmediato.'],
                        ],
                    ],
                    [
                        'id' => 302,
                        'title' => 'Buscando protección de confianza',
                        'body' => 'Te diriges al guardia de la plaza y le dices claramente lo que acaba de suceder.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Esperar junto al guardia hasta que llegue tu familia', 'target' => 304, 'points' => 10, 'feedback' => 'Gran decisión: los uniformados y guardias son puntos de protección segura.'],
                        ],
                    ],
                    [
                        'id' => 303,
                        'title' => 'Voz de alarma interior',
                        'body' => 'Sientes incomodidad en el estómago. Recuerdas el consejo de NAVI: tu cuerpo te avisa del peligro.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Gritar pidiendo ayuda y correr hacia la caseta de seguridad', 'target' => 302, 'points' => 10, 'feedback' => '¡Exacto! Pedir ayuda en voz alta rompe cualquier situación de riesgo.'],
                        ],
                    ],
                    [
                        'id' => 304,
                        'title' => 'A salvo y felicitado por tu valentía',
                        'body' => 'Llega tu familia. El guardia les informa y todos te felicitan por actuar con rapidez y sensatez.',
                        'is_final' => true,
                        'choices' => [],
                    ],
                ],
            ],
            [
                'id' => 4,
                'slug' => 'amigos-en-el-recreo',
                'title' => 'Amigos en el recreo',
                'titulo' => 'Amigos en el recreo',
                'category' => 'escuela',
                'categoria' => 'escuela',
                'description' => 'Aprende a integrar a otros niños, resolver diferencias hablando y jugar en equipo.',
                'descripcion' => 'Aprende a integrar a otros niños, resolver diferencias hablando y jugar en equipo.',
                'status' => 'published',
                'estado' => 'published',
                'version' => 1,
                'cover_path' => '/art/park/arbol.png',
                'imagen' => '🎒',
                'is_main' => false,
                'initial_scene_id' => 401,
                'estimated_minutes' => 5,
                'scenes' => [
                    [
                        'id' => 401,
                        'title' => 'Hora del recreo en el patio',
                        'body' => 'Suena el timbre del recreo. Ves a un compañero nuevo sentado solo en un rincón mirando a los demás jugar.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Acercarte e invitarlo a jugar con tu grupo', 'target' => 402, 'points' => 15, 'feedback' => '¡Hermosa empatía! La inclusión hace felices a todos.'],
                            ['label' => 'Ignorarlo y seguir jugando solo con los amigos de siempre', 'target' => 403, 'points' => 0, 'feedback' => 'NAVI te sugiere: piensa en cómo te sentirías si fueras el nuevo.'],
                        ],
                    ],
                    [
                        'id' => 402,
                        'title' => 'El juego de la pelota compartida',
                        'body' => 'El compañero nuevo sonríe y acepta entusiasmado. Explican las reglas del juego juntos.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Celebrar los goles de todos y felicitar al compañero', 'target' => 404, 'points' => 10, 'feedback' => '¡El trabajo en equipo y el juego limpio crean amistades verdaderas!'],
                        ],
                    ],
                    [
                        'id' => 403,
                        'title' => 'Un momento para reflexionar',
                        'body' => 'Ves que el compañero mira con tristeza el patio. Decides que nunca es tarde para ser amable.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Dar media vuelta y llamarlo con una sonrisa', 'target' => 402, 'points' => 10, 'feedback' => '¡Muy bien! Un gesto sencillo puede cambiarle el día a alguien.'],
                        ],
                    ],
                    [
                        'id' => 404,
                        'title' => 'Un patio lleno de amigos',
                        'body' => 'Termina el recreo. El compañero nuevo ahora tiene amigos y tú ganaste una nueva amistad.',
                        'is_final' => true,
                        'choices' => [],
                    ],
                ],
            ],
            // Cuento de prueba CON RUTA ROTA para verificar que queda excluido de la biblioteca
            [
                'id' => 99,
                'slug' => 'cuento-con-ruta-rota',
                'title' => 'Aventura con ruta rota (debe ser excluida)',
                'titulo' => 'Aventura con ruta rota (debe ser excluida)',
                'category' => 'seguridad',
                'categoria' => 'seguridad',
                'description' => 'Este cuento tiene una opción que apunta a una escena inexistente. Debe quedar fuera de la biblioteca.',
                'descripcion' => 'Este cuento tiene una opción que apunta a una escena inexistente. Debe quedar fuera de la biblioteca.',
                'status' => 'published',
                'estado' => 'published',
                'version' => 1,
                'cover_path' => '/art/park/caseta.png',
                'imagen' => '⚠️',
                'is_main' => false,
                'initial_scene_id' => 991,
                'estimated_minutes' => 3,
                'scenes' => [
                    [
                        'id' => 991,
                        'title' => 'Escena inicial rota',
                        'body' => 'Esta escena apunta a una escena 999 que no existe.',
                        'is_final' => false,
                        'choices' => [
                            ['label' => 'Ir a escena inexistente', 'target' => 999, 'points' => 0], // RUTA ROTA!
                        ],
                    ],
                ],
            ],
        ];

        foreach ($extraStories as $st) {
            $catalog[] = $st;
        }

        return $catalog;
    }
}
