<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollRecord extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'teacher_id',
        'month',
        'base_salary',
        'deductions',
        'net_salary',
        'bank_account',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'deductions'  => 'decimal:2',
        'net_salary'   => 'decimal:2',
        'paid_at'     => 'datetime',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
