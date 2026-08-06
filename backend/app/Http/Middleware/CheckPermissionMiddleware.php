<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$permissions
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error'   => 'Unauthorized'
            ], 401);
        }

        // 1. Super Admin has unrestricted access to all endpoints
        if ($user->isSuperAdmin() || $user->hasRole('Super Admin')) {
            return $next($request);
        }

        // 2. Fetch or retrieve cached permissions for user
        $userPermissions = Cache::remember("user_permissions_{$user->id}", 3600, function () use ($user) {
            $directPermissions = $user->permissions->pluck('name')->toArray();
            $rolePermissions   = $user->getPermissionsViaRoles()->pluck('name')->toArray();

            return array_unique(array_merge($directPermissions, $rolePermissions));
        });

        // 3. Check if user possesses any of the required permissions
        $hasPermission = false;
        foreach ($permissions as $permission) {
            // Support pipe delimited OR checking: 'student.create|student.edit'
            $slugs = explode('|', $permission);
            foreach ($slugs as $slug) {
                if (in_array(trim($slug), $userPermissions)) {
                    $hasPermission = true;
                    break 2;
                }
            }
        }

        if (!$hasPermission) {
            return response()->json([
                'message' => 'Access Denied. You lack the required permission [' . implode(', ', $permissions) . '].',
                'required_permissions' => $permissions,
                'error'   => 'Forbidden'
            ], 403);
        }

        return $next($request);
    }

    /**
     * Clear cached permissions for a given user id.
     */
    public static function clearUserCache(int $userId): void
    {
        Cache::forget("user_permissions_{$userId}");
    }

    /**
     * Clear cached permissions for all users possessing a given role.
     */
    public static function clearRoleCache(string $roleName): void
    {
        Cache::flush(); // Flush permission caches across system
    }
}
