<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_id', 'user_id', 'admission_no', 'roll_no', 'name',
        'grade', 'section', 'gender', 'dob', 'blood_group', 'address',
        'status', 'admission_date', 'total_fees', 'pending_fees',
        'attendance_rate', 'academic_performance', 'fee_status',
    ];

    protected $casts = [
        'dob'                  => 'date',
        'admission_date'       => 'date',
        'total_fees'           => 'decimal:2',
        'pending_fees'         => 'decimal:2',
        'attendance_rate'      => 'decimal:2',
        'academic_performance' => 'decimal:2',
    ];

    // ── Global Scope ──────────────────────────────────────────────────────────
    protected static function booted(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check() && ! auth()->user()->isSuperAdmin()) {
                $builder->where('students.school_id', auth()->user()->school_id);
            }
        });
    }

    // ── Relationships ──────────────────────────────────────────────────────────
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'student_parents', 'student_id', 'parent_id')
                    ->withPivot('relation');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function examResults(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }

    public function feeTransactions(): HasMany
    {
        return $this->hasMany(FeeTransaction::class);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    public function recalculateAttendanceRate(): void
    {
        $total   = $this->attendances()->count();
        $present = $this->attendances()->whereIn('status', ['Present', 'Late'])->count();
        $rate    = $total > 0 ? round(($present / $total) * 100, 2) : 0;
        $this->update(['attendance_rate' => $rate]);
    }

    public function recalculatePendingFees(): void
    {
        $paid = $this->feeTransactions()->where('status', 'Paid')->sum('amount');
        $pending = max(0, $this->total_fees - $paid);
        $status  = $pending <= 0 ? 'Paid' : ($paid > 0 ? 'Partial' : 'Pending');
        $this->update(['pending_fees' => $pending, 'fee_status' => $status]);
    }
}
