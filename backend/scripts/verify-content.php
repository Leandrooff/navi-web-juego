<?php
require __DIR__.'/../vendor/autoload.php';
$app=require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
$s=DB::table('stories')->where('slug','me-perdi-en-el-parque')->firstOrFail();
$scenes=DB::table('scenes')->where('story_id',$s->id)->where('content_version',$s->version)->get()->keyBy('id');
$choices=DB::table('choices')->whereIn('scene_id',$scenes->keys())->get();
$paths=0;
$walk=function($id,$visited=[])use(&$walk,&$paths,$scenes,$choices){
    if(in_array($id,$visited))throw new RuntimeException('Hay un ciclo.');
    $scene=$scenes[$id]??null;if(!$scene)throw new RuntimeException('Falta una escena.');
    if($scene->is_final){$paths++;return;}
    foreach($choices->where('scene_id',$id) as $c){
        if(!$c->consequence)throw new RuntimeException('Falta una consecuencia.');
        $walk($c->target_scene_id,[...$visited,$id]);
    }
};
$walk($s->initial_scene_id);
echo json_encode(['scenes'=>$scenes->count(),'choices'=>$choices->count(),'complete_paths'=>$paths,'story_id'=>$s->id],JSON_PRETTY_PRINT)."\n";
