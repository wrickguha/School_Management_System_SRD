<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SchoolController extends Controller
{
    /**
     * Display a listing of registered tenant schools.
     */
    public function index(): JsonResponse
    {
        $schools = School::with('setting')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'schools' => $schools,
            'total' => $schools->count(),
        ]);
    }

    /**
     * Store a newly created school, settings, and its admin user.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|alpha_dash|max:100|unique:schools,subdomain',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'plan' => 'required|string|in:starter,professional,enterprise',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:6',
        ]);

        // 2. Database transaction to ensure atomicity
        $result = DB::transaction(function () use ($validated) {
            // Create School
            $school = School::create([
                'name' => $validated['name'],
                'subdomain' => $validated['subdomain'],
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'],
                'plan' => $validated['plan'],
                'status' => 'active',
            ]);

            // Create School Settings defaults
            SchoolSetting::create([
                'school_id' => $school->id,
                'academic_year' => '2026-2027',
                'current_term' => 'Term-I',
                'notify_absent' => true,
                'notify_fees' => true,
                'rfid_status' => true,
            ]);

            // Create School Admin User account
            $adminUser = User::create([
                'school_id' => $school->id,
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'role' => 'school_admin',
                'status' => 'active',
            ]);
            $adminUser->assignRole('school_admin');

            return [
                'school' => $school,
                'admin' => $adminUser,
            ];
        });

        return response()->json([
            'message' => 'School and admin user successfully registered!',
            'school' => $result['school'],
            'admin' => [
                'name' => $result['admin']->name,
                'email' => $result['admin']->email,
            ],
        ], 201);
    }
}
