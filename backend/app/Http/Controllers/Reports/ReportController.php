<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ReportController extends Controller
{
    /**
     * List all compiled reports.
     */
    public function index(): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $cacheKey = "school_{$schoolId}_reports";

        // Fetch reports generated during this session, defaulting to standard seed reports
        $reports = Cache::get($cacheKey, [
            [
                'id' => 'REP-4019',
                'title' => 'Student Attendance Consolidation - Term I',
                'date' => '06/01/2026',
                'size' => '2.4 MB',
                'type' => 'PDF',
            ],
            [
                'id' => 'REP-4025',
                'title' => 'Monthly Revenue Cashflow Ledger - May 2026',
                'date' => '05/31/2026',
                'size' => '840 KB',
                'type' => 'XLSX',
            ],
            [
                'id' => 'REP-4028',
                'title' => 'Syllabus Coverage milestones review - Grade 9 & 10',
                'date' => '05/24/2026',
                'size' => '1.1 MB',
                'type' => 'PDF',
            ],
        ]);

        return response()->json($reports);
    }

    /**
     * Compile a new report.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'report_type' => 'required|string|in:academic,financial,attendance,hr',
            'selected_grade' => 'required|string|max:50',
        ]);

        $schoolId = auth()->user()->school_id;
        $cacheKey = "school_{$schoolId}_reports";

        $category = ucfirst($data['report_type']);
        $newReport = [
            'id' => 'REP-' . mt_rand(1000, 9999),
            'title' => "{$category} Audit report - {$data['selected_grade']}",
            'date' => date('m/d/Y'),
            'size' => round(mt_rand(500, 2500) / 1000, 1) . ' MB',
            'type' => $data['report_type'] === 'financial' ? 'XLSX' : 'PDF',
        ];

        // Retrieve current list and prepend the new one
        $reports = Cache::get($cacheKey, [
            [
                'id' => 'REP-4019',
                'title' => 'Student Attendance Consolidation - Term I',
                'date' => '06/01/2026',
                'size' => '2.4 MB',
                'type' => 'PDF',
            ],
            [
                'id' => 'REP-4025',
                'title' => 'Monthly Revenue Cashflow Ledger - May 2026',
                'date' => '05/31/2026',
                'size' => '840 KB',
                'type' => 'XLSX',
            ],
            [
                'id' => 'REP-4028',
                'title' => 'Syllabus Coverage milestones review - Grade 9 & 10',
                'date' => '05/24/2026',
                'size' => '1.1 MB',
                'type' => 'PDF',
            ],
        ]);

        array_unshift($reports, $newReport);
        Cache::put($cacheKey, $reports, 86400); // cache for 1 day

        // Log Activity
        ActivityLog::create([
            'school_id' => $schoolId,
            'user_id' => auth()->id(),
            'action' => 'Report Compiled',
            'description' => "Compiled {$data['report_type']} report for cohort: {$data['selected_grade']}",
            'model_type' => null,
            'model_id' => null,
        ]);

        return response()->json($newReport, 201);
    }
}
