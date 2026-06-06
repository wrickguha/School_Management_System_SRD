<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'school_id', 'title', 'grade', 'subject', 'date', 'time', 'max_marks', 'status',
    ];

    protected $casts = [
        'date'      => 'date',
        'max_marks' => 'integer',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('exams.school_id', auth()->user()->school_id);
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }
}
