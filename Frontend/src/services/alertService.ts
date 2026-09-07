import { AIAlert, AlertStatus } from '../types';
import { api } from './api';
import { INITIAL_ALERTS } from './mockData';

export const alertService = {
  async getAllAlerts(): Promise<AIAlert[]> {
    try {
      return await api.get<AIAlert[]>('/alerts');
    } catch {
      return INITIAL_ALERTS;
    }
  },

  async getAlertById(id: string): Promise<AIAlert | undefined> {
    try {
      return await api.get<AIAlert>(`/alerts/${id}`);
    } catch {
      return INITIAL_ALERTS.find((a) => a.id === id);
    }
  },

  async updateAlertStatus(id: string, status: AlertStatus, comments?: string): Promise<AIAlert> {
    try {
      if (status === 'Verified') {
        const res = await api.post<any>(`/alerts/${id}/verify`, {
          officer_note: comments,
          violation_category: 'Safety Compliance',
          deadline_days: 7
        });
        const fullAlert = await this.getAlertById(id);
        return fullAlert || { ...INITIAL_ALERTS[0], status: 'Verified' };
      } else if (status === 'False Positive' || status === 'Rejected') {
        return await api.post<AIAlert>(`/alerts/${id}/reject`, {
          officer_note: comments
        });
      }
      return (await this.getAlertById(id)) || INITIAL_ALERTS[0];
    } catch {
      const alert = INITIAL_ALERTS.find((a) => a.id === id) || INITIAL_ALERTS[0];
      return { ...alert, status };
    }
  },

  async verifyAlertWithDirectives(
    id: string,
    params: { officerNote?: string; violationCategory?: string; deadlineDays?: number; correctiveDirectives?: string }
  ): Promise<any> {
    return await api.post(`/alerts/${id}/verify`, {
      officer_note: params.officerNote,
      violation_category: params.violationCategory,
      deadline_days: params.deadlineDays || 7,
      corrective_directives: params.correctiveDirectives
    });
  },

  async assignInspector(id: string, inspectorName: string, inspectorId?: string): Promise<AIAlert> {
    try {
      return await api.post<AIAlert>(`/alerts/${id}/assign`, {
        inspector_name: inspectorName,
        inspector_id: inspectorId || 'USR-002'
      });
    } catch {
      const alert = INITIAL_ALERTS.find((a) => a.id === id) || INITIAL_ALERTS[0];
      return {
        ...alert,
        assignedInspector: inspectorName,
        status: 'Assigned'
      };
    }
  }
};
