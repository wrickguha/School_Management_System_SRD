<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ParentController extends Controller
{
    public function index(): JsonResponse
    {
        $parents = Guardian::with('students')->latest()->get();
        return response()->json($parents);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:users,email',
            'student_id' => 'nullable|integer|exists:students,id',
            'relation' => 'nullable|string|max:50',
        ]);

        $parent = DB::transaction(function () use ($data) {
            $schoolId = auth()->user()->school_id;

            $user = User::create([
                'school_id' => $schoolId,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'parent',
                'status' => 'active',
            ]);
            $user->assignRole('parent');

            $guardian = Guardian::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'name' => $data['name'],
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'],
            ]);

            if (!empty($data['student_id'])) {
                $guardian->students()->attach($data['student_id'], [
                    'relation' => $data['relation'] ?? 'Parent',
                ]);
            }

            return $guardian;
        });

        // Log Activity
        ActivityLog::create([
            'school_id' => $parent->school_id,
            'user_id' => auth()->id(),
            'action' => 'Parent Registered',
            'description' => "Registered parent: {$parent->name} for ward",
            'model_type' => Guardian::class,
            'model_id' => $parent->id,
        ]);

        return response()->json($parent, 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $parent = Guardian::find($id);

        if (!$parent) {
            return response()->json(['message' => 'Parent not found'], 404);
        }

        DB::transaction(function () use ($parent) {
            if ($parent->user) {
                $parent->user->delete();
            }
            $parent->delete();
        });

        return response()->json(['success' => true]);
    }
}
