import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Download, 
  Calendar, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { GovernmentNoticesTable } from '../../components/public/GovernmentNoticesTable';

export const NoticesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header Bar */}
      <header className="bg-[#071a2b] text-white border-b border-[#142d44] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Home</span>
            </Link>

            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                KD
              </div>
              <div>
                <span className="text-sm font-extrabold text-white tracking-wide font-serif">
                  KOYLA DRISHTI
                </span>
                <span className="hidden md:inline-block text-[11px] text-slate-400 ml-2">
                  Statutory Government Notices & Directives
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              Officer Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Breadcrumb & Page Banner */}
      <div className="bg-[#0b2238] text-white border-b border-[#1a3854] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-semibold">Government Notices & Circulars</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Statutory Gazette Register
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                Government Notices & DGMS Circulars
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Official repository of all statutory directives, technical circulars, safety advisories, and gazette notifications issued by the Directorate General of Mines Safety (DGMS) and the Ministry of Coal.
              </p>
            </div>

            <div className="bg-[#071a2b] p-3 rounded-xl border border-[#1d466b] text-xs space-y-1 text-slate-300 font-mono shrink-0">
              <div>Enforcement Law: <strong className="text-amber-400">Mines Act 1952</strong></div>
              <div>Operating Standard: <strong className="text-cyan-300">CMR 2017</strong></div>
              <div>Digital Gazette: <strong className="text-emerald-400">Section 22/23 Ready</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabular Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <GovernmentNoticesTable initialLimit={undefined} showAllControls={true} />
      </main>

      {/* Footer */}
      <footer className="bg-[#071a2b] text-slate-400 text-xs py-6 border-t border-[#142d44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Ministry of Coal, Government of India. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/" className="hover:text-white transition-colors">Portal Home</Link>
            <Link to="/login" className="hover:text-white transition-colors">Officer Sign-In</Link>
            <span>DGMS Helpdesk: 1800-11-MINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
