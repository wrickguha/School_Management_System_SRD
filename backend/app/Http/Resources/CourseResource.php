<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'course_code' => $this->course_code,
            'name' => $this->name,
            'description' => $this->description,
            'course_type' => $this->course_type,
            'duration_months' => $this->duration_months,
            'total_semesters' => $this->total_semesters,
            'semester_pattern' => $this->semester_pattern,
            'credits' => $this->credits,
            'status' => $this->status,
            'eligibility_criteria' => $this->eligibility_criteria,
            'fees' => $this->fees ? (float) $this->fees : null,
            'batch_count' => $this->batches()->count(),
            'created_by' => $this->createdBy?->name,
            'is_active' => $this->status === 'ACTIVE',
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
