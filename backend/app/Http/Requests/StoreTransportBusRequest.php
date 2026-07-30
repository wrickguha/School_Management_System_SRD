<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransportBusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bus_number' => 'required|string|max:50|unique:transport_buses,bus_number',
            'route' => 'nullable|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'driver_license' => 'nullable|string|max:100',
            'gps_active' => 'sometimes|required|boolean',
            'status' => 'sometimes|required|string|in:Active,Maintenance,Inactive',
        ];
    }
}
