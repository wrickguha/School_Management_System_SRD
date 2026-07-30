<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'teacher_id' => 'required|integer|exists:teachers,id',
            'month' => 'required|string|max:20',
            'base_salary' => 'required|numeric|min:0',
            'deductions' => 'sometimes|required|numeric|min:0',
            'bank_account' => 'nullable|string|max:100',
            'status' => 'sometimes|required|string|in:Pending,Disbursed,Hold',
        ];
    }
}
