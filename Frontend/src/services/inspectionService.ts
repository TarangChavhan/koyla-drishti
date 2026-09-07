import { Inspection, InspectionStatus } from '../types';
import { INITIAL_INSPECTIONS } from './mockData';

const INSPECTIONS_STORAGE_KEY = 'koyla_drishti_inspections';

function getStoredInspections(): Inspection[] {
  const data = localStorage.getItem(INSPECTIONS_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge in any initial inspections that aren't in stored yet
        const ids = new Set(parsed.map((i: Inspection) => i.id));
        let updated = false;
        for (const initI of INITIAL_INSPECTIONS) {
          if (!ids.has(initI.id)) {
            parsed.push(initI);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  return INITIAL_INSPECTIONS;
}

export const inspectionService = {
  getAllInspections(): Inspection[] {
    return getStoredInspections();
  },

  getInspectionsByMine(mineId: string): Inspection[] {
    return getStoredInspections().filter(
      (i) => i.mineId?.toLowerCase() === mineId.toLowerCase() || i.mineName.toLowerCase().includes(mineId.toLowerCase())
    );
  },

  getInspectionById(id: string): Inspection | undefined {
    const list = getStoredInspections();
    return list.find((ins) => ins.id === id);
  },

  createInspection(data: Omit<Inspection, 'id' | 'evidenceFilesCount'>): Inspection {
    const list = getStoredInspections();
    const newId = `INS-${Math.floor(2420 + Math.random() * 80)}`;
    const newInspection: Inspection = {
      ...data,
      id: newId,
      evidenceFilesCount: 0
    };
    const updated = [newInspection, ...list];
    localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(updated));
    return newInspection;
  },

  updateInspection(id: string, updates: Partial<Inspection>): Inspection {
    const list = getStoredInspections();
    const idx = list.findIndex((ins) => ins.id === id);
    if (idx === -1) throw new Error('Inspection not found');

    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  updateChecklist(id: string, checklistItemId: string, completed: boolean, findings?: string): Inspection {
    const list = getStoredInspections();
    const idx = list.findIndex((ins) => ins.id === id);
    if (idx === -1) throw new Error('Inspection not found');

    const insp = list[idx];
    const items = insp.checklistItems.map((item) => {
      if (item.id === checklistItemId) {
        return {
          ...item,
          completed,
          findings: findings !== undefined ? findings : item.findings
        };
      }
      return item;
    });

    const updated = { ...insp, checklistItems: items };
    list[idx] = updated;
    localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  submitInspectionReport(
    id: string,
    observations: string,
    recommendations: string,
    finalStatus: InspectionStatus = 'Submitted'
  ): Inspection {
    const list = getStoredInspections();
    const idx = list.findIndex((ins) => ins.id === id);
    if (idx === -1) throw new Error('Inspection not found');

    const updated: Inspection = {
      ...list[idx],
      observations,
      recommendations,
      status: finalStatus,
      evidenceFilesCount: list[idx].evidenceFilesCount + 2
    };
    list[idx] = updated;
    localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  }
};
