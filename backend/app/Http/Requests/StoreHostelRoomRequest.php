<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostelRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_no' => 'required|string|max:20',
            'block' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:100',
            'capacity' => 'sometimes|required|integer|min:1',
            'occupied' => 'sometimes|required|integer|min:0',
            'rent_per_term' => 'nullable|numeric|min:0',
        ];
    }
}
