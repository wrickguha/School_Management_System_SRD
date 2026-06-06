<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LibraryBook extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'accession_no',
        'isbn',
        'title',
        'author',
        'rack',
        'total_copies',
        'available_copies',
    ];

    protected $casts = [
        'total_copies'     => 'integer',
        'available_copies' => 'integer',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function issuances(): HasMany
    {
        return $this->hasMany(LibraryIssuance::class, 'book_id');
    }
}
