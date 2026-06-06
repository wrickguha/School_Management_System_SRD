<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use TenantScoped;

    // The activity_logs table only has created_at
    const UPDATED_AT = null;

    protected $fillable = [
        'school_id',
        'user_id',
        'action',
        'description',
        'model_type',
        'model_id',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
