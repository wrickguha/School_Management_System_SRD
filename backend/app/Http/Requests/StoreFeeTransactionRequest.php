<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'nullable|integer|exists:students,id',
            'student_name' => 'required_without:student_id|string|max:255',
            'grade' => 'nullable|string|max:50',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'sometimes|required|string|in:Cash,Online,Check,Bank Transfer,UPI,Card',
            'payment_method' => 'sometimes|required|string',
            'remarks' => 'nullable|string|max:500',
        ];
    }
}
