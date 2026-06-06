<?php

namespace App\Http\Controllers;

use App\Models\TransportBus;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    public function index(): JsonResponse
    {
        $buses = TransportBus::latest()->get();
        return response()->json($buses);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'bus_number' => 'required|string|max:50|unique:transport_buses,bus_number',
            'route' => 'nullable|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'driver_license' => 'nullable|string|max:100',
            'gps_active' => 'sometimes|required|boolean',
            'status' => 'sometimes|required|string|in:Active,Maintenance,Inactive',
        ]);

        $bus = TransportBus::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $bus->school_id,
            'user_id' => auth()->id(),
            'action' => 'Transport Added',
            'description' => "Added transport bus: {$bus->bus_number} on route {$bus->route}",
            'model_type' => TransportBus::class,
            'model_id' => $bus->id,
        ]);

        return response()->json($bus, 201);
    }
}
