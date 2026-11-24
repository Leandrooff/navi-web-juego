<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameSessionController extends Controller {
    private function payload(object $s): array {
        return ['session'=>$s,'pending'=>$s->pending_decision_id ? DB::table('decision_records')->find($s->pending_decision_id):null,
            'marks'=>DB::table('learning_records')->where('game_session_id',$s->id)->orderBy('id')->get(),
            'decisions'=>DB::table('decision_records')->where('game_session_id',$s->id)->orderBy('id')->get()];
    }
    private function mark(object $s,string $key,string $title,string $description,string $kind,?int $scene=null,?int $decision=null): void {
        DB::table('learning_records')->insertOrIgnore(['child_profile_id'=>$s->child_profile_id,'story_id'=>$s->story_id,
            'game_session_id'=>$s->id,'scene_id'=>$scene,'decision_record_id'=>$decision,'event_key'=>$key,
            'title'=>$title,'description'=>$description,'kind'=>$kind,'earned_at'=>now()]);
    }
    private function unlock(object $s,string $name): void {
        $a=DB::table('achievements')->where('name',$name)->value('id');
        if($a)DB::table('child_achievements')->insertOrIgnore(['child_profile_id'=>$s->child_profile_id,'achievement_id'=>$a,'unlocked_at'=>now()]);
    }
    public function hint(Request $r,int $id) {
        $v=$r->validate(['scene_id'=>'required|integer']);
        return DB::transaction(function()use($r,$id,$v){
            $s=$this->locked($r,$id);
            abort_unless($s->status==='in_progress' && !$s->pending_decision_id && $s->current_scene_id==$v['scene_id'],409);
            $scene=DB::table('scenes')->find($s->current_scene_id);
            abort_unless($scene && $scene->hint,422);
            $this->mark($s,'hint:'.$scene->id,'Una pista cuando la necesito','Pediste una pista para pensar tu siguiente paso.','support',$scene->id);
            return ['data'=>$this->payload($s)];
        });
    }
    private function locked(Request $r,int $id): object {
        $s=DB::table('game_sessions')->find($id); abort_unless($s,404);
        Access::child($r->user(),$s->child_profile_id,true);
        ChildProfile::whereKey($s->child_profile_id)->lockForUpdate()->firstOrFail();
        return DB::table('game_sessions')->where('id',$id)->lockForUpdate()->firstOrFail();
    }
    public function store(Request $r) {
        $v=$r->validate(['child_profile_id'=>'required|integer','story_id'=>'required|integer','request_key'=>'required|uuid']);
        Access::child($r->user(),$v['child_profile_id'],true);
        return DB::transaction(function()use($r,$v){
            ChildProfile::whereKey($v['child_profile_id'])->lockForUpdate()->firstOrFail();
            $story=DB::table('stories')->where('id',$v['story_id'])->where('status','published')->firstOrFail();
            abort_unless($story->initial_scene_id,422,'Esta aventura aún no tiene una escena inicial.');
            $same=DB::table('game_sessions')->where('start_key',$v['request_key'])->first();
            if ($same) { abort_unless($same->child_profile_id==$v['child_profile_id'] && $same->story_id==$story->id,409); return ['data'=>$this->payload($same)]; }
            $active=DB::table('game_sessions')->where('child_profile_id',$v['child_profile_id'])->where('story_id',$story->id)->where('status','in_progress')->orderByDesc('id')->first();
            if ($active) return ['data'=>$this->payload($active)];
            $id=DB::table('game_sessions')->insertGetId(['child_profile_id'=>$v['child_profile_id'],'story_id'=>$story->id,'story_version'=>$story->version,
                'current_scene_id'=>$story->initial_scene_id,'start_key'=>$v['request_key'],'status'=>'in_progress','started_at'=>now()]);
            $this->mark(DB::table('game_sessions')->find($id),'start','Abro mi cuaderno','Empezaste un nuevo recorrido.','discovery',$story->initial_scene_id);
            $key=['child_profile_id'=>$v['child_profile_id'],'story_id'=>$story->id];
            $old=DB::table('progress')->where($key)->first();
            DB::table('progress')->updateOrInsert($key,['status'=>$old && $old->completed_at?'completed':'in_progress','last_scene_id'=>$story->initial_scene_id,
                'attempts'=>($old->attempts??0)+1,'started_at'=>$old->started_at??now(),'updated_at'=>now()]);
            return response()->json(['data'=>$this->payload(DB::table('game_sessions')->find($id))],201);
        });
    }
    public function show(Request $r,int $id) {
        $s=DB::table('game_sessions')->find($id); abort_unless($s,404);
        Access::child($r->user(),$s->child_profile_id);
        return ['data'=>$this->payload($s)];
    }
    public function decision(Request $r,int $id) {
        $v=$r->validate(['scene_id'=>'required|integer','choice_id'=>'required|integer','request_key'=>'required|uuid']);
        return DB::transaction(function()use($r,$id,$v){
            $s=$this->locked($r,$id);
            $same=DB::table('decision_records')->where('game_session_id',$id)->where('request_key',$v['request_key'])->first();
            if($same){
                abort_unless($same->choice_id==$v['choice_id'] && $same->scene_id==$v['scene_id'],409);
                return ['data'=>$this->payload($s)];
            }
            abort_unless($s->status==='in_progress',409,'La aventura ya terminó.');
            abort_unless(!$s->pending_decision_id && $s->current_scene_id==$v['scene_id'],409,'Actualiza la aventura para continuar desde la escena guardada.');
            $scene=DB::table('scenes')->where('id',$s->current_scene_id)->where('story_id',$s->story_id)->firstOrFail();
            $choice=DB::table('choices')->where('id',$v['choice_id'])->where('scene_id',$scene->id)->firstOrFail();
            abort_unless(DB::table('scenes')->where('id',$choice->target_scene_id)->where('story_id',$s->story_id)->where('content_version',$s->story_version)->exists(),422,'La escena de destino no está disponible.');
            $seq=DB::table('decision_records')->where('game_session_id',$id)->count()+1;
            $decisionId=DB::table('decision_records')->insertGetId(['game_session_id'=>$id,'scene_id'=>$scene->id,'choice_id'=>$choice->id,
                'request_key'=>$v['request_key'],'sequence'=>$seq,'selected_at'=>now(),'choice_text'=>$choice->label,'consequence_text'=>$choice->consequence,
                'scene_title'=>$scene->title,'target_scene_id'=>$choice->target_scene_id]);
            $this->mark($s,'decision:'.$decisionId,$choice->mark_title?:'Una huella de mi camino',
                $choice->mark_text?:$choice->consequence,$choice->mark_kind??'discovery',$scene->id,$decisionId);
            if($scene->scene_key==='encuentro')$this->unlock($s,'Primer encuentro');
            DB::table('game_sessions')->where('id',$id)->update(['pending_decision_id'=>$decisionId]);
            return ['data'=>$this->payload(DB::table('game_sessions')->find($id))];
        });
    }
    public function advance(Request $r,int $id) {
        $v=$r->validate(['decision_id'=>'required|integer']);
        return DB::transaction(function()use($r,$id,$v){
            $s=$this->locked($r,$id);
            $d=DB::table('decision_records')->where('id',$v['decision_id'])->where('game_session_id',$id)->firstOrFail();
            if ($d->acknowledged_at) return ['data'=>$this->payload($s)];
            abort_unless($s->status==='in_progress' && $s->pending_decision_id==$d->id,409);
            DB::table('decision_records')->where('id',$d->id)->update(['acknowledged_at'=>now()]);
            DB::table('game_sessions')->where('id',$id)->update(['current_scene_id'=>$d->target_scene_id,'pending_decision_id'=>null]);
            DB::table('progress')->where('child_profile_id',$s->child_profile_id)->where('story_id',$s->story_id)
                ->update(['last_scene_id'=>$d->target_scene_id,'updated_at'=>now()]);
            return ['data'=>$this->payload(DB::table('game_sessions')->find($id))];
        });
    }
    public function finish(Request $r,int $id) {
        return DB::transaction(function()use($r,$id){
            $s=$this->locked($r,$id);
            if ($s->status==='completed') return ['data'=>['session'=>$s,'new_star'=>false]];
            $scene=DB::table('scenes')->find($s->current_scene_id);
            abort_unless($s->status==='in_progress' && !$s->pending_decision_id && $scene && $scene->is_final,409,'Continúa hasta el final para guardar tu estrella.');
            $key=['child_profile_id'=>$s->child_profile_id,'story_id'=>$s->story_id];
            $reward=DB::table('scores')->where($key)->first();
            $newStar=!$reward || $reward->stars<1;
            DB::table('scores')->updateOrInsert($key,['stars'=>1,'score'=>0,'updated_at'=>now()]);
            DB::table('game_sessions')->where('id',$id)->update(['status'=>'completed','completed_at'=>now(),'ending_key'=>$scene->ending_key]);
            DB::table('progress')->where($key)->update(['status'=>'completed','completed_at'=>now(),'last_scene_id'=>$scene->id,'updated_at'=>now()]);
            $this->mark($s,'finish',$scene->title,$scene->takeaway?:'Completaste tu aventura.','ending',$scene->id);
            if($scene->ending_key)$this->unlock($s,$scene->title);
            $achievement=DB::table('achievements')->where('name','Primera luz')->value('id');
            if($achievement) DB::table('child_achievements')->insertOrIgnore(['child_profile_id'=>$s->child_profile_id,'achievement_id'=>$achievement,'unlocked_at'=>now()]);
            return ['data'=>['session'=>DB::table('game_sessions')->find($id),'new_star'=>$newStar]];
        });
    }
}
