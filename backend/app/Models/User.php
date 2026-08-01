<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'school_id', 'name', 'email', 'password',
        'role', 'avatar_path', 'profile_image_path', 'status', 'last_login_at',
        'date_of_birth',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'date_of_birth'     => 'date',
            'password'          => 'hashed',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────────────
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    // ── Role Helpers ─────────────────────────────────────────────────────────
    public function isSuperAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'platform_owner']);
    }

    public function isSchoolAdmin(): bool
    {
        return in_array($this->role, ['school_admin', 'principal', 'vice_principal']);
    }

    public function isTeacher(): bool
    {
        return in_array($this->role, ['teacher', 'faculty', 'class_teacher', 'dept_head']);
    }

    public function isParent(): bool
    {
        return $this->role === 'parent';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isAccountant(): bool
    {
        return $this->role === 'accountant';
    }

    public function isHR(): bool
    {
        return $this->role === 'hr';
    }

    public function isLibrarian(): bool
    {
        return $this->role === 'librarian';
    }

    public function isHostelWarden(): bool
    {
        return $this->role === 'hostel_warden';
    }

    public function isTransportManager(): bool
    {
        return in_array($this->role, ['transport_manager', 'driver']);
    }

    public function isSupportStaff(): bool
    {
        return in_array($this->role, [
            'office_staff', 'receptionist', 'lab_assistant', 'transport_manager', 
            'driver', 'security_guard', 'cleaner', 'hostel_warden', 'nurse', 
            'counselor', 'staff', 'other'
        ]);
    }

    /**
     * Returns true if the user can manage data for a given school_id.
     * Super admins can access any school.
     */
    public function canAccessSchool(int $schoolId): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        return $this->school_id === $schoolId;
    }
}
