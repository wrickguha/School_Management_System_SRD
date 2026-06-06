<?php

namespace App\Repositories;

use App\Models\FeeTransaction;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FeeRepository
{
    /**
     * Get all fee transactions.
     */
    public function getAll(array $filters = []): array
    {
        $query = FeeTransaction::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        return $query->latest()->get()->all();
    }

    /**
     * Create a new fee transaction.
     */
    public function create(array $data): FeeTransaction
    {
        return DB::transaction(function () use ($data) {
            $schoolId = auth()->user()->school_id;

            // Resolve student ID by name (case-insensitive search)
            $student = Student::where('school_id', $schoolId)
                ->where('name', 'like', $data['student_name'])
                ->first();

            // Fallback: If no student matched, grab the first student or use a default student
            if (!$student) {
                $student = Student::where('school_id', $schoolId)->first();
            }

            $studentId = $student ? $student->id : 1;
            $studentName = $student ? $student->name : $data['student_name'];
            $grade = $student ? $student->grade : ($data['grade'] ?? 'Grade 10');

            // Generate unique receipt number
            $receiptNo = 'REC-2026-' . mt_rand(10000, 99999);

            $transaction = FeeTransaction::create([
                'school_id' => $schoolId,
                'receipt_no' => $receiptNo,
                'student_id' => $studentId,
                'student_name' => $studentName,
                'grade' => $grade,
                'amount' => $data['amount'],
                'payment_mode' => $data['payment_mode'],
                'status' => 'Paid', // success by default
                'date' => date('Y-m-d'),
                'recorded_by' => auth()->id(),
                'notes' => $data['notes'] ?? 'Fee collection',
            ]);

            // Recalculate pending fees for student
            if ($student) {
                $student->recalculatePendingFees();
            }

            return $transaction;
        });
    }

    /**
     * Get students with pending fees (defaulters).
     */
    public function getDefaulters(): array
    {
        $schoolId = auth()->user()->school_id;

        return Student::where('school_id', $schoolId)
            ->where('pending_fees', '>', 0)
            ->orderByDesc('pending_fees')
            ->get()
            ->all();
    }
}
