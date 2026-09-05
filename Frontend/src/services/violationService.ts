import { Violation, CorrectiveAction, ViolationStatus } from '../types';
import { INITIAL_VIOLATIONS, INITIAL_CORRECTIVE_ACTIONS } from './mockData';

const VIOLATIONS_STORAGE_KEY = 'koyla_drishti_violations';
const ACTIONS_STORAGE_KEY = 'koyla_drishti_corrective_actions';

function getStoredViolations(): Violation[] {
  const data = localStorage.getItem(VIOLATIONS_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge in any initial violations that aren't in stored yet (e.g. newly added KD-104 entries)
        const ids = new Set(parsed.map((v: Violation) => v.id));
        let updated = false;
        for (const initV of INITIAL_VIOLATIONS) {
          if (!ids.has(initV.id)) {
            parsed.push(initV);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(INITIAL_VIOLATIONS));
  return INITIAL_VIOLATIONS;
}

function getStoredActions(): CorrectiveAction[] {
  const data = localStorage.getItem(ACTIONS_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge in any initial actions that aren't in stored yet
        const ids = new Set(parsed.map((a: CorrectiveAction) => a.id));
        let updated = false;
        for (const initA of INITIAL_CORRECTIVE_ACTIONS) {
          if (!ids.has(initA.id)) {
            parsed.push(initA);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_CORRECTIVE_ACTIONS));
  return INITIAL_CORRECTIVE_ACTIONS;
}

export const violationService = {
  getAllViolations(): Violation[] {
    return getStoredViolations();
  },

  getViolationsByMine(mineId: string): Violation[] {
    return getStoredViolations().filter(
      (v) => v.mineId?.toLowerCase() === mineId.toLowerCase() || v.mineName.toLowerCase().includes(mineId.toLowerCase())
    );
  },

  getViolationById(id: string): Violation | undefined {
    return getStoredViolations().find((v) => v.id === id);
  },

  createViolation(data: Omit<Violation, 'id'>): Violation {
    const list = getStoredViolations();
    const newId = `VIO-${Math.floor(1030 + Math.random() * 50)}`;
    const newViolation: Violation = {
      ...data,
      id: newId
    };
    const updated = [newViolation, ...list];
    localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(updated));

    // Also auto-create a paired corrective action
    const actions = getStoredActions();
    const newAction: CorrectiveAction = {
      id: `CA-${newId.replace('VIO-', '')}`,
      violationId: newId,
      mineId: data.mineId,
      mineName: data.mineName,
      title: `${data.category} - Remedial Protocol`,
      instructions: data.correctiveActionText || data.description,
      severity: data.severity,
      dueDate: data.deadline,
      status: 'Pending Response'
    };
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify([newAction, ...actions]));

    return newViolation;
  },

  updateViolationStatus(id: string, status: ViolationStatus): Violation {
    const list = getStoredViolations();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Violation not found');
    const updated = { ...list[idx], status };
    list[idx] = updated;
    localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  // Corrective Actions
  getAllCorrectiveActions(): CorrectiveAction[] {
    return getStoredActions();
  },

  getActionsByMine(mineId: string): CorrectiveAction[] {
    return getStoredActions().filter(
      (a) => a.mineId?.toLowerCase() === mineId.toLowerCase() || a.mineName.toLowerCase().includes(mineId.toLowerCase())
    );
  },

  updateActionStatus(actionId: string, status: any, remarks?: string): CorrectiveAction {
    const actions = getStoredActions();
    const idx = actions.findIndex((a) => a.id === actionId);
    if (idx === -1) throw new Error('Action not found');

    const updated: CorrectiveAction = {
      ...actions[idx],
      status: status === 'Approved' ? 'Closed' : status === 'Rejected' ? 'Pending Response' : status,
      inspectorRemarks: remarks || actions[idx].inspectorRemarks
    };
    actions[idx] = updated;
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));
    return updated;
  },

  submitMineResponse(actionId: string, responseNote: string, evidenceFileName?: string): CorrectiveAction {
    const actions = getStoredActions();
    const idx = actions.findIndex((a) => a.id === actionId);
    if (idx === -1) throw new Error('Action not found');

    const prevEvidence = actions[idx].submittedEvidenceFiles || [];
    const updatedFiles = evidenceFileName ? [...prevEvidence, evidenceFileName] : prevEvidence;

    const updated: CorrectiveAction = {
      ...actions[idx],
      responseNote,
      status: 'Evidence Attached',
      submittedEvidenceFiles: updatedFiles
    };
    actions[idx] = updated;
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));

    // Update parent violation status
    const violations = getStoredViolations();
    const vIdx = violations.findIndex((v) => v.id === updated.violationId);
    if (vIdx !== -1) {
      violations[vIdx] = {
        ...violations[vIdx],
        status: 'Evidence Submitted',
        mineResponse: responseNote,
        submittedEvidence: updatedFiles
      };
      localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(violations));
    }

    return updated;
  },

  inspectorReviewAction(
    actionId: string,
    decision: 'Approved' | 'Rejected',
    remarks: string
  ): CorrectiveAction {
    const actions = getStoredActions();
    const idx = actions.findIndex((a) => a.id === actionId);
    if (idx === -1) throw new Error('Action not found');

    const updatedStatus = decision === 'Approved' ? 'Closed' : 'Pending Response';
    const updated: CorrectiveAction = {
      ...actions[idx],
      status: updatedStatus,
      inspectorRemarks: remarks
    };
    actions[idx] = updated;
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));

    // Update violation
    const violations = getStoredViolations();
    const vIdx = violations.findIndex((v) => v.id === updated.violationId);
    if (vIdx !== -1) {
      violations[vIdx] = {
        ...violations[vIdx],
        status: decision === 'Approved' ? 'Resolved' : 'Corrective Action Required'
      };
      localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(violations));
    }

    return updated;
  }
};
