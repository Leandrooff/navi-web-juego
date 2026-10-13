<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scene extends Model
{
    protected $table = 'scenes';

    public $timestamps = false;

    protected $fillable = [
        'scene_key',
        'dialogue_id',
        'speaker_id',
        'locale',
        'story_id',
        'title',
        'body',
        'scene_order',
        'image_path',
        'audio_path',
        'scene_type',
        'is_final',
    ];

    protected $casts = [
        'is_final' => 'boolean',
    ];

    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    public function choices()
    {
        return $this->hasMany(Choice::class)
            ->orderBy('choice_order');
    }

    public function incomingChoices()
    {
        return $this->hasMany(
            Choice::class,
            'target_scene_id'
        );
    }
}