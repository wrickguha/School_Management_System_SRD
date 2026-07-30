<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransportBusRequest;
use App\Http\Resources\TransportBusResource;
use App\Services\TransportService;
use Illuminate\Http\JsonResponse;

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
        return response()->json(TransportBusResource::collection($buses)->resolve());
    }

    public function store(StoreTransportBusRequest $request): JsonResponse
    {
        $bus = $this->transportService->createBus($request->validated(), auth()->id());

        return response()->json((new TransportBusResource($bus))->resolve(), 201);
    }
}
