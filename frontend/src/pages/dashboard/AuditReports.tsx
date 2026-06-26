import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, Filter, BarChart2 } from 'lucide-react';

interface AuditLog {
  id: number;
  user: { id: number; name: string; email: string };
  action: string;
  model_type: string;
  model_id: number;
  description: string;
  ip_address: string;
  created_at: string;
}

interface AuditStats {
  total_actions: number;
  by_action: Record<string, number>;
  by_model: Record<string, number>;
  by_user: Array<{ user_id: number; user_name: string; count: number }>;
}

export default function AuditReports() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch audit logs
  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ['audit-logs', { dateFrom, dateTo, action: actionFilter, user: userFilter, page: currentPage }],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(actionFilter && { action: actionFilter }),
        ...(userFilter && { user_id: userFilter }),
        page: String(currentPage),
        per_page: '50',
      });
      const response = await fetch(`/api/audit-logs?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
  });

  // Fetch audit statistics
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['audit-statistics', { dateFrom, dateTo }],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      });
      const response = await fetch(`/api/audit-logs/statistics?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(actionFilter && { action: actionFilter }),
        ...(userFilter && { user_id: userFilter }),
      });
      const response = await fetch(`/api/audit-logs/export/csv?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      
      // Download CSV
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data.csv_data));
      element.setAttribute('download', data.filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      alert('Failed to export audit logs');
    }
  };

  const stats = statsData?.data as AuditStats | undefined;
  const logs = logsData?.data as AuditLog[] | undefined;
  const pagination = logsData?.pagination;

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Audit Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Track all system activities and changes for compliance and security.
          </p>
        </div>
        <Button variant="primary" onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Statistics */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Total Actions</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-1">{stats.total_actions}</span>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Create</span>
            <span className="block text-2xl font-extrabold text-school-green mt-1">{stats.by_action?.create || 0}</span>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Update</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-1">{stats.by_action?.update || 0}</span>
          </Card>
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Delete</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-1">{stats.by_action?.delete || 0}</span>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-bold text-school-blue hover:text-school-blue/80"
        >
          <Filter className="h-4 w-4" /> Filters
        </button>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">User ID</label>
              <input
                type="text"
                placeholder="User ID"
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        {loadingLogs ? (
          <div className="text-center py-10">Loading audit logs...</div>
        ) : logs?.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No audit logs found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-850/20">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Model Type</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log: AuditLog) => (
                    <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/40">
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold">{log.user?.name || 'System'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                          log.action === 'create' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                          log.action === 'update' ? 'bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                          log.action === 'delete' ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                          'bg-gray-100 dark:bg-gray-950/20 text-gray-700 dark:text-gray-400'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.model_type}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.description}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-xs text-slate-500">
                  Showing {(pagination.current_page - 1) * pagination.per_page + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} logs
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                    disabled={currentPage === pagination.last_page}
                    className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
