import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { courseService } from '../../services/services';
import type { Course } from '../../services/services';
import { Can } from '../../store/PermissionContext';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseTypeFilter, setCourseTypeFilter] = useState('');
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
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || course.status === statusFilter;
      const matchType = !courseTypeFilter || course.course_type === courseTypeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [courses, searchTerm, statusFilter, courseTypeFilter]);

  const uniqueCourseTypes = Array.from(new Set(courses.map(c => c.course_type).filter(Boolean)));

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

  const columns: Column<Course>[] = [
    {
      header: 'Code',
      accessor: 'course_code',
      sortable: true,
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Duration (Months)',
      accessor: (course: Course) => course.duration_months || '-',
    },
    {
      header: 'Semesters',
      accessor: (course: Course) => course.total_semesters || '-',
    },
    {
      header: 'Type',
      accessor: 'course_type',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (course: Course) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : course.status === 'INACTIVE'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {course.status}
        </span>
      ),
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
        <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        <Can permission="course.create">
          <Button
            onClick={() => {
              setSelectedCourse(null);
              resetForm();
              setIsCreateOpen(true);
            }}
            className="bg-school-blue hover:bg-school-blue-dark text-white"
          >
            <Plus size={18} className="mr-2" />
            Add Course
          </Button>
        </Can>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by course name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            value={courseTypeFilter}
            onChange={(e) => setCourseTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-blue focus:border-transparent"
          >
            <option value="">All Types</option>
            {uniqueCourseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-4">
        {isLoading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCourses.map((course) => ({
              ...course,
              id: course.id || Math.random(),
            }))}
            searchPlaceholder="Search courses..."
            actions={(course: Course) => (
              <div className="flex gap-2">
                <Can permission="course.edit">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    title="Edit course"
                  >
                    <Edit2 size={18} />
                  </button>
                </Can>
                <Can permission="course.delete">
                  <button
                    onClick={() => handleDelete(course)}
                    className="text-red-600 hover:text-red-800 font-medium"
                    title="Delete course"
                  >
                    <Trash2 size={18} />
                  </button>
                </Can>
              </div>
            )}
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateOpen || isEditOpen}
        onClose={() => {
          if (selectedCourse) setIsEditOpen(false);
          else setIsCreateOpen(false);
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
              onClick={() => {
                if (selectedCourse) setIsEditOpen(false);
                else setIsCreateOpen(false);
                resetForm();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-school-blue hover:bg-school-blue-dark text-white"
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
          <p className="text-gray-700">
            Are you sure you want to delete "<strong>{selectedCourse?.name}</strong>"? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setIsDeleteOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
