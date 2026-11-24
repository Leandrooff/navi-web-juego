<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Choice extends Model
{
    use HasFactory;

    protected $fillable = [
        'scene_id',
        'next_scene_id',
        'label',
        'points',
    ];

    protected $casts = [
        'points' => 'integer',
    ];

    public function scene(): BelongsTo
    {
        return $this->belongsTo(Scene::class);
    }

    public function nextScene(): BelongsTo
    {
        return $this->belongsTo(Scene::class, 'next_scene_id');
    }
}