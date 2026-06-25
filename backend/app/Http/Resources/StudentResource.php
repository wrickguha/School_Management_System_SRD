<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'admissionNo' => $this->admission_no,
            'rollNo' => $this->roll_no,
            'grade' => $this->grade,
            'section' => $this->section,
            'gender' => $this->gender,
            'dob' => $this->dob?->toDateString(),
            'bloodGroup' => $this->blood_group,
            'address' => $this->address,
            'admissionDate' => $this->admission_date?->toDateString(),
            'totalFees' => (float) $this->total_fees,
            'pendingFees' => (float) $this->pending_fees,
            'attendanceRate' => (float) $this->attendance_rate,
            'feeStatus' => $this->fee_status,
            'academicPerformance' => (float) $this->academic_performance,
            'status' => $this->status,
            'parentName' => $this->parents->first()?->name,
            'parentPhone' => $this->parents->first()?->phone,
            'parentEmail' => $this->parents->first()?->email,
            'documents' => StudentDocumentResource::collection($this->whenLoaded('documents')),
        ];
    }
}
