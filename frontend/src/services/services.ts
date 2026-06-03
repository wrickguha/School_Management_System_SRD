import apiClient from './apiClient';
import type { Student, Teacher, Exam, FeeTransaction, Announcement, ActivityLog } from './mockDb';

export const studentService = {
  getAll: async () => {
    const res = await apiClient.get<Student[]>('/students');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<Student>(`/students/${id}`);
    return res.data;
  },
  create: async (data: Omit<Student, 'id' | 'status' | 'attendanceRate' | 'pendingFees' | 'feeStatus' | 'academicPerformance' | 'documents'>) => {
    const res = await apiClient.post<Student>('/students', data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean }>(`/students/${id}`);
    return res.data;
  }
};

export const teacherService = {
  getAll: async () => {
    const res = await apiClient.get<Teacher[]>('/teachers');
    return res.data;
  },
  create: async (data: Omit<Teacher, 'id' | 'teacherId' | 'status'>) => {
    const res = await apiClient.post<Teacher>('/teachers', data);
    return res.data;
  }
};

export const examService = {
  getAll: async () => {
    const res = await apiClient.get<Exam[]>('/exams');
    return res.data;
  },
  create: async (data: Omit<Exam, 'id' | 'status'>) => {
    const res = await apiClient.post<Exam>('/exams', data);
    return res.data;
  }
};

export const financeService = {
  getTransactions: async () => {
    const res = await apiClient.get<FeeTransaction[]>('/transactions');
    return res.data;
  },
  payFee: async (data: { studentName: string; grade: string; amount: number; paymentMode: string }) => {
    const res = await apiClient.post<FeeTransaction>('/transactions', data);
    return res.data;
  }
};

export const announcementService = {
  getAll: async () => {
    const res = await apiClient.get<Announcement[]>('/announcements');
    return res.data;
  },
  create: async (data: Omit<Announcement, 'id' | 'date'>) => {
    const res = await apiClient.post<Announcement>('/announcements', data);
    return res.data;
  }
};

export const activityService = {
  getAll: async () => {
    const res = await apiClient.get<ActivityLog[]>('/activities');
    return res.data;
  }
};
