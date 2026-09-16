import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Award, 
  BookOpen, 
  Terminal, 
  ShieldAlert, 
  Mic, 
  FileText, 
  Bookmark, 
  ArrowRight, 
  TrendingUp,
  Play
} from 'lucide-react';

export const StudentDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { userProfile } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 sm:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good evening, {userProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Target Role: <span className="text-indigo-300 font-semibold">{userProfile.role}</span> • Cloud: <span className="text-amber-400 font-semibold">{userProfile.targetCloud}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>{userProfile.streakDays} Day Streak!</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 font-bold text-sm">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>{userProfile.xpPoints} XP</span>
          </div>
        </div>
      </div>

      {/* Grid: Readiness & Daily Challenge (PRD Section 9 Wireframe) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Circular & Continue Learning Box */}
        <div className="lg:col-span-2 glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Your Interview Readiness
              </h3>
              <span className="text-xs text-slate-400 font-medium">Target: {userProfile.targetInterviewDate || 'Oct 2026'}</span>
            </div>

            {/* Readiness Bar & Percentage */}
            <div className="mb-6 space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black text-indigo-400 font-mono">{userProfile.readinessPercentage}%</span>
                  <span className="text-xs text-emerald-400 font-semibold ml-2">
                    ({userProfile.completedQuestionIds.length} Questions + {userProfile.completedScenarioIds.length} Scenarios Completed)
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Target Benchmark: 85%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/50"
                  style={{ width: `${userProfile.readinessPercentage}%` }}
                />
              </div>

              {/* Progress Milestones Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Roadmap Baseline: <strong>+15%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Questions Solved: <strong>+{userProfile.completedQuestionIds.length * 10}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Scenarios Solved: <strong>+{userProfile.completedScenarioIds.length * 15}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning Module */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Continue Learning</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Kubernetes Pod-to-Pod CNI Networking</h4>
              <p className="text-xs text-slate-400 mt-1">Overlay VXLAN tunnels vs VPC Native routing</p>
            </div>

            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-glow-indigo transition-all whitespace-nowrap"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Today's Challenge Card (PRD Section 9 Wireframe) */}
        <div className="glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                Today's Challenge
              </span>
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Advanced
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              🔥 Production Pod CrashLoopBackOff & 5x Latency Surge
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Inspect application logs, diagnose Linux OOM killer exit code 137, and resolve Redis dependency timeouts in production EKS.
            </p>
          </div>

          <button
            onClick={() => onNavigate('scenarios')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Incident Challenge</span>
          </button>
        </div>

      </div>

      {/* Main Navigation Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Preparation Modules</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div 
            onClick={() => onNavigate('learn')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              Structured Learn
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              AWS, Azure, GCP, DevOps, DevSecOps & FinOps theory & concepts.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('practice')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Question Practice Bank
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              "Think & Answer" mode, real-world examples, and architecture diagrams.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('scenarios')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Production Scenarios
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Interactive incident troubleshooting and failure mode diagnostics.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('mock-interview')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              AI Mock Interview
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Voice/Text real-time interviewer simulation with radar evaluation.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('jd-analyzer')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Job Description Analyzer
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paste job specs to generate custom skill matches & prep roadmaps.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('bookmarks')}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              Saved Bookmarks ({userProfile.bookmarkedQuestionIds.length})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Review flagged questions, common mistakes, and architecture notes.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
