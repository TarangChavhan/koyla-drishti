import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { inspectionService } from '../../services/inspectionService';
import { useToast } from '../../context/ToastContext';
import { Inspection, InspectionStatus } from '../../types';
import { FileUpload } from '../common/FileUpload';
import { CheckCircle2, Circle, AlertCircle, Send, Check } from 'lucide-react';

interface InspectionExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
  onSaved?: () => void;
}

export const InspectionExecutionModal: React.FC<InspectionExecutionModalProps> = ({
  isOpen,
  onClose,
  inspection,
  onSaved
}) => {
  const { showToast } = useToast();
  const [checklist, setChecklist] = useState<{ id: string; label: string; completed: boolean; findings?: string }[]>(
    inspection?.checklistItems || []
  );
  const [observations, setObservations] = useState(inspection?.observations || '');
  const [recommendations, setRecommendations] = useState(inspection?.recommendations || '');
  const [finalStatus, setFinalStatus] = useState<InspectionStatus>(inspection?.status || 'In Progress');

  if (!inspection) return null;

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const updateFindings = (id: string, findings: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, findings } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update inspection
    inspectionService.updateInspection(inspection.id, {
      checklistItems: checklist,
      observations,
      recommendations,
      status: finalStatus,
      evidenceFilesCount: inspection.evidenceFilesCount + 1
    });

    showToast(`Inspection report for ${inspection.id} updated (${finalStatus})`, 'success');
    if (onSaved) onSaved();
    onClose();
  };

  const completedCount = checklist.filter((c) => c.completed).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Field Inspection: ${inspection.id}`}
      subtitle={`${inspection.mineName} · ${inspection.inspectionType} Inspection`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Inspection Header stats */}
        <div className="p-3 bg-slate-50 border border-[#e2e9ee] rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[#728594] block text-[11px]">Inspector in Charge</span>
            <strong className="text-[#152737]">{inspection.inspectorName}</strong>
          </div>
          <div>
            <span className="text-[#728594] block text-[11px]">Date & Time</span>
            <strong className="text-[#152737]">{inspection.date} · {inspection.time || '10:00 AM'}</strong>
          </div>
          <div>
            <span className="text-[#728594] block text-[11px]">Checklist Progress</span>
            <strong className="text-[#126fba]">{completedCount} of {checklist.length} Verified</strong>
          </div>
        </div>

        {/* Statutory Inspection Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              Statutory Verification Checklist
            </h4>
            <span className="text-[11px] text-[#728594]">Click item to mark verified</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-colors ${
                  item.completed
                    ? 'bg-[#f0faf5] border-[#bfe8d2]'
                    : 'bg-white border-[#e2e9ee] hover:border-slate-300'
                }`}
              >
                <div
                  className="flex items-center gap-2.5 cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      item.completed ? 'bg-[#19a974] text-white' : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-xs font-medium flex-1 ${item.completed ? 'text-[#14704f] font-semibold' : 'text-[#152737]'}`}>
                    {item.label}
                  </span>
                </div>

                <div className="mt-2 pl-7.5">
                  <input
                    type="text"
                    value={item.findings || ''}
                    onChange={(e) => updateFindings(item.id, e.target.value)}
                    placeholder="Specific findings, measurement values or observations..."
                    className="w-full px-2.5 py-1 bg-white border border-[#e2e9ee] rounded-md text-[11px] text-[#152737] outline-none focus:border-[#126fba]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations and Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#526a79] mb-1">Inspector Site Observations</label>
            <textarea
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Record ground conditions, ventilation, blast vibration, machinery status..."
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#526a79] mb-1">Direct Recommendations to Authority</label>
            <textarea
              rows={3}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Specify mandatory rectifications, equipment repairs, or safety drills..."
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>
        </div>

        {/* Evidence & Photo Upload */}
        <div>
          <FileUpload
            label="Upload Site Photos, Air Sensor Calibration & Inspection Notes"
            helperText="Photos (JPG/PNG), Inspection Sheets (PDF) up to 10 MB"
            onFileSelect={() => showToast('Evidence photo queued for upload', 'info')}
          />
        </div>

        {/* Final Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[#e2e9ee]">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#526a79]">Workflow Status:</label>
            <select
              value={finalStatus}
              onChange={(e) => setFinalStatus(e.target.value as InspectionStatus)}
              className="px-2.5 py-1 bg-white border border-[#e2e9ee] rounded-lg text-xs font-semibold text-[#152737] outline-none"
            >
              <option value="In Progress">In Progress (Field audit ongoing)</option>
              <option value="Submitted">Submitted for DGMS Review</option>
              <option value="Completed">Completed & Verified</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#526a79] bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Save & Submit Report
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
