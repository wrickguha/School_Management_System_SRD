<?php

namespace App\Repositories;

use App\Models\Batch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BatchRepository
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Batch::query();

        // Apply filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('course', 'like', "%{$search}%")
                  ->orWhere('session', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['course'])) {
            $query->where('course', $filters['course']);
        }

        if (!empty($filters['session'])) {
            $query->where('session', $filters['session']);
        }

        return $query->latest('created_at')->paginate($perPage);
    }

    public function getAllWithoutPagination(array $filters = []): Collection
    {
        $query = Batch::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('course', 'like', "%{$search}%")
                  ->orWhere('session', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['course'])) {
            $query->where('course', $filters['course']);
        }

        return $query->latest('created_at')->get();
    }

    public function findById(int $id): ?Batch
    {
        return Batch::find($id);
    }

    public function create(array $data): Batch
    {
        return Batch::create([
            'school_id' => auth()->user()->school_id,
            ...$data
        ]);
    }

    public function update(Batch $batch, array $data): Batch
    {
        $batch->update($data);
        return $batch->refresh();
    }

    public function delete(Batch $batch): bool
    {
        return $batch->delete();
    }

    public function getByCourse(string $course): Collection
    {
        return Batch::where('course', $course)->get();
    }

    public function getByStatus(string $status): Collection
    {
        return Batch::where('status', $status)->get();
    }
}
