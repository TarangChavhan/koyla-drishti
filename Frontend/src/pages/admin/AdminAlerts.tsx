import React, { useState, useMemo } from 'react';
import { alertService } from '../../services/alertService';
import { mineService } from '../../services/mineService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerifyAlertModal } from '../../components/inspector/VerifyAlertModal';
import { AssignInspectorModal } from '../../components/admin/AssignInspectorModal';
import { useToast } from '../../context/ToastContext';
import { AIAlert } from '../../types';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  Eye,
  UserPlus,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const AdminAlerts: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState(alertService.getAllAlerts());
  const [mines] = useState(mineService.getAllMines());
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [targetAlertForAssign, setTargetAlertForAssign] = useState<string | undefined>(undefined);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.mineName.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
      const matchStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Pending' || statusFilter === 'Pending Review'
          ? a.status === 'Under Review' || a.status === 'New' || a.status === 'Assigned' || a.status === 'Pending Review'
          : a.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [alerts, search, severityFilter, statusFilter]);

  const openVerify = (alert: AIAlert) => {
    setSelectedAlert(alert);
    setIsVerifyOpen(true);
  };

  const openAssign = (alertId: string) => {
    setTargetAlertForAssign(alertId);
    setIsAssignOpen(true);
  };

  const refreshAlerts = () => {
    setAlerts(alertService.getAllAlerts());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">
              Autonomous Neural Sentinel Active
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            AI Automated Alert Intelligence & Anomaly Dispatch
          </h1>
          <p className="text-xs text-[#728594]">
            Satellite optical change detection, acoustic sensors, and air particulate telemetry monitoring.
          </p>
        </div>
      </div>

      {/* KPI mini strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Active Signals</span>
          <strong className="block text-xl font-black text-[#152737] mt-0.5">{alerts.length}</strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">High / Critical</span>
          <strong className="block text-xl font-black text-[#df4d52] mt-0.5">
            {alerts.filter((a) => a.severity === 'Critical' || a.severity === 'High').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Verified by DGMS</span>
          <strong className="block text-xl font-black text-[#18a873] mt-0.5">
            {alerts.filter((a) => a.status === 'Verified').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Pending Review</span>
          <strong className="block text-xl font-black text-[#e7a92b] mt-0.5">
            {alerts.filter((a) => a.status === 'Under Review' || a.status === 'New' || a.status === 'Assigned' || a.status === 'Pending Review').length}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert title, mine name, ID..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical Severity</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review / Unresolved</option>
              <option value="Under Review">Under Review</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Verified">Verified by Officer</option>
              <option value="False Positive">False Positive</option>
            </select>
          </div>
        </div>

        {/* Alerts Cards Grid */}
        <div className="space-y-3 pt-1">
          {filteredAlerts.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#728594]">
              No AI alerts matching the selected filters.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/50 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#126fba]">{alert.id}</span>
                    <StatusBadge status={alert.severity} size="sm" />
                    <StatusBadge status={alert.status} size="sm" />
                    <span className="text-[11px] text-[#728594] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.detectedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#152737]">{alert.title}</h3>
                  <p className="text-xs text-[#526a79] leading-relaxed">{alert.detectedIssue}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#728594] pt-1">
                    <span><strong>Mine:</strong> {alert.mineName}</span>
                    <span><strong>Location:</strong> {alert.location}</span>
                    <span><strong>Assigned Inspector:</strong> {alert.assignedInspector || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#e2e9ee]">
                  <div className="text-right">
                    <span className="text-[10px] text-[#728594] uppercase font-bold block">AI Confidence</span>
                    <strong className="text-lg font-black text-[#126fba]">{alert.confidenceScore}%</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAssign(alert.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#e2e9ee] hover:bg-slate-50 text-[#526a79] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Assign Inspector"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Assign
                    </button>
                    <button
                      onClick={() => openVerify(alert)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#126fba] hover:bg-[#0f60a1] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review & Verify
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <VerifyAlertModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        alert={selectedAlert}
        onUpdated={refreshAlerts}
      />

      <AssignInspectorModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        mines={mines}
        alertId={targetAlertForAssign}
        onAssigned={refreshAlerts}
      />
    </div>
  );
};
