import { Inspection, InspectionStatus } from '../types';
import { api } from './api';
import { INITIAL_INSPECTIONS } from './mockData';

export const inspectionService = {
  async getAllInspections(): Promise<Inspection[]> {
    try {
      return await api.get<Inspection[]>('/inspections');
    } catch {
      return INITIAL_INSPECTIONS;
    }
  },

  async getInspectionsByMine(mineId: string): Promise<Inspection[]> {
    try {
      return await api.get<Inspection[]>('/inspections', { mine_id: mineId });
    } catch {
      return INITIAL_INSPECTIONS.filter(
        (i) => i.mineId?.toLowerCase() === mineId.toLowerCase() || i.mineName.toLowerCase().includes(mineId.toLowerCase())
      );
    }
  },

  async getInspectionById(id: string): Promise<Inspection | undefined> {
    try {
      return await api.get<Inspection>(`/inspections/${id}`);
    } catch {
      return INITIAL_INSPECTIONS.find((i) => i.id === id);
    }
  },

  async createInspection(data: Omit<Inspection, 'id' | 'evidenceFilesCount'> & { id?: string }): Promise<Inspection> {
    try {
      return await api.post<Inspection>('/inspections', data);
    } catch {
      const newInsp: Inspection = {
        ...data,
        id: data.id || `INS-${Math.floor(2420 + Math.random() * 80)}`,
        evidenceFilesCount: 0
      };
      return newInsp;
    }
  },

  async updateInspection(id: string, updates: Partial<Inspection>): Promise<Inspection> {
    try {
      return await api.put<Inspection>(`/inspections/${id}`, updates);
    } catch {
      const existing = INITIAL_INSPECTIONS.find((i) => i.id === id) || INITIAL_INSPECTIONS[0];
      return { ...existing, ...updates };
    }
  },

  async submitInspectionReport(
    id: string,
    observations: string,
    recommendations: string,
    finalStatus: InspectionStatus = 'Submitted'
  ): Promise<Inspection> {
    try {
      return await api.post<Inspection>(`/inspections/${id}/submit`, {
        observations,
        recommendations,
        status: finalStatus
      });
    } catch {
      return {
        ...INITIAL_INSPECTIONS[0],
        id,
        observations,
        recommendations,
        status: finalStatus
      };
    }
  }
};
