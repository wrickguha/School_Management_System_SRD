<?php

namespace App\Services;

use App\Models\PayrollRecord;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

class PayrollService
{
    /**
     * Get all payroll records.
     */
    public function getAllRecords(): Collection
    {
        return PayrollRecord::with('teacher')->latest()->get();
    }

    /**
     * Create a payroll record for a teacher.
     */
    public function createRecord(array $data, int $userId): PayrollRecord
    {
        $base = $data['base_salary'];
        $deductions = $data['deductions'] ?? 0;
        $net = max(0, $base - $deductions);

        $record = PayrollRecord::create(array_merge($data, [
            'school_id' => auth()->user()->school_id,
            'deductions' => $deductions,
            'net_salary' => $net,
            'paid_at' => ($data['status'] ?? 'Pending') === 'Disbursed' ? now() : null,
        ]));

        ActivityLog::create([
            'school_id' => $record->school_id,
            'user_id' => $userId,
            'action' => 'Payroll Generated',
            'description' => "Generated payroll record for teacher ID #{$record->teacher_id} for {$record->month}",
            'model_type' => PayrollRecord::class,
            'model_id' => $record->id,
        ]);

        return $record;
    }

    /**
     * Update existing payroll record status.
     */
    public function updateStatus(PayrollRecord $payroll, string $status, int $userId): PayrollRecord
    {
        $payroll->update([
            'status' => $status,
            'paid_at' => ($status === 'Disbursed') ? now() : null,
        ]);

        ActivityLog::create([
            'school_id' => $payroll->school_id,
            'user_id' => $userId,
            'action' => 'Payroll Updated',
            'description' => "Updated payroll record #{$payroll->id} status to {$payroll->status}",
            'model_type' => PayrollRecord::class,
            'model_id' => $payroll->id,
        ]);

        return $payroll;
    }
}
