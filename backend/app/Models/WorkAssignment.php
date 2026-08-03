<?php

namespace App\Models;

use App\Traits\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkAssignment extends Model
{
    use TenantScoped;

    protected $fillable = [
        'school_id',
        'created_by',
        'assigned_to',
        'assigned_role',
        'title',
        'description',
        'category',
        'priority',
        'due_date',
        'status',
        'completion_notes',
        'remarks',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
