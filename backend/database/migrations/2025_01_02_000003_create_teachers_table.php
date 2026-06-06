<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('employee_id', 50)->nullable();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('department', 100)->nullable();
            $table->string('designation', 100)->nullable();
            $table->string('salary_grade', 100)->nullable();
            $table->decimal('attendance_rate', 5, 2)->default(0);
            $table->enum('status', ['Active', 'On Leave', 'Inactive'])->default('Active');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['school_id', 'department']);
        });

        Schema::create('teacher_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->string('grade', 50)->nullable();
            $table->string('section', 10)->nullable();
            $table->string('subject', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_classes');
        Schema::dropIfExists('teachers');
    }
};
