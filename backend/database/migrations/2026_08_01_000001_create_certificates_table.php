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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('issued_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title');
            $table->enum('certificate_type', [
                'Academic Excellence',
                'Sports & Athletics',
                'Course Completion',
                'Extra-Curricular',
                'Character & Conduct',
                'Merit',
                'Other'
            ])->default('Academic Excellence');
            $table->date('issue_date')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_size')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
