<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('session')->nullable(); // e.g., "2023-2024"
            $table->string('course'); // e.g., "BSC", "GNM"
            $table->string('name'); // e.g., "BSC 2023-2024", "GNM 2021-2025"
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'ARCHIVED'])->default('ACTIVE');
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('capacity')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Indexes
            $table->index('school_id');
            $table->index('status');
            $table->index('course');
            $table->unique(['school_id', 'session', 'course', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
