<?php

namespace App\Http\Controllers;

use App\Models\LibraryBook;
use App\Models\LibraryIssuance;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LibraryController extends Controller
{
    /**
     * List library catalog.
     */
    public function indexBooks(): JsonResponse
    {
        $books = LibraryBook::latest()->get();
        return response()->json($books);
    }

    /**
     * Add a book to catalog.
     */
    public function storeBook(Request $request): JsonResponse
    {
        $data = $request->validate([
            'accession_no' => 'nullable|string|max:50|unique:library_books,accession_no',
            'isbn' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'rack' => 'nullable|string|max:50',
            'total_copies' => 'sometimes|required|integer|min:1',
        ]);

        $book = LibraryBook::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'available_copies' => $data['total_copies'] ?? 1,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $book->school_id,
            'user_id' => auth()->id(),
            'action' => 'Book Catalogued',
            'description' => "Catalogued new library book: {$book->title} by {$book->author}",
            'model_type' => LibraryBook::class,
            'model_id' => $book->id,
        ]);

        return response()->json($book, 201);
    }

    /**
     * List book issuances.
     */
    public function indexIssuances(): JsonResponse
    {
        $issuances = LibraryIssuance::with(['book', 'student'])->latest()->get();
        return response()->json($issuances);
    }

    /**
     * Issue a book to a student.
     */
    public function issueBook(Request $request): JsonResponse
    {
        $data = $request->validate([
            'book_id' => 'required|integer|exists:library_books,id',
            'student_id' => 'required|integer|exists:students,id',
            'due_date' => 'required|date|after_or_equal:today',
        ]);

        $issuance = DB::transaction(function () use ($data) {
            $book = LibraryBook::lockForUpdate()->findOrFail($data['book_id']);

            if ($book->available_copies <= 0) {
                throw new \InvalidArgumentException("No copies available for issuance");
            }

            $book->decrement('available_copies');

            return LibraryIssuance::create([
                'school_id' => auth()->user()->school_id,
                'book_id' => $data['book_id'],
                'student_id' => $data['student_id'],
                'issued_at' => date('Y-m-d'),
                'due_date' => $data['due_date'],
            ]);
        });

        // Log Activity
        ActivityLog::create([
            'school_id' => $issuance->school_id,
            'user_id' => auth()->id(),
            'action' => 'Book Issued',
            'description' => "Issued book ID #{$issuance->book_id} to student ID #{$issuance->student_id}",
            'model_type' => LibraryIssuance::class,
            'model_id' => $issuance->id,
        ]);

        return response()->json($issuance, 201);
    }
}
