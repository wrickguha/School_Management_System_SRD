<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemoRequest extends Model
{
    protected $fillable = [
        'school_name',
        'contact_name',
        'email',
        'phone',
        'student_count',
        'status',
    ];
}
