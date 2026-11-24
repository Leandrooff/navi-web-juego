<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    protected $table = 'choices';

    public $timestamps = false;

    protected $fillable = [
        'dialogue_id',
        'audio_path',
        'scene_id',
        'target_scene_id',
        'label',
        'consequence',
        'choice_order',
        'choice_type',
        'is_expected_answer',
        'points',
    ];

    protected $casts = [
        'is_expected_answer' => 'boolean',
        'points' => 'integer',
    ];

    public function scene()
    {
        return $this->belongsTo(Scene::class);
    }

    public function targetScene()
    {
        return $this->belongsTo(
            Scene::class,
            'target_scene_id'
        );
    }
}