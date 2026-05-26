/**
 * Core TypeScript Models for School Management System (ERP)
 * Designed to mirror Laravel Eloquent models and REST API payloads
 */

export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'librarian'
  | 'transport_manager'
  | 'hr_reception';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  phone?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

// Student & Admission Models
export interface Student {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  email?: string;
  phone?: string;
  address?: string;
  admissionDate: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  parentId?: string;
  parentName?: string;
  status: 'active' | 'suspended' | 'graduated' | 'inactive';
}

export interface AdmissionRequest {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  classId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  requestDate: string;
}

// Faculty & Staff Models
export interface Staff {
  id: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  role: UserRole;
  joiningDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
}

// Academics Models
export interface Classroom {
  id: string;
  name: string; // e.g. Grade 10
  sections: string[]; // e.g. ["A", "B"]
}

export interface Section {
  id: string;
  classId: string;
  name: string; // e.g. A
  roomNo?: string;
}

export interface Subject {
  id: string;
  name: string; // e.g. Mathematics
  code: string; // e.g. MATH101
  type: 'theory' | 'practical' | 'both';
}

export interface TimetableSlot {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number; // 1 = Monday, 5 = Friday
  startTime: string; // "09:00"
  endTime: string;   // "09:45"
  roomNo: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName?: string;
  rollNo?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  remarks?: string;
}

export interface Homework {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentUrl?: string;
  submissionsCount?: number;
}

export interface Exam {
  id: string;
  name: string; // e.g. Midterm 2026
  classId: string;
  subjectId: string;
  subjectName: string;
  examDate: string;
  maxMarks: number;
  passingMarks: number;
}

export interface GradeBookEntry {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  marksObtained: number;
  remarks?: string;
  status: 'published' | 'draft';
}

export interface ReportCard {
  studentId: string;
  studentName: string;
  className: string;
  sectionName: string;
  examName: string;
  grades: {
    subjectId: string;
    subjectName: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
    remarks: string;
  }[];
  percentage: number;
  resultStatus: 'Passed' | 'Failed' | 'Held';
}

// Finance Models
export interface FeeReceipt {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  amountPaid: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'online';
  paymentDate: string;
  feeType: 'Tuition' | 'Admission' | 'Transport' | 'Exam' | 'Library';
  status: 'paid' | 'partial' | 'unpaid';
  concession?: number;
}

export interface FeeStructure {
  id: string;
  className: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  transportFee: number;
}

// Logistics Models
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available: number;
  rackLocation: string;
}

export interface BookIssueLog {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string; // student or staff
  borrowerName: string;
  borrowerRole: 'student' | 'teacher';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount?: number;
  status: 'issued' | 'returned' | 'overdue';
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: 'active' | 'maintenance';
}

export interface TransportRoute {
  id: string;
  routeName: string; // e.g. Route A - North City
  vehicleId: string;
  vehicleNo: string;
  stops: string[];
  monthlyFee: number;
}

// Admin & HR Models
export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  leaveType: 'Casual' | 'Sick' | 'Maternity' | 'Earned';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverName?: string;
}

export interface NoticeBoardItem {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedDate: string;
  targetRole: 'all' | UserRole[];
  attachmentUrl?: string;
}
