import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, ArrowRight, Code } from 'lucide-react';
import confetti from 'canvas-confetti';

import logoImg from '../admin/logo.png';

export const SignUpModal: React.FC<{ onAuthenticated?: () => void }> = ({ onAuthenticated }) => {
  const { isSignUpModalOpen, setIsSignUpModalOpen, setUserMode, setIsOnboardingCompleted, setUserProfile, logEvent } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isSignUpModalOpen) return null;

  const handleSignUpSuccess = (providerName: string) => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const userEmail = email || (providerName === 'Google' ? 'alex.mercer@clouddevops.com' : providerName === 'GitHub' ? 'alex.mercer@github.com' : 'alex.mercer@clouddevops.com');
    const userName = name || (providerName === 'Google' ? 'Google Candidate' : providerName === 'GitHub' ? 'GitHub Candidate' : 'Alex Mercer');

    setUserProfile(prev => ({
      ...prev,
      name: userName,
      email: userEmail
    }));

    logEvent('signup_completed', undefined, providerName === 'Google' ? 'google' : providerName === 'GitHub' ? 'linkedin' : 'direct');
    setIsSignUpModalOpen(false);
    setUserMode('student');
    setIsOnboardingCompleted(false);
    onAuthenticated?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSignUpModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <img src={logoImg} alt="CloudForge Logo" className="w-12 h-12 mx-auto mb-3 rounded-2xl object-cover shadow-glow-indigo border border-indigo-500/30" />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            🚀 Start Your Preparation
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Create your free account and unlock the complete interview library.
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSignUpSuccess('Google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSignUpSuccess('GitHub')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">OR EMAIL</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); handleSignUpSuccess('Email'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-6">
          Already have an account?{' '}
          <span onClick={() => handleSignUpSuccess('Login')} className="text-indigo-400 font-semibold cursor-pointer hover:underline">
            Log In
          </span>
        </p>

      </div>
    </div>
  );
};
