<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePayrollRecordRequest;
use App\Http\Requests\UpdatePayrollRecordRequest;
use App\Http\Resources\PayrollRecordResource;
use App\Models\PayrollRecord;
use App\Services\PayrollService;
use Illuminate\Http\JsonResponse;

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
        return response()->json(PayrollRecordResource::collection($payroll)->resolve());
    }

    public function store(StorePayrollRecordRequest $request): JsonResponse
    {
        $record = $this->payrollService->createRecord($request->validated(), auth()->id());

        return response()->json((new PayrollRecordResource($record))->resolve(), 201);
    }

    public function update(UpdatePayrollRecordRequest $request, PayrollRecord $payroll): JsonResponse
    {
        $validated = $request->validated();
        $updatedPayroll = $this->payrollService->updateStatus($payroll, $validated['status'], auth()->id());

        return response()->json((new PayrollRecordResource($updatedPayroll))->resolve());
    }
}
