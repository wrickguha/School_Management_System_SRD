<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
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
     * Submit daily register sheet in bulk.
     */
    public function submitBulk(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'grade' => 'required|string|max:50',
            'section' => 'required|string|max:10',
            'sheet' => 'required|array',
            'sheet.*' => 'required|string|in:Present,Absent,Late',
        ]);

        $this->attendanceService->submitBulkAttendance(
            $data['date'],
            $data['grade'],
            $data['section'],
            $data['sheet'],
            auth()->id()
        );

        return response()->json(['success' => true, 'message' => 'Attendance saved successfully']);
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
