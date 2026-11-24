<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Story extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'title',
        'category',
        'description',
        'cover_image',
        'status',
        'revision',
        'parent_story_id',
        'initial_scene_id',
    ];

    protected $casts = [
        'revision' => 'integer',
    ];

    public function scenes(): HasMany
    {
        return $this->hasMany(Scene::class)->orderBy('sort_order')->orderBy('id');
    }

    public function initialScene(): BelongsTo
    {
        return $this->belongsTo(Scene::class, 'initial_scene_id');
    }

    public function parentStory(): BelongsTo
    {
        return $this->belongsTo(Story::class, 'parent_story_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(Story::class, 'parent_story_id')->orderByDesc('revision');
    }
}