<?php

namespace App\Services;

use App\Models\Student;
use App\Models\ActivityLog;
use App\Repositories\StudentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentService
{
    protected StudentRepository $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function getAllStudents(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->studentRepository->getAll($filters, $perPage);
    }

    public function getStudentById(int $id): ?Student
    {
        return $this->studentRepository->findById($id);
    }

    public function createStudent(array $data): Student
    {
        $student = $this->studentRepository->create($data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $student->school_id,
            'user_id' => auth()->id(),
            'action' => 'Student Registered',
            'description' => "Registered new student: {$student->name} (Admission No: {$student->admission_no})",
            'model_type' => Student::class,
            'model_id' => $student->id,
        ]);

        return $student;
    }

    public function updateStudent(int $id, array $data): Student
    {
        $student = $this->studentRepository->findById($id);

        if (!$student) {
            throw new \InvalidArgumentException("Student not found");
        }

        $updatedStudent = $this->studentRepository->update($student, $data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $updatedStudent->school_id,
            'user_id' => auth()->id(),
            'action' => 'Student Updated',
            'description' => "Updated details for student: {$updatedStudent->name}",
            'model_type' => Student::class,
            'model_id' => $updatedStudent->id,
        ]);

        return $updatedStudent;
    }

    public function deleteStudent(int $id): bool
    {
        $student = $this->studentRepository->findById($id);

        if (!$student) {
            return false;
        }

        $name = $student->name;
        $schoolId = $student->school_id;
        $success = $this->studentRepository->delete($student);

        if ($success) {
            // Log Activity
            ActivityLog::create([
                'school_id' => $schoolId,
                'user_id' => auth()->id(),
                'action' => 'Student Deleted',
                'description' => "Deleted student: {$name}",
                'model_type' => Student::class,
                'model_id' => $id,
            ]);
        }

        return $success;
    }
}
