<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isPrincipal());
    }

    public function rules(): array
    {
        return [
            'session' => 'nullable|string|max:50',
            'course' => 'sometimes|string|max:100',
            'name' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:ACTIVE,INACTIVE,ARCHIVED',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'capacity' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'end_date.after_or_equal' => 'End date must be after or equal to start date',
        ];
    }
}
