import { Book, BookIssueLog, Vehicle, TransportRoute } from '../types';
import { apiClient } from './apiClient';

const MOCK_BOOKS: Book[] = [
  { id: 'bk-1', title: 'The Standard Book of Spells, Grade 4', author: 'Miranda Goshawk', isbn: '978-0747515', category: 'Spells', quantity: 10, available: 8, rackLocation: 'Aisles 4, Row B' },
  { id: 'bk-2', title: 'A History of Magic', author: 'Bathilda Bagshot', isbn: '978-0747516', category: 'History', quantity: 5, available: 4, rackLocation: 'Aisles 1, Row A' },
  { id: 'bk-3', title: 'Advanced Potion-Making', author: 'Libatius Borage', isbn: '978-0747517', category: 'Potions', quantity: 3, available: 0, rackLocation: 'Restricted Section' }
];

const MOCK_ISSUE_LOGS: BookIssueLog[] = [
  { id: 'log-1', bookId: 'bk-1', bookTitle: 'The Standard Book of Spells, Grade 4', borrowerId: 'std-1', borrowerName: 'Harry Potter', borrowerRole: 'student', issueDate: '2026-05-10', dueDate: '2026-05-24', status: 'overdue', fineAmount: 10 },
  { id: 'log-2', bookId: 'bk-3', bookTitle: 'Advanced Potion-Making', borrowerId: 'std-2', borrowerName: 'Hermione Granger', borrowerRole: 'student', issueDate: '2026-05-18', dueDate: '2026-06-01', status: 'issued' }
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'vh-1', vehicleNo: 'HOG-EXP-5972', driverName: 'Hogwarts Express Conductor', driverPhone: '555-5972', capacity: 150, status: 'active' },
  { id: 'vh-2', vehicleNo: 'FLY-CAR-7990', driverName: 'Arthur Weasley', driverPhone: '555-7990', capacity: 5, status: 'maintenance' }
];

const MOCK_ROUTES: TransportRoute[] = [
  { id: 'rt-1', routeName: 'London King\'s Cross to Hogsmeade', vehicleId: 'vh-1', vehicleNo: 'HOG-EXP-5972', stops: ['London', 'Hertfordshire', 'Yorkshire', 'Hogsmeade Station'], monthlyFee: 120 },
  { id: 'rt-2', routeName: 'Hogsmeade Village Shuttle', vehicleId: 'vh-2', vehicleNo: 'FLY-CAR-7990', stops: ['Hogsmeade Station', 'Three Broomsticks', 'Hogwarts Gates'], monthlyFee: 40 }
];

class LogisticsService {
  constructor() {
    apiClient.setMockData('/api/library/books', MOCK_BOOKS);
    apiClient.setMockData('/api/library/logs', MOCK_ISSUE_LOGS);
    apiClient.setMockData('/api/transport/vehicles', MOCK_VEHICLES);
    apiClient.setMockData('/api/transport/routes', MOCK_ROUTES);
  }

  // Library
  async getBooks(): Promise<Book[]> {
    return apiClient.get<Book[]>('/api/library/books');
  }

  async getBookIssueLogs(): Promise<BookIssueLog[]> {
    return apiClient.get<BookIssueLog[]>('/api/library/logs');
  }

  async issueBook(bookId: string, borrowerId: string, borrowerName: string, borrowerRole: 'student' | 'teacher'): Promise<BookIssueLog> {
    const books = await this.getBooks();
    const bIdx = books.findIndex(b => b.id === bookId);
    if (bIdx === -1 || books[bIdx].available <= 0) throw new Error('Book not available');

    books[bIdx].available -= 1;
    localStorage.setItem('mock__api_library_books', JSON.stringify(books));

    const logs = await this.getBookIssueLogs();
    const newLog: BookIssueLog = {
      id: `log-${logs.length + 1}`,
      bookId,
      bookTitle: books[bIdx].title,
      borrowerId,
      borrowerName,
      borrowerRole,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days
      status: 'issued'
    };
    
    const updatedLogs = [...logs, newLog];
    localStorage.setItem('mock__api_library_logs', JSON.stringify(updatedLogs));
    return apiClient.post<BookIssueLog>('/api/library/logs', newLog);
  }

  async returnBook(logId: string): Promise<BookIssueLog> {
    const logs = await this.getBookIssueLogs();
    const idx = logs.findIndex(l => l.id === logId);
    if (idx === -1) throw new Error('Log not found');

    const log = logs[idx];
    log.status = 'returned';
    log.returnDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('mock__api_library_logs', JSON.stringify(logs));

    const books = await this.getBooks();
    const bIdx = books.findIndex(b => b.id === log.bookId);
    if (bIdx !== -1) {
      books[bIdx].available += 1;
      localStorage.setItem('mock__api_library_books', JSON.stringify(books));
    }

    return apiClient.post<BookIssueLog>(`/api/library/logs/${logId}/return`, log);
  }

  // Transport
  async getVehicles(): Promise<Vehicle[]> {
    return apiClient.get<Vehicle[]>('/api/transport/vehicles');
  }

  async getTransportRoutes(): Promise<TransportRoute[]> {
    return apiClient.get<TransportRoute[]>('/api/transport/routes');
  }
}

export const logisticsService = new LogisticsService();
