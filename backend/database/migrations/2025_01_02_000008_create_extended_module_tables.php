<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->unique()->constrained('schools')->cascadeOnDelete();
            $table->string('academic_year', 20)->default('2026-2027');
            $table->string('current_term', 20)->default('Term-I');
            $table->boolean('notify_absent')->default(true);
            $table->boolean('notify_fees')->default(true);
            $table->boolean('rfid_status')->default(true);
            $table->timestamps();
        });

        Schema::create('homework_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->string('title');
            $table->string('subject', 100)->nullable();
            $table->string('grade', 50)->nullable();
            $table->string('section', 10)->nullable();
            $table->text('instructions')->nullable();
            $table->date('deadline')->nullable();
            $table->enum('status', ['Active', 'Draft', 'Closed'])->default('Active');
            $table->timestamps();
        });

        Schema::create('transport_buses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('bus_number', 50)->unique();
            $table->string('route')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('driver_phone', 20)->nullable();
            $table->string('driver_license', 100)->nullable();
            $table->boolean('gps_active')->default(true);
            $table->enum('status', ['Active', 'Maintenance', 'Inactive'])->default('Active');
            $table->timestamps();
        });

        Schema::create('library_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('accession_no', 50)->unique()->nullable();
            $table->string('isbn', 20)->nullable();
            $table->string('title');
            $table->string('author')->nullable();
            $table->string('rack', 50)->nullable();
            $table->integer('total_copies')->default(1);
            $table->integer('available_copies')->default(1);
            $table->timestamps();
        });

        Schema::create('library_issuances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('book_id')->constrained('library_books')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->date('issued_at');
            $table->date('due_date');
            $table->date('returned_at')->nullable();
            $table->decimal('fine_amount', 8, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('room_no', 20);
            $table->string('block', 100)->nullable();
            $table->string('type', 100)->nullable();
            $table->integer('capacity')->default(1);
            $table->integer('occupied')->default(0);
            $table->decimal('rent_per_term', 10, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->string('month', 20);
            $table->decimal('base_salary', 12, 2)->default(0);
            $table->decimal('deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->string('bank_account', 100)->nullable();
            $table->enum('status', ['Pending', 'Disbursed', 'Hold'])->default('Pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_records');
        Schema::dropIfExists('hostel_rooms');
        Schema::dropIfExists('library_issuances');
        Schema::dropIfExists('library_books');
        Schema::dropIfExists('transport_buses');
        Schema::dropIfExists('homework_tasks');
        Schema::dropIfExists('school_settings');
    }
};
