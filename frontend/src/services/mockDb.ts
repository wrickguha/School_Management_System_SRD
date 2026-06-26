export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  rollNo: string;
  photo?: string;
  grade: string;
  section: string;
  gender: string;
  dob: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  bloodGroup: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  attendanceRate: number;
  feeStatus: 'Paid' | 'Partial' | 'Unpaid';
  pendingFees: number;
  totalFees: number;
  academicPerformance: number; // percentage
  documents: { name: string; type: string; status: 'Verified' | 'Pending' }[];
}

export interface Teacher {
  id: string;
  name: string;
  teacherId: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  classes: string[]; // e.g., ["Grade 10-A", "Grade 9-B"]
  subjects: string[];
  salary: number;
}

export interface Exam {
  id: string;
  title: string;
  grade: string;
  subject: string;
  date: string;
  time: string;
  maxMarks: number;
  status: 'Scheduled' | 'Completed' | 'Published';
}

export interface FeeTransaction {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  paymentMode: 'Card' | 'Cash' | 'Bank Transfer' | 'UPI';
  date: string;
  receiptNo: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  target: 'All' | 'Teachers' | 'Parents' | 'Students';
  postedBy: string;
}

// Initial mockup data
export const initialStudents: Student[] = [
  {
    id: 'STU001',
    name: 'Aarav Sharma',
    admissionNo: 'ADM2024091',
    rollNo: '01',
    grade: 'Grade 10',
    section: 'A',
    gender: 'Male',
    dob: '2010-04-12',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'ramesh.sharma@example.com',
    address: 'Flat 402, Royal Residency, Sector 62, Noida',
    bloodGroup: 'O+',
    admissionDate: '2024-04-05',
    status: 'Active',
    attendanceRate: 94.5,
    feeStatus: 'Paid',
    pendingFees: 0,
    totalFees: 45000,
    academicPerformance: 88.5,
    documents: [
      { name: 'Birth Certificate', type: 'PDF', status: 'Verified' },
      { name: 'Transfer Certificate', type: 'PDF', status: 'Verified' },
      { name: 'Previous Report Card', type: 'Image', status: 'Verified' }
    ]
  },
  {
    id: 'STU002',
    name: 'Ananya Iyer',
    admissionNo: 'ADM2024022',
    rollNo: '02',
    grade: 'Grade 10',
    section: 'A',
    gender: 'Female',
    dob: '2010-09-18',
    parentName: 'Srinivasan Iyer',
    parentPhone: '+91 98765 43211',
    parentEmail: 'srinivasan.iyer@example.com',
    address: 'B-12, Green Glen Layout, Bangalore',
    bloodGroup: 'A+',
    admissionDate: '2024-04-06',
    status: 'Active',
    attendanceRate: 98.2,
    feeStatus: 'Partial',
    pendingFees: 15000,
    totalFees: 45000,
    academicPerformance: 94.0,
    documents: [
      { name: 'Birth Certificate', type: 'PDF', status: 'Verified' },
      { name: 'Transfer Certificate', type: 'PDF', status: 'Pending' }
    ]
  },
  {
    id: 'STU003',
    name: 'Kabir Mehta',
    admissionNo: 'ADM2024035',
    rollNo: '03',
    grade: 'Grade 10',
    section: 'B',
    gender: 'Male',
    dob: '2010-11-02',
    parentName: 'Alok Mehta',
    parentPhone: '+91 98765 43212',
    parentEmail: 'alok.mehta@example.com',
    address: 'Shanti Kunj, Link Road, Mumbai',
    bloodGroup: 'B+',
    admissionDate: '2024-04-10',
    status: 'Active',
    attendanceRate: 85.0,
    feeStatus: 'Unpaid',
    pendingFees: 45000,
    totalFees: 45000,
    academicPerformance: 72.3,
    documents: [
      { name: 'Birth Certificate', type: 'PDF', status: 'Verified' }
    ]
  },
  {
    id: 'STU004',
    name: 'Meera Nair',
    admissionNo: 'ADM2024041',
    rollNo: '04',
    grade: 'Grade 9',
    section: 'A',
    gender: 'Female',
    dob: '2011-01-22',
    parentName: 'Gopal Nair',
    parentPhone: '+91 98765 43213',
    parentEmail: 'gopal.nair@example.com',
    address: 'C-204, Alpine Heights, Kochi',
    bloodGroup: 'AB+',
    admissionDate: '2024-04-12',
    status: 'Active',
    attendanceRate: 92.0,
    feeStatus: 'Paid',
    pendingFees: 0,
    totalFees: 42000,
    academicPerformance: 85.1,
    documents: [
      { name: 'Birth Certificate', type: 'PDF', status: 'Verified' },
      { name: 'Previous Report Card', type: 'PDF', status: 'Verified' }
    ]
  },
  {
    id: 'STU005',
    name: 'Rohan Deshmukh',
    admissionNo: 'ADM2024058',
    rollNo: '05',
    grade: 'Grade 9',
    section: 'B',
    gender: 'Male',
    dob: '2011-07-05',
    parentName: 'Sanjay Deshmukh',
    parentPhone: '+91 98765 43214',
    parentEmail: 'sanjay.deshmukh@example.com',
    address: 'D-50, Viman Nagar, Pune',
    bloodGroup: 'O-',
    admissionDate: '2024-04-15',
    status: 'Inactive',
    attendanceRate: 64.0,
    feeStatus: 'Unpaid',
    pendingFees: 42000,
    totalFees: 42000,
    academicPerformance: 55.4,
    documents: []
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'TCH001',
    name: 'Dr. Sunita Rao',
    teacherId: 'T202008',
    email: 'sunita.rao@school.edu',
    phone: '+91 99887 76655',
    department: 'Science',
    qualification: 'Ph.D. in Physics, B.Ed.',
    joiningDate: '2020-06-15',
    status: 'Active',
    classes: ['Grade 10-A', 'Grade 9-A'],
    subjects: ['Physics', 'General Science'],
    salary: 65000
  },
  {
    id: 'TCH002',
    name: 'Mr. Rajesh Verma',
    teacherId: 'T202102',
    email: 'rajesh.verma@school.edu',
    phone: '+91 99887 76656',
    department: 'Mathematics',
    qualification: 'M.Sc. in Mathematics, B.Ed.',
    joiningDate: '2021-02-01',
    status: 'Active',
    classes: ['Grade 10-A', 'Grade 10-B', 'Grade 9-B'],
    subjects: ['Algebra', 'Geometry', 'Calculus'],
    salary: 58000
  },
  {
    id: 'TCH003',
    name: 'Mrs. Priya Sen',
    teacherId: 'T202209',
    email: 'priya.sen@school.edu',
    phone: '+91 99887 76657',
    department: 'English',
    qualification: 'M.A. in English Literature, M.Ed.',
    joiningDate: '2022-09-10',
    status: 'Active',
    classes: ['Grade 9-A', 'Grade 9-B'],
    subjects: ['English Literature', 'Grammar'],
    salary: 55000
  }
];

