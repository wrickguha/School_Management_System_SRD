import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900';
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      // Refetch notifications
      // In a real app, you'd use queryClient.invalidateQueries
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 top-12 w-96 max-h-[32rem] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-school-blue" />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-school-blue font-semibold mt-1">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <div className="text-center">
                <div className="animate-spin h-6 w-6 border-2 border-school-blue border-t-transparent rounded-full mx-auto mb-2" />
                <span className="text-xs">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <div className="text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <span className="text-xs">No notifications yet</span>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notif: Notification) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-school-blue shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-2 block">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete notification
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <button className="text-xs font-bold text-school-blue hover:underline">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
