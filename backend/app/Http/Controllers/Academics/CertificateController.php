<?php

namespace App\Http\Controllers\Academics;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Student;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    /**
     * Display a listing of certificates.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Certificate::with(['student', 'issuedBy'])->latest();

        // If user is a student, restrict to their own certificates
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)
                ->orWhere('parent_email', $user->email)
                ->first();

            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                // Try matching by email
                $query->whereHas('student', function ($q) use ($user) {
                    $q->where('parent_email', $user->email);
                });
            }
        } elseif ($user->role === 'parent') {
            // If parent, find student linked by parent email
            $query->whereHas('student', function ($q) use ($user) {
                $q->where('parent_email', $user->email);
            });
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('certificate_type')) {
            $query->where('certificate_type', $request->certificate_type);
        }

        $certificates = $query->get();

        return response()->json($certificates);
    }

    /**
     * Store a newly created certificate in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id'       => 'required|exists:students,id',
            'title'            => 'required|string|max:255',
            'certificate_type' => 'required|string|in:Academic Excellence,Sports & Athletics,Course Completion,Extra-Curricular,Character & Conduct,Merit,Other',
            'issue_date'       => 'nullable|date',
            'description'      => 'nullable|string',
            'file'             => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120', // Max 5MB
        ]);

        $user = $request->user();

        // Store certificate file
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileSize = round($file->getSize() / 1024, 1) . ' KB';
        
        $path = $file->store('certificates', 'public');
        $fileUrl = Storage::url($path);

        $certificate = Certificate::create([
            'school_id'         => $user->school_id ?? 1,
            'student_id'        => $validated['student_id'],
            'issued_by_user_id' => $user->id,
            'title'             => $validated['title'],
            'certificate_type'  => $validated['certificate_type'],
            'issue_date'        => $validated['issue_date'] ?? now()->toDateString(),
            'file_path'         => $fileUrl,
            'file_name'         => $fileName,
            'file_size'         => $fileSize,
            'description'       => $validated['description'] ?? null,
        ]);

        $certificate->load(['student', 'issuedBy']);

        AuditLog::log('create', 'Certificate', $certificate->id, null, "Uploaded certificate '{$certificate->title}' for student ID {$certificate->student_id}");

        return response()->json([
            'message'     => 'Certificate uploaded successfully!',
            'certificate' => $certificate,
        ], 201);
    }

    /**
     * Remove the specified certificate from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);

        // Delete underlying file if exists
        $relativeStoragePath = str_replace('/storage/', '', $certificate->file_path);
        if (Storage::disk('public')->exists($relativeStoragePath)) {
            Storage::disk('public')->delete($relativeStoragePath);
        }

        AuditLog::log('delete', 'Certificate', $certificate->id, "Deleted certificate '{$certificate->title}'");

        $certificate->delete();

        return response()->json([
            'message' => 'Certificate deleted successfully!',
        ]);
    }
}
