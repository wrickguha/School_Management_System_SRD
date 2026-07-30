<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Services\TransportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    protected TransportService $transportService;

    public function __construct(TransportService $transportService)
    {
        $this->transportService = $transportService;
    }

    public function index(): JsonResponse
    {
        $buses = $this->transportService->getAllBuses();
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

        $bus = $this->transportService->createBus($data, auth()->id());

        return response()->json($bus, 201);
    }
}
