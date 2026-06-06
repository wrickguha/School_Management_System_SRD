<?php

namespace App\Repositories;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class ExamRepository
{
    /**
     * Get all exam schedules.
     */
    public function getAll(array $filters = []): array
    {
        $query = Exam::query();

        if (!empty($filters['grade'])) {
            $query->where('grade', $filters['grade']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get()->all();
    }

    /**
     * Find an exam by ID.
     */
    public function findById(int $id): ?Exam
    {
        return Exam::find($id);
    }

    /**
     * Create an exam.
     */
    public function create(array $data): Exam
    {
        return Exam::create([
            'school_id' => auth()->user()->school_id,
            'title' => $data['title'],
            'grade' => $data['grade'] ?? null,
            'subject' => $data['subject'] ?? null,
            'date' => $data['date'] ?? null,
            'time' => $data['time'] ?? null,
            'max_marks' => $data['max_marks'] ?? 100,
            'status' => $data['status'] ?? 'Scheduled',
        ]);
    }

    /**
     * Update an exam.
     */
    public function update(Exam $exam, array $data): Exam
    {
        $exam->update($data);
        return $exam;
    }

    /**
     * Cancel/delete an exam.
     */
    public function delete(Exam $exam): bool
    {
        return $exam->delete();
    }

    /**
     * Submit marks for a single student or multiple.
     */
    public function submitMarks(int $examId, array $marks): bool
    {
        return DB::transaction(function () use ($examId, $marks) {
            $exam = Exam::findOrFail($examId);
            $schoolId = auth()->user()->school_id;

            foreach ($marks as $entry) {
                $studentId = $entry['student_id'];
                $obtained = $entry['marks_obtained'];
                $maxMarks = $exam->max_marks;

                // Letter grade logic
                $pct = $maxMarks > 0 ? ($obtained / $maxMarks) * 100 : 0;
                if ($pct >= 90) $grade = 'A+';
                elseif ($pct >= 80) $grade = 'A';
                elseif ($pct >= 70) $grade = 'B';
                elseif ($pct >= 60) $grade = 'C';
                elseif ($pct >= 50) $grade = 'D';
                else $grade = 'F';

                ExamResult::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'exam_id' => $examId,
                        'student_id' => $studentId,
                        'subject' => $exam->subject,
                    ],
                    [
                        'marks_obtained' => $obtained,
                        'max_marks' => $maxMarks,
                        'letter_grade' => $grade,
                        'remarks' => $entry['remarks'] ?? null,
                    ]
                );

                // Recalculate student overall academic performance
                $student = Student::find($studentId);
                if ($student) {
                    $results = ExamResult::where('student_id', $studentId)->get();
                    $totalObtained = $results->sum('marks_obtained');
                    $totalMax = $results->sum('max_marks');
                    $avg = $totalMax > 0 ? round(($totalObtained / $totalMax) * 100, 2) : 0;

                    $student->update([
                        'academic_performance' => $avg,
                    ]);
                }
            }

            // Mark exam as completed since results are recorded
            $exam->update(['status' => 'Completed']);

            return true;
        });
    }

    /**
     * Get report card for student.
     */
    public function getStudentReportCard(int $studentId): array
    {
        $results = ExamResult::with('exam')
            ->where('student_id', $studentId)
            ->get();

        $gpa = $results->count() > 0 ? round(($results->sum('marks_obtained') / $results->sum('max_marks')) * 100, 2) : 0;

        return [
            'results' => $results,
            'average' => $gpa,
            'status' => $gpa >= 50 ? 'PASSED' : 'FAILED',
        ];
    }
}
