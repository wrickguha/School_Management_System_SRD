<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user ? $this->user->name : 'System',
            'role' => $this->user ? $this->user->role : 'Automated',
            'action' => $this->action,
            'time' => $this->created_at?->diffForHumans() ?? 'Just now',
            'type' => StrContainsAny($this->action, ['Delete', 'Cancel', 'Failed']) ? 'danger' : 'success',
        ];
    }
}

// Simple helper inside the file or globally
function StrContainsAny(string $haystack, array $needles): bool
{
    foreach ($needles as $needle) {
        if (str_contains(strtolower($haystack), strtolower($needle))) {
            return true;
        }
    }
    return false;
}
