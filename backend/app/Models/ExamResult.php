<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamResult extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'exam_id',
        'student_id',
        'subject',
        'marks_obtained',
        'max_marks',
        'letter_grade',
        'remarks',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'max_marks' => 'integer',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
