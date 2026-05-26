import { TimetableSlot, Attendance, Homework, Exam, GradeBookEntry } from '../types';
import { apiClient } from './apiClient';

const MOCK_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sb-1', subjectName: 'Potions', teacherId: 'usr-3', teacherName: 'Severus Snape', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', roomNo: 'Dungeon 5' },
  { id: 'tt-2', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sb-2', subjectName: 'Transfiguration', teacherId: 'usr-2', teacherName: 'Minerva McGonagall', dayOfWeek: 1, startTime: '10:15', endTime: '11:15', roomNo: 'Room 1B' },
  { id: 'tt-3', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sb-3', subjectName: 'Defence Against the Dark Arts', teacherId: 'usr-4', teacherName: 'Remus Lupin', dayOfWeek: 1, startTime: '11:30', endTime: '12:30', roomNo: 'Classroom 3C' }
];

const MOCK_ATTENDANCE: Attendance[] = [
  { id: 'att-1', studentId: 'std-1', studentName: 'Harry Potter', rollNo: '101', date: '2026-05-27', status: 'present' },
  { id: 'att-2', studentId: 'std-2', studentName: 'Hermione Granger', rollNo: '102', date: '2026-05-27', status: 'present' },
  { id: 'att-3', studentId: 'std-3', studentName: 'Ronald Weasley', rollNo: '103', date: '2026-05-27', status: 'late', remarks: 'Missed the moving staircase' },
  { id: 'att-4', studentId: 'std-4', studentName: 'Draco Malfoy', rollNo: '104', date: '2026-05-27', status: 'absent' }
];

const MOCK_HOMEWORK: Homework[] = [
  { id: 'hw-1', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sb-1', subjectName: 'Potions', teacherId: 'usr-3', title: 'Shrinking Solution Essay', description: 'Write a 12-inch parchment analysis on the ingredients and chemical stability of the Shrinking Solution, focusing on Shrivelfig juice.', assignedDate: '2026-05-25', dueDate: '2026-06-01', submissionsCount: 3 },
  { id: 'hw-2', classId: 'cls-10', sectionId: 'sec-10a', subjectId: 'sb-2', subjectName: 'Transfiguration', teacherId: 'usr-2', title: 'Teapot to Gerbil Practicum', description: 'Practice switching spell gestures. Keep focus on tail length and whisker properties.', assignedDate: '2026-05-26', dueDate: '2026-05-30', submissionsCount: 1 }
];

const MOCK_EXAMS: Exam[] = [
  { id: 'ex-1', name: 'O.W.L. Mock Exams 2026', classId: 'cls-10', subjectId: 'sb-1', subjectName: 'Potions', examDate: '2026-06-10', maxMarks: 100, passingMarks: 50 },
  { id: 'ex-2', name: 'O.W.L. Mock Exams 2026', classId: 'cls-10', subjectId: 'sb-3', subjectName: 'Defence Against the Dark Arts', examDate: '2026-06-12', maxMarks: 100, passingMarks: 55 }
];

const MOCK_GRADEBOOK: GradeBookEntry[] = [
  { id: 'gb-1', examId: 'ex-1', studentId: 'std-1', studentName: 'Harry Potter', rollNo: '101', marksObtained: 82, remarks: 'Excellent practical work, theory acceptable', status: 'published' },
  { id: 'gb-2', examId: 'ex-1', studentId: 'std-2', studentName: 'Hermione Granger', rollNo: '102', marksObtained: 99, remarks: 'Outstanding score, flawless execution', status: 'published' },
  { id: 'gb-3', examId: 'ex-1', studentId: 'std-3', studentName: 'Ronald Weasley', rollNo: '103', marksObtained: 68, remarks: 'Acceptable performance, needs theory review', status: 'draft' }
];

class AcademicService {
  constructor() {
    apiClient.setMockData('/api/timetable', MOCK_TIMETABLE);
    apiClient.setMockData('/api/attendance', MOCK_ATTENDANCE);
    apiClient.setMockData('/api/homework', MOCK_HOMEWORK);
    apiClient.setMockData('/api/exams', MOCK_EXAMS);
    apiClient.setMockData('/api/gradebook', MOCK_GRADEBOOK);
  }

  // Timetabling
  async getTimetable(classId?: string, sectionId?: string): Promise<TimetableSlot[]> {
    // GET /api/timetable
    return apiClient.get<TimetableSlot[]>('/api/timetable');
  }

  // Attendance tracker
  async getAttendance(date: string, classId?: string, sectionId?: string): Promise<Attendance[]> {
    // GET /api/attendance?date=...
    const all = await apiClient.get<Attendance[]>('/api/attendance');
    return all.filter(a => a.date === date);
  }

  async markAttendance(attendanceList: Attendance[]): Promise<Attendance[]> {
    // POST /api/attendance/mark
    localStorage.setItem('mock__api_attendance', JSON.stringify(attendanceList));
    return apiClient.post<Attendance[]>('/api/attendance/mark', attendanceList);
  }

  // Homework
  async getHomework(classId?: string, sectionId?: string): Promise<Homework[]> {
    // GET /api/homework
    return apiClient.get<Homework[]>('/api/homework');
  }

  async createHomework(hw: Omit<Homework, 'id' | 'submissionsCount'>): Promise<Homework> {
    // POST /api/homework
    const homework = await this.getHomework();
    const newHw: Homework = {
      ...hw,
      id: `hw-${homework.length + 1}`,
      submissionsCount: 0,
    };
    const updated = [...homework, newHw];
    localStorage.setItem('mock__api_homework', JSON.stringify(updated));
    return apiClient.post<Homework>('/api/homework', newHw);
  }

  // Gradebook and exams
  async getExams(): Promise<Exam[]> {
    // GET /api/exams
    return apiClient.get<Exam[]>('/api/exams');
  }

  async getGradebook(examId: string): Promise<GradeBookEntry[]> {
    // GET /api/gradebook?examId=...
    const all = await apiClient.get<GradeBookEntry[]>('/api/gradebook');
    return all.filter(g => g.examId === examId);
  }

  async publishGrades(examId: string, entries: GradeBookEntry[]): Promise<GradeBookEntry[]> {
    // POST /api/exams/marks
    const all = await apiClient.get<GradeBookEntry[]>('/api/gradebook');
    const filtered = all.filter(g => g.examId !== examId);
    const updated = [...filtered, ...entries];
    localStorage.setItem('mock__api_gradebook', JSON.stringify(updated));
    return apiClient.post<GradeBookEntry[]>('/api/exams/marks', entries);
  }
}

export const academicService = new AcademicService();
