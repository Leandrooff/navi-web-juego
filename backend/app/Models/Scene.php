<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scene extends Model
{
    use HasFactory;

    protected $fillable = [
        'story_id',
        'title',
        'body',
        'sort_order',
        'is_ending',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_ending' => 'boolean',
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class)->orderBy('id');
    }
}