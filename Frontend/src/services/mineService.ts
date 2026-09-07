import { Mine } from '../types';
import { INITIAL_MINES } from './mockData';

const MINES_STORAGE_KEY = 'koyla_drishti_mines';

function getStoredMines(): Mine[] {
  const data = localStorage.getItem(MINES_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(MINES_STORAGE_KEY, JSON.stringify(INITIAL_MINES));
  return INITIAL_MINES;
}

export const mineService = {
  getAllMines(): Mine[] {
    return getStoredMines();
  },

  getMineById(id: string): Mine | undefined {
    const mines = getStoredMines();
    return mines.find((m) => m.id.toLowerCase() === id.toLowerCase());
  },

  createMine(mineData: Omit<Mine, 'id' | 'activeViolationsCount'>): Mine {
    const mines = getStoredMines();
    const newId = `KD-${Math.floor(260 + Math.random() * 50)}`;
    const newMine: Mine = {
      ...mineData,
      id: newId,
      activeViolationsCount: 0
    };
    const updated = [newMine, ...mines];
    localStorage.setItem(MINES_STORAGE_KEY, JSON.stringify(updated));
    return newMine;
  },

  updateMine(id: string, updates: Partial<Mine>): Mine {
    const mines = getStoredMines();
    const idx = mines.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Mine with ID ${id} not found`);
    const updated = { ...mines[idx], ...updates };
    mines[idx] = updated;
    localStorage.setItem(MINES_STORAGE_KEY, JSON.stringify(mines));
    return updated;
  },

  deleteMine(id: string): void {
    const mines = getStoredMines();
    const filtered = mines.filter((m) => m.id.toLowerCase() !== id.toLowerCase());
    localStorage.setItem(MINES_STORAGE_KEY, JSON.stringify(filtered));
  }
};
