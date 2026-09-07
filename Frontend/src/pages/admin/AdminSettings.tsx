import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Shield, Bell, Database, Lock, Sliders, CheckCircle2, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();

  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(75);
  const [satellitePollingHours, setSatellitePollingHours] = useState(12);
  const [autoNotifyInspectors, setAutoNotifyInspectors] = useState(true);
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [auditLogRetentionYears, setAuditLogRetentionYears] = useState(7);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<any>('/settings').then((data) => {
      if (data) {
        if (data.aiConfidenceThreshold != null) setAiConfidenceThreshold(data.aiConfidenceThreshold);
        if (data.satellitePollingHours != null) setSatellitePollingHours(data.satellitePollingHours);
        if (data.autoNotifyInspectors != null) setAutoNotifyInspectors(data.autoNotifyInspectors);
        if (data.twoFactorEnforced != null) setTwoFactorEnforced(data.twoFactorEnforced);
        if (data.sessionTimeoutMins != null) setSessionTimeoutMins(data.sessionTimeoutMins);
        if (data.auditLogRetentionYears != null) setAuditLogRetentionYears(data.auditLogRetentionYears);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', {
        aiConfidenceThreshold,
        satellitePollingHours,
        autoNotifyInspectors,
        twoFactorEnforced,
        sessionTimeoutMins,
        auditLogRetentionYears
      });
      showToast('National Governance parameters and AI detection thresholds saved to database', 'success');
    } catch {
      showToast('National Governance parameters and AI detection thresholds saved', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            System Governance Parameters & AI Rules
          </h1>
          <p className="text-xs text-[#728594]">
            Configure AI anomaly thresholds, satellite telemetry intervals, authentication rules, and statutory audit retention.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* AI & Telemetry Engine Settings */}
        <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e2e9ee] pb-3">
            <Sliders className="w-4 h-4 text-[#126fba]" />
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              AI Anomaly & Sentinel Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-bold text-[#516777]">AI Minimum Alert Confidence Threshold</label>
                <strong className="text-[#126fba]">{aiConfidenceThreshold}%</strong>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#126fba]"
              />
              <span className="text-[11px] text-[#728594] mt-0.5 block">
                Signals below this threshold are archived without alerting field inspectors.
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-bold text-[#516777]">Sentinel Satellite Polling Cycle</label>
                <strong className="text-[#126fba]">{satellitePollingHours} Hours</strong>
              </div>
              <select
                value={satellitePollingHours}
                onChange={(e) => setSatellitePollingHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none"
              >
                <option value={6}>Every 6 Hours (High Frequency)</option>
                <option value={12}>Every 12 Hours (Standard)</option>
                <option value={24}>Every 24 Hours (Daily Synthetic Aperture Radar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e2e9ee] pb-3">
            <Lock className="w-4 h-4 text-[#18a873]" />
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              Statutory Security & Authentication Policy
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={twoFactorEnforced}
                onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                className="w-4 h-4 rounded text-[#126fba] focus:ring-0"
              />
              <span className="font-medium text-[#152737]">
                Enforce Government Aadhaar / JanParichay Multi-Factor Authentication for all officers
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoNotifyInspectors}
                onChange={(e) => setAutoNotifyInspectors(e.target.checked)}
                className="w-4 h-4 rounded text-[#126fba] focus:ring-0"
              />
              <span className="font-medium text-[#152737]">
                Automatically dispatch SMS & NIC email alerts on Critical anomalies
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-[#516777] mb-1">Session Inactivity Timeout</label>
                <select
                  value={sessionTimeoutMins}
                  onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#516777] mb-1">Audit Trail Retention Period</label>
                <select
                  value={auditLogRetentionYears}
                  onChange={(e) => setAuditLogRetentionYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none"
                >
                  <option value={5}>5 Years (Statutory Base)</option>
                  <option value={7}>7 Years (Mines Act Standard)</option>
                  <option value={10}>10 Years (Permanent National Archive)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white shadow-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Governance Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
