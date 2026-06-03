import axios from 'axios';
import { db } from './mockDb';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.schoolerpsaas.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Backend Interceptor
apiClient.interceptors.request.use(async (config) => {
  // Simulate network latency (e.g., 600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const url = config.url || '';
  const method = config.method?.toLowerCase();

  // MOCK LOGIC FOR AXIOS
  // Note: We bypass sending actual HTTP requests by throwing a "mock-response" object 
  // that the response interceptor catches. This keeps the frontend clean.
  try {
    // ---------------- STUDENTS ----------------
    if (url.startsWith('/students')) {
      if (method === 'get') {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        if (id && id !== 'students') {
          const student = db.students.find(s => s.id === id);
          if (!student) throw { status: 404, data: { message: 'Student not found' } };
          throw { status: 200, data: student };
        }
        throw { status: 200, data: db.students };
      }
      if (method === 'post') {
        const newStudent = { ...config.data, id: `STU${Math.floor(100 + Math.random() * 900)}`, status: 'Active', attendanceRate: 100, pendingFees: config.data.totalFees || 40000, feeStatus: 'Unpaid', academicPerformance: 0, documents: [] };
        db.students = [newStudent, ...db.students];
        db.activities = [{
          id: `ACT${Date.now()}`,
          user: 'Admin',
          role: 'Administrator',
          action: `Registered new student: ${newStudent.name}`,
          time: 'Just now',
          type: 'success'
        }, ...db.activities];
        throw { status: 201, data: newStudent };
      }
      if (method === 'delete') {
        const id = url.split('/').pop();
        db.students = db.students.filter(s => s.id !== id);
        throw { status: 200, data: { success: true } };
      }
    }

    // ---------------- TEACHERS ----------------
    if (url.startsWith('/teachers')) {
      if (method === 'get') {
        throw { status: 200, data: db.teachers };
      }
      if (method === 'post') {
        const newTeacher = { ...config.data, id: `TCH${Math.floor(100 + Math.random() * 900)}`, teacherId: `T${Date.now().toString().slice(-6)}`, status: 'Active' };
        db.teachers = [newTeacher, ...db.teachers];
        throw { status: 201, data: newTeacher };
      }
    }

    // ---------------- EXAMS ----------------
    if (url.startsWith('/exams')) {
      if (method === 'get') {
        throw { status: 200, data: db.exams };
      }
      if (method === 'post') {
        const newExam = { ...config.data, id: `EXM${Math.floor(100 + Math.random() * 900)}`, status: 'Scheduled' };
        db.exams = [newExam, ...db.exams];
        throw { status: 201, data: newExam };
      }
    }

    // ---------------- TRANSACTIONS ----------------
    if (url.startsWith('/transactions')) {
      if (method === 'get') {
        throw { status: 200, data: db.transactions };
      }
      if (method === 'post') {
        const newTx = {
          ...config.data,
          id: `TXN${Math.floor(100 + Math.random() * 900)}`,
          receiptNo: `REC-2026-${Math.floor(400 + Math.random() * 600)}`,
          date: new Date().toLocaleString(),
          status: 'Success'
        };
        db.transactions = [newTx, ...db.transactions];
        
        // Update student fee details
        db.students = db.students.map(s => {
          if (s.name.toLowerCase() === newTx.studentName.toLowerCase()) {
            const rem = Math.max(0, s.pendingFees - newTx.amount);
            return {
              ...s,
              pendingFees: rem,
              feeStatus: rem === 0 ? 'Paid' : 'Partial'
            };
          }
          return s;
        });

        throw { status: 201, data: newTx };
      }
    }

    // ---------------- ANNOUNCEMENTS ----------------
    if (url.startsWith('/announcements')) {
      if (method === 'get') {
        throw { status: 200, data: db.announcements };
      }
      if (method === 'post') {
        const newAnn = { ...config.data, id: `ANC${Math.floor(100 + Math.random() * 900)}`, date: new Date().toISOString().split('T')[0] };
        db.announcements = [newAnn, ...db.announcements];
        throw { status: 201, data: newAnn };
      }
    }

    // ---------------- ACTIVITIES ----------------
    if (url.startsWith('/activities')) {
      if (method === 'get') {
        throw { status: 200, data: db.activities };
      }
    }

    // Fallback for unhandled URLs
    return config;
  } catch (mockResponse: any) {
    // We throw a custom mock response object to prevent standard HTTP execution
    // and resolve it cleanly in response interceptor
    return Promise.reject({ isMock: true, ...mockResponse });
  }
});

// Mock Response Handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.isMock) {
      return Promise.resolve({
        data: error.data,
        status: error.status,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
