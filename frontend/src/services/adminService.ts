import { Staff, LeaveRequest, NoticeBoardItem } from '../types';
import { apiClient } from './apiClient';

const MOCK_STAFF: Staff[] = [
  { id: 'stf-1', employeeNo: 'EMP101', firstName: 'Remus', lastName: 'Lupin', email: 'lupin@hogwarts.edu', phone: '555-2020', designation: 'Professor', department: 'Academics', role: 'teacher', joiningDate: '2022-09-01', salary: 3000, status: 'active' },
  { id: 'stf-2', employeeNo: 'EMP102', firstName: 'Pomona', lastName: 'Sprout', email: 'sprout@hogwarts.edu', phone: '555-3030', designation: 'Head of Herbology', department: 'Academics', role: 'hr_reception', joiningDate: '1995-09-01', salary: 4500, status: 'active' },
  { id: 'stf-3', employeeNo: 'EMP103', firstName: 'Rubeus', lastName: 'Hagrid', email: 'hagrid@hogwarts.edu', phone: '555-4040', designation: 'Keeper of Keys', department: 'Operations', role: 'transport_manager', joiningDate: '1993-09-01', salary: 2500, status: 'active' }
];

const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'lv-1', userId: 'usr-4', userName: 'Remus Lupin', userRole: 'teacher', leaveType: 'Sick', startDate: '2026-06-02', endDate: '2026-06-04', reason: 'Feeling under the weather due to full moon cycle.', status: 'pending' },
  { id: 'lv-2', userId: 'usr-10', userName: 'Pomona Sprout', userRole: 'hr_reception', leaveType: 'Casual', startDate: '2026-05-10', endDate: '2026-05-11', reason: 'Tending to greenhouse mandrake re-potting.', status: 'approved', approverName: 'Albus Dumbledore' }
];

const MOCK_NOTICES: NoticeBoardItem[] = [
  { id: 'not-1', title: 'End of Term Feast Schedule', content: 'The end-of-term feast will take place on June 20th at 18:00 in the Great Hall. Attendance is mandatory for all houses.', postedBy: 'Albus Dumbledore', postedDate: '2026-05-24', targetRole: 'all' },
  { id: 'not-2', title: 'Curfew Reminder', content: 'A reminder that students must not wander the corridors after 22:00. Filch will report any curfew breakers directly.', postedBy: 'Minerva McGonagall', postedDate: '2026-05-25', targetRole: ['student', 'parent'] },
  { id: 'not-3', title: 'Grade Book Entry Deadline', content: 'All mid-term final grade drafts must be submitted by Monday, June 8th for review.', postedBy: 'Severus Snape', postedDate: '2026-05-26', targetRole: ['teacher', 'principal'] }
];

class AdminService {
  constructor() {
    apiClient.setMockData('/api/staff', MOCK_STAFF);
    apiClient.setMockData('/api/leaves', MOCK_LEAVES);
    apiClient.setMockData('/api/notices', MOCK_NOTICES);
  }

  // Staff Management
  async getStaff(): Promise<Staff[]> {
    return apiClient.get<Staff[]>('/api/staff');
  }

  // Leaves
  async getLeaves(): Promise<LeaveRequest[]> {
    return apiClient.get<LeaveRequest[]>('/api/leaves');
  }

  async submitLeave(leave: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
    const leaves = await this.getLeaves();
    const newLeave: LeaveRequest = {
      ...leave,
      id: `lv-${leaves.length + 1}`,
      status: 'pending'
    };
    const updated = [...leaves, newLeave];
    localStorage.setItem('mock__api_leaves', JSON.stringify(updated));
    return apiClient.post<LeaveRequest>('/api/leaves', newLeave);
  }

  async updateLeaveStatus(id: string, status: LeaveRequest['status'], approverName: string): Promise<LeaveRequest> {
    const leaves = await this.getLeaves();
    const idx = leaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Request not found');

    leaves[idx].status = status;
    leaves[idx].approverName = approverName;
    localStorage.setItem('mock__api_leaves', JSON.stringify(leaves));
    return apiClient.post<LeaveRequest>(`/api/leaves/${id}/status`, leaves[idx]);
  }

  // Notice Board
  async getNotices(): Promise<NoticeBoardItem[]> {
    return apiClient.get<NoticeBoardItem[]>('/api/notices');
  }

  async postNotice(notice: Omit<NoticeBoardItem, 'id' | 'postedDate'>): Promise<NoticeBoardItem> {
    const notices = await this.getNotices();
    const newNotice: NoticeBoardItem = {
      ...notice,
      id: `not-${notices.length + 1}`,
      postedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...notices, newNotice];
    localStorage.setItem('mock__api_notices', JSON.stringify(updated));
    return apiClient.post<NoticeBoardItem>('/api/notices', newNotice);
  }
}

export const adminService = new AdminService();
