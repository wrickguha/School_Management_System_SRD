<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmissionEnquiry extends Model
{
    protected $fillable = [
        'school_id',
        'parent_name',
        'parent_email',
        'parent_phone',
        'student_name',
        'applying_grade',
        'status',
        'notes',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
