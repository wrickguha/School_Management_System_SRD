<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'studentId' => $this->student_id,
            'name' => $this->name,
            'type' => $this->type,
            'filePath' => $this->file_path,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toDateTimeString(),
        ];
    }
}
