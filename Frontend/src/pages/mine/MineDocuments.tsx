import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DocumentPreviewModal } from '../../components/mine/DocumentPreviewModal';
import { Modal } from '../../components/common/Modal';
import { FileUpload } from '../../components/common/FileUpload';
import { useToast } from '../../context/ToastContext';
import { MineDocument } from '../../types';
import {
  FileText,
  UploadCloud,
  Download,
  Eye,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const MineDocuments: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currentMineId = user?.mineId || 'KD-104';
  const [documents, setDocuments] = useState<MineDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [selectedDoc, setSelectedDoc] = useState<MineDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<MineDocument['category']>('Environment');
  const [docExpiry, setDocExpiry] = useState('2028-12-31');

  const loadDocs = async () => {
    try {
      const data = await reportService.getAllDocuments(currentMineId);
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDocs();
  }, [currentMineId]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || doc.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || doc.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [documents, search, categoryFilter, statusFilter]);

  // Statistics
  const verifiedCount = documents.filter((d) => d.status === 'Verified').length;
  const reviewCount = documents.filter((d) => d.status === 'Review' || d.status === 'Pending').length;

  const openPreview = (doc: MineDocument) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    try {
      const newDoc = await reportService.uploadDocument({
        mineId: currentMineId,
        mineName: user?.organization || 'Bharat Coking Coal Mine',
        title: docTitle,
        category: docCategory,
        fileName: `${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        fileSize: '4.8 MB',
        fileType: 'pdf',
        status: 'Verified',
        expiryDate: docExpiry
      });

      await loadDocs();
      showToast(`Document "${newDoc.title}" uploaded and cryptographically signed`, 'success');
      setIsUploadOpen(false);
      setDocTitle('');
    } catch (err) {
      showToast('Failed to upload document', 'warn');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#126fba]" />
            Statutory Clearances & Verified Mine Documents
          </h1>
          <p className="text-xs text-[#728594] mt-0.5">
            Environmental clearances (EC/FC), DGMS annual returns, explosive licenses (PESO), and mine lease deeds.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Upload Statutory Document
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e2e9ee] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#728594] text-xs font-semibold">
            <FileText className="w-4 h-4 text-[#126fba]" />
            <span>Total Dossiers</span>
          </div>
          <strong className="block text-2xl font-black text-[#152737] mt-1.5">{documents.length}</strong>
          <span className="text-[10px] text-[#728594]">Registered with Ministry</span>
        </div>

        <div className="bg-white border border-[#e2e9ee] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#728594] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#18a873]" />
            <span>Statutory Verified</span>
          </div>
          <strong className="block text-2xl font-black text-[#18a873] mt-1.5">{verifiedCount}</strong>
          <span className="text-[10px] text-[#728594]">Active & fully compliant</span>
        </div>

        <div className="bg-white border border-[#e2e9ee] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#728594] text-xs font-semibold">
            <Clock className="w-4 h-4 text-[#e7a92b]" />
            <span>Under Review</span>
          </div>
          <strong className="block text-2xl font-black text-[#e7a92b] mt-1.5">{reviewCount}</strong>
          <span className="text-[10px] text-[#728594]">Awaiting DGMS endorsement</span>
        </div>

        <div className="bg-white border border-[#e2e9ee] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-[#728594] text-xs font-semibold">
            <FileCheck className="w-4 h-4 text-[#728594]" />
            <span>Mine Facility ID</span>
          </div>
          <strong className="block text-xl font-bold text-[#126fba] mt-2 font-mono">{currentMineId}</strong>
          <span className="text-[10px] text-[#728594]">Colliery Repository</span>
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
              placeholder="Search document title, keyword, file name..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Statutory Categories</option>
              <option value="Environment">Environmental Clearances (EC/FC/Air)</option>
              <option value="Safety">DGMS Safety & Audits</option>
              <option value="Compliance">PESO & Lease Deeds</option>
              <option value="Equipment">HEMM & Machinery Fitness</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified by DGMS/Ministry</option>
              <option value="Review">Under Review</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl bg-[#f8fafb] border border-dashed border-[#e2e9ee] space-y-3 mt-2">
            <div className="w-12 h-12 rounded-full bg-[#edf5fb] text-[#126fba] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-[#152737]">No Statutory Documents Found</p>
              <p className="text-xs text-[#728594] max-w-sm mx-auto">
                No clearances or returns match your current filter parameters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#126fba] hover:underline"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-3.5 py-1.5 bg-[#126fba] text-white text-xs font-bold rounded-lg shadow hover:bg-[#0f60a1] transition-colors"
              >
                + Upload Document
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-[#fafcfd] border border-[#e2e9ee] rounded-xl shadow-xs hover:border-[#126fba]/40 hover:bg-white transition-all space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edf5fb] text-[#126fba] flex items-center justify-center shrink-0 border border-[#d6e7f5]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-[#152737] leading-snug">{doc.title}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#728594]">
                        <span>{doc.fileName}</span>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-semibold text-[#526a79] bg-slate-100 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-[#728594]">
                          Uploaded: {doc.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#e2e9ee] text-[11px] text-[#728594]">
                  <span>
                    Valid Until: <strong className="text-[#152737]">{doc.expiryDate || 'Continuous Renewal'}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPreview(doc)}
                      className="px-2.5 py-1 rounded-md bg-[#edf5fb] hover:bg-[#dcebf7] text-[#126fba] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      onClick={() => showToast(`Downloading ${doc.fileName}`, 'success')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Download Official File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDoc}
      />

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Statutory Clearances & Returns"
        subtitle="Ministry of Coal Document Registry"
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#516777] mb-1">Document Official Title *</label>
            <input
              type="text"
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Annual DGMS Ground Vibration Test Report"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#516777] mb-1">Statutory Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              >
                <option value="Environment">Environmental Clearance (EC/FC)</option>
                <option value="Safety">DGMS Safety Audit & Annual Return</option>
                <option value="Compliance">PESO Magazine & Explosives License</option>
                <option value="Equipment">HEMM Machinery Fitness Dossier</option>
                <option value="Operations">Mining Operations & Lease Deed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Statutory Expiry Date</label>
              <input
                type="date"
                value={docExpiry}
                onChange={(e) => setDocExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>
          </div>

          <FileUpload
            label="Attach Signed PDF Document"
            helperText="PDF up to 25 MB"
            onFileSelect={() => showToast('File attached ready for upload', 'info')}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e9ee]">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 font-semibold text-[#516777] bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload & Certify
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
