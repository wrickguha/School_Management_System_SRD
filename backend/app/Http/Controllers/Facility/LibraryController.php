<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Services\LibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    protected LibraryService $libraryService;

    public function __construct(LibraryService $libraryService)
    {
        $this->libraryService = $libraryService;
    }

    /**
     * List library catalog.
     */
    public function indexBooks(): JsonResponse
    {
        $books = $this->libraryService->getAllBooks();
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

        $book = $this->libraryService->createBook($data, auth()->id());

        return response()->json($book, 201);
    }

    /**
     * List book issuances.
     */
    public function indexIssuances(): JsonResponse
    {
        $issuances = $this->libraryService->getAllIssuances();
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

        $issuance = $this->libraryService->issueBook($data, auth()->id());

        return response()->json($issuance, 201);
    }
}
