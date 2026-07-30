<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryIssuanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'book_id' => $this->book_id,
            'student_id' => $this->student_id,
            'issued_at' => $this->issued_at,
            'due_date' => $this->due_date,
            'returned_at' => $this->returned_at,
            'book' => new LibraryBookResource($this->whenLoaded('book')),
            'student' => new StudentResource($this->whenLoaded('student')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
