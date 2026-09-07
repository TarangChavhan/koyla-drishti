import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { violationService } from '../../services/violationService';
import { useToast } from '../../context/ToastContext';
import { CorrectiveAction } from '../../types';
import { FileUpload } from '../common/FileUpload';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

interface SubmitEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: CorrectiveAction | null;
  onSubmitted?: () => void;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({
  isOpen,
  onClose,
  action,
  onSubmitted
}) => {
  const { showToast } = useToast();
  const [responseNote, setResponseNote] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!action) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseNote.trim()) {
      showToast('Please provide a technical explanation of the remediation undertaken.', 'warn');
      return;
    }

    setIsSubmitting(true);
    try {
      await violationService.submitMineResponse(action.id, responseNote, selectedFileName || 'Verification_Evidence_Dossier.pdf');
      showToast(`Corrective evidence submitted for ${action.id}. Forwarded to inspector.`, 'success');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit corrective action response', 'warn');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Corrective Action Response: ${action.id}`}
      subtitle={`${action.mineName} · Due: ${action.dueDate}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#124d77] space-y-1">
          <strong className="block text-[#0e3c5e]">{action.title}</strong>
          <p className="leading-relaxed">{action.instructions}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#526a79] mb-1">
            Remediation Report & Mine Authority Response *
          </label>
          <textarea
            rows={4}
            required
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
            placeholder="Explain the engineering modifications, equipment repairs, chemical treatments, or personnel training completed to address the statutory violation..."
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          />
        </div>

        <div>
          <FileUpload
            label="Attach Verification Test Results, Geo-tagged Photos or Certificates"
            helperText="PDF, JPG, PNG, XLSX up to 10 MB"
            onFileSelect={(file) => {
              setSelectedFileName(file.name);
              showToast(`File ${file.name} selected`, 'info');
            }}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e9ee]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#526a79] bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-[#159e89] hover:bg-[#128674] rounded-lg shadow flex items-center gap-1.5"
          >
            {isSubmitting ? 'Uploading & Forwarding...' : 'Submit to DGMS Inspector'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
