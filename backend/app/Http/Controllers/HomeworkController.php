<?php

namespace App\Http\Controllers;

use App\Models\HomeworkTask;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeworkController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = HomeworkTask::with('teacher')->latest()->get();
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

        $task = HomeworkTask::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'teacher_id' => auth()->user()->role === 'teacher' ? auth()->id() : null,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $task->school_id,
            'user_id' => auth()->id(),
            'action' => 'Homework Assigned',
            'description' => "Assigned homework: {$task->title} for {$task->grade}",
            'model_type' => HomeworkTask::class,
            'model_id' => $task->id,
        ]);

        return response()->json($task, 201);
    }
}
