<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_id',
        'course_code',
        'name',
        'description',
        'course_type',
        'duration_months',
        'total_semesters',
        'semester_pattern',
        'credits',
        'status',
        'eligibility_criteria',
        'fees',
        'created_by_user_id',
    ];

    protected $casts = [
        'duration_months' => 'integer',
        'total_semesters' => 'integer',
        'credits' => 'integer',
        'fees' => 'decimal:2',
    ];

    // ── Global Scope ──────────────────────────────────────────────────────────
    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('courses.school_id', auth()->user()->school_id);
            }
        });
    }

    // ── Relationships ──────────────────────────────────────────────────────────
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }

    // ── Accessors ──────────────────────────────────────────────────────────────
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'ACTIVE' || $this->status === 'active';
    }
}
