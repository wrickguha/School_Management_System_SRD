<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get the student ID from route
        $studentId = $this->route('student');

        return [
            'name' => 'sometimes|required|string|max:255',
            'admission_no' => 'sometimes|required|string|unique:students,admission_no,' . $studentId,
            'roll_no' => 'nullable|string|max:20',
            'grade' => 'sometimes|required|string|max:50',
            'section' => 'sometimes|required|string|max:10',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string|max:10',
            'status' => 'sometimes|required|string|in:Active,Inactive,Graduated,Suspended',
        ];
    }
}
