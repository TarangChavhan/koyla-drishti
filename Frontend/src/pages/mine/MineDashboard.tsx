import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { mineService } from '../../services/mineService';
import { violationService } from '../../services/violationService';
import { inspectionService } from '../../services/inspectionService';
import { reportService } from '../../services/reportService';
import { dashboardService, MineDashboardData } from '../../services/dashboardService';
import { SubmitEvidenceModal } from '../../components/mine/SubmitEvidenceModal';
import { DocumentPreviewModal } from '../../components/mine/DocumentPreviewModal';
import { useToast } from '../../context/ToastContext';
import { Mine, Violation, CorrectiveAction, Inspection, MineDocument } from '../../types';
import {
  Building2,
  AlertTriangle,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileText
} from 'lucide-react';

export const MineDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const currentMineId = user?.mineId || 'KD-104';
  const [mine, setMine] = useState<Mine | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [documents, setDocuments] = useState<MineDocument[]>([]);
  const [dashboardData, setDashboardData] = useState<MineDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<MineDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, m, vList, aList, iList, dList] = await Promise.all([
        dashboardService.getMineDashboard(),
        mineService.getMineById(currentMineId),
        violationService.getViolationsByMine(currentMineId),
        violationService.getActionsByMine(currentMineId),
        inspectionService.getInspectionsByMine(currentMineId),
        reportService.getAllDocuments(currentMineId)
      ]);
      setDashboardData(dash);
      setMine(m || null);
      setViolations(vList);
      setActions(aList);
      setInspections(iList);
      setDocuments(dList);
    } catch (e: any) {
      console.error('Failed to load mine dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMineId]);

  const pendingActions = actions.filter((a) => a.status === 'Pending Response' || a.status === 'Rejected');

  const openSubmitEvidence = (action: CorrectiveAction) => {
    setSelectedAction(action);
    setIsSubmitOpen(true);
  };

  const openDocument = (doc: MineDocument) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const refreshData = async () => {
    await loadData();
  };

  const displayName = mine?.name || dashboardData?.mine_name || 'Bharat Coking Coal Mine (Dhanbad)';
  const displayScore = dashboardData ? dashboardData.overall_compliance : mine ? mine.complianceScore : 88;
  const displayStatus = dashboardData ? dashboardData.compliance_status : mine ? mine.status : 'Compliant';

  return (
    <div className="space-y-6">
      {/* Mine Authority Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(90deg, rgba(31,21,5,0.95) 0%, rgba(31,21,5,0.75) 60%, rgba(31,21,5,0.35) 100%), url("https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1800&q=80") center/cover`
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[10px] font-bold tracking-widest text-[#f5cd79] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f4b942] shadow-[0_0_6px_#f4b942]" />
              Mine Compliance Terminal · DGMS Reg ID: {currentMineId}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {displayName}
            </h1>
            <p className="text-xs text-[#f4dcb0] leading-relaxed">
              Operator: <strong>{mine?.operator || 'Bharat Coking Coal Limited (BCCL)'}</strong> · {mine?.district || 'Dhanbad'}, {mine?.state || 'Jharkhand'}. Track statutory compliance deadlines, field audits, and submit corrective evidence dossiers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 border-l-4 border-l-[#f4b942] text-[11px] text-white">
              Next Statutory DGMS Audit: <strong>{mine?.nextInspection || '08 Sep 2026'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#120a02]/70 backdrop-blur-md border border-white/15 rounded-xl p-3.5 min-w-[120px] text-center">
              <span className="block text-[10px] text-[#e0c294] uppercase font-bold">Compliance Score</span>
              <strong className="block text-3xl font-black text-[#f4b942] mt-1">
                {isLoading ? '...' : `${displayScore}%`}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Compliance Status"
          value={isLoading ? '...' : displayStatus}
          subtext="Under Regulatory Review"
          subtextColor="amber"
          icon={<CheckCircle2 className="w-5 h-5 text-[#e5a52a]" />}
          onClick={() => navigate('/mine/compliance')}
        />
        <KpiCard
          label="Active Violations"
          value={isLoading ? '...' : String(violations.length)}
          subtext="Requires Immediate Response"
          subtextColor="red"
          icon={<AlertTriangle className="w-5 h-5 text-[#df4d52]" />}
          onClick={() => navigate('/mine/violations')}
        />
        <KpiCard
          label="Pending Corrective Actions"
          value={isLoading ? '...' : String(pendingActions.length)}
          subtext="Upload remediation evidence"
          subtextColor="amber"
          icon={<FileCheck className="w-5 h-5 text-[#126fba]" />}
          onClick={() => navigate('/mine/actions')}
        />
        <KpiCard
          label="Verified Documents"
          value={isLoading ? '...' : String(documents.length)}
          subtext="All clearances current"
          subtextColor="green"
          icon={<FileText className="w-5 h-5 text-[#18a873]" />}
          onClick={() => navigate('/mine/documents')}
        />
      </div>

      {/* Main Split: Pending Corrective Actions & Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Corrective Actions */}
        <div className="lg:col-span-7 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#df4d52]" />
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Urgent Corrective Actions Requiring Evidence Submission
              </h3>
            </div>
            <button
              onClick={() => navigate('/mine/actions')}
              className="text-[11px] font-bold text-[#126fba] hover:underline cursor-pointer"
            >
              All Actions ({actions.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {actions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#728594] border border-dashed rounded-xl">
                No open corrective actions assigned.
              </div>
            ) : (
              actions.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-[#e2e9ee] bg-[#fbfdfd] hover:border-[#126fba]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#126fba]">{act.id}</span>
                      <span className="text-[10px] text-[#728594]">Due: {act.dueDate}</span>
                      <StatusBadge status={act.status} size="sm" />
                    </div>
                    <h4 className="font-bold text-[#152737]">{act.title}</h4>
                    <p className="text-[#526a79] leading-relaxed text-[11px]">{act.instructions}</p>
                  </div>

                  <button
                    onClick={() => openSubmitEvidence(act)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white font-bold text-xs shadow transition-colors shrink-0 cursor-pointer"
                  >
                    Submit Evidence
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inspections & Clearances */}
        <div className="lg:col-span-5 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#126fba]" />
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Inspection History & Findings
              </h3>
            </div>
            <button
              onClick={() => navigate('/mine/inspections')}
              className="text-[11px] font-bold text-[#126fba] hover:underline cursor-pointer"
            >
              History →
            </button>
          </div>

          <div className="space-y-2.5">
            {inspections.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#728594]">
                No recent inspections recorded.
              </div>
            ) : (
              inspections.slice(0, 3).map((ins) => (
                <div key={ins.id} className="p-3 rounded-xl border border-[#e2e9ee] bg-white text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#126fba]">{ins.id}</span>
                    <StatusBadge status={ins.status} size="sm" />
                  </div>
                  <strong className="text-[#152737] block">{ins.inspectionType} Audit</strong>
                  <p className="text-[11px] text-[#526a79]">Inspector: {ins.inspectorName}</p>
                  <p className="text-[11px] text-[#728594]">{ins.observations || 'Routine checklist in progress.'}</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#e2e9ee]">
            <button
              onClick={() => navigate('/mine/documents')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#526a79] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Statutory DGMS Document / Return
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmitEvidenceModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        action={selectedAction}
        onSubmitted={refreshData}
      />

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
};
