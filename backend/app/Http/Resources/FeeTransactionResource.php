<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeeTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'receiptNo' => $this->receipt_no,
            'studentId' => $this->student_id,
            'studentName' => $this->student_name,
            'grade' => $this->grade,
            'amount' => (float) $this->amount,
            'paymentMode' => $this->payment_mode,
            'status' => $this->status === 'Paid' ? 'Success' : $this->status,
            'date' => $this->date ? $this->date->toDateString() : $this->created_at?->toDateString(),
            'notes' => $this->notes,
        ];
    }
}
