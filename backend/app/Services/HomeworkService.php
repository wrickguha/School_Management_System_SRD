<?php

namespace App\Services;

use App\Models\HomeworkTask;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

class HomeworkService
{
    /**
     * Get all assigned homework tasks.
     */
    public function getAllTasks(): Collection
    {
        return HomeworkTask::with('teacher')->latest()->get();
    }

    /**
     * Create a new homework task.
     */
    public function createTask(array $data, int $userId, string $role): HomeworkTask
    {
        $task = HomeworkTask::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'teacher_id' => $role === 'teacher' ? $userId : null,
        ]));

        ActivityLog::create([
            'school_id' => $task->school_id,
            'user_id' => $userId,
            'action' => 'Homework Assigned',
            'description' => "Assigned homework: {$task->title} for {$task->grade}",
            'model_type' => HomeworkTask::class,
            'model_id' => $task->id,
        ]);

        return $task;
    }
}
