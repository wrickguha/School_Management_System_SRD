<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResultResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'examId' => $this->exam_id,
            'studentId' => $this->student_id,
            'subject' => $this->subject,
            'marksObtained' => (float) $this->marks_obtained,
            'maxMarks' => (int) $this->max_marks,
            'letterGrade' => $this->letter_grade,
            'remarks' => $this->remarks,
            'exam' => new ExamResource($this->whenLoaded('exam')),
        ];
    }
}
