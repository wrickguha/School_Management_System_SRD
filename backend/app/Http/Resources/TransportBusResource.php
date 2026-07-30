<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportBusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'bus_number' => $this->bus_number,
            'route' => $this->route,
            'driver_name' => $this->driver_name,
            'driver_phone' => $this->driver_phone,
            'driver_license' => $this->driver_license,
            'gps_active' => (bool) $this->gps_active,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
