<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('course_code', 50)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('course_type', ['UG', 'PG', 'Diploma', 'Certificate', 'Other'])->default('UG'); // UG = Undergraduate, PG = Postgraduate
            $table->integer('duration_months')->nullable(); // e.g., 36, 48
            $table->integer('total_semesters')->nullable(); // e.g., 6, 8
            $table->string('semester_pattern')->nullable(); // e.g., "6 months per semester"
            $table->integer('credits')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'ARCHIVED'])->default('ACTIVE');
            $table->text('eligibility_criteria')->nullable();
            $table->decimal('fees', 12, 2)->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            // Indexes
            $table->index('school_id');
            $table->index('status');
            $table->index('course_type');
            $table->unique(['school_id', 'course_code', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
