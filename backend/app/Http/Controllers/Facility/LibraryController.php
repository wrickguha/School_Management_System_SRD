<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLibraryBookRequest;
use App\Http\Requests\IssueLibraryBookRequest;
use App\Http\Resources\LibraryBookResource;
use App\Http\Resources\LibraryIssuanceResource;
use App\Services\LibraryService;
use Illuminate\Http\JsonResponse;

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
        return response()->json(LibraryBookResource::collection($books)->resolve());
    }

    /**
     * Add a book to catalog.
     */
    public function storeBook(StoreLibraryBookRequest $request): JsonResponse
    {
        $book = $this->libraryService->createBook($request->validated(), auth()->id());

        return response()->json((new LibraryBookResource($book))->resolve(), 201);
    }

    /**
     * List book issuances.
     */
    public function indexIssuances(): JsonResponse
    {
        $issuances = $this->libraryService->getAllIssuances();
        return response()->json(LibraryIssuanceResource::collection($issuances)->resolve());
    }

    /**
     * Issue a book to a student.
     */
    public function issueBook(IssueLibraryBookRequest $request): JsonResponse
    {
        $issuance = $this->libraryService->issueBook($request->validated(), auth()->id());

        return response()->json((new LibraryIssuanceResource($issuance))->resolve(), 201);
    }
}
