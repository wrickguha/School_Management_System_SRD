<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryBookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'accession_no' => $this->accession_no,
            'isbn' => $this->isbn,
            'title' => $this->title,
            'author' => $this->author,
            'rack' => $this->rack,
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
