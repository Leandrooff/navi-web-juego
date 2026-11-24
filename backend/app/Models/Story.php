<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    protected $table = 'stories';

    protected $fillable = [
        'slug',
        'cover_path',
        'category_id',
        'title',
        'description',
        'version',
        'story_order',
        'status',
        'estimated_minutes',
        'initial_scene_id',
    ];

    protected $casts = [
        'version' => 'integer',
        'story_order' => 'integer',
        'estimated_minutes' => 'integer',
        'initial_scene_id' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scenes()
    {
        return $this->hasMany(Scene::class)
            ->orderBy('scene_order');
    }

    public function initialScene()
    {
        return $this->belongsTo(
            Scene::class,
            'initial_scene_id'
        );
    }
}