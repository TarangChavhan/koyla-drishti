import { ReportItem, MineDocument } from '../types';
import { INITIAL_REPORTS, INITIAL_DOCUMENTS } from './mockData';

const REPORTS_STORAGE_KEY = 'koyla_drishti_reports';
const DOCS_STORAGE_KEY = 'koyla_drishti_docs';

function getStoredReports(): ReportItem[] {
  const data = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
  return INITIAL_REPORTS;
}

function getStoredDocs(): MineDocument[] {
  const data = localStorage.getItem(DOCS_STORAGE_KEY);
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
  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
  return INITIAL_DOCUMENTS;
}

export const reportService = {
  getAllReports(): ReportItem[] {
    return getStoredReports();
  },

  generateReport(title: string, type: ReportItem['type'], period: string, format: 'PDF' | 'XLSX'): ReportItem {
    const list = getStoredReports();
    const newReport: ReportItem = {
      id: `RPT-2026-${String(list.length + 95).padStart(3, '0')}`,
      title,
      type,
      generatedDate: 'Today, Just now',
      generatedBy: 'Authorized Officer',
      period,
      status: 'Available',
      fileFormat: format
    };
    const updated = [newReport, ...list];
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    return newReport;
  },

  // Documents
  getAllDocuments(mineId?: string): MineDocument[] {
    const all = getStoredDocs();
    if (mineId) {
      const filtered = all.filter((d) => !d.mineId || d.mineId.toLowerCase() === mineId.toLowerCase());
      if (filtered.length > 0) {
        return filtered;
      }
    }
    return all;
  },

  uploadDocument(
    mineIdOrDoc: string | (Omit<MineDocument, 'id' | 'uploadDate' | 'status'> & { status?: MineDocument['status'] }),
    maybeDoc?: Omit<MineDocument, 'id' | 'uploadDate' | 'status'> & { status?: MineDocument['status'] }
  ): MineDocument {
    const docs = getStoredDocs();
    const docData = typeof mineIdOrDoc === 'string' ? { ...maybeDoc!, mineId: mineIdOrDoc } : mineIdOrDoc;
    const newDoc: MineDocument = {
      ...docData,
      id: `DOC-${Math.floor(110 + Math.random() * 80)}`,
      uploadDate: 'Today',
      status: docData.status || 'Verified'
    };
    const updated = [newDoc, ...docs];
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  },

  updateDocumentStatus(docId: string, status: MineDocument['status']): MineDocument {
    const docs = getStoredDocs();
    const idx = docs.findIndex((d) => d.id === docId);
    if (idx === -1) throw new Error('Document not found');
    const updated = { ...docs[idx], status };
    docs[idx] = updated;
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    return updated;
  },

  deleteDocument(docId: string): void {
    const docs = getStoredDocs();
    const filtered = docs.filter((d) => d.id !== docId);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(filtered));
  }
};
