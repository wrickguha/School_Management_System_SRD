<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Exam\ExamController;
use App\Http\Controllers\Finance\FeeTransactionController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Communication\AnnouncementController;
use App\Http\Controllers\HR\TeacherController;
use App\Http\Controllers\Settings\SchoolSettingsController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\ParentController;
use App\Http\Controllers\HomeworkController;
use App\Http\Controllers\TransportController;
use App\Http\Controllers\HostelController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\Admin\DemoRequestController;
use Illuminate\Support\Facades\Route;

// ── Public Routes ───────────────────────────────────────────────────────────
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/demo/request', [DemoRequestController::class, 'store']);

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => 'SubhraEdu API']);
});

// ── Protected Routes (Sanctum) ────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Profile
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard & Logs
    Route::get('/activities', [DashboardController::class, 'indexActivities'])
        ->middleware('role:school_admin,principal');
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('role:school_admin,principal,accountant,hr');
    Route::get('/dashboard/super-stats', [DashboardController::class, 'superStats'])
        ->middleware('role:super_admin');

    // Students
    Route::apiResource('students', StudentController::class)->only(['index'])
        ->middleware('role:school_admin,principal,teacher,faculty,accountant,hr');
    Route::apiResource('students', StudentController::class)->except(['index'])
        ->middleware('role:school_admin,principal');

    // Teachers
    Route::get('/teachers', [TeacherController::class, 'index'])
        ->middleware('role:school_admin,principal,hr');
    Route::post('/teachers', [TeacherController::class, 'store'])
        ->middleware('role:school_admin,principal,hr');

    // Parents
    Route::apiResource('parents', ParentController::class)
        ->middleware('role:school_admin,principal');

    // Homework
    Route::apiResource('homework', HomeworkController::class)
        ->middleware('role:school_admin,principal,teacher,faculty,student,parent');

    // Transport
    Route::apiResource('transport', TransportController::class)
        ->middleware('role:school_admin,principal,teacher,student,parent');

    // Hostel
    Route::apiResource('hostel', HostelController::class)
        ->middleware('role:school_admin,principal,student');

    // Library
    Route::get('/library/books', [LibraryController::class, 'indexBooks'])
        ->middleware('role:school_admin,principal,librarian,student,parent,teacher');
    Route::post('/library/books', [LibraryController::class, 'storeBook'])
        ->middleware('role:school_admin,principal,librarian');
    Route::get('/library/issuances', [LibraryController::class, 'indexIssuances'])
        ->middleware('role:school_admin,principal,librarian');
    Route::post('/library/issuances', [LibraryController::class, 'issueBook'])
        ->middleware('role:school_admin,principal,librarian');

    // Payroll
    Route::apiResource('payroll', PayrollController::class)
        ->middleware('role:school_admin,principal,hr');

    // Attendance
    Route::post('/attendance/bulk', [AttendanceController::class, 'submitBulk'])
        ->middleware('role:school_admin,principal,teacher,faculty');
    Route::get('/attendance/stats', [AttendanceController::class, 'getStats'])
        ->middleware('role:school_admin,principal,teacher,faculty');
    Route::get('/attendance/monthly-trend', [AttendanceController::class, 'getMonthlyTrend'])
        ->middleware('role:school_admin,principal,teacher,faculty');

    // Exams & Report Cards
    Route::apiResource('exams', ExamController::class)->only(['index', 'show'])
        ->middleware('role:school_admin,principal,teacher,faculty,student,parent');
    Route::apiResource('exams', ExamController::class)->except(['index', 'show'])
        ->middleware('role:school_admin,principal,teacher,faculty');
    Route::post('/exams/{exam}/results', [ExamController::class, 'submitMarks'])
        ->middleware('role:school_admin,principal,teacher,faculty');
    Route::get('/students/{student}/report-card', [ExamController::class, 'getReportCard'])
        ->middleware('role:school_admin,principal,teacher,faculty,student,parent');

    // Finance / Fees
    Route::get('/transactions', [FeeTransactionController::class, 'index'])
        ->middleware('role:school_admin,principal,accountant');
    Route::post('/transactions', [FeeTransactionController::class, 'store'])
        ->middleware('role:school_admin,principal,accountant');
    Route::get('/finance/defaulters', [FeeTransactionController::class, 'defaulters'])
        ->middleware('role:school_admin,principal,accountant');
    Route::post('/finance/reminders', [FeeTransactionController::class, 'sendReminder'])
        ->middleware('role:school_admin,principal,accountant');

    // Announcements
    Route::get('/announcements', [AnnouncementController::class, 'index']); // all auth users can read
    Route::post('/announcements', [AnnouncementController::class, 'store'])
        ->middleware('role:school_admin,principal,teacher,faculty');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])
        ->middleware('role:school_admin,principal,teacher,faculty');

    // Settings
    Route::get('/settings', [SchoolSettingsController::class, 'show'])
        ->middleware('role:school_admin,principal');
    Route::put('/settings', [SchoolSettingsController::class, 'update'])
        ->middleware('role:school_admin,principal');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])
        ->middleware('role:school_admin,principal,accountant,hr');
    Route::post('/reports/generate', [ReportController::class, 'store'])
        ->middleware('role:school_admin,principal,accountant,hr');

    // Demo Requests (Super Admin)
    Route::get('/admin/demo-requests', [DemoRequestController::class, 'index'])
        ->middleware('role:super_admin');
    Route::patch('/admin/demo-requests/{id}', [DemoRequestController::class, 'update'])
        ->middleware('role:super_admin');
});
