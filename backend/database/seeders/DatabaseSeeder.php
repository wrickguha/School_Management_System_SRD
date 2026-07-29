<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed essential platform roles and Super Admin account.
     * All dummy schools, students, teachers, and transactional data have been removed.
     */
    public function run(): void
    {
        // 1. Create Roles in Spatie Permission
        $roles = [
            'platform_owner',
            'super_admin',
            'school_admin',
            'principal',
            'vice_principal',
            'dept_head',
            'teacher',
            'class_teacher',
            'student',
            'parent',
            'staff',
            'accountant',
            'hr',
            'librarian',
            'driver'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 2. Create Super Admin Account (Global Platform Administrator)
        $superAdminUser = User::updateOrCreate(
            ['email' => 'admin@subhraedu.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );
        $superAdminUser->assignRole('super_admin');
    }
}
