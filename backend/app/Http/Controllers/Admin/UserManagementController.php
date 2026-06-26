<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * School Admin can create accounts for other roles
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only school_admin and principal can create user accounts
        if (!in_array($user->role, ['school_admin', 'principal'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => [
                'required',
                Rule::in(['principal', 'teacher', 'faculty', 'librarian', 'accountant', 'hr']),
            ],
            'date_of_birth' => 'required|date|before:today',
            'status' => 'sometimes|in:active,inactive',
        ]);

        // School admin must assign to their own school
        $validated['school_id'] = $user->school_id;

        // Generate password from date of birth (YYYYMMDD format)
        $dateOfBirth = $validated['date_of_birth'];
        $validated['password'] = Hash::make(str_replace('-', '', $dateOfBirth));

        $newUser = User::create($validated);

        // Log the action
        AuditLog::log('create', 'User', $newUser->id, null, 
            "New user {$newUser->name} ({$newUser->role}) created");

        return response()->json([
            'message' => 'User account created successfully',
            'data' => [
                'id' => $newUser->id,
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role,
                'status' => $newUser->status,
            ],
            'note' => "Password is the user's date of birth in YYYYMMDD format. They should change it on first login.",
        ], 201);
    }

    /**
     * Get list of users in school (for school admin)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = User::where('school_id', $user->school_id);

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->input('per_page', 50));

        return response()->json([
            'data' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $authUser = $request->user();

        // Only school_admin/principal can update, and only for their school
        if (!in_array($authUser->role, ['school_admin', 'principal']) || 
            $authUser->school_id !== $user->school_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:active,inactive',
            'date_of_birth' => 'sometimes|date|before:today',
        ]);

        // If date_of_birth is updated, regenerate password
        if (isset($validated['date_of_birth'])) {
            $validated['password'] = Hash::make(str_replace('-', '', $validated['date_of_birth']));
        }

        $user->update($validated);

        AuditLog::log('update', 'User', $user->id, null, "User {$user->name} updated");

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Delete user (deactivate)
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $authUser = $request->user();

        if (!in_array($authUser->role, ['school_admin', 'principal']) || 
            $authUser->school_id !== $user->school_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->update(['status' => 'inactive']);

        AuditLog::log('delete', 'User', $user->id, null, "User {$user->name} deactivated");

        return response()->json(['message' => 'User deactivated successfully']);
    }

    /**
     * Get available roles that can be created
     */
    public function availableRoles(): JsonResponse
    {
        return response()->json([
            'roles' => [
                ['value' => 'principal', 'label' => 'Principal'],
                ['value' => 'teacher', 'label' => 'Teacher'],
                ['value' => 'faculty', 'label' => 'Faculty'],
                ['value' => 'librarian', 'label' => 'Librarian'],
                ['value' => 'accountant', 'label' => 'Accountant'],
                ['value' => 'hr', 'label' => 'HR'],
            ],
        ]);
    }
}
