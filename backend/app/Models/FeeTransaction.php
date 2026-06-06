<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeTransaction extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'receipt_no',
        'student_id',
        'student_name',
        'grade',
        'amount',
        'payment_mode',
        'status',
        'date',
        'recorded_by',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date'   => 'date',
    ];

    protected static function booted(): void
    {
        // When saved or deleted, we should recalculate student's pending fees
        static::saved(function (FeeTransaction $transaction) {
            $transaction->student?->recalculatePendingFees();
        });

        static::deleted(function (FeeTransaction $transaction) {
            $transaction->student?->recalculatePendingFees();
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
