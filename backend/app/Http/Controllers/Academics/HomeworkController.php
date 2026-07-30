<?php

namespace App\Http\Controllers\Academics;

use App\Http\Controllers\Controller;
use App\Services\HomeworkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:50',
            'section' => 'nullable|string|max:10',
            'instructions' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'sometimes|required|string|in:Active,Draft,Closed',
        ]);

        $task = $this->homeworkService->createTask($data, auth()->id(), auth()->user()->role);

        return response()->json($task, 201);
    }
}
