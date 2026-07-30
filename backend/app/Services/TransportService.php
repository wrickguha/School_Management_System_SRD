<?php

namespace App\Services;

use App\Models\TransportBus;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

class TransportService
{
    /**
     * Get all transport buses.
     */
    public function getAllBuses(): Collection
    {
        return TransportBus::latest()->get();
    }

    /**
     * Create a new transport bus record and log activity.
     */
    public function createBus(array $data, int $userId): TransportBus
    {
        $bus = TransportBus::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
        ]));

        ActivityLog::create([
            'school_id' => $bus->school_id,
            'user_id' => $userId,
            'action' => 'Transport Added',
            'description' => "Added transport bus: {$bus->bus_number} on route {$bus->route}",
            'model_type' => TransportBus::class,
            'model_id' => $bus->id,
        ]);

        return $bus;
    }
}
