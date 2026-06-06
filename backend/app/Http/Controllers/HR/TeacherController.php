<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Get all teachers.
     */
    public function index(): JsonResponse
    {
        $teachers = Teacher::latest()->get();
        $resolved = TeacherResource::collection($teachers)->resolve();

        return response()->json($resolved);
    }

    /**
     * Create a teacher record.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'department' => 'required|string|max:100',
            'designation' => 'required|string|max:100',
            'salary_grade' => 'required|string|max:100',
        ]);

        $teacher = DB::transaction(function () use ($data) {
            $schoolId = auth()->user()->school_id;

            // Generate an employee ID
            $employeeId = 'EMP' . date('Y') . mt_rand(1000, 9999);

            // Create login user account
            $user = User::create([
                'school_id' => $schoolId,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'), // default password
                'role' => 'teacher',
                'status' => 'active',
            ]);
            $user->assignRole('teacher');

            // Create teacher profile
            return Teacher::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'employee_id' => $employeeId,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'department' => $data['department'],
                'designation' => $data['designation'],
                'salary_grade' => $data['salary_grade'],
                'status' => 'Active',
                'attendance_rate' => 100.0,
            ]);
        });

        // Log Activity
        ActivityLog::create([
            'school_id' => $teacher->school_id,
            'user_id' => auth()->id(),
            'action' => 'Teacher Appointed',
            'description' => "Appointed new teacher: {$teacher->name} ({$teacher->employee_id})",
            'model_type' => Teacher::class,
            'model_id' => $teacher->id,
        ]);

        $resource = new TeacherResource($teacher);
        return response()->json($resource->resolve(), 201);
    }
}
