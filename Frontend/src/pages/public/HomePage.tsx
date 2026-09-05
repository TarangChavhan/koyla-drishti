import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { GovernmentNoticesTable } from '../../components/public/GovernmentNoticesTable';
import {
  Shield,
  Building2,
  UserCheck,
  Satellite,
  Activity,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Radio,
  MapPin,
  FileText,
  Lock,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Check,
  LogOut,
  Compass,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
  User,
  Sliders,
  Globe,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

interface HeroBackgroundTheme {
  id: string;
  name: string;
  sub: string;
  tag: string;
  url: string;
  tint: string;
}

const HERO_BACKGROUNDS: HeroBackgroundTheme[] = [
  {
    id: 'opencast',
    name: 'Opencast Terraces',
    sub: 'Deep-bench coal excavation & heavy haulage logistics',
    tag: 'Active Colliery',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=2200&q=85',
    tint: 'linear-gradient(to right, rgba(5, 19, 31, 0.94) 0%, rgba(7, 26, 43, 0.88) 55%, rgba(10, 36, 58, 0.82) 100%)'
  },
  {
    id: 'satellite',
    name: 'Orbital Sat-Radar',
    sub: 'Synthetic Aperture Radar (SAR) & multi-spectral elevation monitoring',
    tag: 'Geospatial Radar',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2200&q=85',
    tint: 'linear-gradient(to right, rgba(5, 19, 31, 0.94) 0%, rgba(6, 23, 40, 0.87) 55%, rgba(9, 33, 54, 0.80) 100%)'
  },
  {
    id: 'green',
    name: 'Eco Reclamation',
    sub: 'Ecological afforestation, slope stabilization & green compliance buffer',
    tag: 'Sustainable Mining',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=2200&q=85',
    tint: 'linear-gradient(to right, rgba(5, 21, 27, 0.94) 0%, rgba(6, 27, 34, 0.88) 55%, rgba(9, 35, 41, 0.82) 100%)'
  },
  {
    id: 'excavation',
    name: 'Heavy Excavation',
    sub: 'High-capacity surface miners, draglines & extraction artery',
    tag: '24/7 Production',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2200&q=85',
    tint: 'linear-gradient(to right, rgba(7, 18, 29, 0.94) 0%, rgba(9, 25, 41, 0.88) 55%, rgba(12, 36, 57, 0.82) 100%)'
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Background image carousel states
  const [bgIndex, setBgIndex] = useState(0);
  const [isAutoPlayBg, setIsAutoPlayBg] = useState(true);

  // Auto advance background images every 8 seconds
  useEffect(() => {
    if (!isAutoPlayBg) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlayBg]);

  // Require authentication before accessing any role operation
  const handleRoleOperation = (targetRole: UserRole, destinationPath?: string) => {
    if (!isAuthenticated || !user) {
      showToast(
        `Please sign in with authorized credentials to access ${
          targetRole === 'admin' ? 'Apex Admin' : targetRole === 'inspector' ? 'DGMS Inspector' : 'Mine Authority'
        } operations.`,
        'info'
      );
      navigate(`/login?role=${targetRole}`);
      return;
    }

    if (user.role === targetRole) {
      navigate(
        destinationPath ||
          (targetRole === 'admin'
            ? '/admin/dashboard'
            : targetRole === 'inspector'
            ? '/inspector/dashboard'
            : '/mine/dashboard')
      );
    } else {
      showToast(
        `Current session is ${user.role}. Please sign in as ${targetRole} to access this operation.`,
        'warning'
      );
      navigate(`/login?role=${targetRole}`);
    }
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'inspector') return '/inspector/dashboard';
    if (role === 'mine') return '/mine/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-[#f3f7fa] text-[#152737] font-sans flex flex-col selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden">
      {/* 1. Sovereign Government Header Ribbon */}
      <div className="bg-[#051422] text-[#93a8b8] text-[11px] border-b border-[#142838] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {/* Tiranga strip */}
            <span className="inline-flex flex-col h-3 w-4.5 rounded-xs overflow-hidden shadow-xs shrink-0">
              <span className="h-1 bg-[#FF9933]"></span>
              <span className="h-1 bg-white"></span>
              <span className="h-1 bg-[#138808]"></span>
            </span>
            <span className="font-medium text-slate-200">{t('gov_india')}</span>
          </div>
          <span className="text-[#2b4458] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-300">{t('ministry_coal')} & DGMS</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Sat-Telemetry: <strong className="text-emerald-300">Live (142 Mines)</strong></span>
          </span>
          <span className="text-[#2b4458] hidden md:inline">|</span>
          <span className="text-slate-300 text-[10px] sm:text-[11px]">{t('toll_free_help')}</span>
        </div>
      </div>

      {/* 2. Official Navigation Bar (<nav>) */}
      <nav id="navbar" className="sticky top-0 z-40 bg-[#071a2b]/95 backdrop-blur-md border-b border-[#142d44] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand & Emblem */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#071a2b] rounded-[7px] flex items-center justify-center">
                <Satellite className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-serif truncate">
                  {t('portal_system_name')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                  KOYLA DRISHTI
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-300 tracking-wide font-medium truncate">
                {t('ministry_coal')} · {t('portal_system_sub')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-200">
            <a href="#overview" className="hover:text-amber-400 transition-colors">{t('nav_overview')}</a>
            <a href="#portals" className="hover:text-amber-400 transition-colors">{t('nav_portals')}</a>
            <a href="#capabilities" className="hover:text-amber-400 transition-colors">{t('nav_capabilities')}</a>
            <a href="#basins" className="hover:text-amber-400 transition-colors">{t('nav_basins')}</a>
            <a 
              href="#notices" 
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold text-amber-400 group"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Notice</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full shadow-xs">Gazette</span>
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">{t('nav_helpdesk')}</a>
          </div>

          {/* Action & Auth State */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-amber-400 capitalize">{user.role} Authority</div>
                </div>
                <button
                  id="nav-go-dashboard-btn"
                  onClick={() => navigate(getDashboardLink())}
                  className="min-h-[40px] px-3 sm:px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>{t('nav_dashboard')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={() => logout()}
                  title={t('nav_logout')}
                  className="min-h-[40px] min-w-[40px] p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="min-h-[40px] px-3.5 sm:px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('nav_login')}</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden min-h-[42px] min-w-[42px] p-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors flex items-center justify-center cursor-pointer ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-[#142d44] bg-[#061726] px-4 py-4 space-y-3 shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <a
                  href="#overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-slate-200 hover:text-amber-400 hover:bg-[#0f2c45] transition-colors flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('nav_overview')}</span>
                </a>
                <a
                  href="#portals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-slate-200 hover:text-amber-400 hover:bg-[#0f2c45] transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('nav_portals')}</span>
                </a>
                <a
                  href="#capabilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-slate-200 hover:text-amber-400 hover:bg-[#0f2c45] transition-colors flex items-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('nav_capabilities')}</span>
                </a>
                <a
                  href="#basins"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-slate-200 hover:text-amber-400 hover:bg-[#0f2c45] transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('nav_basins')}</span>
                </a>
                <a
                  href="#notices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-amber-400 hover:text-amber-300 hover:bg-[#0f2c45] transition-colors flex items-center gap-2 font-bold border border-amber-500/20"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Notice</span>
                  <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold ml-auto">Gazette</span>
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#0b2135] text-slate-200 hover:text-amber-400 hover:bg-[#0f2c45] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('nav_helpdesk')}</span>
                </a>
              </div>

              {/* Quick Mobile Contact Direct Links */}
              <div className="pt-2 border-t border-[#142d44] flex flex-col gap-1.5 text-xs text-slate-300">
                <a
                  href="tel:1800116463"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#091f32] border border-[#173a5a] text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mine Safety Helpline</span>
                  </span>
                  <span className="font-mono text-amber-300 text-[11px] font-bold">1800-11-MINE</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. Hero Tag & Section (<header> / Hero with Background Image & Animation) */}
      <header
        id="overview"
        className="relative overflow-hidden bg-[#071a2b] text-white border-b border-[#142d44]"
      >
        {/* Dynamic Animated Background Cross-Fade */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={HERO_BACKGROUNDS[bgIndex].id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `${HERO_BACKGROUNDS[bgIndex].tint}, url('${HERO_BACKGROUNDS[bgIndex].url}')`
              }}
            />
          </AnimatePresence>

          {/* Decorative radar scan lines & coordinate grid */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]"></div>
          
          {/* Animated Sweeping Radar Scanner Line */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-cyan-500/15 pointer-events-none">
            <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping opacity-25"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full origin-center relative"
            >
              <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-cyan-400/40 to-transparent origin-left"></div>
            </motion.div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Hero Left Column: Sovereign Directives & Clear Platform Identity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Sovereign Statutory Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2a44]/90 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Ministry of Coal · Government of India</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#082035]/90 border border-cyan-400/40 text-cyan-300 text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-[11px]">ISRO EOS-04 & Sentinel-1 SAR Live Link</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
                  KOYLA DRISHTI
                  <span className="block text-xl sm:text-2xl lg:text-3xl text-amber-400 font-sans font-bold mt-2">
                    National Satellite & AI Coal Mine Surveillance Platform
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl pt-1">
                  Empowering sovereign oversight with autonomous 24/7 earth-observation radar (InSAR), thermal anomaly detection, and environmental IoT telemetry across all 142 major Indian coalfields under the Mines Act, 1952.
                </p>
              </div>

              {/* Stat Highlights: High-Contrast, Spacious */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 max-w-lg">
                <div className="bg-[#0b2238]/90 border border-[#1d466b] rounded-xl p-2.5 sm:p-3.5 backdrop-blur-xs">
                  <div className="text-lg sm:text-2xl font-bold text-amber-400 font-mono">142</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5">Collieries Active</div>
                </div>
                <div className="bg-[#0b2238]/90 border border-[#1d466b] rounded-xl p-2.5 sm:p-3.5 backdrop-blur-xs">
                  <div className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono">99.4%</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5">AI Precision</div>
                </div>
                <div className="bg-[#0b2238]/90 border border-[#1d466b] rounded-xl p-2.5 sm:p-3.5 backdrop-blur-xs">
                  <div className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono">24/7</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5">Radar Telemetry</div>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#portals"
                  className="min-h-[44px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 text-center"
                >
                  <span>Explore Operational Portals</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#basins"
                  className="min-h-[44px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#102e4c]/90 hover:bg-[#163a5f] text-white font-semibold text-xs sm:text-sm border border-[#23517c] flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm transform hover:-translate-y-0.5 text-center"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>View National Coal Basins</span>
                </a>
              </div>
            </motion.div>

            {/* Hero Right Column: Clean Statutory Officer Access Gateway */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#091f33]/95 border border-[#1d466b] rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#183955] pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Statutory Officer Access</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Select your jurisdiction to launch your command desk:
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SSO Active
                  </span>
                </div>

                {isAuthenticated && user ? (
                  /* Active Session Card */
                  <div className="bg-[#061523] rounded-xl p-5 border border-[#173b5c] space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-base flex items-center justify-center shrink-0">
                        {user.avatarText || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Active Session
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {user.role}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white truncate mt-0.5">{user.name}</h3>
                        <p className="text-xs text-slate-300 truncate">{user.designation}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#091f33] border border-[#1a4164] text-xs text-slate-300 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jurisdiction:</span>
                        <span className="font-medium text-white">{user.organization || 'Ministry of Coal'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gov Email:</span>
                        <span className="font-mono text-slate-200">{user.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => navigate(getDashboardLink())}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <span>Launch Your Workspace Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => logout()}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                      >
                        Switch Officer / Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Clean, High-Clarity 3-Role Workspace Launcher */
                  <div className="space-y-3">
                    {/* Role 1: Ministry Admin */}
                    <button
                      onClick={() => handleRoleOperation('admin')}
                      className="w-full p-3.5 rounded-xl bg-[#061523] hover:bg-[#0c2336] border border-[#183955] hover:border-amber-400/50 transition-all text-left group cursor-pointer flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            Ministry Admin (MoC HQ)
                          </span>
                          <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                            Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          National compliance, colliery licenses & AI sentinel alerts
                        </p>
                        {/* Live small data strip */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            412 Mines
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            71.8% Compliant
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                            12 Alerts
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Role 2: DGMS Inspector */}
                    <button
                      onClick={() => handleRoleOperation('inspector')}
                      className="w-full p-3.5 rounded-xl bg-[#061523] hover:bg-[#0c2336] border border-[#183955] hover:border-cyan-400/50 transition-all text-left group cursor-pointer flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            DGMS Safety Inspectorate
                          </span>
                          <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
                            Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          Field safety audits, satellite anomalies & Section 22 notices
                        </p>
                        {/* Live small data strip */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                            6 Audits Sched
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                            5 Anomalies
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            4 Notices
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Role 3: Mine Authority */}
                    <button
                      onClick={() => handleRoleOperation('mine')}
                      className="w-full p-3.5 rounded-xl bg-[#061523] hover:bg-[#0c2336] border border-[#183955] hover:border-indigo-400/50 transition-all text-left group cursor-pointer flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            Mine Authority & Operators
                          </span>
                          <span className="text-[10px] text-indigo-300 flex items-center gap-1 font-semibold">
                            Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          Daily sensor telemetry, blast vibration logs & remediation filings
                        </p>
                        {/* Live small data strip */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            14,250 T Today
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            PM10 68 µg
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                            8 Clearances
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Dedicated Sign In Link */}
                    <div className="pt-2 border-t border-[#183955] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Authorized Personnel:</span>
                      <Link
                        to="/login"
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign In with Government SSO →</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 4. Stakeholder Operation Portals Section */}
      <section id="portals" className="py-16 bg-[#eef3f7] border-b border-[#d8e2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Role-Based Governance Modules
            </div>
            <h2 className="text-3xl font-extrabold text-[#071a2b] font-serif">
              Three Distinct Statutory Operational Workspaces
            </h2>
            <p className="text-sm text-[#526a7e] leading-relaxed">
              KOYLA DRISHTI provisions specialized, segregated operational interfaces tailored to each stakeholder’s legal obligations under the Mines Act, 1952.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Ministry Admin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border border-[#d8e2eb] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Themed Photo Banner */}
              <div className="h-36 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Ministry Admin Command"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 text-[11px] font-bold shadow-md">
                    <Shield className="w-3 h-3" />
                    Ministry of Coal · New Delhi
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Government Administrator
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-[#526a7e] leading-relaxed">
                    Central supervisory command for national coal reserves. Monitors state-wise compliance indexes, schedules statutory audits, and manages nationwide colliery licenses.
                  </p>
                  <div className="space-y-2 pt-1 text-xs text-[#2c4355]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>National GIS Mine Registry (Lease bounds)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>AI Sentinel Anomaly Review & Inspector Rosters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Statutory DGMS Compliance Reports</span>
                    </div>
                  </div>

                  {/* Live Small Operational Data Preview */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#152737] px-0.5">
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Live Sovereign Data Feed
                      </span>
                      <span className="font-mono text-[10px] text-[#728594]">Pan-India</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Active Mines</span>
                        <strong className="block text-xs font-black text-[#152737]">412</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Compliance</span>
                        <strong className="block text-xs font-black text-emerald-600">71.8%</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Sentinel Alerts</span>
                        <strong className="block text-xs font-black text-amber-600">12 Active</strong>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-xl p-2.5 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">KD-104 · Bharat Coking Coal</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          EC Verified (86%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">KD-169 · Singareni Incline OCP</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Alert Under Review
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#152737] truncate">KD-101 · Jharia Coal Basin</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          Audit Scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#edf2f6]">
                  <button
                    id="card-launch-admin-btn"
                    onClick={() => handleRoleOperation('admin')}
                    className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[#071a2b] hover:bg-[#0f2c45] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group-hover:bg-amber-500 group-hover:text-slate-950"
                  >
                    <span>Enter Admin Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 2: DGMS Inspector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border border-[#d8e2eb] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Themed Photo Banner */}
              <div className="h-36 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
                  alt="DGMS Inspector Workspace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/90 text-slate-950 text-[11px] font-bold shadow-md">
                    <UserCheck className="w-3 h-3" />
                    DGMS Inspectorate
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Regulatory Inspector Desk
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-[#526a7e] leading-relaxed">
                    Field execution workspace for statutory inspectors. Dispatched to investigate satellite alert discrepancies, conduct safety audits, and issue Section 22 improvement notices.
                  </p>
                  <div className="space-y-2 pt-1 text-xs text-[#2c4355]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Interactive Digital Field Inspection Audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Satellite Anomaly Adjudication Sentinel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Remediation Evidence Review & Closure</span>
                    </div>
                  </div>

                  {/* Live Small Operational Data Preview */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#152737] px-0.5">
                      <span className="flex items-center gap-1.5 text-cyan-700">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        DGMS Field Rosters & Alerts
                      </span>
                      <span className="font-mono text-[10px] text-[#728594]">Zone-II</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Audits Sched</span>
                        <strong className="block text-xs font-black text-[#152737]">6 Pending</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">AI Anomalies</span>
                        <strong className="block text-xs font-black text-rose-600">5 High</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Sec 22 Notices</span>
                        <strong className="block text-xs font-black text-amber-600">4 Issued</strong>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-xl p-2.5 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">INS-1092 · Singareni No. 2</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Drift Alert (92% Conf)
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">INS-1089 · BCCL Opencast Pit</span>
                        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                          Safety Audit Tomorrow
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#152737] truncate">VIO-2026 · Dust Suppression</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Notice Remediation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#edf2f6]">
                  <button
                    id="card-launch-inspector-btn"
                    onClick={() => handleRoleOperation('inspector')}
                    className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[#071a2b] hover:bg-[#0f2c45] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group-hover:bg-cyan-500 group-hover:text-slate-950"
                  >
                    <span>Enter Inspector Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Mine Authority */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border border-[#d8e2eb] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Themed Photo Banner */}
              <div className="h-36 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                  alt="Mine Authority Operations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/90 text-white text-[11px] font-bold shadow-md">
                    <Building2 className="w-3 h-3" />
                    Colliery Management & Operators
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Mine Authority Operations
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-[#526a7e] leading-relaxed">
                    Operational compliance desk for colliery General Managers and Safety Officers. Log daily environmental telemetry, upload mandatory laboratory tests, and submit remediation evidence.
                  </p>
                  <div className="space-y-2 pt-1 text-xs text-[#2c4355]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Daily Shift Telemetry (Gas, Dust, Blast PPV)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Corrective Action Evidence Upload</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Statutory Clearances (EC, FC, Explosive)</span>
                    </div>
                  </div>

                  {/* Live Small Operational Data Preview */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#152737] px-0.5">
                      <span className="flex items-center gap-1.5 text-indigo-700">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Colliery Shift & Sensor Data
                      </span>
                      <span className="font-mono text-[10px] text-[#728594]">KD-104 Live</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Daily Output</span>
                        <strong className="block text-xs font-black text-[#152737]">14,250 T</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">CAAQMS PM10</span>
                        <strong className="block text-xs font-black text-emerald-600">68 µg/m³</strong>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-lg p-1.5">
                        <span className="block text-[10px] text-[#728594]">Clearances</span>
                        <strong className="block text-xs font-black text-indigo-600">8 Active</strong>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] border border-[#e2e9ee] rounded-xl p-2.5 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">Shift 2 · Methane CH4 Conc</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          0.18% (Permitted &lt;0.75%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#edf2f7] pb-1">
                        <span className="font-semibold text-[#152737] truncate">Blast Seismograph · PPV</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          3.4 mm/s Compliant
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#152737] truncate">MoEFCC Clearance EC-2026</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          Dossier Signed (2030)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#edf2f6]">
                  <button
                    id="card-launch-mine-btn"
                    onClick={() => handleRoleOperation('mine')}
                    className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[#071a2b] hover:bg-[#0f2c45] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group-hover:bg-indigo-500 group-hover:text-white"
                  >
                    <span>Enter Mine Authority Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Key System Capabilities & AI Sentinel */}
      <section id="capabilities" className="py-16 bg-white border-b border-[#d8e2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5" />
              Advanced Technology Infrastructure
            </div>
            <h2 className="text-3xl font-extrabold text-[#071a2b] font-serif">
              Autonomous AI Sentinel & Environmental Telemetry
            </h2>
            <p className="text-sm text-[#526a7e] leading-relaxed">
              Replacing sporadic manual inspections with 24x7 automated satellite orbit tracking, continuous IoT gas monitoring, and verifiable statutory digital records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Capability 1 */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 hover:border-amber-400/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Satellite className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071a2b] text-base">
                Satellite Anomaly Sentinel
              </h3>
              <p className="text-xs text-[#526a7e] leading-relaxed">
                Bi-weekly synthetic aperture radar (SAR) and multispectral optical imaging flags illegal boundary encroachments and overburden dump displacement.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 hover:border-cyan-400/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071a2b] text-base">
                Real-Time Gas & Air Telemetry
              </h3>
              <p className="text-xs text-[#526a7e] leading-relaxed">
                Automated continuous intake of CH4 methane, PM10 respirable particulate matter, ambient noise levels, and seismograph blast vibration PPV.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 hover:border-indigo-400/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071a2b] text-base">
                Digital Field Audits
              </h3>
              <p className="text-xs text-[#526a7e] leading-relaxed">
                Standardized DGMS compliance templates with geo-tagged photographic evidence, immediate violation indexing, and statutory warrant verification.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3 hover:border-emerald-400/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#071a2b] text-base">
                Evidence Remediation Dossiers
              </h3>
              <p className="text-xs text-[#526a7e] leading-relaxed">
                Time-stamped corrective action submissions with laboratory certificates, engineering reports, and inspector sign-off to formally close violations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live National Coal Basins Coverage */}
      <section
        id="basins"
        className="py-16 text-white border-b border-[#142d44] relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, rgba(7, 26, 43, 0.94) 0%, rgba(5, 17, 28, 0.98) 100%), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Geographic Command & Control
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1 font-serif">
                Major Indian Coalfields Under Active Surveillance
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Satellite orbits synchronized across Eastern, Central, and Western coal belts with live telemetry ingress every 4 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Basin 1: Jharia */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c243a]/90 border border-[#1b4366] rounded-xl overflow-hidden group hover:border-amber-400/60 shadow-lg"
            >
              <div className="h-28 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80"
                  alt="Jharia Coalfield"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c243a] via-[#0c243a]/40 to-transparent"></div>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold shadow-xs">
                  Jharkhand
                </span>
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  Jharia Coalfield
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Operating: <strong className="text-white">BCCL</strong></div>
                  <div>Active Mines: <strong className="text-white">38 Collieries</strong></div>
                  <div>Compliance: <strong className="text-emerald-400">92.4%</strong></div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 border-t border-[#163857] pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Fire & subsidence SAR active</span>
                </div>
              </div>
            </motion.div>

            {/* Basin 2: Singrauli */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c243a]/90 border border-[#1b4366] rounded-xl overflow-hidden group hover:border-amber-400/60 shadow-lg"
            >
              <div className="h-28 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                  alt="Singrauli Basin"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c243a] via-[#0c243a]/40 to-transparent"></div>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold shadow-xs">
                  MP / UP
                </span>
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  Singrauli Basin
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Operating: <strong className="text-white">NCL</strong></div>
                  <div>Active Mines: <strong className="text-white">26 Collieries</strong></div>
                  <div>Compliance: <strong className="text-emerald-400">96.8%</strong></div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 border-t border-[#163857] pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Heavy draglines radar sync</span>
                </div>
              </div>
            </motion.div>

            {/* Basin 3: Korba */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c243a]/90 border border-[#1b4366] rounded-xl overflow-hidden group hover:border-amber-400/60 shadow-lg"
            >
              <div className="h-28 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                  alt="Korba Coalfield"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c243a] via-[#0c243a]/40 to-transparent"></div>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold shadow-xs">
                  Chhattisgarh
                </span>
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  Korba Coalfield
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Operating: <strong className="text-white">SECL</strong></div>
                  <div>Active Mines: <strong className="text-white">29 Collieries</strong></div>
                  <div>Compliance: <strong className="text-emerald-400">94.1%</strong></div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 border-t border-[#163857] pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Gevra mega pit continuous scan</span>
                </div>
              </div>
            </motion.div>

            {/* Basin 4: Raniganj */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c243a]/90 border border-[#1b4366] rounded-xl overflow-hidden group hover:border-amber-400/60 shadow-lg"
            >
              <div className="h-28 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                  alt="Raniganj Coalfield"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c243a] via-[#0c243a]/40 to-transparent"></div>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold shadow-xs">
                  West Bengal
                </span>
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  Raniganj Coalfield
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Operating: <strong className="text-white">ECL</strong></div>
                  <div>Active Mines: <strong className="text-white">24 Collieries</strong></div>
                  <div>Compliance: <strong className="text-emerald-400">89.7%</strong></div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 border-t border-[#163857] pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Ventilation sensor telemetry grid</span>
                </div>
              </div>
            </motion.div>

            {/* Basin 5: Talcher */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c243a]/90 border border-[#1b4366] rounded-xl overflow-hidden group hover:border-amber-400/60 shadow-lg"
            >
              <div className="h-28 relative overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
                  alt="Talcher Coalfield"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c243a] via-[#0c243a]/40 to-transparent"></div>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold shadow-xs">
                  Odisha
                </span>
                <span className="absolute bottom-2 left-3 text-xs font-bold text-white">
                  Talcher Coalfield
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Operating: <strong className="text-white">MCL</strong></div>
                  <div>Active Mines: <strong className="text-white">25 Collieries</strong></div>
                  <div>Compliance: <strong className="text-emerald-400">95.2%</strong></div>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 border-t border-[#163857] pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Conveyor dust & rail dispatch sync</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Government Notices & Statutory Directives (Tabular Format) */}
      <section
        id="notices"
        className="relative py-16 bg-[#f8fafc] border-b border-[#d8e2eb] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                Statutory Gazette Register · Government Directives
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071a2b] font-serif">
                Government Notices & Circulars Register
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Official register of all statutory notifications, technical circulars, and directives circulated by the Directorate General of Mines Safety (DGMS) and Ministry of Coal in structured tabular format.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/notices"
                className="min-h-[44px] text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 shadow-xs hover:shadow transition-all"
              >
                <span>Open Dedicated Gazette Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              </Link>
            </div>
          </div>

          {/* Tabular Format Component */}
          <GovernmentNoticesTable initialLimit={undefined} showAllControls={true} />
        </div>
      </section>

      {/* 7.5 National Colliery Safety Command Banner */}
      <section className="relative py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold tracking-wide">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Statutory Safety Helpline · Section 23 Mines Act</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                24/7 National Colliery Incident & DGMS Safety Operations Command
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Immediate dispatch connectivity for colliery inundation, abnormal gas liberation, slope displacement, or machinery failures. Direct telephonic link to Regional Inspectorates and MoC Emergency Response Cell.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1 font-mono text-slate-700">
                <span className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-800">National Toll-Free: 1800-11-MINE (1800-11-6463)</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-semibold text-slate-800">dgms-control@coal.gov.in</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => handleRoleOperation('mine', '/mine/submit-data')}
                className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Report Telemetry Incident Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/login"
                className="w-full py-3 px-5 rounded-xl bg-[#091f33] hover:bg-[#0f2e4a] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm hover:-translate-y-0.5"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-300" />
                <span>Officer Secure Sign-In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Official Government Footer (<footer> Tag) */}
      <footer id="contact" className="bg-[#051422] text-[#8aa1b3] border-t border-[#102a3f] mt-auto">
        {/* Top Tricolor Accent Line */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Ministry Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-white tracking-wide font-serif">
                    KOYLA DRISHTI
                  </div>
                  <div className="text-[10px] text-amber-400">
                    कोयला दृष्टि · Ministry of Coal
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous National Satellite Surveillance, Real-Time Sensor Telemetry & Statutory Safety Enforcement Portal for the Indian Mining Sector.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Mines Act, 1952 Enforcement Framework</div>
                <div>Coal Mines Regulations (CMR), 2017</div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Governance Portals
              </h4>
              <ul className="text-xs space-y-2 text-slate-300">
                <li>
                  <button
                    onClick={() => handleRoleOperation('admin')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Ministry Admin Portal (MoC HQ)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleOperation('inspector')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    DGMS Inspector Audit Desk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleOperation('mine')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Mine Authority Telemetry Portal
                  </button>
                </li>
                <li>
                  <Link to="/notices" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-400 font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Government Notices & Gazette</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-amber-400 transition-colors">
                    Standard Secure Sign-In
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="hover:text-amber-400 transition-colors">
                    Officer Password Recovery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: National Apex Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Government of India Nodes
              </h4>
              <ul className="text-xs space-y-2 text-slate-300">
                <li>
                  <a href="https://coal.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>Ministry of Coal (coal.gov.in)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://dgms.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>DGMS Headquarters (dgms.gov.in)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>National Portal of India</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://coalindia.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>Coal India Limited (CIL)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://cmpdi.co.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <span>CMPDI Geomatics Division</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Statutory Helpdesk */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Emergency Mine Safety & Helpdesk
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Ministry of Coal, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24x7 DGMS Control Room: <strong>1800-345-6463</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>helpdesk-koyladrishti@nic.in</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="px-3 py-2 rounded bg-[#091b2c] border border-[#163855] text-[11px] text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>STQC Certified & Hosted in National Informatics Centre (NIC) Cloud</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-12 pt-6 border-t border-[#102a3f] flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <div>
              © 2026 <strong>KOYLA DRISHTI</strong>. Designed & Maintained for Ministry of Coal, Government of India.
            </div>
            <div className="flex items-center gap-4">
              <span>Security Audited by CERT-In</span>
              <span>•</span>
              <span>Terms of Use</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Hyperlinking Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
