<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreParentRequest;
use App\Http\Resources\GuardianResource;
use App\Services\ParentService;
use Illuminate\Http\JsonResponse;

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
        return response()->json(GuardianResource::collection($parents)->resolve());
    }

    public function store(StoreParentRequest $request): JsonResponse
    {
        $parent = $this->parentService->createParent($request->validated(), auth()->id());

        return response()->json((new GuardianResource($parent))->resolve(), 201);
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
