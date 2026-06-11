<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('parent_name');
            $table->string('parent_email');
            $table->string('parent_phone', 20)->nullable();
            $table->string('student_name');
            $table->string('applying_grade', 50)->nullable();
            $table->enum('status', ['New', 'Contacted', 'Admitted', 'Closed'])->default('New');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_enquiries');
    }
};
