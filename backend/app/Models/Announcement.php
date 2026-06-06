<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'title',
        'content',
        'target_audience',
        'is_sms',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'is_sms'       => 'boolean',
        'published_at' => 'datetime',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
