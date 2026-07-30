<?php

namespace App\Services;

use App\Models\Guardian;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ParentService
{
    /**
     * Get all guardians with linked student records.
     */
    public function getAllParents(): Collection
    {
        return Guardian::with('students')->latest()->get();
    }

    /**
     * Register a new parent user and guardian profile.
     */
    public function createParent(array $data, int $currentUserId): Guardian
    {
        $parent = DB::transaction(function () use ($data) {
            $schoolId = auth()->user()->school_id;

            $user = User::create([
                'school_id' => $schoolId,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'parent',
                'status' => 'active',
            ]);
            $user->assignRole('parent');

            $guardian = Guardian::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'name' => $data['name'],
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'],
            ]);

            if (!empty($data['student_id'])) {
                $guardian->students()->attach($data['student_id'], [
                    'relation' => $data['relation'] ?? 'Parent',
                ]);
            }

            return $guardian;
        });

        ActivityLog::create([
            'school_id' => $parent->school_id,
            'user_id' => $currentUserId,
            'action' => 'Parent Registered',
            'description' => "Registered parent: {$parent->name} for ward",
            'model_type' => Guardian::class,
            'model_id' => $parent->id,
        ]);

        return $parent;
    }

    /**
     * Delete parent record and linked user.
     */
    public function deleteParent(int $id): bool
    {
        $parent = Guardian::find($id);

        if (!$parent) {
            return false;
        }

        DB::transaction(function () use ($parent) {
            if ($parent->user) {
                $parent->user->delete();
            }
            $parent->delete();
        });

        return true;
    }
}
