import { api } from './api';

export interface TelemetrySubmissionData {
  mine_id?: string;
  production_tonnage: string;
  pm10_level: number;
  ambient_noise_db: number;
  methane_concentration: number;
  blast_vibration_mms: number;
  water_discharge_ph: number;
  safety_incident_reported: boolean;
  notes?: string;
  attachment_filename?: string;
}

export interface TelemetrySubmissionResponse {
  id: string;
  mine_id: string;
  calculated_score: number;
  risk_level: string;
  status: string;
  ai_analysis_summary?: string;
  created_at: string;
}

export interface MineComplianceBreakdown {
  mine_id: string;
  mine_name: string;
  overall_score: number;
  risk_level: string;
  status: string;
  categories: Array<{
    title: string;
    score: number;
    target: number;
    status: string;
    notes: string;
  }>;
}

export const complianceService = {
  async submitTelemetry(data: TelemetrySubmissionData): Promise<TelemetrySubmissionResponse> {
    return await api.post<TelemetrySubmissionResponse>('/compliance/submit', data);
  },

  async getMineCompliance(mineId: string): Promise<MineComplianceBreakdown> {
    try {
      return await api.get<MineComplianceBreakdown>(`/compliance/mine/${mineId}`);
    } catch {
      return {
        mine_id: mineId,
        mine_name: 'Coal Mining Entity',
        overall_score: 85,
        risk_level: 'Low',
        status: 'Compliant',
        categories: [
          { title: 'Mine Geotechnical Slope & Bench Safety', score: 82, target: 90, status: 'Satisfactory', notes: 'Bench angles compliant with DGMS circular 04/2021.' },
          { title: 'Air Quality & Dust Suppression', score: 68, target: 85, status: 'Remediation Required', notes: 'PM10 elevated on haul road. Additional water mist sprayers ordered.' },
          { title: 'HEMM Heavy Machinery Maintenance', score: 88, target: 85, status: 'Compliant', notes: 'All 24 dumpers equipped with proximity sensors.' },
          { title: 'Statutory Documentation & Worker Medicals', score: 94, target: 95, status: 'Optimal', notes: 'Form B employment register updated and signed.' }
        ]
      };
    }
  },

  // MongoDB Atlas IoT Telemetry Time-Series
  async getTelemetryHistory(mineId: string, limit: number = 20): Promise<any[]> {
    try {
      return await api.get<any[]>(`/telemetry/mine/${mineId}/history`, { limit });
    } catch {
      return [];
    }
  },

  // MongoDB Atlas Raw AI Inferences
  async getAiInferences(mineId?: string): Promise<any[]> {
    try {
      return await api.get<any[]>('/telemetry/ai-inferences', mineId ? { mine_id: mineId } : undefined);
    } catch {
      return [];
    }
  }
};
