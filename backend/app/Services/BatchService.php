<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\ActivityLog;
use App\Repositories\BatchRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BatchService
{
    protected BatchRepository $batchRepository;

    public function __construct(BatchRepository $batchRepository)
    {
        $this->batchRepository = $batchRepository;
    }

    public function getAllBatches(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->batchRepository->getAll($filters, $perPage);
    }

    public function getAllBatchesWithoutPagination(array $filters = []): Collection
    {
        return $this->batchRepository->getAllWithoutPagination($filters);
    }

    public function getBatchById(int $id): ?Batch
    {
        return $this->batchRepository->findById($id);
    }

    public function createBatch(array $data): Batch
    {
        $batch = $this->batchRepository->create($data);

        // Log Activity
        ActivityLog::create([
            'school_id' => $batch->school_id,
            'user_id' => auth()->id(),
            'action' => 'Batch Created',
            'description' => "Created new batch: {$batch->name} (Course: {$batch->course}, Session: {$batch->session})",
            'model_type' => Batch::class,
            'model_id' => $batch->id,
        ]);

        return $batch;
    }

    public function updateBatch(int $id, array $data): Batch
    {
        $batch = $this->batchRepository->findById($id);

        if (!$batch) {
            throw new \InvalidArgumentException('Batch not found');
        }

        $oldValues = $batch->getAttributes();
        $this->batchRepository->update($batch, $data);

        // Log Activity
        $changes = array_diff_assoc($batch->getAttributes(), $oldValues);
        if (!empty($changes)) {
            ActivityLog::create([
                'school_id' => $batch->school_id,
                'user_id' => auth()->id(),
                'action' => 'Batch Updated',
                'description' => "Updated batch: {$batch->name}. Changes: " . json_encode($changes),
                'model_type' => Batch::class,
                'model_id' => $batch->id,
            ]);
        }

        return $batch;
    }

    public function deleteBatch(int $id): bool
    {
        $batch = $this->batchRepository->findById($id);

        if (!$batch) {
            throw new \InvalidArgumentException('Batch not found');
        }

        // Log Activity
        ActivityLog::create([
            'school_id' => $batch->school_id,
            'user_id' => auth()->id(),
            'action' => 'Batch Deleted',
            'description' => "Deleted batch: {$batch->name}",
            'model_type' => Batch::class,
            'model_id' => $batch->id,
        ]);

        return $this->batchRepository->delete($batch);
    }

    public function getBatchesByCourse(string $course): Collection
    {
        return $this->batchRepository->getByCourse($course);
    }

    public function getActiveBatches(): Collection
    {
        return $this->batchRepository->getByStatus('ACTIVE');
    }
}
