<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class ClassroomController extends Controller {
    public function index(Request $r) {
        Access::role($r->user(),'docente');
        $groups=DB::table('class_groups')->where('teacher_id',$r->user()->id)->orderBy('id')->get();
        foreach($groups as $g) $g->students_count=DB::table('class_enrollments')->where('class_group_id',$g->id)->whereNull('revoked_at')->count();
        return ['data'=>$groups];
    }
    public function store(Request $r) {
        Access::role($r->user(),'docente');$v=$r->validate(['name'=>'required|string|max:100']);
        $id=DB::table('class_groups')->insertGetId(['teacher_id'=>$r->user()->id,'name'=>$v['name'],'join_code'=>strtoupper(Str::random(12)),'created_at'=>now(),'updated_at'=>now()]);
        return response()->json(['data'=>DB::table('class_groups')->find($id)],201);
    }
    public function show(Request $r,int $id) {
        $group=Access::group($r->user(),$id);
        $students=DB::table('child_profiles as c')->join('class_enrollments as e','e.child_profile_id','=','c.id')->where('e.class_group_id',$id)->whereNull('e.revoked_at')
            ->select('c.id','c.nickname','c.age','c.avatar','c.navi_color','e.approved_at')->get();
        foreach($students as $s){
            $s->attempts=DB::table('game_sessions')->where('child_profile_id',$s->id)->count();
            $s->completed=DB::table('progress')->where('child_profile_id',$s->id)->where('status','completed')->count();
            $s->last_activity=DB::table('decision_records as d')->join('game_sessions as g','g.id','=','d.game_session_id')->where('g.child_profile_id',$s->id)->max('d.selected_at');
        }
        $assignments=DB::table('class_assignments as a')->join('stories as s','s.id','=','a.story_id')->where('a.class_group_id',$id)->select('a.*','s.title')->get();
        return ['data'=>['group'=>$group,'students'=>$students,'assignments'=>$assignments]];
    }
    public function rotate(Request $r,int $id) {
        Access::group($r->user(),$id);DB::table('class_groups')->where('id',$id)->update(['join_code'=>strtoupper(Str::random(12)),'updated_at'=>now()]);
        return ['data'=>DB::table('class_groups')->find($id)];
    }
    public function lookup(Request $r) {
        Access::role($r->user(),'tutor');$v=$r->validate(['code'=>'required|string|size:12']);
        $g=DB::table('class_groups as g')->join('users as u','u.id','=','g.teacher_id')->where('g.join_code',strtoupper($v['code']))
            ->select('g.id','g.name','u.name as teacher_name')->firstOrFail();
        return ['data'=>$g];
    }
    public function enroll(Request $r) {
        Access::role($r->user(),'tutor');
        $v=$r->validate(['code'=>'required|string|size:12','child_profile_id'=>'required|integer','consent'=>'required|accepted']);
        Access::child($r->user(),$v['child_profile_id'],true);
        $group=DB::table('class_groups')->where('join_code',strtoupper($v['code']))->firstOrFail();
        DB::table('class_enrollments')->updateOrInsert(['class_group_id'=>$group->id,'child_profile_id'=>$v['child_profile_id']],
            ['approved_by'=>$r->user()->id,'approved_at'=>now(),'revoked_at'=>null]);
        return ['data'=>['message'=>'Vinculación autorizada.']];
    }
    public function links(Request $r,int $id) {
        Access::child($r->user(),$id,true);
        return ['data'=>DB::table('class_enrollments as e')->join('class_groups as g','g.id','=','e.class_group_id')->join('users as u','u.id','=','g.teacher_id')
            ->where('e.child_profile_id',$id)->whereNull('e.revoked_at')->select('e.id','g.name','u.name as teacher_name','e.approved_at')->get()];
    }
    public function revoke(Request $r,int $id) {
        $link=DB::table('class_enrollments')->find($id);abort_unless($link,404);
        Access::child($r->user(),$link->child_profile_id,true);
        DB::table('class_enrollments')->where('id',$id)->update(['revoked_at'=>now()]);
        return response()->noContent();
    }
    public function assign(Request $r,int $id) {
        Access::group($r->user(),$id);$v=$r->validate(['story_id'=>'required|integer','due_date'=>'nullable|date']);
        abort_unless(DB::table('stories')->where('id',$v['story_id'])->where('status','published')->exists(),422,'Selecciona una aventura publicada.');
        DB::table('class_assignments')->updateOrInsert(['class_group_id'=>$id,'story_id'=>$v['story_id']],['due_date'=>$v['due_date']??null,'created_at'=>now(),'updated_at'=>now()]);
        return ['data'=>['message'=>'Aventura asignada al grupo.']];
    }
    public function unassign(Request $r,int $id,int $assignment) {
        Access::group($r->user(),$id);
        DB::table('class_assignments')->where('id',$assignment)->where('class_group_id',$id)->delete();
        return response()->noContent();
    }
}
