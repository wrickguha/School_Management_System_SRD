<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Handled via policy/gate in routes, or we can check here
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'admission_no' => 'required|string|unique:students,admission_no',
            'roll_no' => 'nullable|string|max:20',
            'grade' => 'required|string|max:50',
            'section' => 'required|string|max:10',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'parent_email' => 'nullable|email',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string|max:10',
            'admission_date' => 'nullable|date',
            'total_fees' => 'nullable|numeric|min:0',
        ];
    }
}
