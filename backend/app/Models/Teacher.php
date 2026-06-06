<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_id', 'user_id', 'employee_id', 'name', 'email',
        'phone', 'department', 'designation', 'salary_grade',
        'attendance_rate', 'status',
    ];

    protected $casts = [
        'attendance_rate' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('teachers.school_id', auth()->user()->school_id);
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classes(): HasMany
    {
        return $this->hasMany(TeacherClass::class);
    }

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }
}
