import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { MineDocument } from '../../types';
import { FileText, Download, ShieldCheck, Calendar, HardDrive, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MineDocument | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc
}) => {
  const { showToast } = useToast();
  if (!doc) return null;

  const handleDownload = () => {
    showToast(`Downloading ${doc.fileName}...`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doc.title}
      subtitle={`Statutory Mine Document · ${doc.id}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Document metadata card */}
        <div className="p-4 bg-slate-50 border border-[#e2e9ee] rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#728594]">Verification Status</span>
            <StatusBadge status={doc.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e2e9ee]">
            <div>
              <span className="text-[#728594] text-[11px] block">Category</span>
              <strong className="text-[#152737]">{doc.category}</strong>
            </div>
            <div>
              <span className="text-[#728594] text-[11px] block">File Size & Type</span>
              <strong className="text-[#152737]">{doc.fileSize} · {doc.fileType.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-[#728594] text-[11px] block">Uploaded On</span>
              <strong className="text-[#152737]">{doc.uploadDate}</strong>
            </div>
            <div>
              <span className="text-[#728594] text-[11px] block">Statutory Validity Till</span>
              <strong className="text-[#152737]">{doc.expiryDate || 'Continuous Renewal'}</strong>
            </div>
          </div>
        </div>

        {/* Simulated Document Preview Viewer */}
        <div className="p-8 border-2 border-dashed border-[#bac9d2] rounded-xl bg-[#f9fbfc] text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md mx-auto flex items-center justify-center text-[#126fba]">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#152737]">{doc.fileName}</h4>
            <p className="text-xs text-[#728594] mt-1">
              Digitally signed with Government of India National Coal Governance PKI Certificate.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5f7ee] text-[#14704f] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity Check Passed (SHA-256 Verified)
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#e2e9ee]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#516777] bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2 text-xs font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download Original File
          </button>
        </div>
      </div>
    </Modal>
  );
};