export const initialExams: Exam[] = [
  {
    id: 'EXM001',
    title: 'First Terminal Examination',
    grade: 'Grade 10',
    subject: 'Mathematics',
    date: '2026-06-15',
    time: '09:00 AM - 12:00 PM',
    maxMarks: 100,
    status: 'Scheduled'
  },
  {
    id: 'EXM002',
    title: 'First Terminal Examination',
    grade: 'Grade 10',
    subject: 'Physics',
    date: '2026-06-17',
    time: '09:00 AM - 12:00 PM',
    maxMarks: 100,
    status: 'Scheduled'
  },
  {
    id: 'EXM003',
    title: 'Unit Test I',
    grade: 'Grade 9',
    subject: 'English',
    date: '2026-05-10',
    time: '10:00 AM - 11:30 AM',
    maxMarks: 50,
    status: 'Published'
  }
];

export const initialTransactions: FeeTransaction[] = [
  {
    id: 'TXN001',
    studentName: 'Aarav Sharma',
    grade: 'Grade 10',
    amount: 45000,
    paymentMode: 'Bank Transfer',
    date: '2026-05-02 10:30 AM',
    receiptNo: 'REC-2026-402',
    status: 'Success'
  },
  {
    id: 'TXN002',
    studentName: 'Ananya Iyer',
    grade: 'Grade 10',
    amount: 30000,
    paymentMode: 'Card',
    date: '2026-05-04 02:15 PM',
    receiptNo: 'REC-2026-419',
    status: 'Success'
  },
  {
    id: 'TXN003',
    studentName: 'Meera Nair',
    grade: 'Grade 9',
    amount: 42000,
    paymentMode: 'UPI',
    date: '2026-05-06 09:45 AM',
    receiptNo: 'REC-2026-425',
    status: 'Success'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ANC001',
    title: 'Summer Vacation Notification',
    content: 'The school will remain closed for summer vacation from June 20th to July 25th. Online doubt clearing classes will be held weekly.',
    date: '2026-06-01',
    target: 'All',
    postedBy: 'Principal'
  },
  {
    id: 'ANC002',
    title: 'Teacher-Parent Meeting (PTM)',
    content: 'Monthly PTM is scheduled for Grade 9 & 10 on June 12th. Please adhere to the slots allocated to avoid crowding.',
    date: '2026-06-02',
    target: 'Parents',
    postedBy: 'Admin Office'
  },
  {
    id: 'ANC003',
    title: 'Syllabus Coverage Review',
    content: 'All class teachers must submit their syllabus coverage report for Term-I by end of this week.',
    date: '2026-06-03',
    target: 'Teachers',
    postedBy: 'Academic Director'
  }
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'ACT001',
    user: 'Admin (System)',
    role: 'Administrator',
    action: 'Generated monthly financial summary for May 2026',
    time: '2 hours ago',
    type: 'success'
  },
  {
    id: 'ACT002',
    user: 'Mr. Rajesh Verma',
    role: 'Teacher',
    action: 'Uploaded Algebra homework assignment for Grade 10-A',
    time: '4 hours ago',
    type: 'info'
  },
  {
    id: 'ACT003',
    user: 'Mrs. Priya Sen',
    role: 'Teacher',
    action: 'Marked daily attendance register for Grade 9-B',
    time: '5 hours ago',
    type: 'info'
  },
  {
    id: 'ACT004',
    user: 'Parent of Kabir Mehta',
    role: 'Parent',
    action: 'Submitted query regarding fee payment plan installment',
    time: '1 day ago',
    type: 'warning'
  }
];

