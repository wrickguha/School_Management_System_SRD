<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Add fields to track who recorded attendance and for which class
            if (!Schema::hasColumn('attendances', 'class_id')) {
                $table->unsignedBigInteger('class_id')->nullable()->after('section');
            }
            if (!Schema::hasColumn('attendances', 'subject_id')) {
                $table->unsignedBigInteger('subject_id')->nullable()->after('class_id');
            }
            if (!Schema::hasColumn('attendances', 'teacher_id')) {
                $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete()->after('recorded_by');
            }
            if (!Schema::hasColumn('attendances', 'attendance_type')) {
                $table->enum('attendance_type', ['class', 'routine'])->default('class')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'class_id')) {
                $table->dropColumn('class_id');
            }
            if (Schema::hasColumn('attendances', 'subject_id')) {
                $table->dropColumn('subject_id');
            }
            if (Schema::hasColumn('attendances', 'teacher_id')) {
                $table->dropForeignKey(['teacher_id']);
                $table->dropColumn('teacher_id');
            }
            if (Schema::hasColumn('attendances', 'attendance_type')) {
                $table->dropColumn('attendance_type');
            }
        });
    }
};
