import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter identical credentials.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must contain at least 6 characters.', 'warn');
      return;
    }
    showToast('Credentials updated successfully. Please authenticate.', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#071a2b] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f4b942] to-[#d58e14] text-[#142334] font-black text-sm flex items-center justify-center">
              KD
            </div>
            <strong className="text-white text-lg tracking-wider font-mono">KOYLA DRISHTI</strong>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-white">Create New Password</h2>
          <p className="text-xs text-[#9eb0bc] mt-1">
            Set your high-assurance access credentials
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#d2e0e8] mb-1">New Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718594] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-11 pl-10 pr-3.5 bg-black/25 border border-white/15 focus:border-[#4fd1c5] rounded-xl text-xs text-white placeholder-[#718594] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#d2e0e8] mb-1">Confirm Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718594] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-11 pl-10 pr-3.5 bg-black/25 border border-white/15 focus:border-[#4fd1c5] rounded-xl text-xs text-white placeholder-[#718594] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#f4b942] hover:bg-[#ffc95e] text-[#112130] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Update Password & Login <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link to="/login" className="text-xs text-[#8fa4b2] hover:text-[#f4b942] transition-colors">
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
