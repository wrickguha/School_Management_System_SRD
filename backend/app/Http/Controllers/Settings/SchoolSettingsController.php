<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SchoolSetting;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolSettingsController extends Controller
{
    /**
     * Get settings for the authenticated user's school.
     */
    public function show(): JsonResponse
    {
        $user = auth()->user();
        
        // Super admin can view all schools
        if ($user->isSuperAdmin()) {
            return response()->json([
                'message' => 'Super Admin - Use school_id parameter to view specific school',
                'note' => 'Add ?school_id=X to get specific school settings'
            ]);
        }

        $school = $user->school;
        if (!$school) {
            return response()->json(['message' => 'School context not found'], 404);
        }

        $settings = SchoolSetting::firstOrCreate(
            ['school_id' => $school->id],
            [
                'academic_year' => '2026-2027',
                'current_term' => 'Term-I',
                'notify_absent' => true,
                'notify_fees' => true,
                'rfid_status' => true,
            ]
        );

        return response()->json([
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'subdomain' => $school->subdomain,
                'address' => $school->address,
                'phone' => $school->phone,
                'email' => $school->email,
                'logo_path' => $school->logo_path,
                'plan' => $school->plan,
                'status' => $school->status,
            ],
            'settings' => [
                'academic_year' => $settings->academic_year,
                'current_term' => $settings->current_term,
                'notify_absent' => (bool) $settings->notify_absent,
                'notify_fees' => (bool) $settings->notify_fees,
                'rfid_status' => (bool) $settings->rfid_status,
            ],
            'stats' => [
                'total_students' => $school->students()->count(),
                'total_teachers' => $school->teachers()->count(),
                'total_staff' => $school->users()->whereIn('role', ['accountant', 'hr', 'librarian'])->count(),
            ]
        ]);
    }

    /**
     * Update settings for the school.
     */
    public function update(Request $request): JsonResponse
    {
        $user = auth()->user();
        $school = $user->school;
        
        if (!$school) {
            return response()->json(['message' => 'School context not found'], 404);
        }

        $data = $request->validate([
            'school_name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|string|max:500',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'academic_year' => 'sometimes|required|string|max:20',
            'current_term' => 'sometimes|required|string|max:20',
            'notify_absent' => 'sometimes|required|boolean',
            'notify_fees' => 'sometimes|required|boolean',
            'rfid_status' => 'sometimes|required|boolean',
        ]);

        // Track changes for audit
        $oldSchoolData = $school->only(['name', 'address', 'phone', 'email']);

        // Update school information
        if (isset($data['school_name'])) {
            $school->update(['name' => $data['school_name']]);
        }

        if (isset($data['address'])) {
            $school->update(['address' => $data['address']]);
        }

        if (isset($data['phone'])) {
            $school->update(['phone' => $data['phone']]);
        }

        if (isset($data['email'])) {
            $school->update(['email' => $data['email']]);
        }

        // Update settings
        $oldSettings = SchoolSetting::where('school_id', $school->id)->first();
        $settings = SchoolSetting::updateOrCreate(
            ['school_id' => $school->id],
            [
                'academic_year' => $data['academic_year'] ?? ($oldSettings?->academic_year ?? '2026-2027'),
                'current_term' => $data['current_term'] ?? ($oldSettings?->current_term ?? 'Term-I'),
                'notify_absent' => $data['notify_absent'] ?? ($oldSettings?->notify_absent ?? true),
                'notify_fees' => $data['notify_fees'] ?? ($oldSettings?->notify_fees ?? true),
                'rfid_status' => $data['rfid_status'] ?? ($oldSettings?->rfid_status ?? true),
            ]
        );

        // Log Activity
        ActivityLog::create([
            'school_id' => $school->id,
            'user_id' => auth()->id(),
            'action' => 'Settings Updated',
            'description' => "Updated system settings for institution: {$school->name}",
            'model_type' => null,
            'model_id' => null,
        ]);

        // Audit log
        AuditLog::log('update', 'SchoolSetting', $settings->id, 
            ['settings' => $data],
            "School settings updated for {$school->name}");

        return response()->json([
            'message' => 'Settings updated successfully',
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'address' => $school->address,
                'phone' => $school->phone,
                'email' => $school->email,
            ],
            'settings' => [
                'academic_year' => $settings->academic_year,
                'current_term' => $settings->current_term,
                'notify_absent' => (bool) $settings->notify_absent,
                'notify_fees' => (bool) $settings->notify_fees,
                'rfid_status' => (bool) $settings->rfid_status,
            ]
        ]);
    }
}
