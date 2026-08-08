<?php

namespace App\Http\Controllers\Academics;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Services\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    protected CourseService $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Display a listing of the courses.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'course_type', 'status']);
        
        // Fetch all courses for client-side filtering
        $courses = $this->courseService->getAllCoursesWithoutPagination($filters);
        $resolved = CourseResource::collection($courses)->resolve();

        return response()->json($resolved);
    }

    /**
     * Store a newly created course.
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = $this->courseService->createCourse($request->validated());
        $resource = new CourseResource($course);

        return response()->json($resource->resolve(), 201);
    }

    /**
     * Display the specified course.
     */
    public function show(int $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $resource = new CourseResource($course);
        return response()->json($resource->resolve());
    }

    /**
     * Update the specified course.
     */
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        try {
            $course = $this->courseService->updateCourse($id, $request->validated());
            $resource = new CourseResource($course);
            return response()->json($resource->resolve());
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Remove the specified course.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->courseService->deleteCourse($id);
            return response()->json(['success' => true]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Get active courses.
     */
    public function getActive(): JsonResponse
    {
        $courses = $this->courseService->getActiveCourses();
        $resolved = CourseResource::collection($courses)->resolve();

        return response()->json($resolved);
    }

    /**
     * Get courses by type.
     */
    public function getByType(string $type): JsonResponse
    {
        $courses = $this->courseService->getCoursesByType($type);
        $resolved = CourseResource::collection($courses)->resolve();

        return response()->json($resolved);
    }

    /**
     * Get courses by status.
     */
    public function getByStatus(string $status): JsonResponse
    {
        $courses = $this->courseService->getCoursesByStatus($status);
        $resolved = CourseResource::collection($courses)->resolve();

        return response()->json($resolved);
    }
}
