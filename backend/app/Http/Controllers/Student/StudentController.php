<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    /**
     * Display a listing of the students.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'grade', 'section', 'status']);
        
        // Since frontend expects a flat list for client-side search/filtering,
        // we can fetch all or paginate. Let's retrieve all matching students
        // and resolve the resource collection to a flat array.
        $students = $this->studentService->getAllStudents($filters, 1000);
        $resolved = StudentResource::collection($students->items())->resolve();

        return response()->json($resolved);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = $this->studentService->createStudent($request->validated());
        $resource = new StudentResource($student->load(['parents', 'user']));

        return response()->json($resource->resolve(), 201);
    }

    /**
     * Display the specified student.
     */
    public function show(int $id): JsonResponse
    {
        $student = $this->studentService->getStudentById($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $resource = new StudentResource($student);
        return response()->json($resource->resolve());
    }

    /**
     * Update the specified student.
     */
    public function update(UpdateStudentRequest $request, int $id): JsonResponse
    {
        try {
            $student = $this->studentService->updateStudent($id, $request->validated());
            $resource = new StudentResource($student);
            return response()->json($resource->resolve());
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Remove the specified student.
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->studentService->deleteStudent($id);

        if (!$success) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        return response()->json(['success' => true]);
    }
}
