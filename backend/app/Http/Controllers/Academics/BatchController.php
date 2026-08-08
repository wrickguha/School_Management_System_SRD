<?php

namespace App\Http\Controllers\Academics;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Http\Resources\BatchResource;
use App\Services\BatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    protected BatchService $batchService;

    public function __construct(BatchService $batchService)
    {
        $this->batchService = $batchService;
    }

    /**
     * Display a listing of the batches.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'course', 'session', 'status']);
        
        // Fetch all batches for client-side filtering
        $batches = $this->batchService->getAllBatchesWithoutPagination($filters);
        $resolved = BatchResource::collection($batches)->resolve();

        return response()->json($resolved);
    }

    /**
     * Store a newly created batch.
     */
    public function store(StoreBatchRequest $request): JsonResponse
    {
        $batch = $this->batchService->createBatch($request->validated());
        $resource = new BatchResource($batch);

        return response()->json($resource->resolve(), 201);
    }

    /**
     * Display the specified batch.
     */
    public function show(int $id): JsonResponse
    {
        $batch = $this->batchService->getBatchById($id);

        if (!$batch) {
            return response()->json(['message' => 'Batch not found'], 404);
        }

        $resource = new BatchResource($batch);
        return response()->json($resource->resolve());
    }

    /**
     * Update the specified batch.
     */
    public function update(UpdateBatchRequest $request, int $id): JsonResponse
    {
        try {
            $batch = $this->batchService->updateBatch($id, $request->validated());
            $resource = new BatchResource($batch);
            return response()->json($resource->resolve());
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Remove the specified batch.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->batchService->deleteBatch($id);
            return response()->json(['success' => true]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Get active batches.
     */
    public function getActive(): JsonResponse
    {
        $batches = $this->batchService->getActiveBatches();
        $resolved = BatchResource::collection($batches)->resolve();

        return response()->json($resolved);
    }

    /**
     * Get batches by course.
     */
    public function getByCourse(string $course): JsonResponse
    {
        $batches = $this->batchService->getBatchesByCourse($course);
        $resolved = BatchResource::collection($batches)->resolve();

        return response()->json($resolved);
    }
}
