<?php

namespace App\Traits;

use App\Models\User;

trait TenantScoped
{
    protected static function bootTenantScoped(): void
    {
        static::addGlobalScope('school', function ($builder) {
            if (auth()->check()) {
                /** @var User $user */
                $user = auth()->user();
                if (!$user->isSuperAdmin() && $user->school_id) {
                    $builder->where($builder->getModel()->getTable() . '.school_id', $user->school_id);
                }
            }
        });

        static::creating(function ($model) {
            if (auth()->check()) {
                /** @var User $user */
                $user = auth()->user();
                if (!$user->isSuperAdmin() && $user->school_id && !$model->school_id) {
                    $model->school_id = $user->school_id;
                }
            }
        });
    }
}
