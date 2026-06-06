<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Exam;
use App\Repositories\ExamRepository;

class ExamService
{
    protected ExamRepository $examRepository;

    public function __construct(ExamRepository $examRepository)
    {
        $this->examRepository = $examRepository;
    }

    public function getExams(array $filters = []): array
    {
        return $this->examRepository->getAll($filters);
    }

    public function createExam(array $data): Exam
    {
        $exam = $this->examRepository->create($data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $exam->school_id,
            'user_id' => auth()->id(),
            'action' => 'Exam Scheduled',
            'description' => "Scheduled exam: {$exam->title} for {$exam->grade}",
            'model_type' => Exam::class,
            'model_id' => $exam->id,
        ]);

        return $exam;
    }

    public function updateExam(int $id, array $data): Exam
    {
        $exam = $this->examRepository->findById($id);

        if (!$exam) {
            throw new \InvalidArgumentException("Exam not found");
        }

        $updatedExam = $this->examRepository->update($exam, $data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $updatedExam->school_id,
            'user_id' => auth()->id(),
            'action' => 'Exam Updated',
            'description' => "Updated exam details: {$updatedExam->title}",
            'model_type' => Exam::class,
            'model_id' => $updatedExam->id,
        ]);

        return $updatedExam;
    }

    public function deleteExam(int $id): bool
    {
        $exam = $this->examRepository->findById($id);

        if (!$exam) {
            return false;
        }

        $title = $exam->title;
        $schoolId = $exam->school_id;
        $success = $this->examRepository->delete($exam);

        if ($success) {
            // Log Activity
            ActivityLog::create([
                'school_id' => $schoolId,
                'user_id' => auth()->id(),
                'action' => 'Exam Deleted',
                'description' => "Deleted/Cancelled exam schedule: {$title}",
                'model_type' => Exam::class,
                'model_id' => $id,
            ]);
        }

        return $success;
    }

    public function recordMarks(int $examId, array $marks): bool
    {
        $success = $this->examRepository->submitMarks($examId, $marks);

        if ($success) {
            $exam = $this->examRepository->findById($examId);
            // Log Activity
            ActivityLog::create([
                'school_id' => auth()->user()->school_id,
                'user_id' => auth()->id(),
                'action' => 'Marks Recorded',
                'description' => "Recorded results for exam: " . ($exam->title ?? "Exam #$examId"),
                'model_type' => Exam::class,
                'model_id' => $examId,
            ]);
        }

        return $success;
    }

    public function getReportCard(int $studentId): array
    {
        return $this->examRepository->getStudentReportCard($studentId);
    }
}
