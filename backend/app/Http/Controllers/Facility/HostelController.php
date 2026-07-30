<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHostelRoomRequest;
use App\Http\Resources\HostelRoomResource;
use App\Services\HostelService;
use Illuminate\Http\JsonResponse;

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
        return response()->json(HostelRoomResource::collection($rooms)->resolve());
    }

    public function store(StoreHostelRoomRequest $request): JsonResponse
    {
        $room = $this->hostelService->createRoom($request->validated(), auth()->id());

        return response()->json((new HostelRoomResource($room))->resolve(), 201);
    }
}
