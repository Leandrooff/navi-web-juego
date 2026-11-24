<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private function add(string $table,string $column,Closure $callback): void {
        if (!Schema::hasColumn($table,$column)) Schema::table($table,$callback);
    }
    public function up(): void {
        $this->add('users','role_id',fn(Blueprint $t)=>$t->foreignId('role_id')->nullable()->constrained('roles'));
        $this->add('users','status',fn(Blueprint $t)=>$t->string('status')->default('active'));
        $this->add('users','remember_token',fn(Blueprint $t)=>$t->rememberToken());
        $this->add('users','email_verified_at',fn(Blueprint $t)=>$t->timestamp('email_verified_at')->nullable());
        foreach (['tutor','docente','admin'] as $role) DB::table('roles')->updateOrInsert(['name'=>$role],['description'=>'Rol NAVI: '.$role]);
        $this->add('child_profiles','navi_color',fn(Blueprint $t)=>$t->string('navi_color',20)->default('green'));
        $this->add('stories','slug',fn(Blueprint $t)=>$t->string('slug',160)->nullable()->unique());
        $this->add('stories','cover_path',fn(Blueprint $t)=>$t->string('cover_path')->nullable());
        $this->add('scenes','scene_key',fn(Blueprint $t)=>$t->string('scene_key',80)->nullable());
        $this->add('scenes','dialogue_id',fn(Blueprint $t)=>$t->string('dialogue_id',120)->nullable());
        $this->add('scenes','speaker_id',fn(Blueprint $t)=>$t->string('speaker_id',40)->default('navi'));
        $this->add('scenes','locale',fn(Blueprint $t)=>$t->string('locale',12)->default('es-BO'));
        $this->add('choices','dialogue_id',fn(Blueprint $t)=>$t->string('dialogue_id',120)->nullable());
        $this->add('choices','audio_path',fn(Blueprint $t)=>$t->string('audio_path')->nullable());
        $this->add('game_sessions','current_scene_id',fn(Blueprint $t)=>$t->foreignId('current_scene_id')->nullable()->constrained('scenes'));
        $this->add('game_sessions','pending_decision_id',fn(Blueprint $t)=>$t->unsignedBigInteger('pending_decision_id')->nullable());
        $this->add('game_sessions','start_key',fn(Blueprint $t)=>$t->uuid('start_key')->nullable()->unique());
        $this->add('decision_records','request_key',fn(Blueprint $t)=>$t->uuid('request_key')->nullable());
        $this->add('decision_records','sequence',fn(Blueprint $t)=>$t->unsignedInteger('sequence')->nullable());
        $this->add('decision_records','choice_text',fn(Blueprint $t)=>$t->text('choice_text')->nullable());
        $this->add('decision_records','consequence_text',fn(Blueprint $t)=>$t->text('consequence_text')->nullable());
        $this->add('decision_records','scene_title',fn(Blueprint $t)=>$t->string('scene_title')->nullable());
        $this->add('decision_records','target_scene_id',fn(Blueprint $t)=>$t->unsignedBigInteger('target_scene_id')->nullable());
        $this->add('decision_records','acknowledged_at',fn(Blueprint $t)=>$t->timestamp('acknowledged_at')->nullable());
        if (!Schema::hasIndex('decision_records','decision_request_unique')) Schema::table('decision_records',function(Blueprint $t){
            $t->unique(['game_session_id','request_key'],'decision_request_unique');
            $t->unique(['game_session_id','sequence'],'decision_sequence_unique');
        });
        if (!Schema::hasTable('class_groups')) Schema::create('class_groups',function(Blueprint $t){
            $t->id(); $t->foreignId('teacher_id')->constrained('users'); $t->string('name',100);
            $t->string('join_code',24)->unique(); $t->timestamps();
        });
        if (!Schema::hasTable('class_enrollments')) Schema::create('class_enrollments',function(Blueprint $t){
            $t->id(); $t->foreignId('class_group_id')->constrained('class_groups');
            $t->foreignId('child_profile_id')->constrained('child_profiles');
            $t->foreignId('approved_by')->constrained('users'); $t->timestamp('approved_at');
            $t->timestamp('revoked_at')->nullable(); $t->unique(['class_group_id','child_profile_id']);
        });
        if (!Schema::hasTable('class_assignments')) Schema::create('class_assignments',function(Blueprint $t){
            $t->id(); $t->foreignId('class_group_id')->constrained('class_groups'); $t->foreignId('story_id')->constrained('stories');
            $t->date('due_date')->nullable(); $t->timestamps(); $t->unique(['class_group_id','story_id']);
        });
        foreach (DB::table('game_sessions')->whereNull('current_scene_id')->orderBy('id')->cursor() as $s) {
            $last=DB::table('decision_records')->where('game_session_id',$s->id)->orderByDesc('id')->first();
            $target=$last ? DB::table('choices')->where('id',$last->choice_id)->value('target_scene_id') : null;
            DB::table('game_sessions')->where('id',$s->id)->update(['current_scene_id'=>$target ?? DB::table('stories')->where('id',$s->story_id)->value('initial_scene_id')]);
        }
        DB::table('achievements')->updateOrInsert(['name'=>'Primera luz'],['description'=>'Completaste tu primera aventura.','icon_path'=>'star','requirement_type'=>'stories_completed','requirement_value'=>1]);
        foreach (DB::table('game_sessions')->where('status','completed')->select('child_profile_id','story_id')->distinct()->get() as $row) {
            DB::table('scores')->updateOrInsert((array)$row,['score'=>0,'stars'=>1,'updated_at'=>now()]);
            $achievement=DB::table('achievements')->where('name','Primera luz')->value('id');
            DB::table('child_achievements')->insertOrIgnore(['child_profile_id'=>$row->child_profile_id,'achievement_id'=>$achievement,'unlocked_at'=>now()]);
        }
    }
    public function down(): void { throw new RuntimeException('Restaurar copia de seguridad: esta migración conserva historiales.'); }
};
