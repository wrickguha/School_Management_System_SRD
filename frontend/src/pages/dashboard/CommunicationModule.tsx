import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Trash2, MessageSquare, Megaphone, Bell, Users, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { announcementService } from '../../services/services';
import apiClient from '../../services/apiClient';

interface Announcement {
  id: number;
  title: string;
  content: string;
  targetAudience: 'All' | 'Parents' | 'Students' | 'Teachers' | 'Staff';
  isSms: boolean;
  publishedAt?: string;
  date: string;
}

export default function CommunicationModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    target_audience: 'All' as 'All' | 'Parents' | 'Students' | 'Teachers' | 'Staff',
    is_sms: false
  });

  // Queries
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: announcementService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiClient.post<Announcement>('/announcements', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsOpen(false);
      setForm({ title: '', content: '', target_audience: 'All', is_sms: false });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/announcements/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const filteredAnnouncements = announcements?.filter(
    (ann) =>
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.content.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const totalSMS = announcements?.filter(a => a.isSms).length || 0;
  const targetStats = announcements?.reduce((acc, a) => {
    acc[a.targetAudience] = (acc[a.targetAudience] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Communication Hub</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Broadcast emergency alerts, school notices, and SMS campaigns to parents and staff.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Send className="h-4 w-4" />}>
          New Broadcast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Global Notices Published', val: `${announcements?.length || 0} Announcements`, icon: Megaphone, color: 'text-school-blue' },
          { label: 'SMS Campaigns Executed', val: `${totalSMS} Campaigns`, icon: MessageSquare, color: 'text-school-green' },
          { label: 'Target Audiences Reached', val: `${Object.keys(targetStats).length || 0} Roles`, icon: Users, color: 'text-amber-500' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                  {stat.val}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center ${stat.color} shrink-0`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Control Filters and Listing */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 max-w-md">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search circulars, SMS tags or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm focus:outline-none w-full text-slate-900 dark:text-white"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((ann) => {
              let tagColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350';
              if (ann.targetAudience === 'Teachers') tagColor = 'bg-school-blue/10 text-school-blue';
              if (ann.targetAudience === 'Parents') tagColor = 'bg-school-green/10 text-school-green';
              if (ann.targetAudience === 'Students') tagColor = 'bg-amber-100 dark:bg-amber-950/20 text-amber-600';

              return (
                <Card key={ann.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${tagColor}`}>
                          {ann.targetAudience}
                        </span>
                        {ann.isSms && (
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center gap-1">
                            <MessageSquare className="h-2.5 w-2.5" /> SMS Sent
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(ann.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight pt-1">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {ann.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5" /> Published Circular
                    </span>
                    <span>{ann.date || ann.publishedAt?.split(' ')[0]}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-350 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No circular notices match your search queries.</p>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Compose Global Broadcast Circular">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notice Title / Subject</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Schedule for Final Examinations 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Recipient Audience</label>
            <select
              value={form.target_audience}
              onChange={(e) => setForm({ ...form, target_audience: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            >
              <option value="All">All Recipients</option>
              <option value="Teachers">Teachers & Faculty</option>
              <option value="Parents">Parents & Guardians</option>
              <option value="Students">Registered Students</option>
              <option value="Staff">Administrative Staff</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message Body Content</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Compose detailed circular details..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_sms"
              checked={form.is_sms}
              onChange={(e) => setForm({ ...form, is_sms: e.target.checked })}
              className="rounded border-slate-350 dark:border-slate-800 bg-slate-50 text-school-blue focus:ring-school-blue"
            />
            <label htmlFor="is_sms" className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer select-none">
              Trigger instant SMS blast notification to mobile phones
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending} leftIcon={<Send className="h-4 w-4" />}>
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
