<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('grade', 50)->nullable();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->enum('frequency', ['One-time', 'Monthly', 'Quarterly', 'Annual'])->default('Annual');
            $table->timestamps();
        });

        Schema::create('fee_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('receipt_no', 50)->unique();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('student_name')->nullable();
            $table->string('grade', 50)->nullable();
            $table->decimal('amount', 12, 2);
            $table->enum('payment_mode', ['Card', 'UPI', 'Bank Transfer', 'Cash']);
            $table->enum('status', ['Paid', 'Pending', 'Failed', 'Refunded'])->default('Paid');
            $table->date('date')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'status']);
            $table->index(['school_id', 'date']);
            $table->index(['school_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_transactions');
        Schema::dropIfExists('fee_structures');
    }
};
