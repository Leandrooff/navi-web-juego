<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        foreach(DB::table('decision_records')->whereNull('choice_text')->orderBy('id')->cursor() as $d){
            $choice=DB::table('choices')->find($d->choice_id);
            $scene=DB::table('scenes')->find($d->scene_id);
            DB::table('decision_records')->where('id',$d->id)->update([
                'choice_text'=>$choice->label??null,'consequence_text'=>$choice->consequence??null,
                'scene_title'=>$scene->title??null,'target_scene_id'=>$choice->target_scene_id??null,
                'acknowledged_at'=>$d->selected_at
            ]);
        }
        $hasInitial=false;
        foreach(Schema::getForeignKeys('stories') as $foreign){
            if(in_array('initial_scene_id',$foreign['columns']))$hasInitial=true;
        }
        if(!$hasInitial)Schema::table('stories',fn(Blueprint $t)=>$t->foreign('initial_scene_id')->references('id')->on('scenes')->nullOnDelete());
    }
    public function down(): void {throw new RuntimeException('No se eliminan instantáneas del historial.');}
};
