import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { batchService } from '../../services/services';
import type { Batch } from '../../services/services';
import { Can } from '../../store/PermissionContext';

export default function BatchModule() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const [formData, setFormData] = useState({
    session: '',
    course: '',
    name: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
    description: '',
    start_date: '',
    end_date: '',
    capacity: '',
  });

  // Queries
  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchService.getAll,
  });

  const uniqueCourses = React.useMemo(() => {
    return Array.from(new Set((batches || []).map(b => b.course))).filter(Boolean);
  }, [batches]);

  const filteredBatches = React.useMemo(() => {
    return (batches || []).filter(batch => {
      if (searchTerm && !batch.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !batch.course.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !batch.session?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter && batch.status !== statusFilter) return false;
      if (courseFilter && batch.course !== courseFilter) return false;
      return true;
    });
  }, [batches, searchTerm, statusFilter, courseFilter]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: batchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setIsCreateOpen(false);
      setFormData({
        session: '',
        course: '',
        name: '',
        status: 'ACTIVE',
        description: '',
        start_date: '',
        end_date: '',
        capacity: '',
      });
      alert('Batch created successfully!');
    },
    onError: (error: any) => {
      alert(`Error creating batch: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => batchService.update(selectedBatch!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setIsEditOpen(false);
      setSelectedBatch(null);
      setFormData({
        session: '',
        course: '',
        name: '',
        status: 'ACTIVE',
        description: '',
        start_date: '',
        end_date: '',
        capacity: '',
      });
      alert('Batch updated successfully!');
    },
    onError: (error: any) => {
      alert(`Error updating batch: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: batchService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      alert('Batch deleted successfully!');
    },
    onError: (error: any) => {
      alert(`Error deleting batch: ${error.message}`);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course || !formData.name) {
      alert('Please fill in Course and Name fields');
      return;
    }
    createMutation.mutate({
      session: formData.session || '',
      course: formData.course,
      name: formData.name,
      status: formData.status,
      description: formData.description || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    });
  };

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setFormData({
      session: batch.session || '',
      course: batch.course,
      name: batch.name,
      status: batch.status,
      description: batch.description || '',
      start_date: batch.start_date || '',
      end_date: batch.end_date || '',
      capacity: batch.capacity?.toString() || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course || !formData.name) {
      alert('Please fill in Course and Name fields');
      return;
    }
    updateMutation.mutate({
      session: formData.session || undefined,
      course: formData.course,
      name: formData.name,
      status: formData.status,
      description: formData.description || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    });
  };

  const handleDelete = (batch: Batch) => {
    if (confirm(`Are you sure you want to delete batch "${batch.name}"?`)) {
      deleteMutation.mutate(batch.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'ARCHIVED': 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  // Columns for DataTable
  const columns: Column<Batch>[] = [
    { header: 'Session', accessor: 'session', sortable: true, sortKey: 'session' },
    { header: 'Course', accessor: 'course', sortable: true, sortKey: 'course' },
    { header: 'Batch Name', accessor: 'name', sortable: true, sortKey: 'name' },
    {
      header: 'Status',
      accessor: (batch: Batch) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(batch.status)}`}>
          {batch.status}
        </span>
      ),
    },
    {
      header: 'Students',
      accessor: (batch: Batch) => (
        <span className="font-semibold text-school-blue">{batch.student_count || 0}</span>
      ),
    },
    {
      header: 'Capacity',
      accessor: (batch: Batch) => batch.capacity || '-',
    },
    {
      header: 'Duration',
      accessor: (batch: Batch) => {
        if (batch.start_date && batch.end_date) {
          return `${batch.start_date} to ${batch.end_date}`;
        }
        return '-';
      },
    },
    {
      header: 'Actions',
      accessor: () => null,
      sortable: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Batch Management</h2>
        <Can permission="batch.create">
          <Button
            onClick={() => {
              setSelectedBatch(null);
              setFormData({
                session: '',
                course: '',
                name: '',
                status: 'ACTIVE',
                description: '',
                start_date: '',
                end_date: '',
                capacity: '',
              });
              setIsCreateOpen(true);
            }}
            className="bg-school-blue hover:bg-school-blue-dark text-white"
          >
            <Plus size={18} className="mr-2" />
            Add Batch
          </Button>
        </Can>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by session, course, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center">Loading batches...</div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No batches found</div>
        ) : (
          <DataTable<Batch>
            columns={columns}
            data={filteredBatches}
            actions={(batch: Batch) => (
              <div className="flex gap-2">
                <Can permission="batch.edit">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    title="Edit batch"
                  >
                    <Edit2 size={18} />
                  </button>
                </Can>
                <Can permission="batch.delete">
                  <button
                    onClick={() => handleDelete(batch)}
                    className="text-red-600 hover:text-red-800 font-medium"
                    title="Delete batch"
                  >
                    <Trash2 size={18} />
                  </button>
                </Can>
              </div>
            )}
          />
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Batch"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session</label>
            <input
              type="text"
              placeholder="e.g., 2023-2024"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course *</label>
            <input
              type="text"
              placeholder="e.g., BSC, GNM, B.Tech"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Name *</label>
            <input
              type="text"
              placeholder="e.g., BSC 2023-2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Enter batch description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              placeholder="e.g., 60"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              min="1"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-school-blue hover:bg-school-blue-dark text-white flex-1"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Batch'}
            </Button>
            <Button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Batch"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session</label>
            <input
              type="text"
              placeholder="e.g., 2023-2024"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <input
              type="text"
              placeholder="e.g., BSC, GNM, B.Tech"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Name</label>
            <input
              type="text"
              placeholder="e.g., BSC 2023-2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Enter batch description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              placeholder="e.g., 60"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue"
              min="1"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-school-blue hover:bg-school-blue-dark text-white flex-1"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Batch'}
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
