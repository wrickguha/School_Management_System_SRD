<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DemoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemoRequestController extends Controller
{
    /**
     * Display a listing of all demo requests (Super Admin).
     */
    public function index(): JsonResponse
    {
        $requests = DemoRequest::latest()->get();
        return response()->json($requests);
    }

    /**
     * Store a newly created demo request in storage (Public).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'student_count' => 'nullable|string|max:20',
        ]);

        $demoRequest = DemoRequest::create(array_merge($validated, [
            'status' => 'new'
        ]));

        return response()->json($demoRequest, 201);
    }

    /**
     * Update the status or notes of a demo request (Super Admin).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $demoRequest = DemoRequest::find($id);

        if (!$demoRequest) {
            return response()->json(['message' => 'Demo request not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:new,contacted,converted,rejected',
            'notes' => 'nullable|string',
        ]);

        $demoRequest->update($validated);

        return response()->json($demoRequest);
    }
}
