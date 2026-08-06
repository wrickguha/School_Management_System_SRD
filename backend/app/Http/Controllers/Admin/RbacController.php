<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\PermissionAuditLog;
use App\Http\Middleware\CheckPermissionMiddleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RbacController extends Controller
{
    /**
     * List all roles with permission count, active status, user count.
     */
    public function indexRoles()
    {
        $roles = Role::with(['permissions'])->get()->map(function ($role) {
            $userCount = DB::table('model_has_roles')
                ->where('role_id', $role->id)
                ->count();

            return [
                'id'                => $role->id,
                'name'              => $role->name,
                'description'       => $role->description ?? '',
                'status'            => $role->status ?? 'active',
                'is_system'         => (bool) ($role->is_system ?? false),
                'created_by'        => $role->created_by,
                'created_at'        => $role->created_at ? $role->created_at->toISOString() : null,
                'updated_at'        => $role->updated_at ? $role->updated_at->toISOString() : null,
                'users_count'       => $userCount,
                'permissions_count' => $role->permissions->count(),
                'permissions'       => $role->permissions->pluck('name')->toArray(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $roles,
        ]);
    }

    /**
     * Create a new custom role.
     */
    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:roles,name',
            'description' => 'nullable|string|max:255',
            'status'      => 'nullable|in:active,inactive',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create([
                'name'        => $validated['name'],
                'guard_name'  => 'web',
                'description' => $validated['description'] ?? null,
                'status'      => $validated['status'] ?? 'active',
                'is_system'   => false,
                'created_by'  => Auth::id(),
            ]);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            // Log Audit Entry
            PermissionAuditLog::create([
                'user_id'     => Auth::id(),
                'user_name'   => Auth::user()?->name ?? 'Super Admin',
                'action'      => 'role_created',
                'target_type' => 'Role',
                'target_name' => $role->name,
                'new_values'  => [
                    'name'        => $role->name,
                    'description' => $role->description,
                    'permissions' => $validated['permissions'] ?? [],
                ],
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => "Role '{$role->name}' created successfully.",
                'data'    => $role->load('permissions'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create role: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Show single role details.
     */
    public function showRole($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'                => $role->id,
                'name'              => $role->name,
                'description'       => $role->description,
                'status'            => $role->status ?? 'active',
                'is_system'         => (bool) ($role->is_system ?? false),
                'permissions'       => $role->permissions->pluck('name')->toArray(),
            ]
        ]);
    }

    /**
     * Update an existing role.
     */
    public function updateRole(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // Protect Super Admin role from name modification or deletion
        if ($role->name === 'Super Admin' && $request->has('name') && $request->input('name') !== 'Super Admin') {
            return response()->json(['message' => 'The Super Admin role name cannot be modified.'], 422);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:255',
            'status'      => 'nullable|in:active,inactive',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $oldValues = [
            'name'        => $role->name,
            'description' => $role->description,
            'status'      => $role->status,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ];

        DB::beginTransaction();
        try {
            $role->update([
                'name'        => $validated['name'],
                'description' => $validated['description'] ?? $role->description,
                'status'      => $validated['status'] ?? $role->status,
            ]);

            if (isset($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            CheckPermissionMiddleware::clearRoleCache($role->name);

            // Audit Log
            PermissionAuditLog::create([
                'user_id'     => Auth::id(),
                'user_name'   => Auth::user()?->name ?? 'Super Admin',
                'action'      => 'role_updated',
                'target_type' => 'Role',
                'target_name' => $role->name,
                'old_values'  => $oldValues,
                'new_values'  => [
                    'name'        => $role->name,
                    'description' => $role->description,
                    'status'      => $role->status,
                    'permissions' => $validated['permissions'] ?? $oldValues['permissions'],
                ],
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => "Role '{$role->name}' updated successfully.",
                'data'    => $role->load('permissions'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update role: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a custom role.
     */
    public function destroyRole(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'Super Admin' || $role->is_system) {
            return response()->json(['message' => 'System roles and Super Admin cannot be deleted.'], 422);
        }

        $roleName = $role->name;

        // Audit Log
        PermissionAuditLog::create([
            'user_id'     => Auth::id(),
            'user_name'   => Auth::user()?->name ?? 'Super Admin',
            'action'      => 'role_deleted',
            'target_type' => 'Role',
            'target_name' => $roleName,
            'old_values'  => ['name' => $roleName],
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);

        $role->delete();
        CheckPermissionMiddleware::clearRoleCache($roleName);

        return response()->json([
            'status'  => 'success',
            'message' => "Role '{$roleName}' deleted successfully."
        ]);
    }

    /**
     * Clone an existing role with all its permissions.
     */
    public function cloneRole(Request $request, $id)
    {
        $sourceRole = Role::with('permissions')->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:roles,name',
            'description' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $newRole = Role::create([
                'name'        => $validated['name'],
                'guard_name'  => 'web',
                'description' => $validated['description'] ?? ("Copy of " . $sourceRole->name),
                'status'      => 'active',
                'is_system'   => false,
                'created_by'  => Auth::id(),
            ]);

            $permissions = $sourceRole->permissions->pluck('name')->toArray();
            $newRole->syncPermissions($permissions);

            // Audit Log
            PermissionAuditLog::create([
                'user_id'     => Auth::id(),
                'user_name'   => Auth::user()?->name ?? 'Super Admin',
                'action'      => 'role_cloned',
                'target_type' => 'Role',
                'target_name' => $newRole->name,
                'old_values'  => ['source_role' => $sourceRole->name],
                'new_values'  => [
                    'name'        => $newRole->name,
                    'permissions' => $permissions,
                ],
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => "Role cloned successfully as '{$newRole->name}'.",
                'data'    => $newRole->load('permissions'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to clone role: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Sync permissions to a specific role.
     */
    public function syncRolePermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $oldPermissions = $role->permissions->pluck('name')->toArray();
        $newPermissions = $validated['permissions'];

        $added = array_values(array_diff($newPermissions, $oldPermissions));
        $removed = array_values(array_diff($oldPermissions, $newPermissions));

        $role->syncPermissions($newPermissions);
        CheckPermissionMiddleware::clearRoleCache($role->name);

        // Audit Log
        PermissionAuditLog::create([
            'user_id'     => Auth::id(),
            'user_name'   => Auth::user()?->name ?? 'Super Admin',
            'action'      => 'role_permissions_updated',
            'target_type' => 'Role',
            'target_name' => $role->name,
            'old_values'  => ['permissions' => $oldPermissions],
            'new_values'  => [
                'permissions' => $newPermissions,
                'added'       => $added,
                'removed'     => $removed,
            ],
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => "Permissions for role '{$role->name}' updated successfully.",
            'data'    => [
                'role'        => $role->name,
                'permissions' => $role->permissions()->pluck('name'),
                'added_count'   => count($added),
                'removed_count' => count($removed),
            ]
        ]);
    }

    /**
     * List all permissions grouped by module/category.
     */
    public function indexPermissions()
    {
        $allPermissions = Permission::orderBy('name')->get();

        $modulesMap = [
            'student'      => 'Student Management',
            'teacher'      => 'Teacher Management',
            'parent'       => 'Parent Management',
            'attendance'   => 'Attendance & Leave',
            'fee'          => 'Fees & Finance',
            'exam'         => 'Examination & Results',
            'certificate'  => 'Certificates & Documents',
            'homework'     => 'Homework & Academics',
            'library'      => 'Library Management',
            'hostel'       => 'Hostel & Housing',
            'transport'    => 'Transport & Fleet',
            'payroll'      => 'HR & Payroll',
            'communication'=> 'Communication & Messages',
            'user'         => 'User Account Management',
            'role'         => 'Roles & Permissions',
            'settings'     => 'System Settings',
            'work'         => 'Work Allocation Master',
            'visitor'      => 'Reception Visitor Desk',
            'enquiry'      => 'Admission Enquiries',
            'appointment'  => 'Executive Appointments',
            'complaint'    => 'Parent Complaints Desk',
            'dashboard'    => 'Dashboard & Reports',
        ];

        $grouped = [];
        foreach ($allPermissions as $perm) {
            $prefix = explode('.', $perm->name)[0];
            $moduleName = $modulesMap[$prefix] ?? ucfirst($prefix) . ' Module';

            if (!isset($grouped[$moduleName])) {
                $grouped[$moduleName] = [];
            }

            $grouped[$moduleName][] = [
                'id'          => $perm->id,
                'name'        => $perm->name,
                'slug'        => $perm->name,
                'description' => ucwords(str_replace(['.', '_'], ' ', $perm->name)),
            ];
        }

        return response()->json([
            'status' => 'success',
            'data'   => $grouped,
            'total'  => $allPermissions->count(),
        ]);
    }

    /**
     * List users with their assigned role and individual permission overrides.
     */
    public function indexUsers(Request $request)
    {
        $query = User::with(['roles', 'permissions']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20)->through(function ($user) {
            return [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'role'              => $user->role,
                'roles'             => $user->roles->pluck('name')->toArray(),
                'direct_permissions'=> $user->permissions->pluck('name')->toArray(),
                'all_permissions'   => array_unique(array_merge(
                    $user->permissions->pluck('name')->toArray(),
                    $user->getPermissionsViaRoles()->pluck('name')->toArray()
                )),
                'school_id'         => $user->school_id,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $users,
        ]);
    }

    /**
     * Grant/Deny direct individual permission overrides for a specific user.
     */
    public function updateUserPermissions(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'role'              => 'nullable|string',
            'direct_permissions'=> 'present|array',
            'direct_permissions.*' => 'string|exists:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            if (!empty($validated['role'])) {
                $user->role = $validated['role'];
                $user->save();
                $user->syncRoles([$validated['role']]);
            }

            // Sync direct model-level permissions (individual user override)
            $user->syncPermissions($validated['direct_permissions']);

            CheckPermissionMiddleware::clearUserCache($user->id);

            // Audit log
            PermissionAuditLog::create([
                'user_id'     => Auth::id(),
                'user_name'   => Auth::user()?->name ?? 'Super Admin',
                'action'      => 'user_permissions_overridden',
                'target_type' => 'User',
                'target_name' => "{$user->name} ({$user->email})",
                'new_values'  => [
                    'role'               => $user->role,
                    'direct_permissions' => $validated['direct_permissions'],
                ],
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => "Permissions for user '{$user->name}' updated successfully.",
                'data'    => [
                    'id'                => $user->id,
                    'name'              => $user->name,
                    'role'              => $user->role,
                    'direct_permissions'=> $user->permissions->pluck('name')->toArray(),
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update user permissions: ' . $e->getMessage()], 500);
        }
    }

    /**
     * View Audit Logs.
     */
    public function auditLogs(Request $request)
    {
        $logs = PermissionAuditLog::latest()->paginate(50);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }
}
