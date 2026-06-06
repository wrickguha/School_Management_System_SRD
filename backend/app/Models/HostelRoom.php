<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HostelRoom extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'room_no',
        'block',
        'type',
        'capacity',
        'occupied',
        'rent_per_term',
    ];

    protected $casts = [
        'capacity'      => 'integer',
        'occupied'      => 'integer',
        'rent_per_term' => 'decimal:2',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
