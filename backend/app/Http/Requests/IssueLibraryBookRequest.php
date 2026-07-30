<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IssueLibraryBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'book_id' => 'required|integer|exists:library_books,id',
            'student_id' => 'required|integer|exists:students,id',
            'due_date' => 'required|date|after_or_equal:today',
        ];
    }
}
