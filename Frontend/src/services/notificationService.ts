import { NotificationItem, UserRole } from '../types';
import { api } from './api';
import { INITIAL_NOTIFICATIONS } from './mockData';

export const notificationService = {
  async getNotifications(role?: UserRole): Promise<NotificationItem[]> {
    try {
      return await api.get<NotificationItem[]>('/notifications');
    } catch {
      if (!role) return INITIAL_NOTIFICATIONS;
      return INITIAL_NOTIFICATIONS.filter((n) => n.roleTarget === 'all' || n.roleTarget === role);
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // offline fallback
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/notifications/read-all');
    } catch {
      // offline fallback
    }
  },

  async getUnreadCount(role?: UserRole): Promise<number> {
    try {
      const res = await api.get<{ unread_count: number }>('/notifications/unread-count');
      return res.unread_count;
    } catch {
      return this.getNotifications(role).then((list) => list.filter((n) => !n.read).length).catch(() => 0);
    }
  }
};
