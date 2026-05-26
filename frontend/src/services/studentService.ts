import { Student, AdmissionRequest } from '../types';
import { apiClient } from './apiClient';

const MOCK_STUDENTS: Student[] = [
  { id: 'std-1', admissionNo: 'ADM2026001', rollNo: '101', firstName: 'Harry', lastName: 'Potter', dateOfBirth: '1980-07-31', gender: 'male', email: 'harry@hogwarts.edu', phone: '555-0101', address: '4 Privet Drive, Surrey', admissionDate: '2021-09-01', classId: 'cls-10', className: 'Grade 10', sectionId: 'sec-10a', sectionName: 'A', status: 'active', parentName: 'James Potter', parentId: 'usr-6' },
  { id: 'std-2', admissionNo: 'ADM2026002', rollNo: '102', firstName: 'Hermione', lastName: 'Granger', dateOfBirth: '1979-09-19', gender: 'female', email: 'hermione@hogwarts.edu', phone: '555-0102', address: 'Hampstead, London', admissionDate: '2021-09-01', classId: 'cls-10', className: 'Grade 10', sectionId: 'sec-10a', sectionName: 'A', status: 'active', parentName: 'Dr. Granger' },
  { id: 'std-3', admissionNo: 'ADM2026003', rollNo: '103', firstName: 'Ronald', lastName: 'Weasley', dateOfBirth: '1980-03-01', gender: 'male', email: 'ron@hogwarts.edu', phone: '555-0103', address: 'The Burrow, Devon', admissionDate: '2021-09-01', classId: 'cls-10', className: 'Grade 10', sectionId: 'sec-10b', sectionName: 'B', status: 'active', parentName: 'Arthur Weasley' },
  { id: 'std-4', admissionNo: 'ADM2026004', rollNo: '104', firstName: 'Draco', lastName: 'Malfoy', dateOfBirth: '1980-06-05', gender: 'male', email: 'draco@hogwarts.edu', phone: '555-0104', address: 'Malfoy Manor, Wiltshire', admissionDate: '2021-09-01', classId: 'cls-10', className: 'Grade 10', sectionId: 'sec-10b', sectionName: 'B', status: 'active', parentName: 'Lucius Malfoy' }
];

const MOCK_ADMISSIONS: AdmissionRequest[] = [
  { id: 'adm-req-1', firstName: 'Luna', lastName: 'Lovegood', dateOfBirth: '1981-02-13', gender: 'female', classId: 'cls-9', parentName: 'Xenophilius Lovegood', parentPhone: '555-0909', parentEmail: 'editor@quibbler.com', status: 'pending', requestDate: '2026-05-15' },
  { id: 'adm-req-2', firstName: 'Neville', lastName: 'Longbottom', dateOfBirth: '1980-07-30', gender: 'male', classId: 'cls-10', parentName: 'Augusta Longbottom', parentPhone: '555-0404', parentEmail: 'longbottom@ministry.org', status: 'approved', requestDate: '2026-05-10' }
];

class StudentService {
  constructor() {
    apiClient.setMockData('/api/students', MOCK_STUDENTS);
    apiClient.setMockData('/api/admissions', MOCK_ADMISSIONS);
  }

  // Student SIS Methods
  async getStudents(): Promise<Student[]> {
    // GET /api/students
    return apiClient.get<Student[]>('/api/students');
  }

  async getStudentById(id: string): Promise<Student> {
    // GET /api/students/:id
    const students = await this.getStudents();
    const student = students.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  }

  async createStudent(student: Omit<Student, 'id' | 'admissionNo'>): Promise<Student> {
    // POST /api/students
    const students = await this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `std-${students.length + 1}`,
      admissionNo: `ADM202600${students.length + 1}`,
    };
    const updated = [...students, newStudent];
    localStorage.setItem('mock__api_students', JSON.stringify(updated));
    return apiClient.post<Student>('/api/students', newStudent);
  }

  async updateStudent(id: string, studentData: Partial<Student>): Promise<Student> {
    // PUT /api/students/:id
    const students = await this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    
    const updatedStudent = { ...students[idx], ...studentData };
    students[idx] = updatedStudent;
    localStorage.setItem('mock__api_students', JSON.stringify(students));
    return apiClient.put<Student>(`/api/students/${id}`, updatedStudent);
  }

  async deleteStudent(id: string): Promise<boolean> {
    // DELETE /api/students/:id
    const students = await this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem('mock__api_students', JSON.stringify(filtered));
    await apiClient.delete(`/api/students/${id}`);
    return true;
  }

  // Admissions Funnel Methods
  async getAdmissions(): Promise<AdmissionRequest[]> {
    // GET /api/admissions
    return apiClient.get<AdmissionRequest[]>('/api/admissions');
  }

  async updateAdmissionStatus(id: string, status: AdmissionRequest['status']): Promise<AdmissionRequest> {
    // POST /api/admissions/:id/status
    const admissions = await this.getAdmissions();
    const idx = admissions.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Request not found');
    
    admissions[idx].status = status;
    localStorage.setItem('mock__api_admissions', JSON.stringify(admissions));
    return apiClient.post<AdmissionRequest>(`/api/admissions/${id}/status`, admissions[idx]);
  }
}

export const studentService = new StudentService();
