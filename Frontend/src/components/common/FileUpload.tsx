import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFormats = ['pdf', 'jpg', 'png', 'xlsx', 'csv'],
  maxSizeMB = 10,
  label = 'Supporting Documents / Evidence',
  helperText = 'Drop files here or browse · PDF, JPG, PNG, XLSX up to 10 MB'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!acceptedFormats.includes(extension)) {
      setError(`Invalid file type (.${extension}). Allowed formats: ${acceptedFormats.join(', ').toUpperCase()}`);
      return;
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setError(`File is too large (${sizeInMB.toFixed(1)} MB). Maximum allowed size is ${maxSizeMB} MB.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-[#536878]">{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#126fba] bg-[#eef5fa]'
            : 'border-[#bac9d2] bg-[#f9fbfc] hover:border-[#126fba]/60 hover:bg-[#f3f7fa]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedFormats.map((f) => `.${f}`).join(',')}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndSetFile(e.target.files[0]);
            }
          }}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#126fba]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <b className="block text-xs font-bold text-[#3d5566]">
              {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
            </b>
            <span className="text-[11px] text-[#728594]">{helperText}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-[#df4d52] font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && !error && (
        <div className="flex items-center justify-between p-2.5 bg-[#eaf5ef] rounded-lg border border-[#bfe7d1] text-xs">
          <div className="flex items-center gap-2 text-[#15704f] font-semibold truncate">
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
            <span className="text-[10px] text-[#348869]">
              ({(selectedFile.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
