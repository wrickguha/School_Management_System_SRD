<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_requests', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('contact_name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('student_count', 20)->nullable();
            $table->enum('status', ['new', 'contacted', 'converted', 'rejected'])->default('new');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_requests');
    }
};
