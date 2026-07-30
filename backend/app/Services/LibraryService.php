<?php

namespace App\Services;

use App\Models\LibraryBook;
use App\Models\LibraryIssuance;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class LibraryService
{
    /**
     * Get all library books.
     */
    public function getAllBooks(): Collection
    {
        return LibraryBook::latest()->get();
    }

    /**
     * Store a new book in the library catalog.
     */
    public function createBook(array $data, int $userId): LibraryBook
    {
        $book = LibraryBook::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'available_copies' => $data['total_copies'] ?? 1,
        ]));

        ActivityLog::create([
            'school_id' => $book->school_id,
            'user_id' => $userId,
            'action' => 'Book Catalogued',
            'description' => "Catalogued new library book: {$book->title} by {$book->author}",
            'model_type' => LibraryBook::class,
            'model_id' => $book->id,
        ]);

        return $book;
    }

    /**
     * Get all book issuances.
     */
    public function getAllIssuances(): Collection
    {
        return LibraryIssuance::with(['book', 'student'])->latest()->get();
    }

    /**
     * Issue a book to a student with atomic inventory decrement.
     */
    public function issueBook(array $data, int $userId): LibraryIssuance
    {
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

        ActivityLog::create([
            'school_id' => $issuance->school_id,
            'user_id' => $userId,
            'action' => 'Book Issued',
            'description' => "Issued book ID #{$issuance->book_id} to student ID #{$issuance->student_id}",
            'model_type' => LibraryIssuance::class,
            'model_id' => $issuance->id,
        ]);

        return $issuance;
    }
}
