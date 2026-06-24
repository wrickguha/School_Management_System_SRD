import apiClient from './apiClient';
import type { Student, Exam, FeeTransaction, ActivityLog } from './mockDb';

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
    const res = await apiClient.get<any[]>('/teachers');
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post<any>('/teachers', data);
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
    const res = await apiClient.get<any[]>('/announcements');
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post<any>('/announcements', data);
    return res.data;
  }
};

export const activityService = {
  getAll: async () => {
    const res = await apiClient.get<ActivityLog[]>('/activities');
    return res.data;
  }
};

export interface DemoRequest {
  id: number;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  studentCount: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  notes?: string;
  createdAt: string;
}

export const demoService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/admin/demo-requests');
    return res.data.map((item: any) => ({
      id: item.id,
      schoolName: item.school_name,
      contactName: item.contact_name,
      email: item.email,
      phone: item.phone,
      studentCount: item.student_count,
      status: item.status,
      notes: item.notes,
      createdAt: item.created_at
    }));
  },
  updateStatus: async (id: number, data: { status: string; notes?: string }) => {
    const res = await apiClient.patch<any>(`/admin/demo-requests/${id}`, data);
    return {
      id: res.data.id,
      schoolName: res.data.school_name,
      contactName: res.data.contact_name,
      email: res.data.email,
      phone: res.data.phone,
      studentCount: res.data.student_count,
      status: res.data.status,
      notes: res.data.notes,
      createdAt: res.data.created_at
    };
  }
};

export const parentService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/parents');
    return res.data;
  },
  create: async (data: { name: string; phone?: string; email: string; student_id?: number; relation?: string }) => {
    const res = await apiClient.post<any>('/parents', data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await apiClient.delete<{ success: boolean }>(`/parents/${id}`);
    return res.data;
  }
};

export const homeworkService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/homework');
    return res.data;
  },
  create: async (data: { title: string; subject: string; grade: string; section: string; instructions: string; deadline: string }) => {
    const res = await apiClient.post<any>('/homework', data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await apiClient.delete<{ success: boolean }>(`/homework/${id}`);
    return res.data;
  }
};

export const transportService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/transport');
    return res.data;
  },
  create: async (data: { bus_number: string; route: string; driver_name: string; driver_phone: string; driver_license: string; gps_active?: boolean; status?: string }) => {
    const res = await apiClient.post<any>('/transport', data);
    return res.data;
  }
};

export const libraryService = {
  getBooks: async () => {
    const res = await apiClient.get<any[]>('/library/books');
    return res.data;
  },
  addBook: async (data: { accession_no?: string; isbn?: string; title: string; author?: string; rack?: string; total_copies: number }) => {
    const res = await apiClient.post<any>('/library/books', data);
    return res.data;
  },
  getIssuances: async () => {
    const res = await apiClient.get<any[]>('/library/issuances');
    return res.data;
  },
  issueBook: async (data: { book_id: number; student_id: number; due_date: string }) => {
    const res = await apiClient.post<any>('/library/issuances', data);
    return res.data;
  }
};

export const hostelService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/hostel');
    return res.data;
  },
  create: async (data: { room_no: string; block: string; type: string; capacity: number; rent_per_term: number }) => {
    const res = await apiClient.post<any>('/hostel', data);
    return res.data;
  }
};

export const payrollService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/payroll');
    return res.data;
  },
  create: async (data: { teacher_id: number; month: string; base_salary: number; deductions: number; bank_account: string }) => {
    const res = await apiClient.post<any>('/payroll', data);
    return res.data;
  },
  disburse: async (id: number, status: 'Disbursed' | 'Hold') => {
    const res = await apiClient.put<any>(`/payroll/${id}`, { status });
    return res.data;
  }
};

export const enquiryService = {
  getAll: async () => {
    const res = await apiClient.get<any[]>('/admissions/enquiries');
    return res.data;
  },
  create: async (data: { parent_name: string; parent_email: string; parent_phone?: string; student_name: string; applying_grade?: string; notes?: string }) => {
    const res = await apiClient.post<any>('/admissions/enquiries', data);
    return res.data;
  },
  updateStatus: async (id: number, data: { status: 'New' | 'Contacted' | 'Admitted' | 'Closed'; notes?: string }) => {
    const res = await apiClient.put<any>(`/admissions/enquiries/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await apiClient.delete<{ success: boolean }>(`/admissions/enquiries/${id}`);
    return res.data;
  }
};

export interface SuperStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalRevenue: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingDemoRequests: number;
  activeUsersToday: number;
  systemHealth: string;
  schoolGrowthData: Array<{ name: string; Schools: number }>;
  monthlyRevenueData: Array<{ name: string; Subscriptions: number; Addons: number }>;
  userGrowthData: Array<{ name: string; MAU: number; DAU: number }>;
  demoConversionData: Array<{ name: string; Requested: number; Converted: number }>;
  subscriptionTierData: Array<{ name: string; Basic: number; Pro: number; Enterprise: number }>;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalRevenue: number;
  attendanceRate: number;
  pendingPayments: number;
  revenueData: Array<{ name: string; Revenue: number; Collection: number }>;
  studentGrowthData: Array<{ name: string; Students: number }>;
}

export const dashboardService = {
  getSuperStats: async () => {
    const res = await apiClient.get<SuperStats>('/dashboard/super-stats');
    return res.data;
  },
  getSchoolStats: async () => {
    const res = await apiClient.get<SchoolStats>('/dashboard/stats');
    return res.data;
  }
};

