<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DecisionRecord extends Model
{
    protected $table = 'decision_records';

    public $timestamps = false;

    protected $fillable = [
        'game_session_id',
        'scene_id',
        'choice_id',
        'selected_at',
    ];

    protected $casts = [
        'selected_at' => 'datetime',
    ];

    public function session()
    {
        return $this->belongsTo(
            GameSession::class,
            'game_session_id'
        );
    }

    public function scene()
    {
        return $this->belongsTo(
            Scene::class,
            'scene_id'
        );
    }

    public function choice()
    {
        return $this->belongsTo(
            Choice::class,
            'choice_id'
        );
    }
}