import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  const buttonStyles = {
    primary: 'bg-[#126fba] hover:bg-[#0f60a1] text-white',
    danger: 'bg-[#df4d52] hover:bg-[#c93b40] text-white',
    warning: 'bg-[#e5a52a] hover:bg-[#cb9021] text-white'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'danger'
              ? 'bg-rose-100 text-[#df4d52]'
              : variant === 'warning'
              ? 'bg-amber-100 text-[#b58117]'
              : 'bg-blue-100 text-[#126fba]'
          }`}
        >
          {variant === 'danger' || variant === 'warning' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-[#526a79] leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-[#e2e9ee]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-[#526a79] bg-white border border-[#e2e9ee] hover:bg-slate-50 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm ${buttonStyles[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
