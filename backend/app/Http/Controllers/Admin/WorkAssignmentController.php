<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkAssignment;
use App\Models\User;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkAssignmentController extends Controller
{
    /**
     * Display a listing of work assignments with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $query = WorkAssignment::with([
            'creator:id,name,email,role',
            'assignee:id,name,email,role,profile_image_path',
            'school:id,name,code,city'
        ]);

        // If user is super admin and passes specific school_id
        if ($user->isSuperAdmin() && $request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // Filter by assigned_role if specified
        if ($request->filled('assigned_role')) {
            $query->where(function ($q) use ($request) {
                $q->where('assigned_role', $request->assigned_role)
                  ->orWhere('assigned_role', 'all');
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by assigned_to
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Search in title or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by latest
        $assignments = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 25));

        return response()->json($assignments);
    }

    /**
     * Store a newly created work assignment in storage.
     */
    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'assigned_role'  => 'required|string|max:50',
            'assigned_to'    => 'nullable|exists:users,id',
            'school_id'      => 'nullable|exists:schools,id',
            'category'       => 'required|string|max:50',
            'priority'       => 'required|in:low,medium,high,urgent',
            'due_date'       => 'nullable|date',
            'status'         => 'nullable|in:pending,in_progress,submitted,completed,rejected',
            'remarks'        => 'nullable|string',
        ]);

        $schoolId = $user->isSuperAdmin() ? ($validated['school_id'] ?? null) : $user->school_id;

        $assignment = WorkAssignment::create([
            'school_id'       => $schoolId,
            'created_by'      => $user->id,
            'assigned_to'     => $validated['assigned_to'] ?? null,
            'assigned_role'   => $validated['assigned_role'],
            'title'           => $validated['title'],
            'description'     => $validated['description'] ?? null,
            'category'        => $validated['category'] ?? 'general',
            'priority'        => $validated['priority'] ?? 'medium',
            'due_date'        => $validated['due_date'] ?? null,
            'status'          => $validated['status'] ?? 'pending',
            'remarks'         => $validated['remarks'] ?? null,
        ]);

        $assignment->load(['creator:id,name,email,role', 'assignee:id,name,email,role', 'school:id,name,code']);

        return response()->json([
            'message'    => 'Work assignment dispathed successfully',
            'assignment' => $assignment,
        ], 201);
    }

    /**
     * Display the specified work assignment.
     */
    public function show(int $id): JsonResponse
    {
        $assignment = WorkAssignment::with([
            'creator:id,name,email,role',
            'assignee:id,name,email,role,profile_image_path',
            'school:id,name,code'
        ])->findOrFail($id);

        return response()->json($assignment);
    }

    /**
     * Update the specified work assignment.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $assignment = WorkAssignment::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|required|string|max:255',
            'description'      => 'nullable|string',
            'assigned_role'    => 'sometimes|required|string|max:50',
            'assigned_to'      => 'nullable|exists:users,id',
            'category'         => 'sometimes|required|string|max:50',
            'priority'         => 'sometimes|required|in:low,medium,high,urgent',
            'due_date'         => 'nullable|date',
            'status'           => 'sometimes|required|in:pending,in_progress,submitted,completed,rejected',
            'completion_notes' => 'nullable|string',
            'remarks'          => 'nullable|string',
        ]);

        $assignment->update($validated);
        $assignment->load(['creator:id,name,email,role', 'assignee:id,name,email,role', 'school:id,name,code']);

        return response()->json([
            'message'    => 'Work assignment updated successfully',
            'assignment' => $assignment,
        ]);
    }

    /**
     * Quick status update for assignee or admin.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $assignment = WorkAssignment::findOrFail($id);

        $validated = $request->validate([
            'status'           => 'required|in:pending,in_progress,submitted,completed,rejected',
            'completion_notes' => 'nullable|string',
            'remarks'          => 'nullable|string',
        ]);

        $assignment->update($validated);
        $assignment->load(['creator:id,name,email,role', 'assignee:id,name,email,role', 'school:id,name,code']);

        return response()->json([
            'message'    => 'Work status updated successfully',
            'assignment' => $assignment,
        ]);
    }

    /**
     * Remove the specified work assignment.
     */
    public function destroy(int $id): JsonResponse
    {
        $assignment = WorkAssignment::findOrFail($id);
        $assignment->delete();

        return response()->json([
            'message' => 'Work assignment deleted successfully',
        ]);
    }

    /**
     * Return workload and analytics metrics across roles and priorities.
     */
    public function analytics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $query = WorkAssignment::query();

        if ($user->isSuperAdmin() && $request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        $total = (clone $query)->count();
        $pending = (clone $query)->where('status', 'pending')->count();
        $inProgress = (clone $query)->where('status', 'in_progress')->count();
        $submitted = (clone $query)->where('status', 'submitted')->count();
        $completed = (clone $query)->where('status', 'completed')->count();
        $rejected = (clone $query)->where('status', 'rejected')->count();

        // Urgent tasks count
        $urgent = (clone $query)->where('priority', 'urgent')->whereIn('status', ['pending', 'in_progress'])->count();

        // Breakdown by role
        $roleBreakdown = (clone $query)
            ->selectRaw('assigned_role, count(*) as count')
            ->groupBy('assigned_role')
            ->get()
            ->pluck('count', 'assigned_role');

        // Breakdown by priority
        $priorityBreakdown = (clone $query)
            ->selectRaw('priority, count(*) as count')
            ->groupBy('priority')
            ->get()
            ->pluck('count', 'priority');

        $completionRate = $total > 0 ? round(($completed / $total) * 100, 1) : 0;

        return response()->json([
            'total'             => $total,
            'pending'           => $pending,
            'in_progress'       => $inProgress,
            'submitted'         => $submitted,
            'completed'         => $completed,
            'rejected'          => $rejected,
            'urgent'            => $urgent,
            'completion_rate'   => $completionRate,
            'role_breakdown'    => $roleBreakdown,
            'priority_breakdown'=> $priorityBreakdown,
        ]);
    }
}
