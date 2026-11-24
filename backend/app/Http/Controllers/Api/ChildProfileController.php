<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChildProfileController extends Controller {
    private function fields(Request $r): array {
        return $r->validate(['nickname'=>'required|string|max:40','age'=>'required|integer|between:6,10',
            'avatar'=>'required|in:leaf,moon,sun,river','navi_color'=>'required|in:green,blue,purple,orange',
            'support_level'=>'required|in:high,medium,low']);
    }
    public function index(Request $r) {
        Access::role($r->user(),'tutor');
        return ['data'=>ChildProfile::where('tutor_id',$r->user()->id)->orderBy('id')->get()];
    }
    public function store(Request $r) {
        Access::role($r->user(),'tutor'); $child=new ChildProfile($this->fields($r));
        $child->tutor_id=$r->user()->id; $child->save();
        return response()->json(['data'=>$child],201);
    }
    public function update(Request $r,int $id) {
        $child=Access::child($r->user(),$id,true); $child->update($this->fields($r));
        return ['data'=>$child];
    }
    public function assignments(Request $r,int $id) {
        Access::child($r->user(),$id);
        return ['data'=>DB::table('class_assignments as a')->join('class_groups as g','g.id','=','a.class_group_id')
            ->join('class_enrollments as e','e.class_group_id','=','g.id')->join('stories as s','s.id','=','a.story_id')
            ->where('e.child_profile_id',$id)->whereNull('e.revoked_at')->where('s.status','published')
            ->select('a.id','a.story_id','a.due_date','g.name as group_name','s.title')->get()];
    }
}
