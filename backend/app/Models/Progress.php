<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    protected $table = 'progress';

    public $timestamps = false;

    protected $fillable = [
        'child_profile_id',
        'story_id',
        'status',
        'last_scene_id',
        'attempts',
        'started_at',
        'completed_at',
        'updated_at',
    ];

    protected $casts = [
        'attempts' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}