<?php

namespace App\Http\Controllers\Communication;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Get announcements list, filtered by target audience based on user role.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $query = Announcement::query();

        // Target audience scoping
        if ($user && !$user->isSuperAdmin() && !$user->isSchoolAdmin()) {
            $audiences = ['All'];

            if ($user->role === 'teacher' || $user->role === 'faculty') {
                $audiences[] = 'Teachers';
            } elseif ($user->role === 'student') {
                $audiences[] = 'Students';
            } elseif ($user->role === 'parent') {
                $audiences[] = 'Parents';
            } else {
                // accountant, hr, librarian, etc.
                $audiences[] = 'Staff';
            }

            $query->whereIn('target_audience', $audiences);
        }

        $announcements = $query->latest()->get();
        $resolved = AnnouncementResource::collection($announcements)->resolve();

        return response()->json($resolved);
    }

    /**
     * Store a new announcement.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_audience' => 'sometimes|required|string|in:All,Parents,Students,Teachers,Staff',
            'is_sms' => 'sometimes|boolean',
        ]);

        $announcement = Announcement::create([
            'school_id' => auth()->user()->school_id,
            'title' => $data['title'],
            'content' => $data['content'],
            'target_audience' => $data['target_audience'] ?? 'All',
            'is_sms' => $data['is_sms'] ?? false,
            'published_at' => now(),
            'created_by' => auth()->id(),
        ]);

        // Log Activity
        ActivityLog::create([
            'school_id' => $announcement->school_id,
            'user_id' => auth()->id(),
            'action' => 'Announcement Created',
            'description' => "Published announcement: {$announcement->title}",
            'model_type' => Announcement::class,
            'model_id' => $announcement->id,
        ]);

        $resource = new AnnouncementResource($announcement);
        return response()->json($resource->resolve(), 201);
    }

    /**
     * Delete an announcement.
     */
    public function destroy(int $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $title = $announcement->title;
        $schoolId = $announcement->school_id;
        $announcement->delete();

        // Log Activity
        ActivityLog::create([
            'school_id' => $schoolId,
            'user_id' => auth()->id(),
            'action' => 'Announcement Deleted',
            'description' => "Deleted announcement: {$title}",
            'model_type' => Announcement::class,
            'model_id' => $id,
        ]);

        return response()->json(['success' => true]);
    }
}
