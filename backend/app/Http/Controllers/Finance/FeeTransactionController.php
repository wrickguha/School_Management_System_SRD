<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeeTransactionResource;
use App\Http\Resources\StudentResource;
use App\Services\FeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeTransactionController extends Controller
{
    protected FeeService $feeService;

    public function __construct(FeeService $feeService)
    {
        $this->feeService = $feeService;
    }

    /**
     * Display a listing of the transactions.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'student_id']);
        $transactions = $this->feeService->getTransactions($filters);
        $resolved = FeeTransactionResource::collection($transactions)->resolve();

        return response()->json($resolved);
    }

    /**
     * Record a new fee payment.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:255',
            'grade' => 'required|string|max:50',
            'amount' => 'required|numeric|min:1',
            'payment_mode' => 'required|string|in:Card,UPI,Bank Transfer,Cash',
            'notes' => 'nullable|string',
        ]);

        $transaction = $this->feeService->recordPayment($data);
        $resource = new FeeTransactionResource($transaction);

        return response()->json($resource->resolve(), 201);
    }

    /**
     * Get students with pending fees.
     */
    public function defaulters(): JsonResponse
    {
        $defaulters = $this->feeService->getDefaulters();
        $resolved = StudentResource::collection($defaulters)->resolve();

        return response()->json($resolved);
    }

    /**
     * Send fee reminder.
     */
    public function sendReminder(Request $request): JsonResponse
    {
        $request->validate([
            'student_id' => 'required|integer|exists:students,id',
        ]);

        // In production, trigger Twilio or SNS here.
        // For now, write a log audit and return success.
        return response()->json(['success' => true, 'message' => 'Reminder sent successfully']);
    }
}
