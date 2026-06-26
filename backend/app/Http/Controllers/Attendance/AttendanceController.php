<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use App\Models\Attendance;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    /**
     * Get all attendance records with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['student', 'teacher', 'recorder']);

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Filter by grade/section
        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('section')) {
            $query->where('section', $request->section);
        }

        // Filter by attendance status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by attendance type
        if ($request->filled('attendance_type')) {
            $query->where('attendance_type', $request->attendance_type);
        }

        // Filter by teacher (for routine attendance)
        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        $attendances = $query->orderBy('date', 'desc')->paginate($request->input('per_page', 50));

        return response()->json([
            'data' => $attendances->items(),
            'pagination' => [
                'total' => $attendances->total(),
                'per_page' => $attendances->perPage(),
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
            ],
        ]);
    }

    /**
     * Record attendance (new method supporting both class and routine)
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'grade' => 'required|string|max:50',
            'section' => 'required|string|max:10',
            'student_id' => 'required|integer|exists:students,id',
            'status' => 'required|in:Present,Absent,Late',
            'attendance_type' => 'sometimes|in:class,routine',
            'class_id' => 'sometimes|integer',
            'subject_id' => 'sometimes|integer',
        ]);

        $data['school_id'] = $user->school_id;
        $data['recorded_by'] = $user->id;
        $data['teacher_id'] = $user->id;
        $data['attendance_type'] = $data['attendance_type'] ?? 'class';

        $attendance = Attendance::create($data);

        // Audit log
        AuditLog::log('create', 'Attendance', $attendance->id, null,
            "Attendance recorded for student_id {$data['student_id']} on {$data['date']}");

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'data' => $attendance,
        ], 201);
    }

    /**
     * Submit daily register sheet in bulk (class attendance).
     */
    public function submitBulk(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'grade' => 'required|string|max:50',
            'section' => 'required|string|max:10',
            'sheet' => 'required|array',
            'sheet.*' => 'required|string|in:Present,Absent,Late',
            'attendance_type' => 'sometimes|in:class,routine',
        ]);

        $this->attendanceService->submitBulkAttendance(
            $data['date'],
            $data['grade'],
            $data['section'],
            $data['sheet'],
            auth()->id(),
            $data['attendance_type'] ?? 'class'
        );

        return response()->json(['success' => true, 'message' => 'Attendance saved successfully']);
    }

    /**
     * Get attendance by class (for class teachers)
     */
    public function getByClass(Request $request): JsonResponse
    {
        $user = $request->user();
        $date = $request->query('date', date('Y-m-d'));
        $grade = $request->query('grade');
        $section = $request->query('section');

        if (!$grade || !$section) {
            return response()->json(['message' => 'Grade and section are required'], 400);
        }

        $attendances = Attendance::where('school_id', $user->school_id)
            ->whereDate('date', $date)
            ->where('grade', $grade)
            ->where('section', $section)
            ->where('attendance_type', 'class')
            ->with(['student', 'recorder'])
            ->get();

        $summary = [
            'total' => $attendances->count(),
            'present' => $attendances->where('status', 'Present')->count(),
            'absent' => $attendances->where('status', 'Absent')->count(),
            'late' => $attendances->where('status', 'Late')->count(),
            'percentage' => $attendances->count() > 0 
                ? round(($attendances->where('status', 'Present')->count() / $attendances->count()) * 100, 2)
                : 0,
        ];

        return response()->json([
            'data' => $attendances,
            'summary' => $summary,
        ]);
    }

    /**
     * Get teacher's classes for routine attendance
     */
    public function getTeacherClasses(Request $request): JsonResponse
    {
        $user = $request->user();

        // This assumes there's a teacher_classes relationship
        // You may need to adjust based on your actual schema
        $classes = \DB::table('teacher_classes')
            ->where('teacher_id', $user->id)
            ->select('grade', 'section', 'subject')
            ->distinct()
            ->get();

        return response()->json([
            'data' => $classes,
        ]);
    }

    /**
     * Get statistics summary for a specific date.
     */
    public function getStats(Request $request): JsonResponse
    {
        $date = $request->query('date', date('Y-m-d'));
        $stats = $this->attendanceService->getDailyStats($date);

        return response()->json($stats);
    }

    /**
     * Get 6-month historical trends.
     */
    public function getMonthlyTrend(): JsonResponse
    {
        $trend = $this->attendanceService->getMonthlyTrends();

        return response()->json($trend);
    }
}
