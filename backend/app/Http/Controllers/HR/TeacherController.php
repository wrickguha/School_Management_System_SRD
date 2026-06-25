<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
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
     * Get all school staff (excluding students, parents, and super admin).
     */
    public function index(): JsonResponse
    {
        $schoolId = auth()->user()->school_id;

        // Fetch all staff users for the current school
        $users = User::where('school_id', $schoolId)
            ->whereNotIn('role', ['student', 'parent', 'super_admin'])
            ->get();

        $staffList = [];
        foreach ($users as $user) {
            $teacherProfile = Teacher::where('user_id', $user->id)->first();

            $staffList[] = [
                'id' => $user->id,
                'employee_id' => $teacherProfile ? $teacherProfile->employee_id : 'EMP' . $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? ($teacherProfile ? $teacherProfile->phone : ''),
                'department' => $teacherProfile ? $teacherProfile->department : 'Administration',
                'designation' => $teacherProfile ? $teacherProfile->designation : ucfirst(str_replace('_', ' ', $user->role)),
                'salary_grade' => $teacherProfile ? $teacherProfile->salary_grade : 'Grade A',
                'attendance_rate' => $teacherProfile ? (float) $teacherProfile->attendance_rate : 100.0,
                'status' => $teacherProfile ? $teacherProfile->status : 'Active',
                'role' => $user->role,
            ];
        }

        return response()->json($staffList);
    }

    /**
     * Create a staff member record.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|string|in:school_admin,principal,teacher,faculty,accountant,hr,librarian',
            'department' => 'nullable|string|max:100',
            'designation' => 'nullable|string|max:100',
            'salary_grade' => 'nullable|string|max:100',
        ]);

        $staff = DB::transaction(function () use ($data) {
            $schoolId = auth()->user()->school_id;

            // Create login user account
            $user = User::create([
                'school_id' => $schoolId,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'), // default password
                'role' => $data['role'],
                'status' => 'active',
            ]);
            $user->assignRole($data['role']);

            $employeeId = 'EMP' . date('Y') . mt_rand(1000, 9999);

            // If teacher or faculty, create a Teacher profile
            if (in_array($data['role'], ['teacher', 'faculty'])) {
                $teacher = Teacher::create([
                    'school_id' => $schoolId,
                    'user_id' => $user->id,
                    'employee_id' => $employeeId,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'department' => $data['department'] ?? 'Science',
                    'designation' => $data['designation'] ?? 'Senior Teacher',
                    'salary_grade' => $data['salary_grade'] ?? 'Grade A',
                    'status' => 'Active',
                    'attendance_rate' => 100.0,
                ]);

                return [
                    'user' => $user,
                    'profile' => $teacher,
                ];
            }

            return [
                'user' => $user,
                'profile' => null,
            ];
        });

        // Log Activity
        ActivityLog::create([
            'school_id' => auth()->user()->school_id,
            'user_id' => auth()->id(),
            'action' => 'Staff Registered',
            'description' => "Registered staff member: {$staff['user']->name} with role: {$staff['user']->role}",
            'model_type' => User::class,
            'model_id' => $staff['user']->id,
        ]);

        // Return the formatted staff object matching frontend expectations
        $response = [
            'id' => $staff['user']->id,
            'employee_id' => $staff['profile'] ? $staff['profile']->employee_id : 'EMP' . $staff['user']->id,
            'name' => $staff['user']->name,
            'email' => $staff['user']->email,
            'phone' => $data['phone'] ?? '',
            'department' => $staff['profile'] ? $staff['profile']->department : 'Administration',
            'designation' => $staff['profile'] ? $staff['profile']->designation : ucfirst(str_replace('_', ' ', $staff['user']->role)),
            'salary_grade' => $staff['profile'] ? $staff['profile']->salary_grade : 'Grade A',
            'attendance_rate' => 100.0,
            'status' => 'Active',
            'role' => $staff['user']->role,
        ];

        return response()->json($response, 201);
    }
}
