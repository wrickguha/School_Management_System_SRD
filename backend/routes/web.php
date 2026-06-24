<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/deploy-utility', function (\Illuminate\Http\Request $request) {
    $expectedSecret = env('DEPLOY_SECRET');
    
    // Safety check: require a non-empty secret key configured in the .env file
    if (!$expectedSecret || strlen($expectedSecret) < 8) {
        return response()->json([
            'error' => 'Deploy utility is disabled. Set a DEPLOY_SECRET in .env (min 8 chars) to enable it.'
        ], 403);
    }

    if ($request->query('secret') !== $expectedSecret) {
        return response()->json(['error' => 'Unauthorized. Invalid secret.'], 403);
    }

    $action = $request->query('action');
    if (!$action) {
        return response()->json([
            'message' => 'Deploy utility is active.',
            'available_actions' => ['migrate', 'migrate-fresh', 'db-seed', 'seed-admin', 'clear-data', 'storage-link', 'clear-cache', 'optimize']
        ]);
    }

    try {
        switch ($action) {
            case 'migrate':
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Migrations run successfully.', 'output' => $output]);
            
            case 'migrate-fresh':
                \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Fresh migrations run successfully.', 'output' => $output]);

            case 'db-seed':
                \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Database seeding run successfully.', 'output' => $output]);

            case 'seed-admin':
                // Ensure spatie role exists
                \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
                
                $admin = \App\Models\User::updateOrCreate(
                    ['email' => 'admin@subhraedu.com'],
                    [
                        'name' => 'Super Admin',
                        'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                        'role' => 'super_admin',
                        'status' => 'active',
                    ]
                );
                $admin->assignRole('super_admin');
                return response()->json(['message' => 'Super admin account (admin@subhraedu.com) seeded/updated successfully.']);

            case 'clear-data':
                \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
                
                $tablesToTruncate = [
                    'payroll_records',
                    'hostel_rooms',
                    'library_issuances',
                    'library_books',
                    'transport_buses',
                    'homework_tasks',
                    'activity_logs',
                    'announcements',
                    'fee_transactions',
                    'fee_structures',
                    'exam_results',
                    'exams',
                    'attendances',
                    'teacher_classes',
                    'teachers',
                    'student_documents',
                    'student_parents',
                    'parents',
                    'students',
                    'demo_requests',
                    'testimonials',
                    'admission_enquiries',
                    'school_settings',
                    'schools',
                ];

                foreach ($tablesToTruncate as $table) {
                    if (\Illuminate\Support\Facades\Schema::hasTable($table)) {
                        \Illuminate\Support\Facades\DB::table($table)->truncate();
                    }
                }

                if (\Illuminate\Support\Facades\Schema::hasTable('users')) {
                    \Illuminate\Support\Facades\DB::table('users')
                        ->where('email', '!=', 'admin@subhraedu.com')
                        ->delete();
                }

                \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
                return response()->json(['message' => 'All database tables cleared successfully. Only Super Admin has been preserved.']);

            case 'storage-link':
                \Illuminate\Support\Facades\Artisan::call('storage:link');
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Storage link created successfully.', 'output' => $output]);

            case 'clear-cache':
                \Illuminate\Support\Facades\Artisan::call('config:clear');
                \Illuminate\Support\Facades\Artisan::call('route:clear');
                \Illuminate\Support\Facades\Artisan::call('view:clear');
                \Illuminate\Support\Facades\Artisan::call('cache:clear');
                return response()->json(['message' => 'All caches cleared successfully.']);

            case 'optimize':
                \Illuminate\Support\Facades\Artisan::call('optimize');
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Optimizations run successfully.', 'output' => $output]);

            default:
                return response()->json(['error' => 'Unknown action: ' . $action], 400);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Command failed: ' . $e->getMessage()], 500);
    }
});

// React SPA fallback routing
Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    return view('welcome');
});


