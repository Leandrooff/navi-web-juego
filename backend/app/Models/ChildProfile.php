<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ChildProfile extends Model {
    protected $fillable = ['nickname','age','avatar','support_level','navi_color'];
    protected $casts = ['age'=>'integer'];
    public function tutor() { return $this->belongsTo(User::class, 'tutor_id'); }
    public function progress() { return $this->hasMany(Progress::class); }
    public function sessions() { return $this->hasMany(GameSession::class); }
}
