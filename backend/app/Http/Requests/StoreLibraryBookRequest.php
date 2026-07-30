<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLibraryBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'accession_no' => 'nullable|string|max:50|unique:library_books,accession_no',
            'isbn' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'rack' => 'nullable|string|max:50',
            'total_copies' => 'sometimes|required|integer|min:1',
        ];
    }
}
