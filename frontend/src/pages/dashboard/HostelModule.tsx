import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Home as HomeIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { hostelService } from '../../services/services';

interface HostelRoom {
  id: number;
  room_no: string;
  block: string;
  type: string;
  capacity: number;
  occupied: number;
  rent_per_term: number;
}

export default function HostelModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    room_no: '',
    block: '',
    type: '2-Bed Sharing',
    capacity: 2,
    rent_per_term: 1200
  });

  // Queries
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['hostel'],
    queryFn: hostelService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: hostelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel'] });
      setIsOpen(false);
      setForm({ room_no: '', block: '', type: '2-Bed Sharing', capacity: 2, rent_per_term: 1200 });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const columns: Column<HostelRoom>[] = [
    { header: 'Room No', accessor: 'room_no', sortable: true, sortKey: 'room_no' },
    { header: 'Hostel Block', accessor: 'block', sortable: true, sortKey: 'block' },
    { header: 'Room Type', accessor: 'type' },
    { header: 'Rent Charge / Term', accessor: (r: HostelRoom) => `₹${r.rent_per_term}` },
    { header: 'Capacity / Occupancy', accessor: (r: HostelRoom) => `${r.occupied} / ${r.capacity} Beds` },
    {
      header: 'Vacancy Status',
      accessor: (r: HostelRoom) => {
        const vacant = r.capacity - r.occupied;
        return (
          <span className={`font-bold ${vacant > 0 ? 'text-school-blue' : 'text-school-maroon'}`}>
            {vacant > 0 ? `${vacant} Vacancy` : 'No Vacancies'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hostel Rooms</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Audit housing capacity, block vacancies, and student rent logs.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Allocate Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Hostel Capacity', val: `${rooms?.reduce((acc, r) => acc + r.capacity, 0) || 0} Beds` },
          { label: 'Occupied Beds', val: `${rooms?.reduce((acc, r) => acc + r.occupied, 0) || 0} Occupied` },
          { label: 'Available Rooms', val: `${rooms?.filter(r => r.capacity > r.occupied).length || 0} Vacant` }
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <HomeIcon className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={rooms || []}
            searchKey="room_no"
            searchPlaceholder="Search by room no..."
          />
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Catalog Hostel Room">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Room Number</label>
              <input
                type="text"
                required
                value={form.room_no}
                onChange={(e) => setForm({ ...form, room_no: e.target.value })}
                placeholder="e.g. H-102"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hostel Block</label>
              <input
                type="text"
                required
                value={form.block}
                onChange={(e) => setForm({ ...form, block: e.target.value })}
                placeholder="e.g. Aryabhata Block-A"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Room Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="2-Bed Sharing">2-Bed Sharing</option>
                <option value="4-Bed Sharing">4-Bed Sharing</option>
                <option value="Single Room">Single Room</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sharing Capacity</label>
              <input
                type="number"
                required
                min={1}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rent Per Term (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={form.rent_per_term}
                onChange={(e) => setForm({ ...form, rent_per_term: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Allocate Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
