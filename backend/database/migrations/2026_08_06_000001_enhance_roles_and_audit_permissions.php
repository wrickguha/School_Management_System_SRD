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
        $tableNames = config('permission.table_names');

        if (Schema::hasTable($tableNames['roles'] ?? 'roles')) {
            Schema::table($tableNames['roles'] ?? 'roles', function (Blueprint $table) {
                if (!Schema::hasColumn($table->getTable(), 'description')) {
                    $table->string('description')->nullable()->after('name');
                }
                if (!Schema::hasColumn($table->getTable(), 'status')) {
                    $table->enum('status', ['active', 'inactive'])->default('active')->after('description');
                }
                if (!Schema::hasColumn($table->getTable(), 'is_system')) {
                    $table->boolean('is_system')->default(false)->after('status');
                }
                if (!Schema::hasColumn($table->getTable(), 'created_by')) {
                    $table->unsignedBigInteger('created_by')->nullable()->after('is_system');
                }
            });
        }

        if (!Schema::hasTable('permission_audit_logs')) {
            Schema::create('permission_audit_logs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('user_name')->nullable();
                $table->string('action'); // e.g. role_created, permissions_updated, user_role_changed, user_permission_overridden
                $table->string('target_type')->nullable(); // Role, User
                $table->string('target_name')->nullable();
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_audit_logs');
    }
};
