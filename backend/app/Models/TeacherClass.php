<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherClass extends Model
{
    public $timestamps = false;
    protected $fillable = ['school_id', 'teacher_id', 'grade', 'section', 'subject'];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
