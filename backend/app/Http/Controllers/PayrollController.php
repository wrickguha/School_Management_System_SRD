<?php

namespace App\Http\Controllers;

use App\Models\PayrollRecord;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function index(): JsonResponse
    {
        $payroll = PayrollRecord::with('teacher')->latest()->get();
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

        $base = $data['base_salary'];
        $deductions = $data['deductions'] ?? 0;
        $net = max(0, $base - $deductions);

        $record = PayrollRecord::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'deductions' => $deductions,
            'net_salary' => $net,
            'paid_at' => ($request->input('status') === 'Disbursed') ? now() : null,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $record->school_id,
            'user_id' => auth()->id(),
            'action' => 'Payroll Generated',
            'description' => "Generated payroll record for teacher ID #{$record->teacher_id} for {$record->month}",
            'model_type' => PayrollRecord::class,
            'model_id' => $record->id,
        ]);

        return response()->json($record, 201);
    }

    public function update(Request $request, PayrollRecord $payroll): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|string|in:Pending,Disbursed,Hold',
        ]);

        $payroll->update(array_merge($data, [
            'paid_at' => ($data['status'] === 'Disbursed') ? now() : null,
        ]));

        // Log Activity
        ActivityLog::create([
            'school_id' => $payroll->school_id,
            'user_id' => auth()->id(),
            'action' => 'Payroll Updated',
            'description' => "Updated payroll record #{$payroll->id} status to {$payroll->status}",
            'model_type' => PayrollRecord::class,
            'model_id' => $payroll->id,
        ]);

        return response()->json($payroll);
    }
}
