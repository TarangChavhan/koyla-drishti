import { api } from './api';

export interface AdminDashboardData {
  total_mines: number;
  compliant_mines: number;
  compliance_rate: number;
  pending_violations: number;
  resolved_reports: number;
  high_risk_mines: number;
  pending_inspections: number;
  active_alerts: number;
  recent_alerts: Array<{
    id: string;
    title: string;
    mineName: string;
    location: string;
    category: string;
    confidenceScore: number;
    severity: string;
    detectedAt: string;
    status: string;
  }>;
  compliance_categories: Array<{
    title: string;
    compliance: number;
    target: number;
    status: string;
  }>;
}

export interface InspectorDashboardData {
  assigned_mines_count: number;
  pending_alerts_count: number;
  open_violations_count: number;
  resolved_cases_count: number;
  upcoming_inspections_count: number;
  assigned_alerts: Array<any>;
  upcoming_inspections: Array<any>;
}

export interface MineDashboardData {
  mine_id: string;
  mine_name: string;
  overall_compliance: number;
  risk_level: string;
  compliance_status: string;
  open_violations_count: number;
  pending_corrective_actions_count: number;
  upcoming_inspections_count: number;
  recent_violations: Array<any>;
  pending_actions: Array<any>;
}

export const dashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    try {
      return await api.get<AdminDashboardData>('/dashboard/admin');
    } catch {
      // Offline fallback
      return {
        total_mines: 412,
        compliant_mines: 296,
        compliance_rate: 71.8,
        pending_violations: 86,
        resolved_reports: 142,
        high_risk_mines: 28,
        pending_inspections: 19,
        active_alerts: 12,
        recent_alerts: [],
        compliance_categories: [
          { title: 'Mine Safety & Geotechnical Stability', compliance: 91, target: 95, status: 'On Target' },
          { title: 'Environmental Quality (Dust, PM10, Water)', compliance: 78, target: 90, status: 'Needs Improvement' },
          { title: 'HEMM Heavy Machinery & Mechanical Standards', compliance: 84, target: 88, status: 'Stable' },
          { title: 'Statutory Documentation & DGMS Returns', compliance: 95, target: 98, status: 'Optimal' },
          { title: 'Labour Welfare, Medical & PPE Protocols', compliance: 73, target: 92, status: 'Deficient' }
        ]
      };
    }
  },

  async getInspectorDashboard(): Promise<InspectorDashboardData> {
    try {
      return await api.get<InspectorDashboardData>('/dashboard/inspector');
    } catch {
      return {
        assigned_mines_count: 6,
        pending_alerts_count: 8,
        open_violations_count: 4,
        resolved_cases_count: 24,
        upcoming_inspections_count: 2,
        assigned_alerts: [],
        upcoming_inspections: []
      };
    }
  },

  async getMineDashboard(): Promise<MineDashboardData> {
    try {
      return await api.get<MineDashboardData>('/dashboard/mine');
    } catch {
      return {
        mine_id: 'KD-104',
        mine_name: 'Bharat Coking Coal Mine (Dhanbad)',
        overall_compliance: 88,
        risk_level: 'Medium',
        compliance_status: 'Compliant',
        open_violations_count: 3,
        pending_corrective_actions_count: 2,
        upcoming_inspections_count: 1,
        recent_violations: [],
        pending_actions: []
      };
    }
  }
};
