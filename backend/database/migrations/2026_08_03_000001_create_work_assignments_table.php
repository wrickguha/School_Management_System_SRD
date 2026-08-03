<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->string('assigned_role', 50)->default('all');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category', 50)->default('general');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->date('due_date')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'submitted', 'completed', 'rejected'])->default('pending');
            $table->text('completion_notes')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'assigned_role', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_assignments');
    }
};
