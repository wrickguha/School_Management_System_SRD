<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolSetting;
use App\Models\User;
use App\Models\Teacher;
use App\Models\TeacherClass;
use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SchoolController extends Controller
{
    /**
     * Store a newly created school, settings, and its users.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|alpha_dash|max:100|unique:schools,subdomain',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'plan' => 'required|string|in:starter,professional,enterprise',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:6',
        ]);

        // 2. Database transaction to ensure atomicity
        $result = DB::transaction(function () use ($validated) {
            // Create School
            $school = School::create([
                'name' => $validated['name'],
                'subdomain' => $validated['subdomain'],
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'],
                'plan' => $validated['plan'],
                'status' => 'active',
            ]);

            // Create School Settings defaults
            SchoolSetting::create([
                'school_id' => $school->id,
                'academic_year' => '2026-2027',
                'current_term' => 'Term-I',
                'notify_absent' => true,
                'notify_fees' => true,
                'rfid_status' => true,
            ]);

            // Create School Admin User account
            $adminUser = User::create([
                'school_id' => $school->id,
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'role' => 'school_admin',
                'status' => 'active',
            ]);
            $adminUser->assignRole('school_admin');

            // Auto-generate standard roles for immediate demo usage
            $rolesToSeed = [
                ['name' => 'Principal ' . $school->name, 'email' => 'principal@' . $school->subdomain . '.edu', 'role' => 'principal'],
                ['name' => 'Teacher ' . $school->name, 'email' => 'teacher@' . $school->subdomain . '.edu', 'role' => 'teacher'],
                ['name' => 'Faculty ' . $school->name, 'email' => 'faculty@' . $school->subdomain . '.edu', 'role' => 'faculty'],
                ['name' => 'Parent ' . $school->name, 'email' => 'parent@' . $school->subdomain . '.edu', 'role' => 'parent'],
                ['name' => 'Student ' . $school->name, 'email' => 'student@' . $school->subdomain . '.edu', 'role' => 'student'],
                ['name' => 'Accountant ' . $school->name, 'email' => 'accountant@' . $school->subdomain . '.edu', 'role' => 'accountant'],
                ['name' => 'HR ' . $school->name, 'email' => 'hr@' . $school->subdomain . '.edu', 'role' => 'hr'],
                ['name' => 'Librarian ' . $school->name, 'email' => 'librarian@' . $school->subdomain . '.edu', 'role' => 'librarian'],
            ];

            $seededUsers = [];
            foreach ($rolesToSeed as $data) {
                $user = User::create([
                    'school_id' => $school->id,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('password'),
                    'role' => $data['role'],
                    'status' => 'active',
                ]);
                $user->assignRole($data['role']);
                $seededUsers[$data['role']] = $user;
            }

            // Create profiles for special seeded roles (Teacher, Faculty, Parent, Student)
            $teacherObj = Teacher::create([
                'school_id' => $school->id,
                'user_id' => $seededUsers['teacher']->id,
                'employee_id' => 'EMP' . $school->id . '001',
                'name' => $seededUsers['teacher']->name,
                'email' => $seededUsers['teacher']->email,
                'phone' => '+1-555-0201',
                'department' => 'Science',
                'designation' => 'Senior Teacher',
                'salary_grade' => 'Grade A',
                'status' => 'Active',
                'attendance_rate' => 95.0,
            ]);

            $facultyObj = Teacher::create([
                'school_id' => $school->id,
                'user_id' => $seededUsers['faculty']->id,
                'employee_id' => 'EMP' . $school->id . '002',
                'name' => $seededUsers['faculty']->name,
                'email' => $seededUsers['faculty']->email,
                'phone' => '+1-555-0202',
                'department' => 'History',
                'designation' => 'Lecturer',
                'salary_grade' => 'Grade B',
                'status' => 'Active',
                'attendance_rate' => 94.0,
            ]);

            TeacherClass::create([
                'school_id' => $school->id,
                'teacher_id' => $teacherObj->id,
                'grade' => 'Grade 10',
                'section' => 'A',
                'subject' => 'Science',
            ]);

            TeacherClass::create([
                'school_id' => $school->id,
                'teacher_id' => $facultyObj->id,
                'grade' => 'Grade 10',
                'section' => 'A',
                'subject' => 'History',
            ]);

            $parentObj = Guardian::create([
                'school_id' => $school->id,
                'user_id' => $seededUsers['parent']->id,
                'name' => $seededUsers['parent']->name,
                'phone' => '+1-555-0144',
                'email' => $seededUsers['parent']->email,
            ]);

            $studentObj = Student::create([
                'school_id' => $school->id,
                'user_id' => $seededUsers['student']->id,
                'admission_no' => 'ADM' . $school->id . '001',
                'roll_no' => '101',
                'name' => $seededUsers['student']->name,
                'grade' => 'Grade 10',
                'section' => 'A',
                'gender' => 'Male',
                'dob' => '2011-05-14',
                'blood_group' => 'O+',
                'address' => $school->address ?? 'School Address',
                'status' => 'Active',
                'admission_date' => now()->toDateString(),
                'total_fees' => 5000.00,
                'pending_fees' => 5000.00,
                'attendance_rate' => 100.0,
                'academic_performance' => 90.0,
                'fee_status' => 'Pending',
            ]);

            $studentObj->parents()->attach($parentObj->id, ['relation' => 'Father']);

            return [
                'school' => $school,
                'admin' => $adminUser,
            ];
        });

        return response()->json([
            'message' => 'School and demo roles successfully registered!',
            'school' => $result['school'],
            'admin' => [
                'name' => $result['admin']->name,
                'email' => $result['admin']->email,
            ],
        ], 201);
    }
}
