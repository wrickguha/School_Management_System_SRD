<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class School extends Model
{
    protected $fillable = [
        'name', 'subdomain', 'address', 'phone', 'email',
        'logo_path', 'plan', 'status',
    ];

    // ── Relationships ────────────────────────────────────────────────────────
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(Teacher::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(SchoolSetting::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function feeTransactions(): HasMany
    {
        return $this->hasMany(FeeTransaction::class);
    }

    // ── Accessors ────────────────────────────────────────────────────────────
    public function getStudentCountAttribute(): int
    {
        return $this->students()->count();
    }

    public function getTeacherCountAttribute(): int
    {
        return $this->teachers()->count();
    }
}
