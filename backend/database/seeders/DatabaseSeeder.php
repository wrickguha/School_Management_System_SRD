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
            'faculty',
            'accountant',
            'office_staff',
            'receptionist',
            'librarian',
            'lab_assistant',
            'transport_manager',
            'driver',
            'security_guard',
            'cleaner',
            'hostel_warden',
            'nurse',
            'counselor',
            'other',
            'student',
            'parent',
            'staff',
            'hr'
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
        // 3. Seed Sample Work Assignments for Super Admin & School Admin Testing
        $adminUser = User::where('email', 'admin@subhraedu.com')->first();
        if ($adminUser) {
            \App\Models\WorkAssignment::firstOrCreate(
                ['title' => 'Quarterly Financial Audit & Fee Reconciliation'],
                [
                    'school_id' => 1,
                    'created_by' => $adminUser->id,
                    'assigned_role' => 'accountant',
                    'description' => 'Review all pending fee collection receipts and perform reconciliation with bank statements.',
                    'category' => 'finance',
                    'priority' => 'high',
                    'due_date' => now()->addDays(7),
                    'status' => 'pending',
                    'remarks' => 'High priority for Q3 audit compliance.'
                ]
            );

            \App\Models\WorkAssignment::firstOrCreate(
                ['title' => 'Grade 10 Mid-Term Examination Blueprint Preparation'],
                [
                    'school_id' => 1,
                    'created_by' => $adminUser->id,
                    'assigned_role' => 'teacher',
                    'description' => 'Draft the exam syllabus blueprint and submit question papers for Physics, Chemistry, and Mathematics.',
                    'category' => 'academic',
                    'priority' => 'urgent',
                    'due_date' => now()->addDays(3),
                    'status' => 'in_progress',
                    'remarks' => 'Ensure compliance with board pattern.'
                ]
            );

            \App\Models\WorkAssignment::firstOrCreate(
                ['title' => 'Faculty Performance Appraisal & Staff Attendance Review'],
                [
                    'school_id' => 1,
                    'created_by' => $adminUser->id,
                    'assigned_role' => 'hr',
                    'description' => 'Compile annual appraisal feedback forms and calculate monthly attendance percentages for teaching staff.',
                    'category' => 'hr',
                    'priority' => 'medium',
                    'due_date' => now()->addDays(12),
                    'status' => 'pending',
                ]
            );

            \App\Models\WorkAssignment::firstOrCreate(
                ['title' => 'Library Catalog Digitization & Book Stock Audit'],
                [
                    'school_id' => 1,
                    'created_by' => $adminUser->id,
                    'assigned_role' => 'librarian',
                    'description' => 'Scan new accession registers into ERP database and report missing volume titles.',
                    'category' => 'administrative',
                    'priority' => 'low',
                    'due_date' => now()->addDays(15),
                    'status' => 'completed',
                    'completion_notes' => 'Catalog digitized. Stock audit completed for 4,200 volumes.'
                ]
            );

            \App\Models\WorkAssignment::firstOrCreate(
                ['title' => 'School Bus Fleet Safety Inspection & GPS Tracker Maintenance'],
                [
                    'school_id' => 1,
                    'created_by' => $adminUser->id,
                    'assigned_role' => 'transport_manager',
                    'description' => 'Inspect brake condition, speed governors, and GPS tracking hardware across all 12 operational routes.',
                    'category' => 'facilities',
                    'priority' => 'high',
                    'due_date' => now()->addDays(5),
                    'status' => 'submitted',
                    'completion_notes' => 'All buses inspected. Route 4 GPS antenna replaced.'
                ]
            );
        }
    }
}
