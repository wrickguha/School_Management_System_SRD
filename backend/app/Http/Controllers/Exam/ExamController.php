<?php

namespace App\Http\Controllers\Exam;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamResource;
use App\Http\Resources\ExamResultResource;
use App\Services\ExamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    protected ExamService $examService;

    public function __construct(ExamService $examService)
    {
        $this->examService = $examService;
    }

    /**
     * Get list of exam schedules.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['grade', 'status']);
        $exams = $this->examService->getExams($filters);
        $resolved = ExamResource::collection($exams)->resolve();

        return response()->json($resolved);
    }

    /**
     * Schedule a new exam.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'grade' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'time' => 'nullable|string|max:100',
            'max_marks' => 'nullable|integer|min:1',
        ]);

        $exam = $this->examService->createExam($data);
        $resource = new ExamResource($exam);

        return response()->json($resource->resolve(), 201);
    }

    /**
     * Update an exam schedule.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'grade' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'time' => 'nullable|string|max:100',
            'max_marks' => 'nullable|integer|min:1',
            'status' => 'sometimes|required|string|in:Scheduled,Completed,Cancelled',
        ]);

        try {
            $exam = $this->examService->updateExam($id, $data);
            $resource = new ExamResource($exam);
            return response()->json($resource->resolve());
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Delete/cancel an exam schedule.
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->examService->deleteExam($id);

        if (!$success) {
            return response()->json(['message' => 'Exam schedule not found'], 404);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Record marks for an exam.
     */
    public function submitMarks(Request $request, int $examId): JsonResponse
    {
        $data = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|integer|exists:students,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.remarks' => 'nullable|string',
        ]);

        $this->examService->recordMarks($examId, $data['marks']);

        return response()->json(['success' => true, 'message' => 'Marks recorded successfully']);
    }

    /**
     * Retrieve report card details for a single student.
     */
    public function getReportCard(int $studentId): JsonResponse
    {
        $report = $this->examService->getReportCard($studentId);

        return response()->json([
            'results' => ExamResultResource::collection($report['results'])->resolve(),
            'average' => (float) $report['average'],
            'status' => $report['status'],
        ]);
    }
}
