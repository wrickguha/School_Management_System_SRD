<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportBus extends Model
{
    use TenantScoped;

    protected $table = 'transport_buses';

    protected $fillable = [
        'school_id',
        'bus_number',
        'route',
        'driver_name',
        'driver_phone',
        'driver_license',
        'gps_active',
        'status',
    ];

    protected $casts = [
        'gps_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
