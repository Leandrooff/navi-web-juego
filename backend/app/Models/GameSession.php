<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected $table = 'game_sessions';

    public $timestamps = false;

    protected $fillable = [
        'current_scene_id',
        'pending_decision_id',
        'start_key',
        'child_profile_id',
        'story_id',
        'story_version',
        'started_at',
        'completed_at',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function story()
    {
        return $this->belongsTo(
            Story::class,
            'story_id'
        );
    }

    public function decisions()
    {
        return $this->hasMany(
            DecisionRecord::class,
            'game_session_id'
        );
    }
}