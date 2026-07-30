<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Services\HostelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelController extends Controller
{
    protected HostelService $hostelService;

    public function __construct(HostelService $hostelService)
    {
        $this->hostelService = $hostelService;
    }

    public function index(): JsonResponse
    {
        $rooms = $this->hostelService->getAllRooms();
        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'room_no' => 'required|string|max:20',
            'block' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:100',
            'capacity' => 'sometimes|required|integer|min:1',
            'occupied' => 'sometimes|required|integer|min:0',
            'rent_per_term' => 'nullable|numeric|min:0',
        ]);

        $room = $this->hostelService->createRoom($data, auth()->id());

        return response()->json($room, 201);
    }
}
