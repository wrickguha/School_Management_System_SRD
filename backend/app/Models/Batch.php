<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Batch extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_id',
        'session',
        'course',
        'name',
        'status',
        'description',
        'start_date',
        'end_date',
        'capacity',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'capacity' => 'integer',
    ];

    // ── Global Scope ──────────────────────────────────────────────────────────
    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('batches.school_id', auth()->user()->school_id);
            }
        });
    }

    // ── Relationships ──────────────────────────────────────────────────────────
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'batch_id');
    }

    // ── Accessors ──────────────────────────────────────────────────────────────
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' || $this->status === 'ACTIVE';
    }
}
