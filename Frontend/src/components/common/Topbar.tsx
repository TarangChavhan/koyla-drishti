import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Menu,
  Search,
  Bell,
  Maximize2,
  Minimize2,
  ChevronDown,
  LogOut,
  Shield,
  UserCheck,
  Building2,
  ExternalLink,
  Check,
  Home
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange
}) => {
  const { user, role, switchRole, logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleSwitcher(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
      showToast('Fullscreen mode enabled', 'info');
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleSwitcher(false);
    showToast(`Switched to ${newRole === 'admin' ? 'Government Admin' : newRole === 'inspector' ? 'Government Inspector' : 'Mine Authority'} view`, 'success');
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'inspector') navigate('/inspector/dashboard');
    else navigate('/mine/dashboard');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out of government session', 'info');
    navigate('/login');
  };

  const roleLabels: Record<UserRole, { title: string; badge: string; icon: React.ComponentType<{ className?: string }> }> = {
    admin: { title: 'Government Admin', badge: 'Ministry of Coal', icon: Shield },
    inspector: { title: 'Government Inspector', badge: 'DGMS Safety Directorate', icon: UserCheck },
    mine: { title: 'Mine Authority', badge: 'BCCL Dhanbad', icon: Building2 }
  };

  const currentRoleInfo = role ? roleLabels[role] : roleLabels.admin;

  return (
    <header className="h-[70px] bg-white/95 backdrop-blur-md border-b border-[#e2e9ee] sticky top-0 z-30 flex items-center px-4 lg:px-7 gap-3 lg:gap-4 transition-all">
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg bg-[#f1f5f7] hover:bg-slate-200 text-[#152737] lg:hidden transition-colors"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[#8195a2] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={t('Search mine records, violations, inspections, alerts...')}
          className="w-full h-10 pl-9 pr-3.5 bg-[#f8fafb] border border-[#e2e9ee] focus:border-[#126fba] rounded-xl text-xs text-[#152737] placeholder-[#8195a2] outline-none transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        {/* Public Portal Home Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f7] hover:bg-slate-200 text-[#2c4252] text-xs font-semibold transition-colors cursor-pointer"
          title={t('Return to Public Home Page')}
        >
          <Home className="w-3.5 h-3.5 text-[#126fba]" />
          <span className="hidden md:inline">{t('nav_public_home', 'Public Home')}</span>
        </button>

        {/* Quick Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleSwitcher((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#eaf2f8] hover:bg-[#dfeaf2] border border-[#cbe0ee] text-[#126fba] text-xs font-bold transition-colors cursor-pointer"
            title={t('Switch Workspace View')}
          >
            <currentRoleInfo.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t(currentRoleInfo.title)}</span>
            <ChevronDown className="w-3 h-3 text-[#126fba]" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e2e9ee] py-1.5 z-50 animate-scaleUp">
              <div className="px-3 py-2 border-b border-[#e2e9ee] text-[10px] font-bold text-[#728594] uppercase tracking-wider">
                {t('Select Active Portal View')}
              </div>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-[#f3f7fa] transition-colors cursor-pointer ${
                  role === 'admin' ? 'bg-[#f0f6fc] font-bold text-[#126fba]' : 'text-[#152737]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#126fba]" />
                  <div>
                    <div className="font-semibold">{t('Government Admin')}</div>
                    <div className="text-[10px] text-[#728594]">{t('Ministry governance & analytics')}</div>
                  </div>
                </div>
                {role === 'admin' && <Check className="w-3.5 h-3.5 text-[#126fba]" />}
              </button>

              <button
                onClick={() => handleRoleChange('inspector')}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-[#f3f7fa] transition-colors cursor-pointer ${
                  role === 'inspector' ? 'bg-[#f0f6fc] font-bold text-[#126fba]' : 'text-[#152737]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#159e89]" />
                  <div>
                    <div className="font-semibold">{t('Government Inspector')}</div>
                    <div className="text-[10px] text-[#728594]">{t('Field verification & violations')}</div>
                  </div>
                </div>
                {role === 'inspector' && <Check className="w-3.5 h-3.5 text-[#159e89]" />}
              </button>

              <button
                onClick={() => handleRoleChange('mine')}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-[#f3f7fa] transition-colors cursor-pointer ${
                  role === 'mine' ? 'bg-[#f0f6fc] font-bold text-[#126fba]' : 'text-[#152737]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#e5a52a]" />
                  <div>
                    <div className="font-semibold">{t('Mine Authority')}</div>
                    <div className="text-[10px] text-[#728594]">{t('Data submission & corrective actions')}</div>
                  </div>
                </div>
                {role === 'mine' && <Check className="w-3.5 h-3.5 text-[#e5a52a]" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              if (role === 'admin') navigate('/admin/notifications');
              else if (role === 'inspector') navigate('/inspector/notifications');
              else navigate('/mine/notifications');
            }}
            className="w-9 h-9 rounded-xl bg-[#f3f6f8] hover:bg-slate-200 flex items-center justify-center text-[#526a79] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#df4d52] ring-2 ring-white" />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 rounded-xl bg-[#f3f6f8] hover:bg-slate-200 hidden sm:flex items-center justify-center text-[#526a79] transition-colors"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#e6eef4] text-[#126fba] font-bold text-xs flex items-center justify-center shrink-0 border border-[#b8d4ea]">
              {user?.avatarText || 'GOV'}
            </div>
            <div className="hidden md:block">
              <strong className="block text-xs font-bold text-[#152737] leading-tight truncate max-w-[140px]">
                {user?.name || 'Authorized Officer'}
              </strong>
              <small className="block text-[10px] text-[#728594] truncate max-w-[140px]">
                {user?.designation || currentRoleInfo.title}
              </small>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#728594] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e2e9ee] py-2 z-50 animate-scaleUp">
              <div className="px-4 py-2.5 border-b border-[#e2e9ee]">
                <p className="text-xs font-bold text-[#152737]">{user?.name}</p>
                <p className="text-[11px] text-[#728594]">{user?.email}</p>
                <div className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#edf4fb] text-[#126fba]">
                  {user?.organization}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#526a79] hover:bg-[#f3f7fa] hover:text-[#152737] transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('Public Landing Portal')}
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (role === 'admin') navigate('/admin/settings');
                    else if (role === 'inspector') navigate('/inspector/profile');
                    else navigate('/mine/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#526a79] hover:bg-[#f3f7fa] hover:text-[#152737] transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {t('Account Details & Security')}
                </button>
              </div>

              <div className="border-t border-[#e2e9ee] pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#df4d52] hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('Sign Out of Portal')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
