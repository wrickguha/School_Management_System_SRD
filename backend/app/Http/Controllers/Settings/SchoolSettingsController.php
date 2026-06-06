<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SchoolSetting;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolSettingsController extends Controller
{
    /**
     * Get settings for the authenticated user's school.
     */
    public function show(): JsonResponse
    {
        $school = auth()->user()->school;
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
            'schoolName' => $school->name,
            'academicYear' => $settings->academic_year,
            'currentTerm' => $settings->current_term,
            'notifyAbsent' => (bool) $settings->notify_absent,
            'notifyFees' => (bool) $settings->notify_fees,
            'rfidStatus' => (bool) $settings->rfid_status,
        ]);
    }

    /**
     * Update settings for the school.
     */
    public function update(Request $request): JsonResponse
    {
        $school = auth()->user()->school;
        if (!$school) {
            return response()->json(['message' => 'School context not found'], 404);
        }

        $data = $request->validate([
            'school_name' => 'sometimes|required|string|max:255',
            'academic_year' => 'sometimes|required|string|max:20',
            'current_term' => 'sometimes|required|string|max:20',
            'notify_absent' => 'sometimes|required|boolean',
            'notify_fees' => 'sometimes|required|boolean',
            'rfid_status' => 'sometimes|required|boolean',
        ]);

        if (!empty($data['school_name'])) {
            $school->update(['name' => $data['school_name']]);
        }

        $settings = SchoolSetting::updateOrCreate(
            ['school_id' => $school->id],
            [
                'academic_year' => $data['academic_year'] ?? '2026-2027',
                'current_term' => $data['current_term'] ?? 'Term-I',
                'notify_absent' => $data['notify_absent'] ?? true,
                'notify_fees' => $data['notify_fees'] ?? true,
                'rfid_status' => $data['rfid_status'] ?? true,
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

        return response()->json([
            'schoolName' => $school->name,
            'academicYear' => $settings->academic_year,
            'currentTerm' => $settings->current_term,
            'notifyAbsent' => (bool) $settings->notify_absent,
            'notifyFees' => (bool) $settings->notify_fees,
            'rfidStatus' => (bool) $settings->rfid_status,
        ]);
    }
}
