<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Repositories\AttendanceRepository;

class AttendanceService
{
    protected AttendanceRepository $attendanceRepository;

    public function __construct(AttendanceRepository $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function submitBulkAttendance(string $date, string $grade, string $section, array $sheet, int $userId): bool
    {
        $success = $this->attendanceRepository->saveBulk($date, $grade, $section, $sheet, $userId);

        if ($success) {
            // Log Activity
            ActivityLog::create([
                'school_id' => auth()->user()->school_id,
                'user_id' => $userId,
                'action' => 'Attendance Logged',
                'description' => "Logged attendance for {$grade}-{$section} on {$date}",
                'model_type' => null,
                'model_id' => null,
            ]);
        }

        return $success;
    }

    public function getDailyStats(string $date): array
    {
        return $this->attendanceRepository->getStatsForDate($date);
    }

    public function getMonthlyTrends(): array
    {
        return $this->attendanceRepository->getMonthlyTrend();
    }
}
