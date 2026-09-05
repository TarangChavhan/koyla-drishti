import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Shield,
  UserCheck,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const roleParam = searchParams.get('role') as UserRole | null;
  const validRoleParam = (roleParam === 'admin' || roleParam === 'inspector' || roleParam === 'mine') ? roleParam : null;

  const [selectedRole, setSelectedRole] = useState<UserRole>(validRoleParam || 'admin');
  const [emailOrId, setEmailOrId] = useState(
    validRoleParam === 'inspector'
      ? 'inspector@dgms.gov.in'
      : validRoleParam === 'mine'
      ? 'mine@bccl.gov.in'
      : 'admin@coal.gov.in'
  );
  const [password, setPassword] = useState(
    validRoleParam === 'inspector'
      ? 'Inspector@2026'
      : validRoleParam === 'mine'
      ? 'MineBCCL@2026'
      : 'GovAdmin@2026'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (validRoleParam) {
      handleQuickRoleSelect(validRoleParam);
    }
  }, [validRoleParam]);

  const handleQuickRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setEmailOrId('admin@coal.gov.in');
      setPassword('GovAdmin@2026');
    } else if (role === 'inspector') {
      setEmailOrId('inspector@dgms.gov.in');
      setPassword('Inspector@2026');
    } else {
      setEmailOrId('mine@bccl.gov.in');
      setPassword('MineBCCL@2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailOrId.trim()) {
      setErrorMsg('Please enter your official email or Government User ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(emailOrId, password, selectedRole);
      showToast(`Welcome back, ${user.name}`, 'success');

      // Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'inspector') {
        navigate('/inspector/dashboard');
      } else {
        navigate('/mine/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071a2b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background subtle decoration */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#f4b942_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back to Home Navigation */}
        <div className="mb-4 flex items-center justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium py-1 px-3 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all"
          >
            <span>← {t('nav_public_home')}</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f4b942] to-[#d58e14] text-[#142334] font-black text-lg flex items-center justify-center shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform">
              KD
            </div>
            <div className="text-left">
              <strong className="block text-white text-lg tracking-wider font-mono">{t('portal_system_name')}</strong>
              <span className="block text-[10px] text-[#c7d8e5] uppercase tracking-wider font-semibold">
                {t('ministry_coal')} · {t('portal_system_sub')}
              </span>
            </div>
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold text-white tracking-tight">
            {t('gateway_title')}
          </h2>
          <p className="mt-1 text-xs text-[#9eb0bc]">
            {t('gateway_subtitle')}
          </p>
        </div>

        {/* Quick Role Tester Pills */}
        <div className="mt-6 bg-[#04121e]/80 p-1.5 rounded-xl border border-white/10 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#126fba] text-white shadow-md'
                : 'text-[#9fb2bf] hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('role_admin')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleSelect('inspector')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'inspector'
                ? 'bg-[#159e89] text-white shadow-md'
                : 'text-[#9fb2bf] hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('role_inspector')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleSelect('mine')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'mine'
                ? 'bg-[#e5a52a] text-[#071a2b] shadow-md'
                : 'text-[#9fb2bf] hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('role_mine')}</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="mt-4 bg-white/[0.04] backdrop-blur-xl py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-white/10">
          {validRoleParam && (
            <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Please sign in with authorized credentials to access {validRoleParam === 'admin' ? 'Apex Admin' : validRoleParam === 'inspector' ? 'DGMS Inspector' : 'Mine Authority'} operations.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#d2e0e8] mb-1">
                {t('label_email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#718594] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="e.g. officer@coal.gov.in or KD-USER-ID"
                  className="w-full h-11 pl-10 pr-3.5 bg-black/25 border border-white/15 focus:border-[#4fd1c5] rounded-xl text-xs text-white placeholder-[#718594] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#d2e0e8]">{t('label_password')}</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#f4b942] hover:underline"
                >
                  {t('forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718594] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full h-11 pl-10 pr-10 bg-black/25 border border-white/15 focus:border-[#4fd1c5] rounded-xl text-xs text-white placeholder-[#718594] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718594] hover:text-white p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#a9bcc8]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-black/30 border-white/20 text-[#126fba] focus:ring-0 cursor-pointer"
                />
                <span>{t('remember_id')}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-[#f4b942] hover:bg-[#ffc95e] text-[#112130] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#112130] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('btn_sign_in_prefix')} {selectedRole === 'admin' ? t('role_admin') : selectedRole === 'inspector' ? t('role_inspector') : t('role_mine')} {t('btn_sign_in_suffix')} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-[#869caa] space-y-1.5">
            <span className="font-bold text-[#d2e0e8] block">Demo Credentials:</span>
            <div className="flex items-center justify-between">
              <span>Admin: <code className="text-[#f4b942]">admin@coal.gov.in</code></span>
              <span className="text-[#728594]">GovAdmin@2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Inspector: <code className="text-[#4fd1c5]">inspector@dgms.gov.in</code></span>
              <span className="text-[#728594]">Inspector@2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Mine: <code className="text-[#e5a52a]">mine@bccl.gov.in</code></span>
              <span className="text-[#728594]">MineBCCL@2026</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#8fa4b2] hover:text-[#f4b942] transition-colors">
            ← Back to Public Information Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
