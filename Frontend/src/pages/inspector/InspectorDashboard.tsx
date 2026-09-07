import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { alertService } from '../../services/alertService';
import { inspectionService } from '../../services/inspectionService';
import { violationService } from '../../services/violationService';
import { dashboardService, InspectorDashboardData } from '../../services/dashboardService';
import { VerifyAlertModal } from '../../components/inspector/VerifyAlertModal';
import { InspectionExecutionModal } from '../../components/inspector/InspectionExecutionModal';
import { useToast } from '../../context/ToastContext';
import { AIAlert, Inspection, Violation } from '../../types';
import {
  UserCheck,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Play
} from 'lucide-react';

export const InspectorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState<InspectorDashboardData>({
    assigned_mines_count: 6,
    pending_alerts_count: 3,
    open_violations_count: 2,
    resolved_cases_count: 14,
    upcoming_inspections_count: 2,
    assigned_alerts: [],
    upcoming_inspections: []
  });

  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isExecOpen, setIsExecOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, alertsList, inspsList, viosList] = await Promise.all([
        dashboardService.getInspectorDashboard(),
        alertService.getAllAlerts(),
        inspectionService.getAllInspections(),
        violationService.getAllViolations()
      ]);
      setDashboardData(dash);
      setAlerts(alertsList);
      setInspections(inspsList);
      setViolations(viosList);
    } catch (e: any) {
      console.error('Failed loading inspector dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingAlerts = alerts.filter(
    (a) => a.status === 'New' || a.status === 'Under Review' || a.status === 'Assigned' || a.status === 'Pending Review'
  );
  const myInspections = inspections.filter((i) => i.status !== 'Completed');
  const openViolations = violations.filter((v) => v.status === 'Open' || v.status === 'Corrective Action Required' || v.status === 'Evidence Submitted');

  const openAlertModal = (a: AIAlert) => {
    setSelectedAlert(a);
    setIsVerifyOpen(true);
  };

  const openInspectionModal = (i: Inspection) => {
    setSelectedInspection(i);
    setIsExecOpen(true);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Inspector Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(90deg, rgba(6,35,30,0.95) 0%, rgba(6,35,30,0.72) 55%, rgba(6,35,30,0.35) 100%), url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1800&q=80") center/cover`
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[10px] font-bold tracking-widest text-[#9ed9ce] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#159e89] shadow-[0_0_6px_#159e89]" />
              DGMS Safety Directorate · Field Inspector Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Field Intelligence & Enforcement Station
            </h1>
            <p className="text-xs text-[#c6e8e1] leading-relaxed">
              Verify satellite radar and sensor anomaly signals, conduct statutory Regulation audits, and adjudicate mine remediation evidence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 border-l-4 border-l-[#159e89] text-[11px] text-white">
              Authorized DGMS Statutory Enforcement Protocol Active
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#031c17]/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 min-w-[110px] text-center">
              <span className="block text-[10px] text-[#9ed9ce] uppercase font-bold">Assigned Mines</span>
              <strong className="block text-2xl font-black text-white mt-1">
                {isLoading ? '...' : dashboardData.assigned_mines_count}
              </strong>
            </div>
            <div className="bg-[#031c17]/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 min-w-[110px] text-center">
              <span className="block text-[10px] text-[#9ed9ce] uppercase font-bold">Pending Signals</span>
              <strong className="block text-2xl font-black text-[#e5a52a] mt-1">
                {isLoading ? '...' : pendingAlerts.length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pending AI Alerts"
          value={isLoading ? '...' : String(pendingAlerts.length)}
          subtext="Requires field verification"
          subtextColor="yellow"
          icon={<AlertTriangle className="w-5 h-5" />}
          onClick={() => navigate('/inspector/alerts')}
        />
        <KpiCard
          label="Upcoming Inspections"
          value={isLoading ? '...' : String(myInspections.length)}
          subtext="Audits scheduled this month"
          subtextColor="green"
          icon={<Calendar className="w-5 h-5" />}
          onClick={() => navigate('/inspector/inspections')}
        />
        <KpiCard
          label="Active Violations"
          value={isLoading ? '...' : String(openViolations.length)}
          subtext="Statutory directives pending"
          subtextColor="red"
          icon={<ShieldAlert className="w-5 h-5" />}
          onClick={() => navigate('/inspector/violations')}
        />
        <KpiCard
          label="Resolved Cases"
          value={isLoading ? '...' : String(dashboardData.resolved_cases_count)}
          subtext="Remediation approved"
          subtextColor="green"
          icon={<CheckCircle2 className="w-5 h-5" />}
          onClick={() => navigate('/inspector/reports')}
        />
      </div>

      {/* Main Grid: Pending Alerts & Scheduled Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Alerts List */}
        <div className="lg:col-span-7 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e5a52a]" />
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Pending Anomaly Verification Signals
              </h3>
            </div>
            <button
              onClick={() => navigate('/inspector/alerts')}
              className="text-[11px] font-bold text-[#126fba] hover:underline"
            >
              All Alerts →
            </button>
          </div>

          <div className="space-y-3">
            {pendingAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#728594] border border-dashed rounded-xl">
                No active anomaly alerts pending verification.
              </div>
            ) : (
              pendingAlerts.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#159e89]/40 hover:bg-[#fbfdfd] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={a.severity} size="sm" />
                      <span className="font-mono text-[11px] font-bold text-[#526a79]">{a.id}</span>
                      <span className="text-[10px] text-[#728594]">{a.detectedAt}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#152737]">{a.title}</h4>
                    <p className="text-[11px] text-[#526a79] truncate max-w-md">{a.detectedIssue}</p>
                    <span className="text-[10px] text-[#728594] block">
                      Target: <strong>{a.mineName}</strong> ({a.location})
                    </span>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2">
                    <span className="text-[11px] font-black text-[#e5a52a]">{a.confidenceScore}% Conf</span>
                    <button
                      onClick={() => openAlertModal(a)}
                      className="px-3 py-1.5 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white text-xs font-bold shadow transition-colors cursor-pointer"
                    >
                      Examine Signal
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scheduled Inspections & Action Panel */}
        <div className="lg:col-span-5 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#126fba]" />
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Today & Upcoming Audits
              </h3>
            </div>
            <button
              onClick={() => navigate('/inspector/inspections')}
              className="text-[11px] font-bold text-[#126fba] hover:underline"
            >
              Roster →
            </button>
          </div>

          <div className="space-y-3">
            {myInspections.slice(0, 3).map((ins) => (
              <div
                key={ins.id}
                className="p-3 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/30 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#126fba]">{ins.id}</span>
                    <StatusBadge status={ins.status} size="sm" />
                  </div>
                  <strong className="text-[#152737] block mt-0.5">{ins.mineName}</strong>
                  <span className="text-[11px] text-[#728594] block">{ins.date} · {ins.inspectionType}</span>
                </div>

                <button
                  onClick={() => openInspectionModal(ins)}
                  className="px-3 py-1.5 rounded-lg bg-[#126fba] hover:bg-[#0f60a1] text-white font-bold text-xs shadow flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Audit
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#e2e9ee]">
            <button
              onClick={() => navigate('/inspector/reports')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#526a79] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Prepare Statutory DGMS Audit Report
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VerifyAlertModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        alert={selectedAlert}
        onUpdated={refreshData}
      />

      <InspectionExecutionModal
        isOpen={isExecOpen}
        onClose={() => setIsExecOpen(false)}
        inspection={selectedInspection}
        onSaved={refreshData}
      />
    </div>
  );
};
