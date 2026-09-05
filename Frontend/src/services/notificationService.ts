import { NotificationItem, UserRole } from '../types';
import { INITIAL_NOTIFICATIONS } from './mockData';

const NOTIF_STORAGE_KEY = 'koyla_drishti_notifications';

function getStoredNotifications(): NotificationItem[] {
  const data = localStorage.getItem(NOTIF_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
}

export const notificationService = {
  getNotifications(role?: UserRole): NotificationItem[] {
    const all = getStoredNotifications();
    if (!role) return all;
    return all.filter((n) => n.roleTarget === 'all' || n.roleTarget === role);
  },

  markAsRead(id: string): void {
    const list = getStoredNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  },

  markAllAsRead(): void {
    const list = getStoredNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  },

  getUnreadCount(role?: UserRole): number {
    return this.getNotifications(role).filter((n) => !n.read).length;
  }
};
