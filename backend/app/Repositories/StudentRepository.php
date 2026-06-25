<?php

namespace App\Repositories;

use App\Models\Student;
use App\Models\User;
use App\Models\Guardian;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Exception;

class StudentRepository
{
    /**
     * Get paginated or filtered list of students.
     */
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Student::with(['parents', 'user']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('admission_no', 'like', "%{$search}%")
                  ->orWhere('roll_no', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['grade'])) {
            $query->where('grade', $filters['grade']);
        }

        if (!empty($filters['section'])) {
            $query->where('section', $filters['section']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Find a student by ID.
     */
    public function findById(int $id): ?Student
    {
        return Student::with(['parents', 'user', 'documents', 'attendances', 'feeTransactions', 'examResults.exam'])->find($id);
    }

    /**
     * Create a student.
     * Optionally creates a User login if an email is provided.
     */
    public function create(array $data): Student
    {
        return DB::transaction(function () use ($data) {
            $userId = null;

            // Create login user account if requested / email provided
            if (!empty($data['email'])) {
                $user = User::create([
                    'school_id' => auth()->user()->school_id ?? $data['school_id'] ?? null,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password'] ?? 'password'),
                    'role' => 'student',
                    'status' => 'active',
                ]);
                $user->assignRole('student');
                $userId = $user->id;
            }

            $schoolId = auth()->user()->school_id ?? $data['school_id'] ?? null;

            $student = Student::create([
                'school_id' => $schoolId,
                'user_id' => $userId,
                'admission_no' => $data['admission_no'],
                'roll_no' => $data['roll_no'] ?? null,
                'name' => $data['name'],
                'grade' => $data['grade'],
                'section' => $data['section'],
                'gender' => $data['gender'] ?? null,
                'dob' => $data['dob'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'address' => $data['address'] ?? null,
                'admission_date' => $data['admission_date'] ?? now()->toDateString(),
                'total_fees' => $data['total_fees'] ?? 0,
                'pending_fees' => $data['total_fees'] ?? 0,
                'status' => $data['status'] ?? 'Active',
            ]);

            // Create/link Parent profile if provided
            if (!empty($data['parent_name'])) {
                $parent = null;
                
                // If parent email is provided, check if parent already exists in this school
                if (!empty($data['parent_email'])) {
                    $parent = Guardian::where('school_id', $schoolId)
                        ->where('email', $data['parent_email'])
                        ->first();
                }

                if (!$parent) {
                    $parentUserId = null;
                    if (!empty($data['parent_email'])) {
                        // Check if a User already exists with this email
                        $existingUser = User::where('email', $data['parent_email'])->first();
                        if (!$existingUser) {
                            $parentUser = User::create([
                                'school_id' => $schoolId,
                                'name' => $data['parent_name'],
                                'email' => $data['parent_email'],
                                'password' => Hash::make('password'),
                                'role' => 'parent',
                                'status' => 'active',
                            ]);
                            $parentUser->assignRole('parent');
                            $parentUserId = $parentUser->id;
                        } else {
                            $parentUserId = $existingUser->id;
                        }
                    }

                    $parent = Guardian::create([
                        'school_id' => $schoolId,
                        'user_id' => $parentUserId,
                        'name' => $data['parent_name'],
                        'phone' => $data['parent_phone'] ?? null,
                        'email' => $data['parent_email'] ?? null,
                    ]);
                }

                // Associate student with parent
                $student->parents()->attach($parent->id, ['relation' => 'Parent']);
            }

            return $student;
        });
    }

    /**
     * Update an existing student.
     */
    public function update(Student $student, array $data): Student
    {
        return DB::transaction(function () use ($student, $data) {
            $student->update($data);

            // Sync user details if student has a linked user account
            if ($student->user) {
                $userData = [];
                if (!empty($data['name'])) {
                    $userData['name'] = $data['name'];
                }
                if (!empty($data['email'])) {
                    $userData['email'] = $data['email'];
                }
                if (!empty($data['password'])) {
                    $userData['password'] = Hash::make($data['password']);
                }
                if (!empty($userData)) {
                    $student->user->update($userData);
                }
            }

            return $student->fresh(['parents', 'user']);
        });
    }

    /**
     * Delete a student (soft delete).
     */
    public function delete(Student $student): bool
    {
        return DB::transaction(function () use ($student) {
            if ($student->user) {
                $student->user->delete();
            }
            return $student->delete();
        });
    }
}
