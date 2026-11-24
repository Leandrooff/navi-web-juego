<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NaviStorySeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            /*
            |--------------------------------------------------------------------------
            | 1. CATEGORÍA
            |--------------------------------------------------------------------------
            */

            $categoryId = DB::table('categories')
                ->where(
                    'name',
                    'Seguridad en espacios públicos'
                )
                ->value('id');

            if (!$categoryId) {
                $categoryId = DB::table('categories')
                    ->insertGetId([
                        'name' =>
                            'Seguridad en espacios públicos',

                        'description' =>
                            'Historias preventivas sobre cómo actuar de forma segura en espacios públicos.',
                    ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 2. ELIMINAR VERSIÓN ANTERIOR DEL CUENTO
            |--------------------------------------------------------------------------
            */

            $storyId = DB::table('stories')
                ->where(
                    'title',
                    'Me perdí en el parque'
                )
                ->value('id');

            if ($storyId) {

                $sceneIdsAnteriores = DB::table('scenes')
                    ->where('story_id', $storyId)
                    ->pluck('id');

                /*
                 * Primero quitamos la referencia
                 * a la escena inicial.
                 */
                DB::table('stories')
                    ->where('id', $storyId)
                    ->update([
                        'initial_scene_id' => null,
                    ]);

                /*
                 * Eliminamos las opciones antes
                 * de eliminar las escenas.
                 */
                if ($sceneIdsAnteriores->isNotEmpty()) {
                    DB::table('choices')
                        ->whereIn(
                            'scene_id',
                            $sceneIdsAnteriores
                        )
                        ->delete();
                }

                DB::table('scenes')
                    ->where('story_id', $storyId)
                    ->delete();

                DB::table('stories')
                    ->where('id', $storyId)
                    ->delete();
            }

            /*
            |--------------------------------------------------------------------------
            | 3. CREAR HISTORIA
            |--------------------------------------------------------------------------
            */

            $storyId = DB::table('stories')
                ->insertGetId([
                    'category_id' => $categoryId,

                    'title' =>
                        'Me perdí en el parque',

                    'description' =>
                        'Acompaña a Navi y practica cómo pedir ayuda si te separas de tu tutor.',

                    'version' => 1,

                    'story_order' => 1,

                    'status' => 'published',

                    'estimated_minutes' => 8,

                    'initial_scene_id' => null,

                    'created_at' => now(),

                    'updated_at' => now(),
                ]);

            /*
            |--------------------------------------------------------------------------
            | 4. ESCENAS DEL CUENTO
            |--------------------------------------------------------------------------
            */

            $scenes = [

                'inicio' => [
                    'title' =>
                        '¿Dónde está mi tutor?',

                    'body' =>
                        'Estabas jugando cerca de los árboles. Al mirar alrededor, ya no ves a tu tutor. Respira despacio: puedes elegir cómo pedir ayuda.',

                    'scene_order' => 1,

                    'scene_type' =>
                        'preventive_decision',

                    'is_final' => false,
                ],

                'caseta' => [
                    'title' =>
                        'Un lugar para pedir ayuda',

                    'body' =>
                        'Una trabajadora identificada del parque te escucha y avisa a sus compañeros. ¿Qué haces mientras buscan a tu tutor?',

                    'scene_order' => 2,

                    'scene_type' =>
                        'preventive_decision',

                    'is_final' => false,
                ],

                'punto-visible' => [
                    'title' =>
                        'Me quedo donde puedan verme',

                    'body' =>
                        'Estás cerca de un banco visible. Desde allí ves la caseta de información y un sendero que lleva hacia la salida.',

                    'scene_order' => 3,

                    'scene_type' =>
                        'preventive_decision',

                    'is_final' => false,
                ],

                'sendero' => [
                    'title' =>
                        'Todavía puedo pedir ayuda',

                    'body' =>
                        'En el sendero ves a un trabajador identificado del parque. Una persona que no conoces también te ofrece llevarte fuera del parque para buscar a tu tutor.',

                    'scene_order' => 4,

                    'scene_type' =>
                        'preventive_decision',

                    'is_final' => false,
                ],

                'reencuentro' => [
                    'title' =>
                        '¡Volvemos a encontrarnos!',

                    'body' =>
                        'Tu tutor llega al punto de ayuda. Ya están juntos. Antes de seguir jugando, ¿qué acuerdo pueden hacer?',

                    'scene_order' => 5,

                    'scene_type' =>
                        'preventive_decision',

                    'is_final' => false,
                ],

                'cierre' => [
                    'title' =>
                        'Terminaste la aventura',

                    'body' =>
                        'Cada decisión fue una oportunidad para aprender. Puedes revisar tu recorrido o volver a intentarlo.',

                    'scene_order' => 6,

                    'scene_type' =>
                        'final',

                    'is_final' => true,
                ],
            ];

            /*
            |--------------------------------------------------------------------------
            | 5. INSERTAR ESCENAS
            |--------------------------------------------------------------------------
            */

            $sceneIds = [];

            foreach ($scenes as $key => $scene) {

                $sceneIds[$key] = DB::table('scenes')
                    ->insertGetId([
                        'story_id' =>
                            $storyId,

                        'title' =>
                            $scene['title'],

                        'body' =>
                            $scene['body'],

                        'scene_order' =>
                            $scene['scene_order'],

                        'image_path' =>
                            null,

                        'audio_path' =>
                            null,

                        'scene_type' =>
                            $scene['scene_type'],

                        'is_final' =>
                            $scene['is_final'],
                    ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 6. DEFINIR ESCENA INICIAL
            |--------------------------------------------------------------------------
            */

            DB::table('stories')
                ->where('id', $storyId)
                ->update([
                    'initial_scene_id' =>
                        $sceneIds['inicio'],

                    'updated_at' =>
                        now(),
                ]);

            /*
            |--------------------------------------------------------------------------
            | 7. OPCIONES Y CONSECUENCIAS
            |--------------------------------------------------------------------------
            */

            $choices = [

                /*
                 * ESCENA: INICIO
                 */

                [
                    'scene' => 'inicio',

                    'target' => 'caseta',

                    'label' =>
                        'Pedir ayuda en la caseta del parque',

                    'consequence' =>
                        'La caseta es un lugar identificado. Su personal puede ayudarte a localizar a tu tutor sin salir del parque.',

                    'order' => 1,

                    'points' => 10,
                ],

                [
                    'scene' => 'inicio',

                    'target' =>
                        'punto-visible',

                    'label' =>
                        'Quedarme en un lugar visible y pedir ayuda',

                    'consequence' =>
                        'Quedarte visible evita alejarte más. Ahora busca ayuda de personal identificado del parque.',

                    'order' => 2,

                    'points' => 5,
                ],

                [
                    'scene' => 'inicio',

                    'target' => 'sendero',

                    'label' =>
                        'Salir del área de juegos para buscar por mi cuenta',

                    'consequence' =>
                        'Alejarte sin compañía puede dificultar que te encuentren. Todavía puedes detenerte y pedir ayuda segura.',

                    'order' => 3,

                    'points' => 0,
                ],

                /*
                 * ESCENA: CASETA
                 */

                [
                    'scene' => 'caseta',

                    'target' =>
                        'reencuentro',

                    'label' =>
                        'Esperar en la caseta con el personal',

                    'consequence' =>
                        'Esperar en el lugar acordado facilita el reencuentro. El personal del parque localiza a tu tutor.',

                    'order' => 1,

                    'points' => 10,
                ],

                [
                    'scene' => 'caseta',

                    'target' =>
                        'sendero',

                    'label' =>
                        'Volver a salir para buscar sin compañía',

                    'consequence' =>
                        'Si cambias de lugar, tu tutor y el personal pueden no encontrarte. Detente para volver a pedir ayuda.',

                    'order' => 2,

                    'points' => 0,
                ],

                /*
                 * ESCENA: PUNTO VISIBLE
                 */

                [
                    'scene' =>
                        'punto-visible',

                    'target' =>
                        'caseta',

                    'label' =>
                        'Pedir ayuda al personal de la caseta cercana',

                    'consequence' =>
                        'Reconoces un lugar de ayuda y buscas personal identificado. Ya no tienes que resolverlo sin compañía.',

                    'order' => 1,

                    'points' => 10,
                ],

                [
                    'scene' =>
                        'punto-visible',

                    'target' =>
                        'sendero',

                    'label' =>
                        'Correr por el sendero hacia la salida',

                    'consequence' =>
                        'Correr puede alejarte del lugar donde te están buscando. Haz una pausa y busca ayuda segura.',

                    'order' => 2,

                    'points' => 0,
                ],

                /*
                 * ESCENA: SENDERO
                 */

                [
                    'scene' =>
                        'sendero',

                    'target' =>
                        'reencuentro',

                    'label' =>
                        'Pedir ayuda al trabajador del parque',

                    'consequence' =>
                        'Te detienes y eliges ayuda identificada. El trabajador avisa a la caseta para organizar el reencuentro.',

                    'order' => 1,

                    'points' => 5,
                ],

                [
                    'scene' =>
                        'sendero',

                    'target' =>
                        'cierre',

                    'label' =>
                        'Aceptar salir con la persona desconocida',

                    'consequence' =>
                        'En esta práctica aprendemos que no debemos salir con desconocidos. Si te pierdes, quédate en un lugar visible y busca personal identificado.',

                    'order' => 2,

                    'points' => 0,
                ],

                /*
                 * ESCENA: REENCUENTRO
                 */

                [
                    'scene' =>
                        'reencuentro',

                    'target' =>
                        'cierre',

                    'label' =>
                        'Acordar un punto de encuentro y mantenernos cerca',

                    'consequence' =>
                        'Un punto de encuentro y mantenerse cerca ayudan a prevenir otra separación. ¡Buen aprendizaje!',

                    'order' => 1,

                    'points' => 5,
                ],

                [
                    'scene' =>
                        'reencuentro',

                    'target' =>
                        'cierre',

                    'label' =>
                        'Volver a jugar sin acordar dónde encontrarnos',

                    'consequence' =>
                        'Antes de jugar conviene acordar un punto de encuentro. Puedes practicarlo con tu tutor en la próxima visita.',

                    'order' => 2,

                    'points' => 0,
                ],
            ];

            /*
            |--------------------------------------------------------------------------
            | 8. INSERTAR OPCIONES
            |--------------------------------------------------------------------------
            */

            foreach ($choices as $choice) {

                DB::table('choices')->insert([

                    'scene_id' =>
                        $sceneIds[
                            $choice['scene']
                        ],

                    'target_scene_id' =>
                        $sceneIds[
                            $choice['target']
                        ],

                    'label' =>
                        $choice['label'],

                    'consequence' =>
                        $choice['consequence'],

                    'choice_order' =>
                        $choice['order'],

                    /*
                     * Son decisiones preventivas.
                     */
                    'choice_type' =>
                        'preventive',

                    /*
                     * No se marca automáticamente
                     * como correcta o incorrecta.
                     */
                    'is_expected_answer' =>
                        null,

                    /*
                     * Se conserva el valor original
                     * del motor importado.
                     */
                    'points' =>
                        $choice['points'],
                ]);
            }
        });
    }
}