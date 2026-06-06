<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolSetting extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'academic_year',
        'current_term',
        'notify_absent',
        'notify_fees',
        'rfid_status',
    ];

    protected $casts = [
        'notify_absent' => 'boolean',
        'notify_fees'   => 'boolean',
        'rfid_status'   => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
