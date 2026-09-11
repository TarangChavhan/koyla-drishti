import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Pickaxe,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  Users,
  Bell,
  UserCheck,
  Settings,
  ShieldCheck,
  FileText,
  Clock,
  Send,
  HelpCircle,
  FileSpreadsheet,
  FolderOpen,
  Camera
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getNavGroups = (): NavGroup[] => {
    if (role === 'admin') {
      return [
        {
          groupTitle: 'Overview',
          items: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/admin/mines', label: 'Mines Overview', icon: Pickaxe },
            { to: '/admin/cctv', label: 'CCTV Surveillance', icon: Camera },
            { to: '/admin/compliance', label: 'Compliance Monitoring', icon: CheckCircle2 },
            { to: '/admin/alerts', label: 'AI Alerts', icon: AlertTriangle, count: 12 }
          ]
        },
        {
          groupTitle: 'Operations',
          items: [
            { to: '/admin/inspections', label: 'Inspection Management', icon: ClipboardList },
            { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
            { to: '/admin/experts', label: 'Expert Management', icon: UserCheck }
          ]
        },
        {
          groupTitle: 'Administration',
          items: [
            { to: '/admin/notifications', label: 'Notifications', icon: Bell, count: 4 },
            { to: '/admin/users', label: 'User Management', icon: Users },
            { to: '/admin/settings', label: 'Settings', icon: Settings }
          ]
        }
      ];
    } else if (role === 'inspector') {
      return [
        {
          groupTitle: 'Inspector Workspace',
          items: [
            { to: '/inspector/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/inspector/mines', label: 'Assigned Mines', icon: Pickaxe },
            { to: '/inspector/cctv', label: 'CCTV Monitoring', icon: Camera },
            { to: '/inspector/alerts', label: 'AI Alerts', icon: AlertTriangle, count: 8 },
            { to: '/inspector/inspections', label: 'Inspections', icon: ClipboardList }
          ]
        },
        {
          groupTitle: 'Case Management',
          items: [
            { to: '/inspector/violations', label: 'Violations', icon: ShieldCheck, count: 4 },
            { to: '/inspector/actions', label: 'Corrective Actions', icon: Clock },
            { to: '/inspector/evidence', label: 'Evidence & Documents', icon: FolderOpen },
            { to: '/inspector/reports', label: 'Reports', icon: BarChart3 }
          ]
        },
        {
          groupTitle: 'Account',
          items: [
            { to: '/inspector/notifications', label: 'Notifications', icon: Bell, count: 4 },
            { to: '/inspector/profile', label: 'My Profile', icon: UserCheck }
          ]
        }
      ];
    } else {
      // Mine Authority
      return [
        {
          groupTitle: 'Mine Workspace',
          items: [
            { to: '/mine/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/mine/profile', label: 'Mine Profile', icon: Pickaxe },
            { to: '/mine/cctv', label: 'CCTV & Warning Siren', icon: Camera },
            { to: '/mine/submit-data', label: 'Submit Data', icon: Send },
            { to: '/mine/compliance', label: 'Compliance Status', icon: CheckCircle2 }
          ]
        },
        {
          groupTitle: 'Case Management',
          items: [
            { to: '/mine/violations', label: 'Violations', icon: ShieldCheck, count: 4 },
            { to: '/mine/actions', label: 'Corrective Actions', icon: Clock },
            { to: '/mine/inspections', label: 'Inspections', icon: ClipboardList },
            { to: '/mine/documents', label: 'Documents', icon: FolderOpen }
          ]
        },
        {
          groupTitle: 'Account',
          items: [
            { to: '/mine/notifications', label: 'Notifications', icon: Bell, count: 3 },
            { to: '/mine/help', label: 'Help & Support', icon: HelpCircle }
          ]
        }
      ];
    }
  };

  const navGroups = getNavGroups();

  const getPortalSubtitle = () => {
    if (role === 'admin') return 'Government Control Portal';
    if (role === 'inspector') return 'Inspector Operations Portal';
    return 'Mine Authority Portal';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#040f1a]/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-[#061725] via-[#081d30] to-[#0b2337] text-[#dce8ef] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div
          onClick={() => navigate('/')}
          className="h-[84px] px-5 flex items-center gap-3 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f4be51] to-[#d48e14] text-[#071827] font-black text-sm grid place-items-center shadow-md shadow-amber-500/10 shrink-0">
            KD
          </div>
          <div className="overflow-hidden">
            <strong className="block text-white text-[14px] font-extrabold tracking-wider font-mono">
              KOYLA DRISHTI
            </strong>
            <small className="block text-[#91a8b7] text-[10px] truncate">
              {t(getPortalSubtitle())}
            </small>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#638094]">
                {t(group.groupTitle)}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-[#126fba] text-white shadow-[0_4px_14px_rgba(18,111,186,0.35)]'
                            : 'text-[#b7c9d4] hover:bg-white/[0.06] hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{t(item.label)}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#e75d61] text-white">
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Banner */}
        <div className="p-4 border-t border-white/10 text-[10px] text-[#8ba1af] leading-relaxed bg-[#051422]/60 space-y-2">
          <div>
            <p className="font-bold text-white mb-0.5">
              {role === 'admin'
                ? t('Safer Mines. Stronger India.')
                : role === 'inspector'
                ? t('Field Intelligence & Inspection')
                : t('Operate Safely. Stay Compliant.')}
            </p>
            <p className="text-[10px] text-[#718b9c]">
              {t('ministry_coal', 'Ministry of Coal')} · {t('gov_india', 'Government of India')}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full text-center py-1.5 px-2 rounded bg-white/5 hover:bg-white/10 text-[#f4be51] hover:text-white font-medium text-[11px] transition-colors cursor-pointer"
          >
            ← {t('View Public Home Page')}
          </button>
        </div>
      </aside>
    </>
  );
};
