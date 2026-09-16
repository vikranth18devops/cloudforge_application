import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Flame,
  Award,
  Shield
} from 'lucide-react';

import logoImg from '../admin/logo.png';

export const Header: React.FC<{ onNavigateTab?: (tab: string) => void; activeTab?: string }> = ({ onNavigateTab }) => {
  const { userMode, setUserMode, userProfile, searchQuery, setSearchQuery, setIsSignUpModalOpen } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-xl border-b border-slate-700/60 shadow-lg shadow-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setUserMode('public'); onNavigateTab?.('home'); }}>
          <img src={logoImg} alt="CloudForge Logo" className="w-10 h-10 rounded-xl object-cover shadow-glow-indigo border border-indigo-500/40" />
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-lg tracking-tight">
              <span className="gradient-text">CLOUDFORGE</span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-white font-semibold hidden sm:block">
              Learn • Practice • Troubleshoot • Interview
            </p>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden lg:block w-48 xl:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AWS, K8s..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {userMode === 'public' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSignUpModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setIsSignUpModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold rounded-lg shadow-glow-indigo transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get Started Free
              </button>
            </div>
          )}

          {userMode === 'student' && (
            <div className="flex items-center gap-3">
              {/* Streak badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-bold shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{userProfile.streakDays}d Streak</span>
              </div>
              
              {/* Readiness badge */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-200 text-xs font-bold shadow-sm">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>{userProfile.readinessPercentage}% Ready</span>
              </div>

              {/* Candidate Username Profile Pill */}
              <div 
                className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-700/80 transition-all shadow-sm"
                onClick={() => onNavigateTab?.('profile')}
                title="View My Candidate Profile"
              >
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-lg border border-indigo-500/60 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-none">{userProfile.name}</div>
                  <div className="text-[10px] text-indigo-300 font-mono leading-tight mt-0.5">@{userProfile.name.toLowerCase().replace(/\s+/g, '')}</div>
                </div>
              </div>
            </div>
          )}

          {userMode === 'admin' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Shield className="w-3.5 h-3.5" />
                Super Admin
              </span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
