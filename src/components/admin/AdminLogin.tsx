import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, AlertCircle, Zap } from 'lucide-react';

import logoImg from './logo.png';

export const AdminLogin: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const { logEvent } = useApp();
  const [email, setEmail] = useState('admin@cloudinterviewlab.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Allow admin credentials (case-insensitive & whitespace trimmed) or any admin test login
    if (
      (cleanEmail === 'admin@cloudinterviewlab.com' && cleanPass === 'admin123') ||
      cleanEmail.includes('admin')
    ) {
      setError('');
      logEvent('signup_completed', undefined, 'direct');
      onAuthenticated();
    } else {
      setError('Invalid admin credentials. Use admin@cloudinterviewlab.com / admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@cloudinterviewlab.com');
    setPassword('admin123');
    setError('');
    logEvent('signup_completed', undefined, 'direct');
    onAuthenticated();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="glass-panel bg-slate-900/95 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Shield Header */}
        <img src={logoImg} alt="CloudForge Logo" className="w-14 h-14 mx-auto rounded-2xl object-cover shadow-glow-aws border border-amber-500/30" />

        <div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-widest border border-amber-500/30 mb-2">
            RESTRICTED ADMIN PORTAL
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admin Authentication Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            RBAC Access Gate. Please enter your super admin credentials to proceed.
          </p>
        </div>

        {/* One-Click Quick Admin Demo Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-extrabold text-xs rounded-xl shadow-glow-aws transition-all transform hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>⚡ One-Click Demo Admin Login</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">OR ENTER CREDENTIALS</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cloudinterviewlab.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-glow-aws transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
