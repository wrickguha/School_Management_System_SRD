<?php

namespace App\Services;

use App\Models\User;
use App\Models\AuditLog;
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

        // Log the login action
        AuditLog::log('login', 'User', $user->id, null, "{$user->name} ({$user->role}) logged in");

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
                'profile_image_path' => $user->profile_image_path,
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
        AuditLog::log('logout', 'User', $user->id, null, "{$user->name} ({$user->role}) logged out");
        $user->currentAccessToken()->delete();
    }

    /**
     * Generate password from date of birth
     *
     * @param string $dateOfBirth Format: YYYY-MM-DD
     * @return string
     */
    public static function generatePasswordFromBirthday(string $dateOfBirth): string
    {
        // Remove hyphens to get YYYYMMDD format
        return str_replace('-', '', $dateOfBirth);
    }

    /**
     * Validate birthday-based password for non-admin roles
     *
     * @param User $user
     * @param string $password
     * @return bool
     */
    public static function validateBirthdayPassword(User $user, string $password): bool
    {
        if (!$user->date_of_birth) {
            return false;
        }

        $expectedPassword = self::generatePasswordFromBirthday($user->date_of_birth->format('Y-m-d'));
        return $password === $expectedPassword;
    }

    /**
     * Update user profile image
     *
     * @param User $user
     * @param string $imagePath
     * @return User
     */
    public function updateProfileImage(User $user, string $imagePath): User
    {
        $oldPath = $user->profile_image_path;
        $user->update(['profile_image_path' => $imagePath]);
        
        AuditLog::log('update', 'User', $user->id, 
            ['profile_image_path' => ['from' => $oldPath, 'to' => $imagePath]], 
            "Profile image updated");
        
        return $user;
    }
}

