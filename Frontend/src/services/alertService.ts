import { AIAlert, AlertStatus } from '../types';
import { INITIAL_ALERTS } from './mockData';

const ALERTS_STORAGE_KEY = 'koyla_drishti_alerts';

function getStoredAlerts(): AIAlert[] {
  const data = localStorage.getItem(ALERTS_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
  return INITIAL_ALERTS;
}

export const alertService = {
  getAllAlerts(): AIAlert[] {
    return getStoredAlerts();
  },

  getAlertById(id: string): AIAlert | undefined {
    const alerts = getStoredAlerts();
    return alerts.find((a) => a.id === id);
  },

  updateAlertStatus(id: string, status: AlertStatus, comments?: string): AIAlert {
    const alerts = getStoredAlerts();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Alert not found');

    const updated: AIAlert = {
      ...alerts[idx],
      status
    };
    if (comments) {
      updated.recommendedAction = `${updated.recommendedAction} [Officer Note: ${comments}]`;
    }
    alerts[idx] = updated;
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    return updated;
  },

  assignInspector(id: string, inspectorName: string, inspectorId?: string): AIAlert {
    const alerts = getStoredAlerts();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Alert not found');

    const updated: AIAlert = {
      ...alerts[idx],
      assignedInspector: inspectorName,
      inspectorId: inspectorId || 'USR-002',
      status: 'Assigned'
    };
    alerts[idx] = updated;
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    return updated;
  }
};
