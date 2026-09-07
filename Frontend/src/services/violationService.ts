import { Violation, CorrectiveAction, ViolationStatus } from '../types';
import { api } from './api';
import { INITIAL_VIOLATIONS, INITIAL_CORRECTIVE_ACTIONS } from './mockData';

export const violationService = {
  async getAllViolations(): Promise<Violation[]> {
    try {
      return await api.get<Violation[]>('/violations');
    } catch {
      return INITIAL_VIOLATIONS;
    }
  },

  async getViolationsByMine(mineId: string): Promise<Violation[]> {
    try {
      return await api.get<Violation[]>('/violations', { mine_id: mineId });
    } catch {
      return INITIAL_VIOLATIONS.filter(
        (v) => v.mineId?.toLowerCase() === mineId.toLowerCase() || v.mineName.toLowerCase().includes(mineId.toLowerCase())
      );
    }
  },

  async getViolationById(id: string): Promise<Violation | undefined> {
    try {
      return await api.get<Violation>(`/violations/${id}`);
    } catch {
      return INITIAL_VIOLATIONS.find((v) => v.id === id);
    }
  },

  async createViolation(data: Omit<Violation, 'id'> & { id?: string }): Promise<Violation> {
    try {
      return await api.post<Violation>('/violations', data);
    } catch {
      const newV: Violation = {
        ...data,
        id: data.id || `VIO-${Math.floor(1030 + Math.random() * 50)}`
      };
      return newV;
    }
  },

  // Corrective Actions
  async getAllCorrectiveActions(): Promise<CorrectiveAction[]> {
    try {
      return await api.get<CorrectiveAction[]>('/corrective-actions');
    } catch {
      return INITIAL_CORRECTIVE_ACTIONS;
    }
  },

  async getActionsByMine(mineId: string): Promise<CorrectiveAction[]> {
    try {
      return await api.get<CorrectiveAction[]>('/corrective-actions', { mine_id: mineId });
    } catch {
      return INITIAL_CORRECTIVE_ACTIONS.filter(
        (a) => a.mineId?.toLowerCase() === mineId.toLowerCase() || a.mineName.toLowerCase().includes(mineId.toLowerCase())
      );
    }
  },

  async submitMineResponse(actionId: string, responseNote: string, evidenceFileName?: string): Promise<CorrectiveAction> {
    try {
      return await api.post<CorrectiveAction>(`/corrective-actions/${actionId}/respond`, {
        response_note: responseNote,
        evidence_file_name: evidenceFileName
      });
    } catch {
      const action = INITIAL_CORRECTIVE_ACTIONS.find((a) => a.id === actionId) || INITIAL_CORRECTIVE_ACTIONS[0];
      return {
        ...action,
        responseNote,
        status: 'Evidence Attached',
        submittedEvidenceFiles: evidenceFileName ? [evidenceFileName] : []
      };
    }
  },

  async inspectorReviewAction(
    actionId: string,
    decision: 'Approved' | 'Rejected',
    remarks: string
  ): Promise<CorrectiveAction> {
    try {
      return await api.post<CorrectiveAction>(`/corrective-actions/${actionId}/adjudicate`, {
        decision,
        remarks
      });
    } catch {
      const action = INITIAL_CORRECTIVE_ACTIONS.find((a) => a.id === actionId) || INITIAL_CORRECTIVE_ACTIONS[0];
      return {
        ...action,
        status: decision === 'Approved' ? 'Closed' : 'Pending Response',
        inspectorRemarks: remarks
      };
    }
  }
};
