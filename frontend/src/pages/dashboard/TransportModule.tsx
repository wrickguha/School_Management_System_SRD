import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Database, Bus, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { transportService } from '../../services/services';

interface TransportBusEntity {
  id: number;
  bus_number: string;
  route: string;
  driver_name: string;
  driver_phone: string;
  driver_license: string;
  gps_active: boolean;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export default function TransportModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    bus_number: '',
    route: '',
    driver_name: '',
    driver_phone: '',
    driver_license: ''
  });

  // Queries
  const { data: buses, isLoading } = useQuery({
    queryKey: ['transport'],
    queryFn: transportService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: transportService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport'] });
      setIsOpen(false);
      setForm({ bus_number: '', route: '', driver_name: '', driver_phone: '', driver_license: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      gps_active: true,
      status: 'Active' as any
    });
  };

  const columns: Column<TransportBusEntity>[] = [
    { header: 'Bus Number', accessor: 'bus_number', sortable: true, sortKey: 'bus_number' },
    { header: 'Route Allocation', accessor: 'route', sortable: true, sortKey: 'route' },
    { header: 'Driver Name', accessor: 'driver_name', sortable: true, sortKey: 'driver_name' },
    { header: 'Driver Phone', accessor: 'driver_phone' },
    {
      header: 'GPS Signal',
      accessor: (r: TransportBusEntity) => (
        <span className="text-school-green font-bold flex items-center gap-1.5">
          {r.gps_active ? (
            <>
              <span className="h-2 w-2 rounded-full bg-school-green animate-ping" />
              <span>Active Signal</span>
            </>
          ) : (
            <span className="text-slate-400">Offline</span>
          )}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (r: TransportBusEntity) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          r.status === 'Active' ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {r.status || 'Active'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Transport Fleet</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Monitor school bus routes, driver licensing registers, and live GPS signals.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Register Bus
        </Button>
      </div>

      {/* Interactive GPS Map Simulator & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Fleet KPIs */}
        <div className="lg:col-span-4 space-y-6">
          {[
            { label: 'Active Buses', val: buses?.filter(b => b.status === 'Active').length || 0, icon: Bus },
            { label: 'Total Routes Covered', val: buses?.length || 0, icon: MapPin },
            { label: 'GPS Live Links', val: buses?.filter(b => b.gps_active).length || 0, icon: Database }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                    {stat.val}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live GPS SVG simulated Map */}
        <div className="lg:col-span-8">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-widest">Active GPS Fleet map (Real-Time Simulator)</span>
              <span className="px-2 py-0.5 bg-school-greenLight text-school-green text-[10px] font-bold rounded-full">LIVE FEED</span>
            </div>
            
            <div className="relative h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Connected routes and floating bus icons */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40 180 Q 200 40, 360 180 T 680 180" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8,8" className="dark:stroke-slate-800" />
                <path d="M 40 180 Q 200 40, 360 180 T 680 180" fill="none" stroke="#0A4D8C" strokeWidth="4" strokeDasharray="15,200" strokeDashoffset="0" className="animate-dash-move" />
                
                <circle cx="40" cy="180" r="6" fill="#7B1E3A" />
                <circle cx="360" cy="180" r="6" fill="#138D75" />
                <circle cx="680" cy="180" r="6" fill="#7B1E3A" />
              </svg>

              {/* Float indicators representing Buses */}
              <div className="absolute top-12 left-1/4 flex items-center gap-1.5 px-3 py-1 bg-school-blue text-white text-xs font-bold rounded-full shadow animate-bounce">
                <Bus className="h-3.5 w-3.5" />
                <span>Bus 01 (Alice Ward)</span>
              </div>

              <div className="absolute top-28 left-2/3 flex items-center gap-1.5 px-3 py-1 bg-school-green text-white text-xs font-bold rounded-full shadow animate-float-y">
                <Bus className="h-3.5 w-3.5" />
                <span>Bus 02</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mt-4">
              <span>Map Refresh Cycle: 2s</span>
              <span className="text-school-blue font-bold">All active routes synchronized</span>
            </div>
          </Card>
        </div>

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
            data={buses || []}
            searchKey="bus_number"
            searchPlaceholder="Search by bus number..."
          />
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Fleet Vehicle">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bus Number</label>
              <input
                type="text"
                required
                value={form.bus_number}
                onChange={(e) => setForm({ ...form, bus_number: e.target.value })}
                placeholder="e.g. BUS-2026-A1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Route Allocation</label>
              <input
                type="text"
                required
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                placeholder="e.g. Sector 62 Noida to Campus"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Driver Name</label>
              <input
                type="text"
                required
                value={form.driver_name}
                onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
                placeholder="e.g. Michael Scott"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Driver Phone</label>
              <input
                type="tel"
                required
                value={form.driver_phone}
                onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
                placeholder="+1-555-0301"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Driver License</label>
              <input
                type="text"
                required
                value={form.driver_license}
                onChange={(e) => setForm({ ...form, driver_license: e.target.value })}
                placeholder="DL-993848-A"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Register Bus
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
