import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast('Password recovery verification link dispatched to official email', 'success');
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
          <h2 className="mt-4 text-2xl font-extrabold text-white">Reset Official Credentials</h2>
          <p className="text-xs text-[#9eb0bc] mt-1">
            Ministry of Coal Security Token Dispatcher
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-white/10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#c2d4e0] leading-relaxed">
                Enter your registered government email address. We will verify your designated role and send a single-use authorization token.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#d2e0e8] mb-1">Government Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#718594] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gov.in or name@mine.gov.in"
                    className="w-full h-11 pl-10 pr-3.5 bg-black/25 border border-white/15 focus:border-[#4fd1c5] rounded-xl text-xs text-white placeholder-[#718594] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#f4b942] hover:bg-[#ffc95e] text-[#112130] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Send Password Reset Token <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#19a974]/20 text-[#19a974] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Token Dispatched</h3>
              <p className="text-xs text-[#9eb0bc] leading-relaxed">
                A verification link has been sent to <strong className="text-white">{email}</strong>. For demonstration purposes, you can jump directly to the reset screen.
              </p>
              <button
                onClick={() => navigate('/reset-password')}
                className="w-full py-2.5 rounded-lg bg-[#126fba] hover:bg-[#0f60a1] text-white text-xs font-bold transition-colors"
              >
                Proceed to Reset Password →
              </button>
            </div>
          )}

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
