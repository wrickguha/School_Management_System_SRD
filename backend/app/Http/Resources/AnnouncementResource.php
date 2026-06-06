<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'targetAudience' => $this->target_audience,
            'isSms' => (bool) $this->is_sms,
            'publishedAt' => $this->published_at?->toDateTimeString(),
            'date' => $this->created_at?->toDateString(),
        ];
    }
}
