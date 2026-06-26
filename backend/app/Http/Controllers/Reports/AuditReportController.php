<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditReportController extends Controller
{
    /**
     * Get audit logs with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with(['user', 'school']);

        // Apply filters
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->input('per_page', 50);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'pagination' => [
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }

    /**
     * Get audit log details
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        $this->authorize('view', $auditLog);

        return response()->json([
            'data' => $auditLog->load(['user', 'school']),
        ]);
    }

    /**
     * Export audit logs
     */
    public function export(Request $request): JsonResponse
    {
        $query = AuditLog::with(['user', 'school']);

        // Apply same filters as index
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->limit(10000)->get();

        // Convert to CSV format
        $csv = "Timestamp,User,Action,Model Type,Model ID,Description,IP Address\n";
        foreach ($logs as $log) {
            $csv .= sprintf(
                '"%s","%s","%s","%s","%s","%s","%s"' . "\n",
                $log->created_at->format('Y-m-d H:i:s'),
                $log->user?->name ?? 'System',
                $log->action,
                $log->model_type,
                $log->model_id ?? '',
                str_replace('"', '""', $log->description ?? ''),
                $log->ip_address ?? ''
            );
        }

        return response()->json([
            'csv_data' => $csv,
            'filename' => 'audit_logs_' . now()->format('Y-m-d_H-i-s') . '.csv',
        ]);
    }

    /**
     * Get audit statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $dateFrom = $request->input('date_from', now()->subMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $stats = [
            'total_actions' => AuditLog::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'by_action' => AuditLog::whereBetween('created_at', [$dateFrom, $dateTo])
                ->groupBy('action')
                ->selectRaw('action, count(*) as count')
                ->pluck('count', 'action'),
            'by_model' => AuditLog::whereBetween('created_at', [$dateFrom, $dateTo])
                ->groupBy('model_type')
                ->selectRaw('model_type, count(*) as count')
                ->pluck('count', 'model_type'),
            'by_user' => AuditLog::whereBetween('created_at', [$dateFrom, $dateTo])
                ->with('user')
                ->groupBy('user_id')
                ->selectRaw('user_id, count(*) as count')
                ->get()
                ->map(fn ($log) => [
                    'user_id' => $log->user_id,
                    'user_name' => $log->user?->name,
                    'count' => $log->count,
                ]),
        ];

        return response()->json(['data' => $stats]);
    }
}
