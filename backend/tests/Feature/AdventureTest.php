<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\{User,ChildProfile};
use Database\Seeders\NaviStorySeeder;

class AdventureTest extends TestCase {
    use DatabaseTransactions;
    protected function setUp(): void {
        parent::setUp();
        $this->assertSame('mysql',DB::getDriverName(),'Las pruebas requieren MariaDB.');
        $this->assertStringEndsWith('_test',DB::getDatabaseName(),'Utiliza exclusivamente una base separada terminada en _test.');
    }
    private function adult(string $role='tutor'): User {
        return User::create(['name'=>'Cuenta de prueba','email'=>Str::uuid().'@example.test','password'=>'PruebaNavi12345','role_id'=>DB::table('roles')->where('name',$role)->value('id'),'status'=>'active']);
    }
    private function child(User $u): ChildProfile {
        $c=new ChildProfile(['nickname'=>'Explorador de prueba','age'=>8,'avatar'=>'leaf','support_level'=>'high','navi_color'=>'green']);$c->tutor_id=$u->id;$c->save();return $c;
    }
    private function story(): object {return DB::table('stories')->where('slug','me-perdi-en-el-parque')->firstOrFail();}
    private function start(ChildProfile $c,?string $key=null): array {
        return $this->postJson('/api/game-sessions',['child_profile_id'=>$c->id,'story_id'=>$this->story()->id,'request_key'=>$key??(string)Str::uuid()])->assertSuccessful()->json('data');
    }
    private function finishPath(array $saved,array $indices=[]): array {
        for($i=0;$i<40;$i++){
            $s=$saved['session'];$scene=DB::table('scenes')->find($s['current_scene_id']);
            if($scene->is_final)return $this->postJson('/api/game-sessions/'.$s['id'].'/finish')->assertOk()->json('data');
            $choices=DB::table('choices')->where('scene_id',$scene->id)->orderBy('choice_order')->get();
            $choice=$choices[$indices[$i]??0];
            $saved=$this->postJson('/api/game-sessions/'.$s['id'].'/decisions',['scene_id'=>$scene->id,'choice_id'=>$choice->id,'request_key'=>(string)Str::uuid()])->assertOk()->json('data');
            $saved=$this->postJson('/api/game-sessions/'.$s['id'].'/continue',['decision_id'=>$saved['pending']['id']])->assertOk()->json('data');
        }
        $this->fail('Ruta sin final.');
    }
    public function test_public_content_has_expanded_illustrated_scenes_and_no_voice(): void {
        $s=$this->getJson('/api/stories/'.$this->story()->id)->assertOk()->json('data');
        $this->assertCount(34,$s['scenes']);$this->assertSame(53,collect($s['scenes'])->sum(fn($s)=>count($s['choices'])));
        foreach($s['scenes'] as $scene){$this->assertStringStartsWith('/art/',$scene['image_path']);$this->assertNull($scene['audio_path']);}
        DB::table('stories')->where('id',$s['id'])->update(['status'=>'draft']);
        $this->getJson('/api/stories/'.$s['id'])->assertNotFound();
        $this->getJson('/api/stories')->assertJsonCount(0,'data');
    }
    public function test_unauthenticated_requests_are_rejected(): void {
        $this->getJson('/api/child-profiles')->assertUnauthorized();
        $this->getJson('/api/child-profiles/1/progress')->assertUnauthorized();
        $this->postJson('/api/game-sessions',[])->assertUnauthorized();
    }
    public function test_adult_registration_login_logout_and_password_hash(): void {
        $email=Str::uuid().'@example.test';
        $this->postJson('/api/auth/register',['name'=>'Prueba','email'=>$email,'password'=>'ClaveLarga123','password_confirmation'=>'ClaveLarga123','role'=>'tutor'])->assertCreated()->assertJsonPath('data.role','tutor');
        $u=User::where('email',$email)->first();$this->assertNotSame('ClaveLarga123',$u->password);
        $this->getJson('/api/auth/me')->assertOk();
        $this->postJson('/api/auth/logout')->assertNoContent();
        $this->postJson('/api/auth/login',['email'=>$email,'password'=>'incorrecta'])->assertUnprocessable();
        $this->postJson('/api/auth/login',['email'=>$email,'password'=>'ClaveLarga123'])->assertOk();
        $this->postJson('/api/auth/register',['name'=>'Prueba','email'=>Str::uuid().'@example.test','password'=>'ClaveLarga123','password_confirmation'=>'ClaveLarga123','role'=>'admin'])->assertUnprocessable();
    }
    public function test_profiles_validate_age_and_cannot_be_read_or_changed_by_another_tutor(): void {
        $owner=$this->adult();$child=$this->child($owner);$other=$this->adult();$this->actingAs($other);
        $this->getJson('/api/child-profiles/'.$child->id.'/progress')->assertNotFound();
        $this->getJson('/api/child-profiles/'.$child->id.'/history')->assertNotFound();
        $this->getJson('/api/child-profiles/'.$child->id.'/memories')->assertNotFound();
        $this->putJson('/api/child-profiles/'.$child->id,[])->assertNotFound();
        $this->postJson('/api/game-sessions',['child_profile_id'=>$child->id,'story_id'=>$this->story()->id,'request_key'=>(string)Str::uuid()])->assertNotFound();
        $this->postJson('/api/child-profiles',['nickname'=>'Prueba','age'=>4,'avatar'=>'leaf','navi_color'=>'green','support_level'=>'high'])->assertUnprocessable();
    }
    public function test_session_start_decisions_continue_and_rewards_are_idempotent(): void {
        $u=$this->adult();$c=$this->child($u);$this->actingAs($u);$key=(string)Str::uuid();
        $a=$this->start($c,$key);$b=$this->start($c,$key);$d=$this->start($c);
        $this->assertSame($a['session']['id'],$b['session']['id']);$this->assertSame($a['session']['id'],$d['session']['id']);
        $id=$a['session']['id'];$this->postJson("/api/game-sessions/$id/finish")->assertConflict();
        $scene=DB::table('scenes')->find($a['session']['current_scene_id']);$choice=DB::table('choices')->where('scene_id',$scene->id)->first();
        $body=['scene_id'=>$scene->id,'choice_id'=>$choice->id,'request_key'=>(string)Str::uuid()];
        $a=$this->postJson("/api/game-sessions/$id/decisions",$body)->assertOk()->json('data');
        $this->postJson("/api/game-sessions/$id/decisions",$body)->assertOk();
        $this->assertSame(1,DB::table('decision_records')->where('game_session_id',$id)->count());
        $this->getJson("/api/game-sessions/$id")->assertJsonPath('data.pending.id',$a['pending']['id']);
        $continue=['decision_id'=>$a['pending']['id']];
        $a=$this->postJson("/api/game-sessions/$id/continue",$continue)->assertOk()->json('data');
        $this->postJson("/api/game-sessions/$id/continue",$continue)->assertOk();
        $body['request_key']=(string)Str::uuid();$this->postJson("/api/game-sessions/$id/decisions",$body)->assertConflict();
        $end=$this->finishPath($a);$this->assertTrue($end['new_star']);
        $this->postJson("/api/game-sessions/$id/finish")->assertOk()->assertJsonPath('data.new_star',false);
        $second=$this->start($c);$this->getJson('/api/child-profiles/'.$c->id.'/progress')->assertJsonPath('data.completed',1);
        $end=$this->finishPath($second);$this->assertFalse($end['new_star']);
        $this->getJson('/api/child-profiles/'.$c->id.'/progress')->assertJsonPath('data.stars',1)->assertJsonPath('data.attempts',2)->assertJsonCount(3,'data.achievements');
    }
    public function test_foreign_session_cannot_be_read_finished_or_changed(): void {
        $owner=$this->adult();$c=$this->child($owner);$this->actingAs($owner);$s=$this->start($c)['session'];$this->actingAs($this->adult());
        $this->getJson('/api/game-sessions/'.$s['id'])->assertNotFound();
        $this->postJson('/api/game-sessions/'.$s['id'].'/finish')->assertNotFound();
        $this->postJson('/api/game-sessions/'.$s['id'].'/decisions',['scene_id'=>$s['current_scene_id'],'choice_id'=>1,'request_key'=>(string)Str::uuid()])->assertNotFound();
    }
    public function test_teacher_needs_tutor_consent_and_cannot_play_or_modify_child(): void {
        $teacher=$this->adult('docente');$guardian=$this->adult();$child=$this->child($guardian);
        $this->actingAs($teacher);$group=$this->postJson('/api/classrooms',['name'=>'Grupo de prueba'])->assertCreated()->json('data');
        $this->getJson('/api/child-profiles/'.$child->id.'/progress')->assertNotFound();
        $this->actingAs($guardian);
        $this->postJson('/api/enrollments',['code'=>$group['join_code'],'child_profile_id'=>$child->id,'consent'=>false])->assertUnprocessable();
        $this->postJson('/api/enrollments',['code'=>$group['join_code'],'child_profile_id'=>$child->id,'consent'=>true])->assertOk();
        $this->actingAs($teacher);
        $this->getJson('/api/child-profiles/'.$child->id.'/progress')->assertOk();
        $this->getJson('/api/classrooms/'.$group['id'])->assertOk()->assertJsonCount(1,'data.students');
        $this->putJson('/api/child-profiles/'.$child->id,[])->assertNotFound();
        $this->postJson('/api/game-sessions',['child_profile_id'=>$child->id,'story_id'=>$this->story()->id,'request_key'=>(string)Str::uuid()])->assertNotFound();
        $this->postJson('/api/classrooms/'.$group['id'].'/assignments',['story_id'=>$this->story()->id])->assertOk();
        $this->actingAs($guardian);$this->getJson('/api/child-profiles/'.$child->id.'/assignments')->assertJsonCount(1,'data');
        $link=DB::table('class_enrollments')->where('child_profile_id',$child->id)->value('id');
        $this->deleteJson('/api/enrollments/'.$link)->assertNoContent();
        $this->actingAs($teacher);$this->getJson('/api/child-profiles/'.$child->id.'/progress')->assertNotFound();
        $this->getJson('/api/classrooms/'.$group['id'])->assertJsonCount(0,'data.students');
        $this->actingAs($this->adult('docente'));$this->getJson('/api/classrooms/'.$group['id'])->assertNotFound();
        $this->postJson('/api/classrooms/'.$group['id'].'/assignments',['story_id'=>$this->story()->id])->assertNotFound();
    }
    public function test_seeding_twice_preserves_ids_history_and_content_graph(): void {
        $u=$this->adult();$c=$this->child($u);$this->actingAs($u);$this->finishPath($this->start($c));
        $ids=DB::table('scenes')->orderBy('id')->pluck('id')->all();$records=DB::table('decision_records')->count();
        $this->seed(NaviStorySeeder::class);$this->seed(NaviStorySeeder::class);
        $this->assertSame($ids,DB::table('scenes')->orderBy('id')->pluck('id')->all());
        $this->assertSame($records,DB::table('decision_records')->count());
        $this->assertSame(53,DB::table('choices')->count());$this->assertSame(1,(int)DB::table('scores')->where('child_profile_id',$c->id)->sum('stars'));
    }
}
