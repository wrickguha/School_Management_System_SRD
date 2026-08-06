<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class CleanupLegacyRoles extends Command
{
    protected $signature   = 'rbac:cleanup-legacy-roles {--force : Skip confirmation}';
    protected $description = 'Remove all old snake_case legacy Spatie roles and replace with properly named RBAC system roles.';

    // The authoritative list of properly named system roles to KEEP
    private array $keepRoles = [
        'Super Admin',
        'School Admin',
        'Principal',
        'Teacher',
        'Accountant',
        'HR',
        'Receptionist',
        'Librarian',
        'Transport Manager',
        'Hostel Warden',
        'Student',
        'Parent',
    ];

    public function handle(): int
    {
        if (!$this->option('force') && !$this->confirm('This will delete ALL legacy snake_case roles. Continue?')) {
            $this->info('Cancelled.');
            return 0;
        }

        $allRoles = Role::all();
        $legacyDeleted = 0;

        $this->info('Scanning roles...');

        foreach ($allRoles as $role) {
            // Skip if this is an authoritative properly named role
            if (in_array($role->name, $this->keepRoles)) {
                $this->line("  ✔ KEEP: {$role->name}");
                continue;
            }

            // Delete legacy role — detach from users first via DB
            DB::table('model_has_roles')->where('role_id', $role->id)->delete();
            DB::table('role_has_permissions')->where('role_id', $role->id)->delete();
            $role->delete();
            $legacyDeleted++;
            $this->line("  ✖ REMOVED legacy: {$role->name}");
        }

        $this->newLine();
        $this->info("Done. {$legacyDeleted} legacy role(s) removed.");
        $this->info('Now run: php artisan db:seed --class=RolePermissionSeeder --force');

        return 0;
    }
}
