import React, { useState, useMemo } from 'react';
import { alertService } from '../../services/alertService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerifyAlertModal } from '../../components/inspector/VerifyAlertModal';
import { useToast } from '../../context/ToastContext';
import { AIAlert } from '../../types';
import { Sparkles, Search, Filter, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const InspectorAlerts: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState(alertService.getAllAlerts());
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.mineName.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = filterSeverity === 'All' || a.severity === filterSeverity;
      const matchStatus =
        filterStatus === 'All'
          ? true
          : filterStatus === 'Pending' || filterStatus === 'Pending Review'
          ? a.status === 'Under Review' || a.status === 'New' || a.status === 'Assigned' || a.status === 'Pending Review'
          : a.status === filterStatus;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [alerts, search, filterSeverity, filterStatus]);

  const openVerifyModal = (a: AIAlert) => {
    setSelectedAlert(a);
    setIsVerifyOpen(true);
  };

  const refreshAlerts = () => {
    setAlerts(alertService.getAllAlerts());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            AI Anomaly Review & Statutory Adjudication
          </h1>
          <p className="text-xs text-[#728594]">
            Statutory review of neural satellite change detection, acoustic telemetry, and particulate sensors.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert, mine or ID..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Adjudication Statuses</option>
              <option value="Pending">Pending Review / Unresolved</option>
              <option value="Under Review">Under Review</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Verified">Verified by Inspector</option>
              <option value="False Positive">False Positive</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/50 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#126fba]">{alert.id}</span>
                  <StatusBadge status={alert.severity} size="sm" />
                  <StatusBadge status={alert.status} size="sm" />
                  <span className="text-[11px] text-[#728594]">{alert.detectedAt}</span>
                </div>

                <h3 className="text-sm font-bold text-[#152737]">{alert.title}</h3>
                <p className="text-xs text-[#526a79] leading-relaxed">{alert.detectedIssue}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#728594] pt-1">
                  <span>Target: <strong>{alert.mineName}</strong> ({alert.location})</span>
                  <span>Geodesy: <code>{alert.satelliteCoordinates || 'N/A'}</code></span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#e2e9ee]">
                <div className="text-right">
                  <span className="text-[10px] text-[#728594] uppercase font-bold block">AI Confidence</span>
                  <strong className="text-lg font-black text-[#159e89]">{alert.confidenceScore}%</strong>
                </div>

                <button
                  onClick={() => openVerifyModal(alert)}
                  className="px-4 py-2 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review & Adjudicate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VerifyAlertModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        alert={selectedAlert}
        onUpdated={refreshAlerts}
      />
    </div>
  );
};
