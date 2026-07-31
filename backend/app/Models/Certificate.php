<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    protected $fillable = [
        'school_id',
        'student_id',
        'issued_by_user_id',
        'title',
        'certificate_type',
        'issue_date',
        'file_path',
        'file_name',
        'file_size',
        'description',
    ];

    protected $casts = [
        'issue_date' => 'date',
    ];

    // ── Global Scope ──────────────────────────────────────────────────────────
    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('certificates.school_id', auth()->user()->school_id);
            }
        });
    }

    // ── Relationships ────────────────────────────────────────────────────────
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by_user_id');
    }
}
