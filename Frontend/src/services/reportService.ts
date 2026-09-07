import { ReportItem, MineDocument } from '../types';
import { api } from './api';
import { INITIAL_REPORTS, INITIAL_DOCUMENTS } from './mockData';

export const reportService = {
  async getAllReports(): Promise<ReportItem[]> {
    try {
      return await api.get<ReportItem[]>('/reports');
    } catch {
      return INITIAL_REPORTS;
    }
  },

  async generateReport(title: string, type: ReportItem['type'], period: string, format: 'PDF' | 'XLSX'): Promise<ReportItem> {
    try {
      return await api.post<ReportItem>('/reports/generate', {
        title,
        type,
        period,
        format
      });
    } catch {
      return {
        id: `RPT-2026-${Math.floor(100 + Math.random() * 50)}`,
        title,
        type,
        generatedDate: 'Today, Just now',
        generatedBy: 'Authorized Officer',
        period,
        status: 'Available',
        fileFormat: format
      };
    }
  },

  // Documents
  async getAllDocuments(mineId?: string): Promise<MineDocument[]> {
    try {
      return await api.get<MineDocument[]>('/documents', mineId ? { mine_id: mineId } : undefined);
    } catch {
      if (mineId) {
        return INITIAL_DOCUMENTS.filter((d) => !d.mineId || d.mineId.toLowerCase() === mineId.toLowerCase());
      }
      return INITIAL_DOCUMENTS;
    }
  },

  async uploadDocument(
    mineIdOrDoc: string | (Omit<MineDocument, 'id' | 'uploadDate' | 'status'> & { status?: MineDocument['status'] }),
    maybeDoc?: Omit<MineDocument, 'id' | 'uploadDate' | 'status'> & { status?: MineDocument['status'] }
  ): Promise<MineDocument> {
    const docData = typeof mineIdOrDoc === 'string' ? { ...maybeDoc!, mineId: mineIdOrDoc } : mineIdOrDoc;

    try {
      const formData = new FormData();
      // If there's an actual file uploaded or virtual placeholder file
      const blob = new Blob(['Statutory Evidence File Dossier'], { type: 'application/pdf' });
      formData.append('file', blob, docData.fileName || 'compliance_doc.pdf');
      formData.append('title', docData.title);
      formData.append('category', docData.category);
      if (docData.mineId) formData.append('mine_id', docData.mineId);
      if (docData.expiryDate) formData.append('expiry_date', docData.expiryDate);

      return await api.upload<MineDocument>('/documents/upload', formData);
    } catch {
      return {
        ...docData,
        id: `DOC-${Math.floor(110 + Math.random() * 80)}`,
        uploadDate: 'Today',
        status: docData.status || 'Verified'
      };
    }
  },

  async deleteDocument(docId: string): Promise<void> {
    try {
      await api.delete(`/documents/${docId}`);
    } catch {
      // offline fallback
    }
  }
};
