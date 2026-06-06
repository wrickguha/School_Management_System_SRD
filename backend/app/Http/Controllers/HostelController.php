<?php

namespace App\Http\Controllers;

use App\Models\HostelRoom;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = HostelRoom::latest()->get();
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

        $room = HostelRoom::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $room->school_id,
            'user_id' => auth()->id(),
            'action' => 'Hostel Room Created',
            'description' => "Created hostel room: {$room->room_no} in {$room->block}",
            'model_type' => HostelRoom::class,
            'model_id' => $room->id,
        ]);

        return response()->json($room, 201);
    }
}
