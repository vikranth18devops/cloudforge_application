import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, AlertCircle, Code } from 'lucide-react';

import logoImg from '../admin/logo.png';

export const StudentLogin: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const { logEvent, setUserProfile, setUserMode, setIsSignUpModalOpen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      setError('');
      const cleanEmail = email.trim().toLowerCase();
      const derivedName = cleanEmail.split('@')[0]
        .replace(/[^a-z0-9]/gi, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) || 'Candidate';

      setUserProfile(prev => ({
        ...prev,
        name: derivedName,
        email: cleanEmail
      }));

      setUserMode('student');
      logEvent('signup_completed', undefined, 'direct');
      onAuthenticated();
    } else {
      setError('Please enter your email and password.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    const socialEmail = provider === 'Google' ? 'candidate@gmail.com' : 'candidate@linkedin.com';
    const socialName = provider === 'Google' ? 'Google Candidate' : 'LinkedIn Candidate';

    setUserProfile(prev => ({
      ...prev,
      name: socialName,
      email: socialEmail
    }));

    setUserMode('student');
    logEvent('signup_completed', undefined, provider === 'Google' ? 'google' : 'linkedin');
    onAuthenticated();
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 sm:px-6">
      <div className="glass-panel bg-slate-900/95 border-2 border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Terminal Header */}
        <img src={logoImg} alt="CloudForge Logo" className="w-14 h-14 mx-auto rounded-2xl object-cover shadow-glow-indigo border border-indigo-500/30" />

        <div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-widest border border-indigo-500/30 mb-2">
            STUDENT PLATFORM LOGIN
          </div>
          <h2 className="text-2xl font-extrabold text-white">Log In to Start Preparing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your personalized roadmap, production scenarios, and AI mock interviews.
          </p>
        </div>



        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Social Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Log In with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('GitHub')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Log In with GitHub</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">OR EMAIL</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.mercer@clouddevops.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <span>Log In & Open Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-400">
          Don't have an account?{' '}
          <span onClick={() => setIsSignUpModalOpen(true)} className="text-indigo-400 font-semibold cursor-pointer hover:underline">
            Register Free Account
          </span>
        </p>

      </div>
    </div>
  );
};
