import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/services';
import { Course } from '../../services/services';
import Card from '../../components/Card';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import Can from '../../components/Can';

export default function CourseModule() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    course_code: '',
    name: '',
    description: '',
    course_type: 'UG',
    duration_months: '',
    total_semesters: '',
    semester_pattern: '',
    credits: '',
    fees: '',
    eligibility_criteria: '',
    status: 'ACTIVE',
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', courseType: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        return await courseService.getAll();
      } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
      }
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      resetForm();
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || {});
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => courseService.update(selectedCourse!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      resetForm();
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || {});
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => courseService.delete(selectedCourse!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDeleteOpen(false);
      setSelectedCourse(null);
    },
  });

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        course.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.course_code?.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || course.status === filters.status;
      const matchType = !filters.courseType || course.course_type === filters.courseType;
      return matchSearch && matchStatus && matchType;
    });
  }, [courses, filters]);

  const resetForm = () => {
    setFormData({
      course_code: '',
      name: '',
      description: '',
      course_type: 'UG',
      duration_months: '',
      total_semesters: '',
      semester_pattern: '',
      credits: '',
      fees: '',
      eligibility_criteria: '',
      status: 'ACTIVE',
    });
    setErrors({});
    setSelectedCourse(null);
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      course_code: course.course_code || '',
      name: course.name || '',
      description: course.description || '',
      course_type: course.course_type || 'UG',
      duration_months: course.duration_months?.toString() || '',
      total_semesters: course.total_semesters?.toString() || '',
      semester_pattern: course.semester_pattern || '',
      credits: course.credits?.toString() || '',
      fees: course.fees?.toString() || '',
      eligibility_criteria: course.eligibility_criteria || '',
      status: course.status || 'ACTIVE',
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_code || !formData.name) {
      setErrors({
        course_code: !formData.course_code ? 'Course code is required' : '',
        name: !formData.name ? 'Course name is required' : '',
      });
      return;
    }

    const submitData = {
      ...formData,
      duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
      total_semesters: formData.total_semesters ? parseInt(formData.total_semesters) : null,
      credits: formData.credits ? parseInt(formData.credits) : null,
      fees: formData.fees ? parseFloat(formData.fees) : null,
    };

    if (selectedCourse) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const columns = [
    { key: 'course_code', label: 'Code' },
    { key: 'name', label: 'Course Name' },
    { key: 'duration_months', label: 'Duration (Months)' },
    { key: 'total_semesters', label: 'Semesters' },
    { key: 'course_type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : value === 'INACTIVE'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, course: Course) => (
        <div className="flex gap-2">
          <Can permission="course.edit">
            <button
              onClick={() => handleEdit(course)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
          </Can>
          <Can permission="course.delete">
            <button
              onClick={() => handleDelete(course)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <Can permission="course.create">
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Course
          </Button>
        </Can>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by course name or code..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            value={filters.courseType}
            onChange={(e) => setFilters({ ...filters, courseType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Types</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : (
          <DataTable columns={columns} data={filteredCourses} />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateOpen || isEditOpen}
        onClose={() => {
          selectedCourse ? setIsEditOpen(false) : setIsCreateOpen(false);
          resetForm();
        }}
        title={selectedCourse ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.course_code}
                onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.course_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., GNM"
                disabled={!!selectedCourse}
              />
              {errors.course_code && (
                <p className="text-red-500 text-xs mt-1">{errors.course_code}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., General Nursing and Midwifery"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Course description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type
              </label>
              <select
                value={formData.course_type}
                onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 36"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Semesters
              </label>
              <input
                type="number"
                value={formData.total_semesters}
                onChange={(e) => setFormData({ ...formData, total_semesters: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 6"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester Pattern
              </label>
              <input
                type="text"
                value={formData.semester_pattern}
                onChange={(e) => setFormData({ ...formData, semester_pattern: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 6 months per semester"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 120"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
              <input
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 50000"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eligibility Criteria
            </label>
            <textarea
              value={formData.eligibility_criteria}
              onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Course eligibility..."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                selectedCourse ? setIsEditOpen(false) : setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Course"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <p className="font-medium text-gray-900">
                Are you sure you want to delete "{selectedCourse?.name}"?
              </p>
              <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate()}
              loading={deleteMutation.isPending}
            >
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
