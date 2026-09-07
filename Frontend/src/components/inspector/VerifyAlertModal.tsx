import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { alertService } from '../../services/alertService';
import { violationService } from '../../services/violationService';
import { useToast } from '../../context/ToastContext';
import { AIAlert, ViolationSeverity } from '../../types';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Send,
  AlertTriangle
} from 'lucide-react';

interface VerifyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AIAlert | null;
  onUpdated?: () => void;
}

export const VerifyAlertModal: React.FC<VerifyAlertModalProps> = ({
  isOpen,
  onClose,
  alert,
  onUpdated
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'review' | 'violation'>('review');
  const [officerNote, setOfficerNote] = useState('');
  const [violationCategory, setViolationCategory] = useState('Safety Compliance');
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [correctiveDirectives, setCorrectiveDirectives] = useState('');

  if (!alert) return null;

  const handleVerify = async () => {
    try {
      await alertService.updateAlertStatus(alert.id, 'Verified', officerNote);
      showToast(`AI Alert ${alert.id} verified as legitimate observation`, 'success');
      if (onUpdated) onUpdated();
      setActiveTab('violation');
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'warn');
    }
  };

  const handleRejectFalsePositive = async () => {
    try {
      await alertService.updateAlertStatus(alert.id, 'False Positive', officerNote || 'Marked as false detection after site review');
      showToast(`Alert ${alert.id} dismissed as False Positive`, 'info');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to dismiss alert', 'warn');
    }
  };

  const handleCreateViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));
    const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    try {
      await violationService.createViolation({
        mineId: alert.mineId,
        mineName: alert.mineName,
        category: violationCategory,
        severity: alert.severity as ViolationSeverity,
        description: alert.detectedIssue,
        issuedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        deadline: formattedDeadline,
        assignedInspector: alert.assignedInspector || 'Rajesh Sharma, DGMS',
        status: 'Open',
        correctiveActionText: correctiveDirectives || alert.recommendedAction
      });

      showToast(`Statutory Violation Case and Corrective Action issued to ${alert.mineName}`, 'success');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to issue statutory violation order', 'warn');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Signal Review: ${alert.id}`}
      subtitle={`${alert.mineName} · ${alert.location}`}
      maxWidth="lg"
    >
      {/* Tabs */}
      <div className="flex border-b border-[#e2e9ee] mb-4">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'review' ? 'border-[#126fba] text-[#126fba]' : 'border-transparent text-[#728594]'
          }`}
        >
          1. AI Anomaly Examination
        </button>
        <button
          onClick={() => setActiveTab('violation')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'violation' ? 'border-[#df4d52] text-[#df4d52]' : 'border-transparent text-[#728594]'
          }`}
        >
          2. Issue Statutory Violation & Directive
        </button>
      </div>

      {activeTab === 'review' ? (
        <div className="space-y-4">
          {/* AI Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d2639] to-[#071827] text-white flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#f4be51]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#98b8cc]">
                  Neural Anomaly Detection
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{alert.title}</h4>
              <p className="text-[11px] text-[#8ea7b8] mt-0.5">Detected: {alert.detectedAt}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#98b8cc] uppercase block">AI Confidence</span>
              <strong className="text-2xl font-black text-[#f4be51]">{alert.confidenceScore}%</strong>
              <div className="mt-1">
                <StatusBadge status={alert.severity} size="sm" />
              </div>
            </div>
          </div>

          {/* Coordinates & Location */}
          {alert.satelliteCoordinates && (
            <div className="flex items-center gap-2 text-xs text-[#526a79] bg-slate-50 p-2.5 rounded-lg border border-[#e2e9ee]">
              <MapPin className="w-4 h-4 text-[#df4d52] shrink-0" />
              <span>Geo-Coordinates: <strong>{alert.satelliteCoordinates}</strong></span>
              <span className="ml-auto text-[11px] text-[#728594]">Demarcated Sector Lease Boundary</span>
            </div>
          )}

          {/* Issue & Supporting Evidence */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-[#526a79] block mb-1">Detected Anomaly Findings:</span>
              <p className="bg-[#f8fafc] border border-[#e2e9ee] p-3 rounded-xl text-[#152737] leading-relaxed">
                {alert.detectedIssue}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#526a79] block mb-1">Supporting Telemetry / Satellite Evidence:</span>
              <p className="bg-[#f8fafc] border border-[#e2e9ee] p-3 rounded-xl text-[#152737] leading-relaxed">
                {alert.supportingEvidence}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#526a79] block mb-1">Intelligence Recommended Action:</span>
              <p className="bg-[#eef6fc] border border-[#cbe0f1] p-3 rounded-xl text-[#11548a] leading-relaxed">
                {alert.recommendedAction}
              </p>
            </div>
          </div>

          {/* Inspector verification notes */}
          <div>
            <label className="block text-xs font-bold text-[#526a79] mb-1">
              Inspector Verification Note & Observations
            </label>
            <textarea
              rows={2}
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="Record ground check findings, photo reference or instrument calibration check..."
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2e9ee]">
            <button
              type="button"
              onClick={handleRejectFalsePositive}
              className="px-4 py-2 text-xs font-bold text-[#df4d52] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Dismiss as False Positive
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleVerify}
                className="px-4 py-2 text-xs font-bold text-white bg-[#159e89] hover:bg-[#128674] rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify & Advance to Violation
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateViolation} className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              By issuing a violation, this case will officially enter the statutory compliance registry. Mine authority will receive a direct notification and must respond with evidence before the statutory deadline.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#526a79] mb-1">Violation Category</label>
              <select
                value={violationCategory}
                onChange={(e) => setViolationCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              >
                <option value="Safety Compliance">Safety Compliance</option>
                <option value="Environmental Parameter">Environmental Parameter</option>
                <option value="Equipment & Mechanical">Equipment & Mechanical</option>
                <option value="Leasehold Encroachment">Leasehold Encroachment</option>
                <option value="Labour & Welfare">Labour & Welfare</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#526a79] mb-1">Response Deadline (Days)</label>
              <select
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              >
                <option value={3}>3 Days (Emergency / Critical)</option>
                <option value={7}>7 Days (Statutory High)</option>
                <option value={14}>14 Days (Medium Severity)</option>
                <option value={30}>30 Days (Documentary Renewal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#526a79] mb-1">
              Mandatory Corrective Action Directive for Mine Operator
            </label>
            <textarea
              rows={3}
              value={correctiveDirectives || alert.recommendedAction}
              onChange={(e) => setCorrectiveDirectives(e.target.value)}
              placeholder="State precise technical rectifications, sensor deployments, or engineering reports required..."
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div className="flex justify-between gap-3 pt-3 border-t border-[#e2e9ee]">
            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className="px-4 py-2 text-xs font-semibold text-[#526a79] bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              ← Back to Review
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#df4d52] hover:bg-[#c4383d] rounded-lg shadow flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              Issue Statutory Violation Order
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
