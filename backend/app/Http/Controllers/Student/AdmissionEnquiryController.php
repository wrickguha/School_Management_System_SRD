<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AdmissionEnquiry;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdmissionEnquiryController extends Controller
{
    public function index(): JsonResponse
    {
        $schoolId = auth()->user()->school_id;
        $enquiries = AdmissionEnquiry::where('school_id', $schoolId)->latest()->get();
        return response()->json($enquiries);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'parent_name' => 'required|string|max:255',
            'parent_email' => 'required|email|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'student_name' => 'required|string|max:255',
            'applying_grade' => 'nullable|string|max:50',
            'status' => 'sometimes|required|string|in:New,Contacted,Admitted,Closed',
            'notes' => 'nullable|string',
        ]);

        $schoolId = auth()->user()->school_id;
        $enquiry = AdmissionEnquiry::create(array_merge($data, [
            'school_id' => $schoolId,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $schoolId,
            'user_id' => auth()->id(),
            'action' => 'Admission Enquiry Registered',
            'description' => "Enquiry registered for prospective student: {$enquiry->student_name} (Grade: {$enquiry->applying_grade})",
            'model_type' => AdmissionEnquiry::class,
            'model_id' => $enquiry->id,
        ]);

        return response()->json($enquiry, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $enquiry = AdmissionEnquiry::where('school_id', auth()->user()->school_id)->find($id);

        if (!$enquiry) {
            return response()->json(['message' => 'Enquiry not found'], 404);
        }

        $data = $request->validate([
            'parent_name' => 'sometimes|required|string|max:255',
            'parent_email' => 'sometimes|required|email|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'student_name' => 'sometimes|required|string|max:255',
            'applying_grade' => 'nullable|string|max:50',
            'status' => 'sometimes|required|string|in:New,Contacted,Admitted,Closed',
            'notes' => 'nullable|string',
        ]);

        $enquiry->update($data);

        return response()->json($enquiry);
    }

    public function destroy(int $id): JsonResponse
    {
        $enquiry = AdmissionEnquiry::where('school_id', auth()->user()->school_id)->find($id);

        if (!$enquiry) {
            return response()->json(['message' => 'Enquiry not found'], 404);
        }

        $enquiry->delete();

        return response()->json(['success' => true]);
    }
}
