import React, { useState, useEffect } from 'react';
import { Book, BookIssueLog } from '../../types';
import { logisticsService } from '../../services/logisticsService';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/FormFields';
import { SPLINE_SCENES } from '../../config/splineUrls';
import { SplineEmptyState } from '../../components/spline/SplineEmptyState';
import * as Icons from 'lucide-react';

export const LibraryInventory: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [logs, setLogs] = useState<BookIssueLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [selectedBookId, setSelectedBookId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    logisticsService.getBooks().then(data => {
      setBooks(data);
      if (data.length > 0) setSelectedBookId(data[0].id);
    });
    logisticsService.getBookIssueLogs().then(setLogs);
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logisticsService.issueBook(
        selectedBookId,
        'std-manual',
        borrowerName,
        'student'
      );
      setIsOpen(false);
      loadData();
      setBorrowerName('');
    } catch (e: any) {
      alert(e.message || 'Error renting book');
    }
  };

  const handleReturn = async (logId: string) => {
    await logisticsService.returnBook(logId);
    loadData();
  };

  const isLibrarian = user?.role === 'librarian' || user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal';

  const logColumns: Column<BookIssueLog>[] = [
    { key: 'bookTitle', title: 'Book Title', sortable: true },
    { key: 'borrowerName', title: 'Borrower', sortable: true },
    { key: 'borrowerRole', title: 'Role', render: (val) => String(val).toUpperCase() },
    { key: 'issueDate', title: 'Issue Date', sortable: true },
    { key: 'dueDate', title: 'Due Date', sortable: true },
    { key: 'fineAmount', title: 'Fine Dues', render: (val) => val ? `$${val}` : '-' },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'returned' ? 'success' : val === 'issued' ? 'primary' : 'danger'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Return Gate',
      render: (_, row) => {
        if (!isLibrarian) return null;
        if (row.status === 'returned') return <span style={{ color: 'var(--text-tertiary)' }}>Returned</span>;
        return (
          <button 
            className="btn btn-primary"
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            onClick={() => handleReturn(row.id)}
          >
            Check In
          </button>
        );
      }
    }
  ];

  const bookColumns: Column<Book>[] = [
    { key: 'title', title: 'Magical Text Title', sortable: true },
    { key: 'author', title: 'Author' },
    { key: 'isbn', title: 'ISBN Identifier' },
    { key: 'category', title: 'Category' },
    { key: 'quantity', title: 'Total Qty' },
    { key: 'available', title: 'Available Copies' },
    { key: 'rackLocation', title: 'Library Location' }
  ];

  const overdueCount = logs.filter(l => l.status === 'overdue').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Library Catalog & Borrow Registers</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track school textbook collections, lease out books, and log overdue checkouts.</p>
        </div>

        {isLibrarian && (
          <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
            <Icons.BookPlus size={16} /> Issue Book Lease
          </button>
        )}
      </div>

      {/* Show beautiful SplineEmptyState in presentation section when no overdue leases are found */}
      {overdueCount === 0 ? (
        <SplineEmptyState 
          sceneUrl={SPLINE_SCENES.emptyBooks}
          title="No Overdue Books Found"
          description="Great! All active leases are currently compliant and within their scheduled check-in dates."
          fallbackType="book"
          height={200}
        />
      ) : (
        <Card style={{ borderLeft: '4px solid var(--danger)' }}>
          <Card.Body style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'var(--space-md)' }}>
            <Icons.ShieldAlert size={24} color="var(--danger)" />
            <div>
              <strong>Action Required: {overdueCount} lease items are currently overdue!</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Please contact student borrowers or log appropriate fines on check-in.</p>
            </div>
          </Card.Body>
        </Card>
      )}

      <h3>Active Borrow Logs</h3>
      <DataTable columns={logColumns} data={logs} searchKey="bookTitle" searchPlaceholder="Search checked out books..." />

      <h3 style={{ marginTop: 'var(--space-lg)' }}>Book Catalog Inventory</h3>
      <DataTable columns={bookColumns} data={books} searchKey="title" searchPlaceholder="Search catalog titles..." />

      {/* Issue Book Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Check Out Textbook (New Rental Lease)"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleIssueBook}>Complete Checkout</button>
          </>
        }
      >
        <form onSubmit={handleIssueBook} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Select 
            label="Select Book Catalog Title"
            value={selectedBookId}
            onChange={e => setSelectedBookId(e.target.value)}
            options={books.filter(b => b.available > 0).map(b => ({ value: b.id, label: `${b.title} (${b.available} copies left)` }))}
          />
          <Input label="Borrower Name (Student/Staff)" required value={borrowerName} onChange={e => setBorrowerName(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
};
export default LibraryInventory;
