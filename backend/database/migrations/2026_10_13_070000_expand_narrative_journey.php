<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
 public function up(): void {
  Schema::table('scenes',function(Blueprint $t){
   $t->unsignedInteger('content_version')->default(1)->index();
   $t->string('presentation',24)->default('story');
   $t->unsignedTinyInteger('act')->default(1);
   $t->text('hint')->nullable();
   $t->string('ending_key',40)->nullable();
   $t->text('takeaway')->nullable();
   $t->string('caption',120)->nullable();
  });
  Schema::table('choices',function(Blueprint $t){
   $t->string('mark_title',120)->nullable(); $t->text('mark_text')->nullable();
   $t->string('mark_kind',24)->default('discovery');
  });
  Schema::table('game_sessions',function(Blueprint $t){$t->string('ending_key',40)->nullable();});
  Schema::create('learning_records',function(Blueprint $t){
   $t->id();
   $t->foreignId('child_profile_id')->constrained('child_profiles');
   $t->foreignId('story_id')->constrained('stories');
   $t->foreignId('game_session_id')->constrained('game_sessions');
   $t->foreignId('scene_id')->nullable()->constrained('scenes');
   $t->foreignId('decision_record_id')->nullable()->unique()->constrained('decision_records');
   $t->string('event_key',80); $t->string('title',120); $t->text('description');
   $t->string('kind',24); $t->timestamp('earned_at');
   $t->unique(['game_session_id','event_key']);
   $t->index(['child_profile_id','earned_at']);
  });
  // Preserve the timestamp and words of decisions made before this update.
  DB::table('decision_records as d')->join('game_sessions as g','g.id','=','d.game_session_id')
   ->select('d.*','g.child_profile_id','g.story_id')->orderBy('d.id')->chunk(200,function($rows){
    foreach($rows as $d) DB::table('learning_records')->insertOrIgnore([
     'child_profile_id'=>$d->child_profile_id,'story_id'=>$d->story_id,'game_session_id'=>$d->game_session_id,
     'scene_id'=>$d->scene_id,'decision_record_id'=>$d->id,'event_key'=>'decision:'.$d->id,
     'title'=>'Una huella de mi camino','description'=>$d->consequence_text ?: 'Esta decisión forma parte de tu aventura.',
     'kind'=>'discovery','earned_at'=>$d->selected_at]);
   });
  foreach([
   ['Primer encuentro','Conociste a NAVI y empezaste una aventura en compañía.'],
   ['La luz que nos reunió','Descubriste el final del farol compartido.'],
   ['Mi voz encontró un camino','Descubriste el final de la ayuda en la caseta.'],
   ['Siempre puedo cambiar de rumbo','Descubriste el final del regreso al árbol.']
  ] as [$name,$description]) DB::table('achievements')->insertOrIgnore(['name'=>$name,'description'=>$description,'requirement_type'=>'narrative_event','requirement_value'=>1]);
 }
 public function down(): void { throw new RuntimeException('Esta migración conserva recuerdos infantiles. Restaura una copia de seguridad para retroceder.'); }
};
