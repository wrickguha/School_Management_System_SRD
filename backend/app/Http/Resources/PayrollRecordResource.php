<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'teacher_id' => $this->teacher_id,
            'month' => $this->month,
            'base_salary' => (float) $this->base_salary,
            'deductions' => (float) $this->deductions,
            'net_salary' => (float) $this->net_salary,
            'bank_account' => $this->bank_account,
            'status' => $this->status,
            'paid_at' => $this->paid_at,
            'teacher' => new TeacherResource($this->whenLoaded('teacher')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
