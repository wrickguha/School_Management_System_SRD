<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostelRoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'room_no' => $this->room_no,
            'block' => $this->block,
            'type' => $this->type,
            'capacity' => $this->capacity,
            'occupied' => $this->occupied,
            'rent_per_term' => $this->rent_per_term,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
