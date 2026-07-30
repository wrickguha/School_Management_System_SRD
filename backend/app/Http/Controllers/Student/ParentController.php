<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\ParentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    protected ParentService $parentService;

    public function __construct(ParentService $parentService)
    {
        $this->parentService = $parentService;
    }

    public function index(): JsonResponse
    {
        $parents = $this->parentService->getAllParents();
        return response()->json($parents);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:users,email',
            'student_id' => 'nullable|integer|exists:students,id',
            'relation' => 'nullable|string|max:50',
        ]);

        $parent = $this->parentService->createParent($data, auth()->id());

        return response()->json($parent, 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $success = $this->parentService->deleteParent($id);

        if (!$success) {
            return response()->json(['message' => 'Parent not found'], 404);
        }

        return response()->json(['success' => true]);
    }
}
