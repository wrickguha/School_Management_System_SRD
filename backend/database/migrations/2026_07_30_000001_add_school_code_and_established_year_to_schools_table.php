<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'code')) {
                $table->string('code', 50)->nullable()->after('subdomain');
            }
            if (!Schema::hasColumn('schools', 'established_year')) {
                $table->string('established_year', 10)->nullable()->after('code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'code')) {
                $table->dropColumn('code');
            }
            if (Schema::hasColumn('schools', 'established_year')) {
                $table->dropColumn('established_year');
            }
        });
    }
};
