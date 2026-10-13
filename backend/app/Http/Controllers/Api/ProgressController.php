<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ProgressController extends Controller {
    public function index(Request $r,int $id) {
        Access::child($r->user(),$id);
        $progress=DB::table('progress as p')->join('stories as s','s.id','=','p.story_id')->where('p.child_profile_id',$id)
            ->select('p.*','s.title','s.cover_path')->orderBy('p.story_id')->get();
        $achievements=DB::table('child_achievements as c')->join('achievements as a','a.id','=','c.achievement_id')->where('c.child_profile_id',$id)
            ->select('a.name','a.description','a.icon_path','c.unlocked_at')->get();
        return ['data'=>['progress'=>$progress,'stars'=>(int)DB::table('scores')->where('child_profile_id',$id)->sum('stars'),
            'achievements'=>$achievements,
            'memories_count'=>DB::table('learning_records')->where('child_profile_id',$id)->count(),
            'memories'=>DB::table('learning_records')->where('child_profile_id',$id)->orderByDesc('id')->limit(12)->get(),
            'endings'=>DB::table('game_sessions as g')->join('scenes as e','e.id','=','g.current_scene_id')
                ->where('g.child_profile_id',$id)->where('g.status','completed')->whereNotNull('g.ending_key')
                ->select('g.ending_key','e.title','e.image_path',DB::raw('MIN(g.completed_at) as unlocked_at'))
                ->groupBy('g.ending_key','e.title','e.image_path')->get(),'attempts'=>(int)DB::table('game_sessions')->where('child_profile_id',$id)->count(),
            'completed'=>$progress->where('status','completed')->count(),
            'active_sessions'=>DB::table('game_sessions')->where('child_profile_id',$id)->where('status','in_progress')->select('id','story_id','current_scene_id')->get()]];
    }
    public function memories(Request $r,int $id) {
        Access::child($r->user(),$id);
        return ['data'=>DB::table('learning_records as l')->leftJoin('scenes as e','e.id','=','l.scene_id')
            ->where('l.child_profile_id',$id)->select('l.*','e.title as scene_title','e.image_path')
            ->orderByDesc('l.id')->paginate(20)];
    }
    public function history(Request $r,int $id) {
        Access::child($r->user(),$id);
        $v=$r->validate(['from'=>'nullable|date','to'=>'nullable|date','story_id'=>'nullable|integer']);
        if($r->filled('from') && $r->filled('to')) $r->validate(['to'=>'after_or_equal:from']);
        $q=DB::table('game_sessions as g')->join('stories as s','s.id','=','g.story_id')->where('g.child_profile_id',$id)
            ->select('g.*','s.title')->orderByDesc('g.id');
        if(!empty($v['from']))$q->whereDate('g.started_at','>=',$v['from']);
        if(!empty($v['to']))$q->whereDate('g.started_at','<=',$v['to']);
        if(!empty($v['story_id']))$q->where('g.story_id',$v['story_id']);
        $page=$q->paginate(20);
        $page->getCollection()->transform(function($s){
            $s->decisions=DB::table('decision_records as d')->join('choices as c','c.id','=','d.choice_id')->join('scenes as e','e.id','=','d.scene_id')
                ->where('d.game_session_id',$s->id)->orderBy('d.id')
                ->select('d.id','d.selected_at',DB::raw('COALESCE(d.choice_text,c.label) as choice_text'),DB::raw('COALESCE(d.consequence_text,c.consequence) as consequence_text'),DB::raw('COALESCE(d.scene_title,e.title) as scene_title'))->get();
            $s->memories=DB::table('learning_records')->where('game_session_id',$s->id)->orderBy('id')->get();
            return $s;
        });
        return ['data'=>$page];
    }
}