// Helper database manager to persist mock operations in SessionStorage
class MockDatabase {
  private getStore<T>(key: string, initial: T[]): T[] {
    const data = sessionStorage.getItem(key);
    if (!data) {
      sessionStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  private setStore<T>(key: string, data: T[]): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  get students(): Student[] {
    return this.getStore('school_erp_students', initialStudents);
  }
  set students(data: Student[]) {
    this.setStore('school_erp_students', data);
  }

  get teachers(): Teacher[] {
    return this.getStore('school_erp_teachers', initialTeachers);
  }
  set teachers(data: Teacher[]) {
    this.setStore('school_erp_teachers', data);
  }

  get exams(): Exam[] {
    return this.getStore('school_erp_exams', initialExams);
  }
  set exams(data: Exam[]) {
    this.setStore('school_erp_exams', data);
  }

  get transactions(): FeeTransaction[] {
    return this.getStore('school_erp_transactions', initialTransactions);
  }
  set transactions(data: FeeTransaction[]) {
    this.setStore('school_erp_transactions', data);
  }

  get announcements(): Announcement[] {
    return this.getStore('school_erp_announcements', initialAnnouncements);
  }
  set announcements(data: Announcement[]) {
    this.setStore('school_erp_announcements', data);
  }

  get activities(): ActivityLog[] {
    return this.getStore('school_erp_activities', initialActivities);
  }
  set activities(data: ActivityLog[]) {
    this.setStore('school_erp_activities', data);
  }
}

export const db = new MockDatabase();
