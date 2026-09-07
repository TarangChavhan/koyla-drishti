import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mineService } from '../../services/mineService';
import { alertService } from '../../services/alertService';
import { inspectionService } from '../../services/inspectionService';
import { dashboardService, AdminDashboardData } from '../../services/dashboardService';
import { AddMineModal } from '../../components/admin/AddMineModal';
import { AssignInspectorModal } from '../../components/admin/AssignInspectorModal';
import { GenerateReportModal } from '../../components/admin/GenerateReportModal';
import { useToast } from '../../context/ToastContext';
import { Mine, AIAlert, Inspection } from '../../types';
import {
  Pickaxe,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Plus,
  Users,
  BarChart3,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    total_mines: 6,
    compliant_mines: 4,
    compliance_rate: 66.7,
    pending_violations: 2,
    resolved_reports: 5,
    high_risk_mines: 2,
    pending_inspections: 2,
    active_alerts: 3,
    recent_alerts: [],
    compliance_categories: []
  });

  const [mines, setMines] = useState<Mine[]>([]);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddMineOpen, setIsAddMineOpen] = useState(false);
  const [isAssignInspectorOpen, setIsAssignInspectorOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, minesList, alertsList, inspsList] = await Promise.all([
        dashboardService.getAdminDashboard(),
        mineService.getAllMines(),
        alertService.getAllAlerts(),
        inspectionService.getAllInspections()
      ]);
      setDashboardData(dash);
      setMines(minesList);
      setAlerts(alertsList);
      setInspections(inspsList);
    } catch (e: any) {
      console.error('Failed loading admin dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Government Control Portal Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(90deg, rgba(5,19,31,0.95) 0%, rgba(5,19,31,0.72) 55%, rgba(5,19,31,0.35) 100%), url("https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1800&q=82") center/cover`
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[10px] font-bold tracking-widest text-[#c4d7e2] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#19a974] shadow-[0_0_6px_#19a974]" />
              Government Control Portal · Ministry of Coal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              National Coal Mine Governance Panel
            </h1>
            <p className="text-xs text-[#d6e3eb] leading-relaxed">
              Real-time pan-India spatial monitoring, statutory compliance oversight, AI risk detection, and inspector workload orchestration.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 border-l-4 border-l-[#38bca8] text-[11px] text-white">
              Sovereign DGMS Compliance Engine Active · 100% Audit Readiness
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#04121f]/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 min-w-[110px] text-center">
              <span className="block text-[10px] text-[#a9c0cc] uppercase font-bold">Active Mines</span>
              <strong className="block text-2xl font-black text-white mt-1">
                {isLoading ? '...' : dashboardData.total_mines}
              </strong>
            </div>
            <div className="bg-[#04121f]/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 min-w-[110px] text-center">
              <span className="block text-[10px] text-[#a9c0cc] uppercase font-bold">High Risk</span>
              <strong className="block text-2xl font-black text-[#df4d52] mt-1">
                {isLoading ? '...' : dashboardData.high_risk_mines}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Registered Mines"
          value={isLoading ? '...' : String(dashboardData.total_mines)}
          subtext="+2.5% from last quarter"
          subtextColor="green"
          icon={<Pickaxe className="w-5 h-5" />}
          onClick={() => navigate('/admin/mines')}
        />
        <KpiCard
          label="Compliant Mines"
          value={isLoading ? '...' : String(dashboardData.compliant_mines)}
          subtext={`${dashboardData.compliance_rate}% National Compliance Rate`}
          subtextColor="green"
          icon={<CheckCircle2 className="w-5 h-5" />}
          onClick={() => navigate('/admin/compliance')}
        />
        <KpiCard
          label="Pending Violations"
          value={isLoading ? '...' : String(dashboardData.pending_violations)}
          subtext="+12 new cases this week"
          subtextColor="red"
          icon={<AlertTriangle className="w-5 h-5" />}
          onClick={() => navigate('/admin/alerts')}
        />
        <KpiCard
          label="Resolved Reports"
          value={isLoading ? '...' : String(dashboardData.resolved_reports)}
          subtext="Case Resolution Verified"
          subtextColor="green"
          icon={<FileCheck2 className="w-5 h-5" />}
          onClick={() => navigate('/admin/reports')}
        />
      </div>

      {/* Row 1: Compliance Donut, India Spatial Map, Recent AI Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Donut Card */}
        <div className="lg:col-span-4 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              National Compliance Breakdown
            </h3>
            <button
              onClick={() => navigate('/admin/compliance')}
              className="text-[11px] font-bold text-[#126fba] hover:underline flex items-center gap-1"
            >
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-5 py-2">
            <div
              className="w-32 h-32 rounded-full relative flex items-center justify-center shrink-0 shadow-inner"
              style={{
                background: `conic-gradient(#18a873 0% ${dashboardData.compliance_rate}%, #e7a92b ${dashboardData.compliance_rate}% 87.3%, #df4d52 87.3% 100%)`
              }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                <strong className="text-xl font-black text-[#152737]">{dashboardData.compliance_rate}%</strong>
                <span className="text-[9px] text-[#728594] font-semibold">Compliant</span>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#526a79]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#18a873]" /> Compliant
                </span>
                <strong className="text-[#152737]">{dashboardData.compliant_mines} ({dashboardData.compliance_rate}%)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#526a79]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e7a92b]" /> High Risk
                </span>
                <strong className="text-[#152737]">{dashboardData.high_risk_mines}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#526a79]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#df4d52]" /> Active Alerts
                </span>
                <strong className="text-[#152737]">{dashboardData.active_alerts}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* India Map Representation */}
        <div className="lg:col-span-4 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              Mines Across India
            </h3>
            <button
              onClick={() => navigate('/admin/mines')}
              className="text-[11px] font-bold text-[#126fba] hover:underline"
            >
              View Overview →
            </button>
          </div>

          <div className="h-44 bg-gradient-to-br from-[#edf4f8] to-[#f8fafc] rounded-xl relative flex items-center justify-center overflow-hidden border border-[#e2e9ee]">
            <div className="text-7xl opacity-80 select-none">🇮🇳</div>
            {/* Animated Pin Markers */}
            <div className="absolute top-[28%] left-[58%] w-3 h-3 rounded-full bg-[#df4d52] border-2 border-white shadow-md animate-pulse" title="Jharia / Dhanbad (High Alert)" />
            <div className="absolute top-[48%] left-[48%] w-3 h-3 rounded-full bg-[#18a873] border-2 border-white shadow-md animate-pulse" title="Korba Central (Compliant)" />
            <div className="absolute top-[60%] left-[62%] w-3 h-3 rounded-full bg-[#e7a92b] border-2 border-white shadow-md animate-pulse" title="Talcher Angul (Under Review)" />
            <div className="absolute top-[72%] left-[42%] w-3 h-3 rounded-full bg-[#18a873] border-2 border-white shadow-md animate-pulse" title="Singareni (Compliant)" />

            <div className="absolute bottom-2.5 right-2.5 bg-[#071827]/90 text-white px-2.5 py-1.5 rounded-lg text-[10px] space-y-0.5 backdrop-blur-sm">
              <div>Major States: <strong>12</strong></div>
              <div>Operating Basins: <strong>38</strong></div>
            </div>
          </div>
        </div>

        {/* Recent AI Alerts */}
        <div className="lg:col-span-4 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#e5a52a]" />
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Recent AI Alerts
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/alerts')}
              className="text-[11px] font-bold text-[#126fba] hover:underline"
            >
              All ({alerts.length}) →
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {alerts.slice(0, 3).map((al) => (
              <div
                key={al.id}
                onClick={() => navigate('/admin/alerts')}
                className="p-2.5 rounded-xl border border-[#e2e9ee] hover:border-[#126fba]/50 hover:bg-[#f8fafb] transition-all cursor-pointer flex items-start gap-2.5"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                    al.severity === 'Critical' || al.severity === 'High'
                      ? 'bg-rose-100 text-[#df4d52]'
                      : al.severity === 'Medium'
                      ? 'bg-amber-100 text-[#91640b]'
                      : 'bg-blue-100 text-[#126fba]'
                  }`}
                >
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#152737] truncate">{al.title}</h4>
                  <p className="text-[10px] text-[#728594] truncate">
                    {al.mineName} · {al.detectedAt}
                  </p>
                </div>
                <StatusBadge status={al.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Inspections & Administrative Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Inspections Table */}
        <div className="lg:col-span-8 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
                Upcoming DGMS Field Inspections
              </h3>
              <p className="text-[11px] text-[#728594]">Authorized audits scheduled across coalfields</p>
            </div>
            <button
              onClick={() => navigate('/admin/inspections')}
              className="text-[11px] font-bold text-[#126fba] hover:underline"
            >
              Manage Inspections →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                  <th className="py-2.5 px-3 font-semibold">Inspection ID</th>
                  <th className="py-2.5 px-3 font-semibold">Mine Location</th>
                  <th className="py-2.5 px-3 font-semibold">Inspector</th>
                  <th className="py-2.5 px-3 font-semibold">Scheduled Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e9ee]">
                {inspections.slice(0, 3).map((ins) => (
                  <tr key={ins.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#126fba]">{ins.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#152737]">{ins.mineName}</td>
                    <td className="py-2.5 px-3 text-[#526a79]">{ins.inspectorName}</td>
                    <td className="py-2.5 px-3 text-[#526a79]">{ins.date}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={ins.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Tiles */}
        <div className="lg:col-span-4 bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="border-b border-[#e2e9ee] pb-3">
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              Administrative Quick Actions
            </h3>
            <p className="text-[11px] text-[#728594]">Operational direct triggers</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsAssignInspectorOpen(true)}
              className="p-3.5 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-white text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>Assign Inspector</span>
            </button>

            <button
              onClick={() => setIsGenerateReportOpen(true)}
              className="p-3.5 rounded-xl bg-[#18a873] hover:bg-[#148e61] text-white text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={() => setIsAddMineOpen(true)}
              className="p-3.5 rounded-xl bg-[#e5a52a] hover:bg-[#cb9021] text-[#152737] text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Mine</span>
            </button>

            <button
              onClick={() => navigate('/admin/alerts')}
              className="p-3.5 rounded-xl bg-[#6247b5] hover:bg-[#52399e] text-white text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>View AI Insights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMineModal
        isOpen={isAddMineOpen}
        onClose={() => setIsAddMineOpen(false)}
        onMineAdded={async () => {
          await loadData();
          showToast('Mine successfully registered and dashboard metrics refreshed', 'success');
        }}
      />
      <AssignInspectorModal
        isOpen={isAssignInspectorOpen}
        onClose={() => setIsAssignInspectorOpen(false)}
        mines={mines}
        onAssigned={async () => {
          await loadData();
          showToast('Inspection assigned and workload metrics updated', 'success');
        }}
      />
      <GenerateReportModal
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
      />
    </div>
  );
};
