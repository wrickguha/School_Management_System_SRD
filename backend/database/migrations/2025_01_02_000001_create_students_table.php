<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('admission_no', 50)->unique();
            $table->string('roll_no', 20)->nullable();
            $table->string('name');
            $table->string('grade', 50);
            $table->string('section', 10);
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->date('dob')->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->text('address')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Graduated', 'Suspended'])->default('Active');
            $table->date('admission_date')->nullable();
            $table->decimal('total_fees', 12, 2)->default(0);
            $table->decimal('pending_fees', 12, 2)->default(0);
            $table->decimal('attendance_rate', 5, 2)->default(0);
            $table->decimal('academic_performance', 5, 2)->default(0);
            $table->enum('fee_status', ['Paid', 'Partial', 'Pending'])->default('Pending');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['school_id', 'grade', 'section']);
            $table->index(['school_id', 'fee_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
