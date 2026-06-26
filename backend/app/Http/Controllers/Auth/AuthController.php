<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Authenticate credentials and return Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $result = $this->authService->login($credentials);

        return response()->json($result);
    }

    /**
     * Terminate user session.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('school');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'school_id' => $user->school_id,
            'avatar_path' => $user->avatar_path,
            'profile_image_path' => $user->profile_image_path,
            'school' => $user->school,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    /**
     * Upload and update user profile image
     */
    public function uploadProfileImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old image if exists
        if ($user->profile_image_path && Storage::disk('public')->exists($user->profile_image_path)) {
            Storage::disk('public')->delete($user->profile_image_path);
        }

        // Store new image
        $path = $request->file('image')->store('profile-images', 'public');
        $imageUrl = Storage::url($path);

        // Update user
        $user = $this->authService->updateProfileImage($user, $imageUrl);

        return response()->json([
            'message' => 'Profile image uploaded successfully',
            'image_url' => $imageUrl,
            'user' => [
                'id' => $user->id,
                'profile_image_path' => $user->profile_image_path,
            ],
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Only allow password change for super_admin and school_admin
        if (isset($validated['password']) && !in_array($user->role, ['super_admin', 'school_admin', 'principal'])) {
            unset($validated['password']);
        }

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
