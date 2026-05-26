import { FeeReceipt } from '../types';
import { apiClient } from './apiClient';

const MOCK_RECEIPTS: FeeReceipt[] = [
  { id: 'rec-1', invoiceNo: 'INV2026101', studentId: 'std-1', studentName: 'Harry Potter', className: 'Grade 10', amountPaid: 1500, paymentMethod: 'online', paymentDate: '2026-05-10', feeType: 'Tuition', status: 'paid' },
  { id: 'rec-2', invoiceNo: 'INV2026102', studentId: 'std-2', studentName: 'Hermione Granger', className: 'Grade 10', amountPaid: 1500, paymentMethod: 'bank_transfer', paymentDate: '2026-05-11', feeType: 'Tuition', status: 'paid' },
  { id: 'rec-3', invoiceNo: 'INV2026103', studentId: 'std-3', studentName: 'Ronald Weasley', className: 'Grade 10', amountPaid: 500, paymentMethod: 'cash', paymentDate: '2026-05-12', feeType: 'Tuition', status: 'partial', concession: 1000 },
  { id: 'rec-4', invoiceNo: 'INV2026104', studentId: 'std-4', studentName: 'Draco Malfoy', className: 'Grade 10', amountPaid: 2000, paymentMethod: 'card', paymentDate: '2026-05-14', feeType: 'Tuition', status: 'paid' }
];

class FinanceService {
  constructor() {
    apiClient.setMockData('/api/fees/receipts', MOCK_RECEIPTS);
  }

  async getFeeReceipts(): Promise<FeeReceipt[]> {
    // GET /api/fees/receipts
    return apiClient.get<FeeReceipt[]>('/api/fees/receipts');
  }

  async createFeeReceipt(receipt: Omit<FeeReceipt, 'id' | 'invoiceNo'>): Promise<FeeReceipt> {
    // POST /api/fees/pay
    const receipts = await this.getFeeReceipts();
    const newReceipt: FeeReceipt = {
      ...receipt,
      id: `rec-${receipts.length + 1}`,
      invoiceNo: `INV2026${100 + receipts.length + 1}`,
    };
    const updated = [...receipts, newReceipt];
    localStorage.setItem('mock__api_fees_receipts', JSON.stringify(updated));
    return apiClient.post<FeeReceipt>('/api/fees/pay', newReceipt);
  }

  async getOutstandingFeesSummary() {
    // GET /api/fees/dues
    const receipts = await this.getFeeReceipts();
    let totalCollected = 0;
    let totalConcession = 0;
    
    receipts.forEach(r => {
      totalCollected += r.amountPaid;
      totalConcession += r.concession || 0;
    });

    const totalInvoiced = 12000; // Mock target for whole term
    const totalPending = totalInvoiced - totalCollected - totalConcession;

    return {
      totalInvoiced,
      totalCollected,
      totalPending,
      recoveryRate: Math.round((totalCollected / (totalInvoiced - totalConcession)) * 100)
    };
  }
}

export const financeService = new FinanceService();
