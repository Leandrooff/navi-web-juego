<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\{User,ChildProfile};
use Database\Seeders\NaviStorySeeder;
class JourneyTest extends TestCase {
 use DatabaseTransactions;
 private $child; private $story;
 protected function setUp(): void {
  parent::setUp();
  $this->assertSame('mysql',DB::getDriverName());
  $this->assertStringEndsWith('_test',DB::getDatabaseName());
  $u=User::create(['name'=>'Journey QA','email'=>Str::uuid().'@example.test','password'=>'JourneyTest123','role_id'=>DB::table('roles')->where('name','tutor')->value('id'),'status'=>'active']);
  $c=new ChildProfile(['nickname'=>'Sol','age'=>8,'avatar'=>'leaf','support_level'=>'high','navi_color'=>'green']);$c->tutor_id=$u->id;$c->save();
  $this->child=$c;$this->actingAs($u);$this->story=DB::table('stories')->where('slug','me-perdi-en-el-parque')->first();
 }
 private function start():array {
  return $this->postJson('/api/game-sessions',['child_profile_id'=>$this->child->id,'story_id'=>$this->story->id,'request_key'=>(string)Str::uuid()])->assertSuccessful()->json('data');
 }
 private function choose(array $saved,int $index=0):array {
  $s=$saved['session'];$scene=DB::table('scenes')->find($s['current_scene_id']);
  $c=DB::table('choices')->where('scene_id',$scene->id)->orderBy('choice_order')->get()[$index];
  $body=['scene_id'=>$scene->id,'choice_id'=>$c->id,'request_key'=>(string)Str::uuid()];
  $a=$this->postJson('/api/game-sessions/'.$s['id'].'/decisions',$body)->assertOk()->json('data');
  $this->postJson('/api/game-sessions/'.$s['id'].'/decisions',$body)->assertOk();
  $this->assertSame(1,DB::table('learning_records')->where('decision_record_id',$a['pending']['id'])->count());
  $m=DB::table('learning_records')->where('decision_record_id',$a['pending']['id'])->first();
  $this->assertSame($this->child->id,(int)$m->child_profile_id);$this->assertNotEmpty($m->earned_at);$this->assertNotEmpty($m->description);
  return $this->postJson('/api/game-sessions/'.$s['id'].'/continue',['decision_id'=>$a['pending']['id']])->assertOk()->json('data');
 }
 public function test_three_endings_each_decision_and_first_meeting_are_persisted_without_duplicate_rewards(): void {
  $paths=[
   'farol'=>[],
   'voz'=>['respiro'=>1,'mapa'=>0],
   'regreso'=>['silencio'=>1,'cruce'=>1,'limite'=>1,'oferta'=>1,'umbral'=>0]
  ];$firstMeeting=null;
  foreach($paths as $ending=>$choices){
   $saved=$this->start();
   for($i=0;$i<40;$i++){
    $s=DB::table('scenes')->find($saved['session']['current_scene_id']);
    if($s->is_final)break;
    $saved=$this->choose($saved,$choices[$s->scene_key]??0);
    if($s->scene_key==='encuentro'){
     $date=DB::table('child_achievements as c')->join('achievements as a','a.id','=','c.achievement_id')->where('c.child_profile_id',$this->child->id)->where('a.name','Primer encuentro')->value('unlocked_at');
     $this->assertNotEmpty($date);if($firstMeeting)$this->assertSame($firstMeeting,$date);$firstMeeting=$date;
    }
   }
   $this->assertTrue((bool)$s->is_final);
   $this->assertSame($ending,$s->ending_key);
   $id=$saved['session']['id'];
   $result=$this->postJson("/api/game-sessions/$id/finish")->assertOk()->json('data');
   $this->assertSame($ending,$result['session']['ending_key']);
   $this->postJson("/api/game-sessions/$id/finish")->assertOk();
   $this->assertSame(1,DB::table('learning_records')->where('game_session_id',$id)->where('event_key','finish')->count());
   $this->assertSame(count($saved['decisions']),DB::table('learning_records')->where('game_session_id',$id)->whereNotNull('decision_record_id')->count());
  }
  $p=$this->getJson('/api/child-profiles/'.$this->child->id.'/progress')->assertOk()->json('data');
  $this->assertCount(3,$p['endings']);$this->assertSame(1,$p['stars']);$this->assertCount(5,$p['achievements']);
  $this->assertGreaterThan(40,$p['memories_count']);
  $page=$this->getJson('/api/child-profiles/'.$this->child->id.'/memories?page=2')->assertOk()->json('data');
  $this->assertSame(2,$page['current_page']);$this->assertNotEmpty($page['data']);
 }
 public function test_hint_is_optional_persisted_once_and_bound_to_the_current_scene():void {
  $saved=$this->start();$id=$saved['session']['id'];
  $this->postJson("/api/game-sessions/$id/hint",['scene_id'=>999])->assertConflict();
  $this->postJson("/api/game-sessions/$id/hint",['scene_id'=>$saved['session']['current_scene_id']])->assertUnprocessable();
  for($i=0;$i<3;$i++)$saved=$this->choose($saved);
  $body=['scene_id'=>$saved['session']['current_scene_id']];
  $this->postJson("/api/game-sessions/$id/hint",$body)->assertOk();
  $this->postJson("/api/game-sessions/$id/hint",$body)->assertOk();
  $this->assertSame(1,DB::table('learning_records')->where('game_session_id',$id)->where('kind','support')->count());
  $saved=$this->choose($saved);
  $this->postJson("/api/game-sessions/$id/hint",$body)->assertConflict();
 }
 public function test_old_session_keeps_its_graph_after_the_new_story_is_seeded():void {
  $legacy=json_decode(file_get_contents(database_path('content/park-legacy.json')),true);$ids=[];
  foreach($legacy['scenes'] as $i=>$s)$ids[$s['key']]=DB::table('scenes')->insertGetId(['story_id'=>$this->story->id,'scene_order'=>$i+1,'content_version'=>1,'scene_key'=>$s['key'],'title'=>$s['title'],'body'=>$s['body'],'is_final'=>!empty($s['final'])]);
  foreach($legacy['choices'] as $i=>$c)DB::table('choices')->insert(['scene_id'=>$ids[$c[0]],'target_scene_id'=>$ids[$c[1]],'choice_order'=>$i+1,'label'=>$c[2],'consequence'=>$c[3]]);
  DB::table('stories')->where('id',$this->story->id)->update(['version'=>1,'initial_scene_id'=>$ids['inicio']]);
  $saved=$this->choose($this->start());
  $before=DB::table('decision_records')->where('game_session_id',$saved['session']['id'])->first();
  $this->seed(NaviStorySeeder::class);$this->seed(NaviStorySeeder::class);
  $resumed=$this->start();$this->assertSame($saved['session']['id'],$resumed['session']['id']);
  $this->assertSame(1,$resumed['session']['story_version']);$this->assertSame($saved['session']['current_scene_id'],$resumed['session']['current_scene_id']);
  $old=$this->getJson('/api/stories/'.$this->story->id.'?version=1')->assertOk()->json('data');
  $this->assertCount(6,$old['scenes']);$this->assertSame($ids['inicio'],$old['initial_scene_id']);
  $this->getJson('/api/stories/'.$this->story->id)->assertJsonCount(34,'data.scenes');
  $this->assertSame($before->choice_text,DB::table('decision_records')->find($before->id)->choice_text);
  $wrong=DB::table('choices')->where('scene_id',DB::table('stories')->find($this->story->id)->initial_scene_id)->first();
  $this->postJson('/api/game-sessions/'.$saved['session']['id'].'/decisions',['scene_id'=>$saved['session']['current_scene_id'],'choice_id'=>$wrong->id,'request_key'=>(string)Str::uuid()])->assertNotFound();
 }
}
