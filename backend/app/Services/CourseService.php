<?php

namespace App\Services;

use App\Models\Course;
use App\Models\ActivityLog;
use App\Repositories\CourseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseService
{
    protected CourseRepository $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getAllCourses(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->courseRepository->getAll($filters, $perPage);
    }

    public function getAllCoursesWithoutPagination(array $filters = []): Collection
    {
        return $this->courseRepository->getAllWithoutPagination($filters);
    }

    public function getCourseById(int $id): ?Course
    {
        return $this->courseRepository->findById($id);
    }

    public function getCourseByCode(string $code): ?Course
    {
        return $this->courseRepository->findByCode($code);
    }

    public function createCourse(array $data): Course
    {
        $course = $this->courseRepository->create($data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $course->school_id,
            'user_id' => auth()->id(),
            'action' => 'Course Created',
            'description' => "Created new course: {$course->name} (Code: {$course->course_code}, Type: {$course->course_type})",
            'model_type' => Course::class,
            'model_id' => $course->id,
        ]);

        return $course;
    }

    public function updateCourse(int $id, array $data): Course
    {
        $course = $this->courseRepository->findById($id);

        if (!$course) {
            throw new \InvalidArgumentException('Course not found');
        }

        $oldValues = $course->getAttributes();
        $this->courseRepository->update($course, $data);

        // Log Activity
        $changes = array_diff_assoc($course->getAttributes(), $oldValues);
        if (!empty($changes)) {
            ActivityLog::create([
                'school_id' => $course->school_id,
                'user_id' => auth()->id(),
                'action' => 'Course Updated',
                'description' => "Updated course: {$course->name}. Changes: " . json_encode($changes),
                'model_type' => Course::class,
                'model_id' => $course->id,
            ]);
        }

        return $course;
    }

    public function deleteCourse(int $id): bool
    {
        $course = $this->courseRepository->findById($id);

        if (!$course) {
            throw new \InvalidArgumentException('Course not found');
        }

        // Log Activity
        ActivityLog::create([
            'school_id' => $course->school_id,
            'user_id' => auth()->id(),
            'action' => 'Course Deleted',
            'description' => "Deleted course: {$course->name}",
            'model_type' => Course::class,
            'model_id' => $course->id,
        ]);

        return $this->courseRepository->delete($course);
    }

    public function getCoursesByType(string $type): Collection
    {
        return $this->courseRepository->getByType($type);
    }

    public function getActiveCourses(): Collection
    {
        return $this->courseRepository->getActive();
    }

    public function getCoursesByStatus(string $status): Collection
    {
        return $this->courseRepository->getByStatus($status);
    }
}
