<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable {
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable=['name','email','password','role_id','status'];
    protected $hidden=['password','remember_token'];
    protected function casts(): array { return ['password'=>'hashed','email_verified_at'=>'datetime']; }
    public function roleName(): ?string { return DB::table('roles')->where('id',$this->role_id)->value('name'); }
    public function publicProfile(): array { return ['id'=>$this->id,'name'=>$this->name,'email'=>$this->email,'role'=>$this->roleName()]; }
    public function children() { return $this->hasMany(ChildProfile::class,'tutor_id'); }
}
