<?php

namespace App\Http\Controllers\Academics;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHomeworkRequest;
use App\Http\Resources\HomeworkResource;
use App\Services\HomeworkService;
use Illuminate\Http\JsonResponse;

class HomeworkController extends Controller
{
    protected HomeworkService $homeworkService;

    public function __construct(HomeworkService $homeworkService)
    {
        $this->homeworkService = $homeworkService;
    }

    public function index(): JsonResponse
    {
        $tasks = $this->homeworkService->getAllTasks();
        return response()->json(HomeworkResource::collection($tasks)->resolve());
    }

    public function store(StoreHomeworkRequest $request): JsonResponse
    {
        $task = $this->homeworkService->createTask(
            $request->validated(),
            auth()->id(),
            auth()->user()->role
        );

        return response()->json((new HomeworkResource($task))->resolve(), 201);
    }
}
