<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseRepository
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Course::query();

        // Apply filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('course_code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['course_type'])) {
            $query->where('course_type', $filters['course_type']);
        }

        return $query->latest('created_at')->paginate($perPage);
    }

    public function getAllWithoutPagination(array $filters = []): Collection
    {
        $query = Course::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('course_code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['course_type'])) {
            $query->where('course_type', $filters['course_type']);
        }

        return $query->latest('created_at')->get();
    }

    public function findById(int $id): ?Course
    {
        return Course::find($id);
    }

    public function findByCode(string $code): ?Course
    {
        return Course::where('course_code', $code)->first();
    }

    public function create(array $data): Course
    {
        return Course::create([
            'school_id' => auth()->user()->school_id,
            'created_by_user_id' => auth()->id(),
            ...$data
        ]);
    }

    public function update(Course $course, array $data): Course
    {
        $course->update($data);
        return $course->refresh();
    }

    public function delete(Course $course): bool
    {
        return $course->delete();
    }

    public function getByType(string $type): Collection
    {
        return Course::where('course_type', $type)->get();
    }

    public function getByStatus(string $status): Collection
    {
        return Course::where('status', $status)->get();
    }

    public function getActive(): Collection
    {
        return Course::where('status', 'ACTIVE')->get();
    }
}
