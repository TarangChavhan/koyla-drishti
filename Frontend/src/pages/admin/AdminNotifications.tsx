import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, Trash2, Filter, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';
import { NotificationItem } from '../../types';

export const AdminNotifications: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications('admin');
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = notifications.filter((n) => filter === 'all' || !n.read);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to mark all as read', 'warn');
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Government Administrative Dispatch & Notifications
          </h1>
          <p className="text-xs text-[#728594]">
            Statutory dispatches, inspector submissions, AI high-threat alarms, and compliance deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e9ee] hover:bg-slate-50 text-xs font-semibold text-[#526a79] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-[#18a873]" />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e2e9ee] pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all' ? 'bg-[#126fba] text-white' : 'text-[#728594] hover:bg-slate-100'
            }`}
          >
            All Dispatch ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'unread' ? 'bg-[#126fba] text-white' : 'text-[#728594] hover:bg-slate-100'
            }`}
          >
            Unread Only ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        <div className="divide-y divide-[#e2e9ee]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#728594]">
              No dispatch notifications to display.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex items-start gap-3.5 ${
                  !item.read ? 'bg-[#f4f9fd] font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'alert'
                      ? 'bg-rose-100 text-[#df4d52]'
                      : item.type === 'violation'
                      ? 'bg-amber-100 text-[#d48b17]'
                      : 'bg-blue-100 text-[#126fba]'
                  }`}
                >
                  {item.type === 'alert' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : item.type === 'violation' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-[#152737] truncate">{item.title}</h3>
                    <span className="text-[10px] text-[#728594] shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#526a79] mt-0.5 leading-relaxed">{item.message}</p>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#126fba] shrink-0 mt-2" title="Unread" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
