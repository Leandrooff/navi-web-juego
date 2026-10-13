<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class NaviStorySeeder extends Seeder {
 public function run(): void {
  $c=json_decode(file_get_contents(database_path('content/park.json')),true,512,JSON_THROW_ON_ERROR);
  DB::transaction(function()use($c){
   $category=DB::table('categories')->where('name','Seguridad en espacios públicos')->value('id');
   if(!$category)$category=DB::table('categories')->insertGetId(['name'=>'Seguridad en espacios públicos','description'=>'Aprender a pedir ayuda y cuidarnos en compañía.']);
   $story=DB::table('stories')->where('slug',$c['slug'])->orWhere('title',$c['title'])->first();
   $id=$story?->id ?? DB::table('stories')->insertGetId(['category_id'=>$category,'title'=>$c['title'],'story_order'=>(DB::table('stories')->max('story_order')??0)+1,'version'=>$c['version'],'status'=>'published','created_at'=>now(),'updated_at'=>now()]);
   $ids=[];
   foreach($c['scenes'] as $i=>$s){
    $order=$c['version']*1000+$i+1;
    // Each revision has its own IDs. Old sessions keep the exact old graph.
    DB::table('scenes')->updateOrInsert(['story_id'=>$id,'scene_order'=>$order],[
     'content_version'=>$c['version'],'scene_key'=>$s['key'],'title'=>$s['title'],'body'=>$s['body'],
     'image_path'=>$s['image'],'dialogue_id'=>'park.r'.$c['version'].'.'.$s['key'].'.narration',
     'speaker_id'=>$s['speaker'],'locale'=>'es-BO','presentation'=>$s['kind'],'act'=>$s['act'],
     'hint'=>$s['hint'],'caption'=>$s['caption']??null,'ending_key'=>$s['ending']??null,'takeaway'=>$s['takeaway']??null,
     'scene_type'=>!empty($s['final'])?'final':($s['kind']==='cinematic'?'dialogue':'preventive_decision'),
     'is_final'=>!empty($s['final'])]);
    $ids[$s['key']]=DB::table('scenes')->where('story_id',$id)->where('scene_order',$order)->value('id');
   }
   foreach($c['scenes'] as $s)foreach($s['choices'] as $i=>$choice){
    DB::table('choices')->updateOrInsert(['scene_id'=>$ids[$s['key']],'choice_order'=>$i+1],[
     'target_scene_id'=>$ids[$choice['to']],'label'=>$choice['label'],'consequence'=>$choice['consequence'],
     'choice_type'=>'preventive','is_expected_answer'=>null,'points'=>0,
     'dialogue_id'=>'park.r'.$c['version'].'.'.$choice['key'].'.consequence',
     'mark_title'=>$choice['mark']['title'],'mark_text'=>$choice['mark']['text'],'mark_kind'=>$choice['mark']['kind']]);
   }
   DB::table('stories')->where('id',$id)->update(['version'=>$c['version'],'slug'=>$c['slug'],'title'=>$c['title'],
    'description'=>$c['description'],'estimated_minutes'=>$c['minutes'],'cover_path'=>'/art/park/entrada.png',
    'initial_scene_id'=>$ids[$c['initial']],'updated_at'=>now()]);
  });
 }
}
