<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // e.g., 'create', 'update', 'delete'
            $table->string('model_type'); // e.g., 'Student', 'User', 'Attendance'
            $table->unsignedBigInteger('model_id')->nullable();
            $table->longText('changes')->nullable(); // JSON before/after changes
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
            
            $table->index(['school_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
