import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TargetRole, CloudProvider, ExperienceLevel } from '../../types';
import { 
  User, 
  Mail, 
  Briefcase, 
  Award, 
  Flame, 
  Zap, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Globe,
  DollarSign, 
  Building, 
  Edit3, 
  Save, 
  Share2, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { userProfile, setUserProfile, resetUserProgress } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'certifications' | 'edit'>('overview');
  const [isCopied, setIsCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Edit form state initialized with userProfile data
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
    experienceLevel: userProfile.experienceLevel,
    targetCloud: userProfile.targetCloud,
    targetInterviewDate: userProfile.targetInterviewDate || '',
    bio: userProfile.bio || '',
    githubUrl: userProfile.githubUrl || '',
    linkedinUrl: userProfile.linkedinUrl || '',
    targetSalary: userProfile.targetSalary || '',
    targetCompaniesStr: (userProfile.targetCompanies || []).join(', '),
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCompanies = formData.targetCompaniesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setUserProfile(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      role: formData.role as TargetRole,
      experienceLevel: formData.experienceLevel as ExperienceLevel,
      targetCloud: formData.targetCloud as CloudProvider | 'Multi-cloud',
      targetInterviewDate: formData.targetInterviewDate,
      bio: formData.bio,
      githubUrl: formData.githubUrl,
      linkedinUrl: formData.linkedinUrl,
      targetSalary: formData.targetSalary,
      targetCompanies: updatedCompanies
    }));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('overview');
    }, 1500);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* ======================================================== */}
      {/* 1. HERO PROFILE BANNER                                   */}
      {/* ======================================================== */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl">
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Active Platform Learner" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{userProfile.name}</h1>
                <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {userProfile.accountType || 'Pro Member'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-xs sm:text-sm flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  {userProfile.role} ({userProfile.experienceLevel})
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {userProfile.email}
                </span>
              </div>

              {userProfile.bio && (
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl line-clamp-2 pt-1 leading-relaxed">
                  {userProfile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'edit'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{activeTab === 'edit' ? 'View Profile' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{isCopied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
              title="Reset practice progress to 0%"
            >
              <span>Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md glass-panel bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Reset Practice Progress?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will clear all your completed questions, completed outage scenarios, and reset your readiness gauge back to <strong className="text-rose-400">0%</strong>. Your profile settings will remain intact.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetUserProgress();
                    setIsResetConfirmOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Key User Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Readiness Gauge</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400 mt-1">{userProfile.readinessPercentage}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${userProfile.readinessPercentage}%` }} />
            </div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Study Streak</span>
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{userProfile.streakDays} Days</div>
            <div className="text-[10px] text-slate-500 mt-1">Keep learning daily</div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Platform XP</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-black text-yellow-400 mt-1">{userProfile.xpPoints} XP</div>
            <div className="text-[10px] text-slate-500 mt-1">Level 4 Candidate</div>
          </div>

          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Badges Earned</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{userProfile.badges.length} Unlocked</div>
            <div className="text-[10px] text-slate-500 mt-1">Verified Achievements</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PROFILE TAB NAVIGATION                                */}
      {/* ======================================================== */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        {[
          { id: 'overview', label: 'Overview & Target Goals', icon: User },
          { id: 'certifications', label: `Certifications & Badges (${(userProfile.certifications || []).length})`, icon: ShieldCheck },
          { id: 'edit', label: 'Edit Profile Settings', icon: Edit3 },
        ].map(tab => {
          const IconC = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & TARGET GOALS                           */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Target Career Goals & Social Links */}
          <div className="space-y-6">
            
            {/* Target Interview Goal Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Target Career Roadmap</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400">Target Cloud Role</span>
                  <span className="font-bold text-white">{userProfile.role}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400">Target Ecosystem</span>
                  <span className="font-bold text-amber-400">{userProfile.targetCloud}</span>
                </div>

                {userProfile.targetSalary && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Target Compensation
                    </span>
                    <span className="font-bold text-emerald-400">{userProfile.targetSalary}</span>
                  </div>
                )}

                {userProfile.targetInterviewDate && (
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Target Interview Date</span>
                    <span className="font-bold text-cyan-400">{userProfile.targetInterviewDate}</span>
                  </div>
                )}
              </div>

              {/* Target Companies */}
              {userProfile.targetCompanies && userProfile.targetCompanies.length > 0 && (
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Target Dream Companies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.targetCompanies.map((company, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social & Portfolio Links Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Developer Social Links</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {userProfile.githubUrl ? (
                  <a
                    href={userProfile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-800/60 rounded-xl border border-slate-800 transition-all text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-300" />
                      <span className="font-mono truncate">{userProfile.githubUrl.replace('https://', '')}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                ) : (
                  <div className="text-slate-500 italic text-xs">No GitHub profile linked yet.</div>
                )}

                {userProfile.linkedinUrl ? (
                  <a
                    href={userProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-800/60 rounded-xl border border-slate-800 transition-all text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono truncate">{userProfile.linkedinUrl.replace('https://', '')}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                ) : (
                  <div className="text-slate-500 italic text-xs">No LinkedIn profile linked yet.</div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Skill Matrix & Preparation Progress */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skill Breakdown Radar / Bars */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <span>Technical Competency Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-400">Calculated based on question solutions and AI mock interview scores</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  6 Domains Assessed
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {(userProfile.skillsBreakdown || []).map((sb, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{sb.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sb.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          sb.status === 'Proficient' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sb.status}
                        </span>
                        <span className="font-mono text-slate-300 font-bold">{sb.percentage}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          sb.percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                          sb.percentage >= 65 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' :
                          'bg-gradient-to-r from-amber-500 to-orange-400'
                        }`}
                        style={{ width: `${sb.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Questions Completed</div>
                <div className="text-2xl font-extrabold text-white flex items-center justify-between">
                  <span>{userProfile.completedQuestionIds.length} Core Questions</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-500">Includes AWS, Kubernetes & Terraform deep-dives</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Production Incidents Solved</div>
                <div className="text-2xl font-extrabold text-white flex items-center justify-between">
                  <span>{userProfile.completedScenarioIds.length} Incidents</span>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-500">Real-world outage root cause troubleshooting</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CERTIFICATIONS & BADGES                           */}
      {/* ======================================================== */}
      {activeTab === 'certifications' && (
        <div className="space-y-8">
          
          {/* Cloud Certifications Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verified Cloud Industry Certifications</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official cloud vendor certifications associated with candidate profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(userProfile.certifications || []).map((cert) => (
                <div key={cert.id} className="glass-card p-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-2">{cert.title}</h4>
                    <p className="text-xs text-slate-400">{cert.issuer}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Issued: {cert.issuedDate}</span>
                    {cert.credentialId && (
                      <span className="font-mono text-slate-400 font-medium">{cert.credentialId}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Badges Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Platform Badges & Achievements</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Unlocked by completing interview questions, streaks, and AI mock sessions</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {userProfile.badges.map((badge) => (
                <div key={badge.id} className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/60 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white">{badge.title}</div>
                  <div className="text-[10px] text-slate-400">Unlocked: {badge.unlockedAt}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: EDIT PROFILE SETTINGS FORM                        */}
      {/* ======================================================== */}
      {activeTab === 'edit' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              <span>Edit Candidate Profile Information</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Update your target role, compensation expectations, and developer social links.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully! Redirecting to profile view...</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Target Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as TargetRole })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cloud Engineer">Cloud Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="DevSecOps Engineer">DevSecOps Engineer</option>
                  <option value="SRE">SRE</option>
                  <option value="Platform Engineer">Platform Engineer</option>
                  <option value="Cloud Architect">Cloud Architect</option>
                  <option value="FinOps Engineer">FinOps Engineer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Target Cloud Provider</label>
                <select
                  value={formData.targetCloud}
                  onChange={e => setFormData({ ...formData, targetCloud: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="Kubernetes">Kubernetes</option>
                  <option value="Terraform">Terraform</option>
                  <option value="Multi-cloud">Multi-cloud</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Target Compensation Range</label>
                <input
                  type="text"
                  placeholder="e.g. $145,000 - $170,000 / year"
                  value={formData.targetSalary}
                  onChange={e => setFormData({ ...formData, targetSalary: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Target Interview Date</label>
                <input
                  type="date"
                  value={formData.targetInterviewDate}
                  onChange={e => setFormData({ ...formData, targetInterviewDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Bio & Summary</label>
              <textarea
                rows={3}
                placeholder="Brief technical summary..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Target Dream Companies (Comma separated)</label>
              <input
                type="text"
                placeholder="AWS, Datadog, HashiCorp, Stripe"
                value={formData.targetCompaniesStr}
                onChange={e => setFormData({ ...formData, targetCompaniesStr: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
