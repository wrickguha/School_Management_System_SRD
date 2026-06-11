import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Library as LibraryIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { libraryService, studentService } from '../../services/services';

interface Book {
  id: number;
  accession_no: string;
  isbn: string;
  title: string;
  author: string;
  rack: string;
  total_copies: number;
  available_copies: number;
}

interface Issuance {
  id: number;
  book_id: number;
  student_id: number;
  issued_at: string;
  due_date: string;
  returned_at: string | null;
  fine_amount: number;
  book?: Book;
  student?: {
    id: number;
    name: string;
    grade: string;
    section: string;
  };
}

export default function LibraryModule() {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'issuances'>('catalog');
  
  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Forms
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    accession_no: '',
    rack: '',
    total_copies: 1
  });

  const [issueForm, setIssueForm] = useState({
    book_id: '',
    student_id: '',
    due_date: ''
  });

  // Queries
  const { data: books, isLoading: loadingBooks } = useQuery({
    queryKey: ['libraryBooks'],
    queryFn: libraryService.getBooks
  });

  const { data: issuances, isLoading: loadingIssuances } = useQuery({
    queryKey: ['libraryIssuances'],
    queryFn: libraryService.getIssuances
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  // Mutations
  const addBookMutation = useMutation({
    mutationFn: libraryService.addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      setIsBookModalOpen(false);
      setBookForm({ title: '', author: '', isbn: '', accession_no: '', rack: '', total_copies: 1 });
    }
  });

  const issueBookMutation = useMutation({
    mutationFn: libraryService.issueBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryIssuances'] });
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      setIsIssueModalOpen(false);
      setIssueForm({ book_id: '', student_id: '', due_date: '' });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to issue book. Make sure copies are available.');
    }
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBookMutation.mutate({
      ...bookForm,
      accession_no: bookForm.accession_no || `LIB-${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueBookMutation.mutate({
      book_id: Number(issueForm.book_id),
      student_id: Number(issueForm.student_id),
      due_date: issueForm.due_date
    });
  };

  const bookColumns: Column<Book>[] = [
    { header: 'Accession No', accessor: 'accession_no', sortable: true, sortKey: 'accession_no' },
    { header: 'Book Title', accessor: 'title', sortable: true, sortKey: 'title' },
    { header: 'Author', accessor: 'author', sortable: true, sortKey: 'author' },
    { header: 'Rack Code', accessor: 'rack' },
    { header: 'Available Copies', accessor: (r: Book) => `${r.available_copies} / ${r.total_copies}` }
  ];

  const issuanceColumns: Column<Issuance>[] = [
    { header: 'Issuance ID', accessor: (r: Issuance) => `ISS-${String(r.id).padStart(3, '0')}` },
    { header: 'Book Title', accessor: (r: Issuance) => r.book?.title || 'Unknown Title' },
    { header: 'Student Name', accessor: (r: Issuance) => r.student?.name || 'Unknown Student' },
    { header: 'Issued Date', accessor: 'issued_at' },
    { header: 'Due Date', accessor: 'due_date' },
    {
      header: 'Returned',
      accessor: (r: Issuance) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          r.returned_at ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {r.returned_at ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Accrued Fine',
      accessor: (r: Issuance) => (
        <span className={Number(r.fine_amount) > 0 ? 'text-red-500 font-bold' : 'text-slate-400 font-semibold'}>
          ${r.fine_amount}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Library Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage book stocks, virtual shelves, student checkouts, and fine registers.
          </p>
        </div>
        <div className="flex gap-3">
          {activeSubTab === 'catalog' ? (
            <Button variant="primary" size="sm" onClick={() => setIsBookModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Catalog Book
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setIsIssueModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Issue Book
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Book Inventory
        </button>
        <button
          onClick={() => setActiveSubTab('issuances')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'issuances'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Issuance Ledger
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Volumes', val: books?.reduce((acc, b) => acc + b.total_copies, 0) || 0 },
          { label: 'Checked Out', val: issuances?.filter(i => !i.returned_at).length || 0 },
          { label: 'Fine Accrued', val: `$${issuances?.reduce((acc, i) => acc + Number(i.fine_amount), 0) || 0}` }
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <LibraryIcon className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      {activeSubTab === 'catalog' ? (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          {loadingBooks ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ) : (
            <DataTable
              columns={bookColumns}
              data={books || []}
              searchKey="title"
              searchPlaceholder="Search by book title..."
            />
          )}
        </Card>
      ) : (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          {loadingIssuances ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ) : (
            <DataTable
              columns={issuanceColumns}
              data={issuances || []}
              searchKey="id"
              searchPlaceholder="Search by ID..."
            />
          )}
        </Card>
      )}

      {/* Catalog Book Modal */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Catalog New Title">
        <form onSubmit={handleBookSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Book Title</label>
            <input
              type="text"
              required
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              placeholder="e.g. Concepts of Physics Vol 1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author Name</label>
              <input
                type="text"
                required
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                placeholder="Dr. H.C. Verma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ISBN Code</label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                placeholder="978-0553380163"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accession Number</label>
              <input
                type="text"
                value={bookForm.accession_no}
                onChange={(e) => setBookForm({ ...bookForm, accession_no: e.target.value })}
                placeholder="LIB-009488"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rack Code</label>
              <input
                type="text"
                value={bookForm.rack}
                onChange={(e) => setBookForm({ ...bookForm, rack: e.target.value })}
                placeholder="Science Rack C"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Copies</label>
              <input
                type="number"
                required
                min={1}
                value={bookForm.total_copies}
                onChange={(e) => setBookForm({ ...bookForm, total_copies: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={addBookMutation.isPending}>
              Catalog Book
            </Button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Book to Student">
        <form onSubmit={handleIssueSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Book Title</label>
              <select
                value={issueForm.book_id}
                onChange={(e) => setIssueForm({ ...issueForm, book_id: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="">-- Choose Book --</option>
                {books?.filter(b => b.available_copies > 0).map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} (Acc No: {b.accession_no})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Borrowing Student</label>
              <select
                value={issueForm.student_id}
                onChange={(e) => setIssueForm({ ...issueForm, student_id: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="">-- Choose Student --</option>
                {students?.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade}-{s.section})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Return Due Date</label>
            <input
              type="date"
              required
              value={issueForm.due_date}
              onChange={(e) => setIssueForm({ ...issueForm, due_date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={issueBookMutation.isPending}>
              Issue Title
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
