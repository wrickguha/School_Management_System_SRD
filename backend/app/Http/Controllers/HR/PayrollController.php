<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\PayrollRecord;
use App\Services\PayrollService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    protected PayrollService $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(): JsonResponse
    {
        $payroll = $this->payrollService->getAllRecords();
        return response()->json($payroll);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'teacher_id' => 'required|integer|exists:teachers,id',
            'month' => 'required|string|max:20',
            'base_salary' => 'required|numeric|min:0',
            'deductions' => 'sometimes|required|numeric|min:0',
            'bank_account' => 'nullable|string|max:100',
            'status' => 'sometimes|required|string|in:Pending,Disbursed,Hold',
        ]);

        $record = $this->payrollService->createRecord($data, auth()->id());

        return response()->json($record, 201);
    }

    public function update(Request $request, PayrollRecord $payroll): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:Pending,Disbursed,Hold',
        ]);

        $updatedPayroll = $this->payrollService->updateStatus($payroll, $data['status'], auth()->id());

        return response()->json($updatedPayroll);
    }
}
