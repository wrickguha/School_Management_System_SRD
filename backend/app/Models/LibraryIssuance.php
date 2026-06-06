<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryIssuance extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'book_id',
        'student_id',
        'issued_at',
        'due_date',
        'returned_at',
        'fine_amount',
    ];

    protected $casts = [
        'issued_at'   => 'date',
        'due_date'    => 'date',
        'returned_at' => 'date',
        'fine_amount' => 'decimal:2',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(LibraryBook::class, 'book_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
