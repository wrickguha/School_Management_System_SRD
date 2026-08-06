<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissionsByModule = [
            'Dashboard' => [
                'dashboard.view' => 'View Dashboard',
                'dashboard.analytics' => 'View Analytics',
                'dashboard.reports' => 'View Reports Overview',
            ],
            'Student Management' => [
                'student.view' => 'View Students',
                'student.create' => 'Add Student',
                'student.edit' => 'Edit Student',
                'student.delete' => 'Delete Student',
                'student.import' => 'Import Students',
                'student.export' => 'Export Students',
                'student.promote' => 'Promote Student',
                'student.transfer' => 'Transfer Student',
            ],
            'Teacher Management' => [
                'teacher.view' => 'View Teachers',
                'teacher.create' => 'Add Teacher',
                'teacher.edit' => 'Edit Teacher',
                'teacher.delete' => 'Delete Teacher',
            ],
            'Parent Management' => [
                'parent.view' => 'View Parents',
                'parent.create' => 'Add Parent',
                'parent.edit' => 'Edit Parent',
                'parent.delete' => 'Delete Parent',
            ],
            'Attendance' => [
                'attendance.view' => 'View Attendance',
                'attendance.mark' => 'Mark Attendance',
                'attendance.edit' => 'Edit Attendance',
                'attendance.delete' => 'Delete Attendance',
                'attendance.export' => 'Export Attendance',
            ],
            'Fees & Finance' => [
                'fee.view' => 'View Fees',
                'fee.create' => 'Add Fees',
                'fee.edit' => 'Edit Fees',
                'fee.delete' => 'Delete Fees',
                'fee.approve' => 'Approve Payment',
                'fee.refund' => 'Refund Payment',
            ],
            'Examination' => [
                'exam.view' => 'View Exams',
                'exam.create' => 'Create Exam',
                'exam.edit' => 'Edit Exam',
                'exam.delete' => 'Delete Exam',
                'exam.publish' => 'Publish Results',
            ],
            'Certificates' => [
                'certificate.view' => 'View Certificates',
                'certificate.create' => 'Generate Certificate',
                'certificate.edit' => 'Edit Certificate',
                'certificate.delete' => 'Delete Certificate',
            ],
            'Homework' => [
                'homework.view' => 'View Homework',
                'homework.create' => 'Create Homework',
                'homework.edit' => 'Edit Homework',
                'homework.delete' => 'Delete Homework',
            ],
            'Library' => [
                'library.view' => 'View Books',
                'library.create' => 'Add Book',
                'library.edit' => 'Edit Book',
                'library.delete' => 'Delete Book',
                'library.issue' => 'Issue Book',
                'library.return' => 'Return Book',
            ],
            'Hostel' => [
                'hostel.view' => 'View Hostel',
                'hostel.create' => 'Add Room',
                'hostel.allocate' => 'Allocate Room',
                'hostel.remove' => 'Remove Room Allocation',
            ],
            'Transport' => [
                'transport.view' => 'View Vehicles',
                'transport.create' => 'Add Vehicle',
                'transport.edit' => 'Edit Vehicle',
                'transport.delete' => 'Delete Vehicle',
                'transport.assign_route' => 'Assign Route',
            ],
            'HR & Payroll' => [
                'payroll.view' => 'View Payroll',
                'payroll.create' => 'Generate Payslip',
                'payroll.edit' => 'Edit Payroll',
                'payroll.delete' => 'Delete Payroll',
            ],
            'Communication' => [
                'communication.view' => 'View Messages',
                'communication.create' => 'Send Message / Announcement',
                'communication.delete' => 'Delete Message',
            ],
            'Users Management' => [
                'user.view' => 'View Users',
                'user.create' => 'Create User',
                'user.edit' => 'Edit User',
                'user.delete' => 'Delete User',
                'user.reset_password' => 'Reset Password',
            ],
            'Roles & Permissions' => [
                'role.view' => 'View Roles',
                'role.create' => 'Create Role',
                'role.edit' => 'Edit Role',
                'role.delete' => 'Delete Role',
                'role.assign_permissions' => 'Assign Permissions',
            ],
            'Settings' => [
                'settings.view' => 'View Settings',
                'settings.update' => 'Update Settings',
                'settings.manage_school' => 'Manage School Information',
            ],
            'Work Allocation' => [
                'work.view' => 'View Work Assignments',
                'work.create' => 'Assign Work',
                'work.edit' => 'Edit Work Assignment',
                'work.delete' => 'Delete Work Assignment',
            ],
            'Receptionist Desk' => [
                'visitor.view' => 'View Visitor Log',
                'visitor.create' => 'Register Visitor',
                'enquiry.view' => 'View Admission Enquiries',
                'enquiry.create' => 'Create Admission Enquiry',
                'appointment.view' => 'View Appointments',
                'appointment.create' => 'Schedule Appointment',
                'complaint.view' => 'View Complaints',
                'complaint.create' => 'Register Complaint',
            ],
        ];

        // Create or update permissions in database
        foreach ($permissionsByModule as $moduleName => $permissions) {
            foreach ($permissions as $slug => $displayName) {
                Permission::firstOrCreate(
                    ['name' => $slug, 'guard_name' => 'web']
                );
            }
        }

        // Roles Definition with Default Permission Slugs
        $rolesConfig = [
            'Super Admin' => [
                'description' => 'Unrestricted master owner with complete platform administration authority',
                'is_system' => true,
                'permissions' => 'ALL',
            ],
            'School Admin' => [
                'description' => 'School level administrative manager',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view', 'dashboard.analytics', 'dashboard.reports',
                    'student.view', 'student.create', 'student.edit', 'student.delete', 'student.import', 'student.export', 'student.promote',
                    'teacher.view', 'teacher.create', 'teacher.edit', 'teacher.delete',
                    'parent.view', 'parent.create', 'parent.edit', 'parent.delete',
                    'attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.export',
                    'fee.view', 'fee.create', 'fee.edit', 'fee.approve',
                    'exam.view', 'exam.create', 'exam.edit', 'exam.publish',
                    'certificate.view', 'certificate.create', 'certificate.edit',
                    'homework.view', 'homework.create',
                    'library.view', 'library.create', 'library.issue',
                    'hostel.view', 'hostel.create', 'hostel.allocate',
                    'transport.view', 'transport.create', 'transport.assign_route',
                    'payroll.view', 'payroll.create',
                    'communication.view', 'communication.create',
                    'user.view', 'user.create', 'user.edit', 'user.reset_password',
                    'role.view',
                    'settings.view', 'settings.update', 'settings.manage_school',
                    'work.view', 'work.create', 'work.edit', 'work.delete',
                    'visitor.view', 'visitor.create', 'enquiry.view', 'enquiry.create', 'appointment.view', 'appointment.create', 'complaint.view', 'complaint.create',
                ],
            ],
            'Principal' => [
                'description' => 'Academic executive and institutional director',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view', 'dashboard.analytics', 'dashboard.reports',
                    'student.view', 'student.create', 'student.edit', 'student.export', 'student.promote',
                    'teacher.view', 'teacher.create', 'teacher.edit',
                    'parent.view', 'parent.create',
                    'attendance.view', 'attendance.mark', 'attendance.export',
                    'fee.view', 'fee.approve',
                    'exam.view', 'exam.create', 'exam.edit', 'exam.publish',
                    'certificate.view', 'certificate.create',
                    'homework.view', 'homework.create',
                    'library.view', 'library.issue',
                    'hostel.view', 'hostel.allocate',
                    'transport.view',
                    'payroll.view',
                    'communication.view', 'communication.create',
                    'user.view',
                    'settings.view',
                    'work.view', 'work.create', 'work.edit',
                    'visitor.view', 'enquiry.view', 'appointment.view', 'complaint.view',
                ],
            ],
            'Teacher' => [
                'description' => 'Faculty member managing academics, classes, homework, exams, and attendance',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'student.view',
                    'attendance.view', 'attendance.mark', 'attendance.edit',
                    'exam.view', 'exam.create', 'exam.edit',
                    'homework.view', 'homework.create', 'homework.edit',
                    'certificate.view', 'certificate.create',
                    'library.view',
                    'communication.view', 'communication.create',
                    'work.view',
                ],
            ],
            'Accountant' => [
                'description' => 'Finance desk handling student fees, invoices, payments, and payroll',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view', 'dashboard.reports',
                    'student.view',
                    'fee.view', 'fee.create', 'fee.edit', 'fee.delete', 'fee.approve', 'fee.refund',
                    'payroll.view', 'payroll.create', 'payroll.edit',
                    'communication.view',
                    'work.view',
                ],
            ],
            'HR' => [
                'description' => 'Human Resources managing staff recruitment, teachers, payroll, and team onboarding',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view', 'dashboard.reports',
                    'teacher.view', 'teacher.create', 'teacher.edit', 'teacher.delete',
                    'payroll.view', 'payroll.create', 'payroll.edit', 'payroll.delete',
                    'user.view', 'user.create', 'user.edit', 'user.reset_password',
                    'role.view',
                    'communication.view', 'communication.create',
                    'work.view', 'work.create',
                ],
            ],
            'Receptionist' => [
                'description' => 'Front office desk managing visitors, enquiries, appointments, gate passes, and complaints',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'student.view', 'student.create', 'student.edit',
                    'parent.view', 'parent.create',
                    'visitor.view', 'visitor.create',
                    'enquiry.view', 'enquiry.create',
                    'appointment.view', 'appointment.create',
                    'complaint.view', 'complaint.create',
                    'communication.view', 'communication.create',
                    'work.view',
                ],
            ],
            'Librarian' => [
                'description' => 'Library catalog manager handling book issuing, returns, and inventory',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'student.view',
                    'library.view', 'library.create', 'library.edit', 'library.delete', 'library.issue', 'library.return',
                    'communication.view',
                    'work.view',
                ],
            ],
            'Transport Manager' => [
                'description' => 'Fleet manager overseeing vehicles, drivers, routes, and student transport',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'student.view',
                    'transport.view', 'transport.create', 'transport.edit', 'transport.delete', 'transport.assign_route',
                    'communication.view',
                    'work.view',
                ],
            ],
            'Hostel Warden' => [
                'description' => 'Resident hostel housing and room allocation manager',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'student.view',
                    'hostel.view', 'hostel.create', 'hostel.allocate', 'hostel.remove',
                    'communication.view',
                    'work.view',
                ],
            ],
            'Student' => [
                'description' => 'Enrolled student accessing attendance, report cards, homework, library, and fees',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'attendance.view',
                    'exam.view',
                    'homework.view',
                    'fee.view',
                    'certificate.view',
                    'library.view',
                    'communication.view',
                ],
            ],
            'Parent' => [
                'description' => 'Parent/Guardian viewing child performance, attendance, fee dues, and notices',
                'is_system' => true,
                'permissions' => [
                    'dashboard.view',
                    'attendance.view',
                    'exam.view',
                    'homework.view',
                    'fee.view',
                    'certificate.view',
                    'communication.view',
                ],
            ],
        ];

        $allPermissionObjects = Permission::all();

        foreach ($rolesConfig as $roleName => $config) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
                [
                    'description' => $config['description'],
                    'status' => 'active',
                    'is_system' => $config['is_system'],
                ]
            );

            // Ensure status/description are saved if existed
            $role->update([
                'description' => $config['description'],
                'status' => 'active',
                'is_system' => $config['is_system'],
            ]);

            if ($config['permissions'] === 'ALL') {
                $role->syncPermissions($allPermissionObjects);
            } else {
                $role->syncPermissions($config['permissions']);
            }
        }

        // Sync existing user roles with Spatie models if needed
        $users = User::all();
        foreach ($users as $user) {
            if ($user->role) {
                // Map user.role string (e.g., 'super_admin' or 'Super Admin') to Role model
                $matchingRoleName = null;
                $formattedRole = strtolower(str_replace(['_', '-'], ' ', $user->role));
                
                foreach (array_keys($rolesConfig) as $rName) {
                    if (strtolower($rName) === $formattedRole) {
                        $matchingRoleName = $rName;
                        break;
                    }
                }

                if ($matchingRoleName) {
                    $user->syncRoles([$matchingRoleName]);
                }
            }
        }
    }
}
