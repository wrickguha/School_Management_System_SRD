<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomeworkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:50',
            'section' => 'nullable|string|max:10',
            'instructions' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'sometimes|required|string|in:Active,Draft,Closed',
        ];
    }
}
