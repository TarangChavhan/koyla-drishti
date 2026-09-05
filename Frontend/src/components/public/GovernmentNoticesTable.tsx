import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  X, 
  Printer, 
  Share2, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { GOVERNMENT_NOTICES, GovernmentNotice } from '../../data/noticesData';
import { useToast } from '../../context/ToastContext';

interface GovernmentNoticesTableProps {
  initialLimit?: number;
  showAllControls?: boolean;
}

export const GovernmentNoticesTable: React.FC<GovernmentNoticesTableProps> = ({
  initialLimit,
  showAllControls = true
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<GovernmentNotice | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter notices based on criteria
  const filteredNotices = useMemo(() => {
    return GOVERNMENT_NOTICES.filter((notice) => {
      const matchesSearch = 
        notice.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.actReference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAuthority = 
        selectedAuthority === 'all' || notice.authorityShort === selectedAuthority;

      const matchesCategory = 
        selectedCategory === 'all' || notice.category === selectedCategory;

      const matchesUrgency = 
        selectedUrgency === 'all' || notice.urgency === selectedUrgency;

      return matchesSearch && matchesAuthority && matchesCategory && matchesUrgency;
    });
  }, [searchTerm, selectedAuthority, selectedCategory, selectedUrgency]);

  const displayedNotices = initialLimit ? filteredNotices.slice(0, initialLimit) : filteredNotices;

  const handleDownload = (notice: GovernmentNotice) => {
    showToast(`Downloading official gazette PDF for ${notice.refNo}...`, 'info');
    setTimeout(() => {
      showToast(`Downloaded ${notice.refNo} (${notice.fileSize}) successfully.`, 'success');
    }, 1000);
  };

  const handlePrintTable = () => {
    setIsExporting(true);
    showToast('Preparing official circular registry for printing...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = ['Ref No', 'Date', 'Authority', 'Title', 'Category', 'Urgency', 'Act Reference'];
    const rows = filteredNotices.map(n => [
      `"${n.refNo}"`,
      `"${n.date}"`,
      `"${n.authorityShort}"`,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.category}"`,
      `"${n.urgency}"`,
      `"${n.actReference}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `koyla_drishti_statutory_notices_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported statutory notices table to CSV successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Search, Category Filters, Export */}
      {showAllControls && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search circulars by Ref No, Subject, Act, or Authority..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportCSV}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export filtered records as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrintTable}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print current notices table"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Print Table</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Authority:</span>
            </span>
            {[
              { id: 'all', label: 'All Authorities' },
              { id: 'DGMS', label: 'DGMS HQ' },
              { id: 'MoC', label: 'Ministry of Coal' },
              { id: 'CMPDI', label: 'CMPDI Geomatics' },
              { id: 'MoEFCC', label: 'MoEFCC Environmental' },
            ].map((auth) => (
              <button
                key={auth.id}
                onClick={() => setSelectedAuthority(auth.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedAuthority === auth.id 
                    ? 'bg-blue-900 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {auth.label}
              </button>
            ))}

            <span className="text-slate-600 font-semibold flex items-center gap-1 ml-2 mr-1">
              <span>Category:</span>
            </span>
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'Safety', label: 'Safety' },
              { id: 'Technical', label: 'Technical' },
              { id: 'Gazette', label: 'Gazette' },
              { id: 'Environmental', label: 'Environmental' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Tabular View: Responsive Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Summary Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-semibold text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Government Gazette & Statutory Circular Register</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold text-[11px]">
              {filteredNotices.length} Recorded
            </span>
          </div>
          <span className="text-[11px] text-slate-600">
            Official repository maintained by Directorate General of Mines Safety & Ministry of Coal
          </span>
        </div>

        {/* The Tabular Format */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#071a2b] text-white text-[11px] uppercase tracking-wider font-semibold border-b border-[#142e44]">
                <th scope="col" className="py-3 px-4 w-12 text-center">Sl.</th>
                <th scope="col" className="py-3 px-4 min-w-[170px]">Notice / Ref. No.</th>
                <th scope="col" className="py-3 px-4 min-w-[100px]">Issue Date</th>
                <th scope="col" className="py-3 px-4 min-w-[130px]">Issuing Authority</th>
                <th scope="col" className="py-3 px-4 min-w-[280px]">Subject & Statutory Mandate</th>
                <th scope="col" className="py-3 px-4 min-w-[110px]">Category</th>
                <th scope="col" className="py-3 px-4 min-w-[120px]">Status</th>
                <th scope="col" className="py-3 px-4 w-28 text-center">Official Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {displayedNotices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600 space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="font-semibold text-sm text-slate-800">No matching statutory notices found</p>
                    <p className="text-xs text-slate-600">Try adjusting your search query or reset the category filters.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedAuthority('all');
                        setSelectedCategory('all');
                        setSelectedUrgency('all');
                      }}
                      className="mt-2 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                displayedNotices.map((notice, index) => {
                  return (
                    <tr 
                      key={notice.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Sl No */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-medium">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* Notice / Ref No */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                          {notice.refNo}
                        </div>
                        <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <span>{notice.fileSize}</span>
                          <span>•</span>
                          <span>PDF Gazette</span>
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{notice.date}</span>
                        </div>
                      </td>

                      {/* Authority */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          notice.authorityShort === 'DGMS' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                            : notice.authorityShort === 'MoC' 
                            ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                            : notice.authorityShort === 'CMPDI' 
                            ? 'bg-cyan-100 text-cyan-900 border border-cyan-200' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span>{notice.authorityShort}</span>
                        </span>
                        <div className="text-[10px] text-slate-600 mt-1 line-clamp-1">
                          {notice.signatory.split(',')[0]}
                        </div>
                      </td>

                      {/* Subject & Statutory Mandate */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedNotice(notice)}
                          className="text-left font-bold text-slate-900 hover:text-blue-700 transition-colors leading-snug cursor-pointer line-clamp-2"
                        >
                          {notice.title}
                        </button>
                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                          {notice.description}
                        </div>
                        <div className="text-[10px] font-mono text-blue-700 mt-1 flex items-center gap-1">
                          <span className="font-semibold">Mandate:</span>
                          <span>{notice.actReference}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {notice.category}
                        </span>
                      </td>

                      {/* Enforcement Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          notice.urgency === 'Immediate'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : notice.urgency === 'Mandatory'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : notice.urgency === 'Compliance Required'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            notice.urgency === 'Immediate' ? 'bg-red-600 animate-pulse' :
                            notice.urgency === 'Mandatory' ? 'bg-amber-600' :
                            notice.urgency === 'Compliance Required' ? 'bg-blue-600' : 'bg-slate-500'
                          }`}></span>
                          <span>{notice.urgency}</span>
                        </span>
                        <div className="text-[10px] text-slate-600 mt-0.5">
                          Eff: {notice.effectiveDate}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedNotice(notice)}
                            title="View Full Gazette Circular"
                            className="min-h-[34px] min-w-[34px] p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownload(notice)}
                            title="Download Official Gazette PDF"
                            className="min-h-[34px] min-w-[34px] p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stat / Disclaimer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All notices published under statutory authority of Mines Act 1952 & CMR 2017.</span>
          </div>
          <div className="font-mono text-slate-600">
            Showing {displayedNotices.length} of {filteredNotices.length} notices
          </div>
        </div>
      </div>

      {/* Modal: Full Government Notice Gazette Preview */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gazette Header with Emblem Style */}
            <div className="bg-[#071a2b] text-white p-6 relative">
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg font-serif">
                  GOI
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Official Statutory Circular · Government of India
                  </span>
                  <h3 className="text-lg font-bold font-serif text-white mt-0.5">
                    {selectedNotice.authority}
                  </h3>
                </div>
              </div>
            </div>

            {/* Gazette Notice Details */}
            <div className="p-6 space-y-5 text-slate-800 text-xs sm:text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-600 uppercase">Circular Ref No</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedNotice.refNo}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 uppercase">Issue Date</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedNotice.date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 uppercase">Enforcement</div>
                  <div className="font-bold text-red-700 mt-0.5">{selectedNotice.urgency}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 uppercase">Effective Date</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedNotice.effectiveDate}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-extrabold text-slate-950 font-serif leading-tight">
                  {selectedNotice.title}
                </h4>
                <div className="text-xs font-mono text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 inline-block">
                  Statutory Reference: {selectedNotice.actReference}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">Directive Summary</h5>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedNotice.description}
                </p>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="font-semibold text-slate-800">Target Collieries & Establishments:</div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                  {selectedNotice.targetCollieries}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Authorized Signatory: </span>
                  <span>{selectedNotice.signatory}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  Statutory Signed
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleDownload(selectedNotice)}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Gazette PDF ({selectedNotice.fileSize})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
