import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import {
  Shield,
  Building2,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  Lock,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSelectRoleAndProceed = (role: UserRole) => {
    setSelectedRole(role);
    switchRole(role);
    showToast(`Accessing ${role === 'admin' ? 'Government Admin' : role === 'inspector' ? 'Inspector Operations' : 'Mine Authority'} workspace`, 'info');
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'inspector') navigate('/inspector/dashboard');
    else navigate('/mine/dashboard');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    showToast(`Thank you, ${contactName}. Your support ticket has been registered in the system.`, 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="bg-[#071a2b] text-white min-h-screen font-sans selection:bg-[#f4b942] selection:text-[#071a2b]">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#071a2b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#f4b942] to-[#d58e14] text-[#142334] font-black text-base flex items-center justify-center shadow-lg shadow-amber-500/20">
              KD
            </div>
            <div>
              <strong className="block text-white text-base tracking-wider font-mono">KOYLA DRISHTI</strong>
              <span className="block text-[10px] text-[#c7d8e5] tracking-wider uppercase font-semibold">
                Ministry of Coal · Smart Mine Governance
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#eef5fa]">
            <a href="#hero" className="hover:text-[#f4b942] transition-colors">Home</a>
            <a href="#platform" className="hover:text-[#f4b942] transition-colors">Platform</a>
            <a href="#compliance" className="hover:text-[#f4b942] transition-colors">Compliance</a>
            <a href="#ai-monitoring" className="hover:text-[#f4b942] transition-colors">AI Monitoring</a>
            <a href="#contact" className="hover:text-[#f4b942] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#0c1d2c] text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#126fba]" />
              Government Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/10">
        {/* Background photo & overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(3,14,24,0.94) 0%, rgba(3,18,31,0.72) 48%, rgba(3,14,24,0.4) 100%), linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(3,14,24,0.75) 100%), url("https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=2200&q=85")`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[11px] uppercase tracking-wider text-[#eaf4fa]">
              <span className="w-2 h-2 rounded-full bg-[#4fd1c5] shadow-[0_0_8px_#4fd1c5]" />
              AI-Powered Government Intelligence System
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              See Every Mine.<br />
              <span className="text-[#f4b942]">Know Every Risk.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#d7e3ec] leading-relaxed max-w-xl">
              A smart governance and compliance intelligence platform that helps authorities monitor coal mines, identify risks, verify violations, and drive corrective actions from one secure enterprise system.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#roles"
                className="px-6 py-3.5 rounded-xl bg-[#f4b942] hover:bg-[#ffc95e] text-[#112130] text-xs font-bold transition-all shadow-lg shadow-amber-500/15 hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                Access Portal Workspaces <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#ai-monitoring"
                className="px-6 py-3.5 rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 text-white text-xs font-bold backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                Explore Intelligence Workflow
              </a>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-xs text-[#bfd0dc] border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[#4fd1c5] font-black text-sm">✓</span>
                <span>Role-Based Sovereign Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#4fd1c5] font-black text-sm">✓</span>
                <span>Automated Satellite & Sensor AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#4fd1c5] font-black text-sm">✓</span>
                <span>Statutory DGMS Compliance</span>
              </div>
            </div>
          </div>

          {/* Floating Live Compliance Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-[#051422]/85 border border-white/20 p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] uppercase tracking-wider text-[#b9cedc] font-semibold">
                  Live National Mine Intelligence
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19a974] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19a974]" />
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <strong className="text-4xl sm:text-5xl font-extrabold text-white">88%</strong>
                  <span className="text-[#4fd1c5] text-xs font-bold">Good Standing</span>
                </div>
                <div className="text-xs text-[#9eb5c4] mt-0.5">Average National Compliance Score</div>
                <div className="h-2 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4fd1c5] to-[#74e5ba] rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[10px] text-[#91a8b7] uppercase block">Total Mines</span>
                  <b className="text-lg text-white">412</b>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[10px] text-[#91a8b7] uppercase block">Current Risk</span>
                  <b className="text-lg text-[#71e6bc]">Low</b>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#cedce6]">
                <span>Active Field Inspections</span>
                <b className="text-[#f4b942]">24 In Progress</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Picker Section */}
      <section id="roles" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-[#f4b942]/10 border border-[#f4b942]/20 text-[#f4b942] text-[10px] font-bold uppercase tracking-wider mb-2">
            Multi-Tier Role Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-white">Choose Your Workspace to Enter</h2>
          <p className="text-xs sm:text-sm text-[#aebfcb] mt-2">
            KOYLA DRISHTI strictly segregates administrative governance, field inspector enforcement, and mine operator compliance workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Role Card */}
          <div
            onClick={() => handleSelectRoleAndProceed('admin')}
            className="group p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#f4b942]/60 hover:bg-[#f4b942]/[0.06] transition-all cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#126fba]/20 text-[#3ba3f5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#f4b942] transition-colors">
                Government Admin
              </h3>
              <p className="text-xs text-[#9eb0bc] leading-relaxed mb-4">
                Macro governance, national mines registry, AI alert triaging, inspector assignments, analytics, and policy settings.
              </p>
              {/* Small live data chips */}
              <div className="grid grid-cols-3 gap-1.5 mb-5 text-center">
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Mines</span>
                  <span className="block text-xs font-black text-white">412</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Index</span>
                  <span className="block text-xs font-black text-emerald-400">71.8%</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Alerts</span>
                  <span className="block text-xs font-black text-amber-400">12</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-[#f4b942] gap-1 group-hover:translate-x-1 transition-transform">
              Enter Admin Portal <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Inspector Role Card */}
          <div
            onClick={() => handleSelectRoleAndProceed('inspector')}
            className="group p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#159e89]/60 hover:bg-[#159e89]/[0.06] transition-all cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#159e89]/20 text-[#4fd1c5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#4fd1c5] transition-colors">
                Government Inspector
              </h3>
              <p className="text-xs text-[#9eb0bc] leading-relaxed mb-4">
                Assigned mine inspections, statutory checklist execution, AI alert verification, issue violations, and review evidence.
              </p>
              {/* Small live data chips */}
              <div className="grid grid-cols-3 gap-1.5 mb-5 text-center">
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Audits</span>
                  <span className="block text-xs font-black text-white">6 Sched</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">AI Signals</span>
                  <span className="block text-xs font-black text-rose-400">5 High</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Sec 22</span>
                  <span className="block text-xs font-black text-amber-400">4 Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-[#4fd1c5] gap-1 group-hover:translate-x-1 transition-transform">
              Enter Inspector Operations <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mine Authority Role Card */}
          <div
            onClick={() => handleSelectRoleAndProceed('mine')}
            className="group p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#e5a52a]/60 hover:bg-[#e5a52a]/[0.06] transition-all cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#e5a52a]/20 text-[#f4be51] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#f4be51] transition-colors">
                Mine Authority
              </h3>
              <p className="text-xs text-[#9eb0bc] leading-relaxed mb-4">
                Monthly compliance data submission, monitor risk score, respond to violations, attach evidence, and manage documents.
              </p>
              {/* Small live data chips */}
              <div className="grid grid-cols-3 gap-1.5 mb-5 text-center">
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Output</span>
                  <span className="block text-xs font-black text-white">14.2k T</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">CAAQMS</span>
                  <span className="block text-xs font-black text-emerald-400">68 µg</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                  <span className="block text-[9px] text-[#9eb0bc]">Dossiers</span>
                  <span className="block text-xs font-black text-amber-400">8 Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-[#f4be51] gap-1 group-hover:translate-x-1 transition-transform">
              Enter Mine Authority Portal <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="platform" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#4fd1c5] mb-2">
            Integrated Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-white">One platform. Complete oversight.</h2>
          <p className="text-xs sm:text-sm text-[#aebfcb] mt-2 leading-relaxed">
            A connected digital ecosystem bringing together Ministry officials, DGMS field inspectors, and coal mine operators into an accountable loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="text-3xl">🏛️</div>
            <h3 className="text-base font-bold text-white">Central Government Governance</h3>
            <p className="text-xs text-[#aabcc8] leading-relaxed">
              Real-time pan-India spatial mapping, risk distribution curves, inspector workload optimization, and cabinet-ready compliance summaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="text-3xl">👷</div>
            <h3 className="text-base font-bold text-white">DGMS Field Operations</h3>
            <p className="text-xs text-[#aabcc8] leading-relaxed">
              Standardized statutory inspection checklists, instant photographic evidence capture, geo-tagged observation notes, and closure sign-offs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="text-3xl">⛏️</div>
            <h3 className="text-base font-bold text-white">Mine Operator Accountability</h3>
            <p className="text-xs text-[#aabcc8] leading-relaxed">
              Structured multi-category data reporting (Safety, Environment, Equipment, Documentation), remedial evidence submission, and certificate vaults.
            </p>
          </div>
        </div>
      </section>

      {/* AI Monitoring Workflow Section */}
      <section id="ai-monitoring" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#f4b942] mb-2">
            Smart Intelligence Pipeline
          </div>
          <h2 className="text-3xl font-extrabold text-white">From Detection to Resolution</h2>
          <p className="text-xs sm:text-sm text-[#aebfcb] mt-2 leading-relaxed">
            AI identifies and prioritizes potential violations without auto-issuing legal penalties. Final verification always remains strictly with authorized officers.
          </p>
        </div>

        {/* 4 Step Workflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative">
            <span className="w-8 h-8 rounded-lg bg-[#f4b942]/15 text-[#f4b942] font-black text-xs grid place-items-center mb-3">
              01
            </span>
            <b className="block text-sm font-bold text-white mb-1">Mine Data Submitted</b>
            <small className="text-xs text-[#9fb1bd] leading-relaxed block">
              IoT sensors, air quality monitors, drone surveys and operator logs stream into the platform.
            </small>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative">
            <span className="w-8 h-8 rounded-lg bg-[#f4b942]/15 text-[#f4b942] font-black text-xs grid place-items-center mb-3">
              02
            </span>
            <b className="block text-sm font-bold text-white mb-1">AI Risk Analysis</b>
            <small className="text-xs text-[#9fb1bd] leading-relaxed block">
              Deep vision and anomaly models classify risk level (Low, Med, High, Critical) with confidence scores.
            </small>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative">
            <span className="w-8 h-8 rounded-lg bg-[#f4b942]/15 text-[#f4b942] font-black text-xs grid place-items-center mb-3">
              03
            </span>
            <b className="block text-sm font-bold text-white mb-1">Inspector Verification</b>
            <small className="text-xs text-[#9fb1bd] leading-relaxed block">
              Authorized DGMS inspectors examine the evidence, conduct site audits, and formalize violations.
            </small>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative">
            <span className="w-8 h-8 rounded-lg bg-[#f4b942]/15 text-[#f4b942] font-black text-xs grid place-items-center mb-3">
              04
            </span>
            <b className="block text-sm font-bold text-white mb-1">Corrective Action & Closure</b>
            <small className="text-xs text-[#9fb1bd] leading-relaxed block">
              Mine authority rectifies the fault, uploads verification certificates, and the case is closed.
            </small>
          </div>
        </div>

        {/* Sample Alert Highlight */}
        <div className="mt-8 p-6 rounded-2xl bg-[#f4b942]/[0.06] border border-[#f4b942]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#f4b942] block mb-1">
              Sample AI Signal in Queue
            </span>
            <h3 className="text-base font-bold text-white">
              Unauthorized Pit Expansion Beyond Demarcated Lease Boundary
            </h3>
            <p className="text-xs text-[#afc0cb] mt-1 max-w-xl">
              Sentinel-2 multispectral comparison detected outward overburden movement in Sector 4B of Singareni Colliery.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#98adba] uppercase tracking-wider block">AI Confidence Score</span>
            <b className="text-3xl font-extrabold text-[#f4b942]">92%</b>
          </div>
        </div>
      </section>

      {/* Support & Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#4fd1c5]">
              Assistance & Integration
            </div>
            <h2 className="text-3xl font-extrabold text-white">Government & Mine Helpdesk</h2>
            <p className="text-xs sm:text-sm text-[#aebfcb] leading-relaxed">
              Centralized support for state mining departments, DGMS regional directorates, public sector undertakings (CIL, BCCL, ECL, SECL, MCL), and private captive miners.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-[#4fd1c5]/15 text-[#4fd1c5] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <b className="block text-xs font-bold text-white">Official Helpdesk Email</b>
                  <small className="text-[11px] text-[#93a8b5]">support@koyladristi.gov.in</small>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-[#4fd1c5]/15 text-[#4fd1c5] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <b className="block text-xs font-bold text-white">National Coal Governance Helpline</b>
                  <small className="text-[11px] text-[#93a8b5]">1800-11-2026 (Toll Free · 09:00 - 18:00 IST)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleContactSubmit} className="p-7 rounded-2xl bg-white/[0.045] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white mb-1">Submit Inquiry or Grievance</h3>
              <div>
                <label className="block text-xs text-[#cedce5] mb-1 font-medium">Full Name & Designation</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Er. Ramanathan, Dy. GM Safety"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/20 border border-white/15 focus:border-[#4fd1c5] text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#cedce5] mb-1 font-medium">Official Government / Corporate Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@mine.gov.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/20 border border-white/15 focus:border-[#4fd1c5] text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#cedce5] mb-1 font-medium">Message / Case Details</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your inquiry, mine reference ID, or technical issue..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/20 border border-white/15 focus:border-[#4fd1c5] text-xs text-white outline-none transition-colors resize-vertical"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#f4b942] hover:bg-[#ffc95e] text-[#112130] text-xs font-bold transition-all shadow-md"
              >
                Submit Support Request →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-[#8fa4b2] bg-[#051422]">
        <p>© 2026 KOYLA DRISHTI · Ministry of Coal · Government of India</p>
        <p className="text-[11px] text-[#627785] mt-1">
          Designed for high-reliability statutory mine safety, environmental preservation, and transparent governance.
        </p>
      </footer>
    </div>
  );
};
