<?php
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
Artisan::command('navi:doctor',function(){
    $this->info('PHP '.PHP_VERSION.'; conexión '.config('database.default'));
    if(DB::getDriverName()!=='mysql'){$this->error('Configura MariaDB/MySQL.');return 1;}
    $this->line('Base: '.DB::getDatabaseName());
    foreach(['users','child_profiles','stories','scenes','choices','game_sessions','progress','scores'] as $table){
        $this->line($table.': '.(Schema::hasTable($table)?'presente':'se creará'));
        if(Schema::hasTable($table)){
            $id=DB::selectOne("SHOW COLUMNS FROM ".$table." WHERE Field = 'id'");
            if(!$id || !str_contains(strtolower($id->Type),'unsigned') || !str_contains($id->Extra,'auto_increment')){
                $this->error('Esquema académico reducido incompatible. Usa una copia y revisa docs/INSTALACION.md.');return 1;
            }
        }
    }
    $this->info('Precomprobación terminada. Haz copia de seguridad antes de actualizar una base con datos.');
})->purpose('Comprobar el esquema sin modificar datos');
Artisan::command('navi:assign-role {email} {role}',function(){
    $role=$this->argument('role');
    if(!in_array($role,['tutor','docente','admin'])){$this->error('Rol inválido.');return 1;}
    $user=User::where('email',$this->argument('email'))->first();
    if(!$user){$this->error('Cuenta no encontrada.');return 1;}
    if(!$this->confirm('¿Asignar el rol '.$role.' a '.$user->email.'?'))return 1;
    $user->update(['role_id'=>DB::table('roles')->where('name',$role)->value('id')]);
    $this->info('Rol actualizado. No se cambió la contraseña.');
})->purpose('Asignar explícitamente un rol a una cuenta histórica desde el servidor');
