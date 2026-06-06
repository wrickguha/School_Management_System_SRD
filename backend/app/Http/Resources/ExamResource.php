<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'grade' => $this->grade,
            'subject' => $this->subject,
            'date' => $this->date?->toDateString(),
            'time' => $this->time,
            'maxMarks' => (int) $this->max_marks,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
