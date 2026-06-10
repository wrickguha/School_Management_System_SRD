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
            'available_actions' => ['unzip', 'migrate', 'db-seed', 'storage-link', 'clear-cache', 'optimize']
        ]);
    }

    try {
        switch ($action) {
            case 'unzip':
                $zipFile = base_path('release.zip');
                if (!file_exists($zipFile)) {
                    return response()->json(['error' => 'release.zip not found in backend root.'], 404);
                }
                $zip = new \ZipArchive;
                if ($zip->open($zipFile) === TRUE) {
                    $zip->extractTo(base_path());
                    $zip->close();
                    unlink($zipFile); // Free up space immediately
                    return response()->json(['message' => 'release.zip extracted successfully.']);
                } else {
                    return response()->json(['error' => 'Failed to open release.zip.'], 500);
                }

            case 'migrate':
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Migrations run successfully.', 'output' => $output]);
            
            case 'db-seed':
                \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json(['message' => 'Database seeding run successfully.', 'output' => $output]);

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


