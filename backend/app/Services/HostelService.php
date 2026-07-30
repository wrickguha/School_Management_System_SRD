<?php

namespace App\Services;

use App\Models\HostelRoom;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

class HostelService
{
    /**
     * Get all hostel rooms.
     */
    public function getAllRooms(): Collection
    {
        return HostelRoom::latest()->get();
    }

    /**
     * Create a new hostel room and log activity.
     */
    public function createRoom(array $data, int $userId): HostelRoom
    {
        $room = HostelRoom::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
        ]));

        ActivityLog::create([
            'school_id' => $room->school_id,
            'user_id' => $userId,
            'action' => 'Hostel Room Created',
            'description' => "Created hostel room: {$room->room_no} in {$room->block}",
            'model_type' => HostelRoom::class,
            'model_id' => $room->id,
        ]);

        return $room;
    }
}
