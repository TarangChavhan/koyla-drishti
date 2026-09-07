import { Mine } from '../types';
import { api } from './api';
import { INITIAL_MINES } from './mockData';

export const mineService = {
  async getAllMines(): Promise<Mine[]> {
    try {
      return await api.get<Mine[]>('/mines');
    } catch {
      return INITIAL_MINES;
    }
  },

  async getMineById(id: string): Promise<Mine | undefined> {
    try {
      return await api.get<Mine>(`/mines/${id}`);
    } catch {
      return INITIAL_MINES.find((m) => m.id.toLowerCase() === id.toLowerCase());
    }
  },

  async createMine(mineData: Omit<Mine, 'id' | 'activeViolationsCount'> & { id?: string }): Promise<Mine> {
    try {
      return await api.post<Mine>('/mines', mineData);
    } catch {
      const newMine: Mine = {
        ...mineData,
        id: mineData.id || `KD-${Math.floor(260 + Math.random() * 50)}`,
        activeViolationsCount: 0
      };
      return newMine;
    }
  },

  async updateMine(id: string, updates: Partial<Mine>): Promise<Mine> {
    try {
      return await api.put<Mine>(`/mines/${id}`, updates);
    } catch {
      const existing = INITIAL_MINES.find((m) => m.id.toLowerCase() === id.toLowerCase()) || INITIAL_MINES[0];
      return { ...existing, ...updates };
    }
  },

  async deleteMine(id: string): Promise<void> {
    try {
      await api.delete(`/mines/${id}`);
    } catch {
      // offline fallback
    }
  }
};
