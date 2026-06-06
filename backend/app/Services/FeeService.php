<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\FeeTransaction;
use App\Repositories\FeeRepository;

class FeeService
{
    protected FeeRepository $feeRepository;

    public function __construct(FeeRepository $feeRepository)
    {
        $this->feeRepository = $feeRepository;
    }

    public function getTransactions(array $filters = []): array
    {
        return $this->feeRepository->getAll($filters);
    }

    public function recordPayment(array $data): FeeTransaction
    {
        $transaction = $this->feeRepository->create($data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $transaction->school_id,
            'user_id' => auth()->id(),
            'action' => 'Fee Paid',
            'description' => "Recorded fee payment of $" . number_format($transaction->amount, 2) . " for student: {$transaction->student_name}",
            'model_type' => FeeTransaction::class,
            'model_id' => $transaction->id,
        ]);

        return $transaction;
    }

    public function getDefaulters(): array
    {
        return $this->feeRepository->getDefaulters();
    }
}
