<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isPrincipal() || auth()->user()->hasRole('Department Head'));
    }

    public function rules(): array
    {
        return [
            'course_code' => 'sometimes|string|max:50|unique:courses,course_code,' . $this->route('course') . ',id,school_id,' . auth()->user()->school_id,
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'course_type' => 'sometimes|in:UG,PG,Diploma,Certificate,Other',
            'duration_months' => 'nullable|integer|min:1',
            'total_semesters' => 'nullable|integer|min:1',
            'semester_pattern' => 'nullable|string|max:255',
            'credits' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:ACTIVE,INACTIVE,ARCHIVED',
            'eligibility_criteria' => 'nullable|string',
            'fees' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'course_code.unique' => 'This course code already exists in your school',
        ];
    }
}
