<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate user and return token & user data.
     *
     * @param array $credentials
     * @return array
     * @throws ValidationException
     */
    public function login(array $credentials): array
    {
        $user = User::with('school')->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive. Please contact your school administrator.'],
            ]);
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
        ]);

        // Create Sanctum token (contains role and school_id for verification/reference)
        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'school_id' => $user->school_id,
                'avatar_path' => $user->avatar_path,
                'school' => $user->school,
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ];
    }

    /**
     * Log out current user (revoke token).
     *
     * @param User $user
     * @return void
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
