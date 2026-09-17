import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AnimatedBackground } from './components/common/AnimatedBackground';

// Public Components
import { HeroSection } from './components/public/HeroSection';
import { TopicDirectory } from './components/public/TopicDirectory';
import { QuestionPreviewModal } from './components/public/QuestionPreviewModal';
import { SignUpModal } from './components/public/SignUpModal';
import { SocialShareGeneratorModal } from './components/app/SocialShareGeneratorModal';

// Student App Components
import { StudentLogin } from './components/app/StudentLogin';
import { OnboardingWizard } from './components/app/OnboardingWizard';
import { StudentDashboard } from './components/app/StudentDashboard';
import { QuestionDetailView } from './components/app/QuestionDetailView';
import { ScenarioEngine } from './components/app/ScenarioEngine';
import { MockInterviewSimulator } from './components/app/MockInterviewSimulator';
import { JobDescriptionAnalyzer } from './components/app/JobDescriptionAnalyzer';
import { BookmarksAndProgress } from './components/app/BookmarksAndProgress';
import { ArchitectureSimulator } from './components/app/ArchitectureSimulator';
import { UserProfileView } from './components/app/UserProfileView';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuestionManager } from './components/admin/QuestionManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { FunnelAnalytics } from './components/admin/FunnelAnalytics';
import { ContentAndSearchAnalytics } from './components/admin/ContentAndSearchAnalytics';
import { SocialAnalyticsDashboard } from './components/admin/SocialAnalyticsDashboard';
import { AdminSettings } from './components/admin/AdminSettings';
import { UserManager } from './components/admin/UserManager';

import type { Question } from './types';
import { LayoutDashboard, HelpCircle, FolderTree, TrendingDown, Search, Share2, Settings, Users, LogOut } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    userMode, 
    setUserMode,
    userProfile,
    isOnboardingCompleted, 
    activeShareModalQuestion, 
    setActiveShareModalQuestion 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState<boolean>(false);

  const userSlug = (userProfile.name || 'alex-mercer').toLowerCase().replace(/\s+/g, '-');

  // Parse URL hash on mount and hash change (e.g. #/admin-portal/dashboard, #/@[AdminDashboard], #/@alex-mercer/learn)
  React.useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash || '';
      if (!hash) return;

      const lowerHash = hash.toLowerCase();

      // 1. Admin Portal routes (e.g. #/admin-portal, #/admin-portal/dashboard, #/@[AdminDashboard], #/admin)
      if (lowerHash.includes('admin')) {
        setUserMode('admin');
        setIsAdminAuthenticated(true);
        if (lowerHash.includes('question')) setAdminTab('questions');
        else if (lowerHash.includes('categor')) setAdminTab('categories');
        else if (lowerHash.includes('user') || lowerHash.includes('candidate') || lowerHash.includes('profile')) setAdminTab('users');
        else if (lowerHash.includes('funnel')) setAdminTab('funnel');
        else if (lowerHash.includes('content') || lowerHash.includes('search')) setAdminTab('content-analytics');
        else if (lowerHash.includes('social')) setAdminTab('social-analytics');
        else if (lowerHash.includes('setting')) setAdminTab('settings');
        else setAdminTab('dashboard');
        return;
      }

      // 2. Candidate / Student Platform routes (e.g. #/@alex-mercer/learn, #/@alex-mercer/dashboard)
      if (hash.startsWith('#/@') || lowerHash.includes('student') || lowerHash.includes('learn') || lowerHash.includes('dashboard')) {
        setUserMode('student');
        setIsStudentAuthenticated(true);
        if (lowerHash.includes('learn') || lowerHash.includes('practice')) setActiveTab('learn');
        else if (lowerHash.includes('scenario')) setActiveTab('scenarios');
        else if (lowerHash.includes('architect')) setActiveTab('architecture');
        else if (lowerHash.includes('mock')) setActiveTab('mock-interview');
        else if (lowerHash.includes('jd') || lowerHash.includes('analyzer')) setActiveTab('jd-analyzer');
        else if (lowerHash.includes('bookmark')) setActiveTab('bookmarks');
        else if (lowerHash.includes('profile')) setActiveTab('profile');
        else setActiveTab('dashboard');
        return;
      }

      // 3. Public Website route
      if (lowerHash.includes('explore') || hash === '#/') {
        setUserMode('public');
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, [setUserMode]);

  // Synchronize browser URL hash with candidate username & active tab
  React.useEffect(() => {
    if (userMode === 'student' && isStudentAuthenticated) {
      const newHash = `#/@${userSlug}/${activeTab}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } else if (userMode === 'admin' && isAdminAuthenticated) {
      const newHash = `#/admin-portal/${adminTab}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } else if (userMode === 'public') {
      if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#/explore') {
        window.history.replaceState(null, '', '#/explore');
      }
    }
  }, [userMode, activeTab, adminTab, userSlug, isStudentAuthenticated, isAdminAuthenticated]);

  const handleSelectQuestion = (q: Question) => {
    if (userMode === 'public') {
      setPreviewQuestion(q);
    } else {
      setSelectedQuestion(q);
      setActiveTab('question-detail');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Animated Background Layer */}
      <AnimatedBackground />

      {/* Persistent Navigation Header */}
      <Header 
        activeTab={activeTab} 
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedQuestion(null);
        }} 
        onNavigateToLogin={() => {
          setUserMode('student');
          setIsStudentAuthenticated(false);
        }}
      />

      <main className="flex-grow">
        
        {/* ======================================================== */}
        {/* EXPERIENCE 1: PUBLIC WEBSITE                             */}
        {/* ======================================================== */}
        {userMode === 'public' && (
          <div className="animate-fadeIn">
            <HeroSection 
              onExploreClick={() => {
                const el = document.getElementById('topics-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />
            <TopicDirectory onSelectQuestion={handleSelectQuestion} />
          </div>
        )}

        {/* ======================================================== */}
        {/* EXPERIENCE 2: AUTHENTICATED STUDENT PLATFORM             */}
        {/* ======================================================== */}
        {userMode === 'student' && (
          <div className="animate-fadeIn">
            
            {!isStudentAuthenticated ? (
              <StudentLogin onAuthenticated={() => setIsStudentAuthenticated(true)} />
            ) : !isOnboardingCompleted ? (
              <OnboardingWizard onComplete={() => setActiveTab('dashboard')} />
            ) : (
              <div>
                {/* Secondary Student Navigation Sub-bar */}
                <div className="bg-slate-900/60 border-b border-slate-800/80 sticky top-16 z-40 backdrop-blur-md">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 overflow-x-auto py-2 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'learn', label: 'Learn & Practice' },
                        { id: 'scenarios', label: 'Scenarios' },
                        { id: 'architecture', label: 'Architecture Simulator' },
                        { id: 'mock-interview', label: 'AI Mock Interview' },
                        { id: 'jd-analyzer', label: 'JD Analyzer' },
                        { id: 'bookmarks', label: 'Bookmarks & Progress' },
                        { id: 'profile', label: 'My Profile' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setSelectedQuestion(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                            activeTab === tab.id || (tab.id === 'learn' && activeTab === 'question-detail')
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsStudentAuthenticated(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* Tab Views */}
                {(activeTab === 'dashboard' || activeTab === 'home' || !activeTab) && (
                  <StudentDashboard onNavigate={(target) => {
                    setActiveTab(target);
                    setSelectedQuestion(null);
                  }} />
                )}

                {(activeTab === 'learn' || activeTab === 'practice') && (
                  <TopicDirectory onSelectQuestion={handleSelectQuestion} />
                )}

                {activeTab === 'question-detail' && selectedQuestion && (
                  <QuestionDetailView 
                    question={selectedQuestion} 
                    onBack={() => {
                      setSelectedQuestion(null);
                      setActiveTab('learn');
                    }} 
                  />
                )}

                {activeTab === 'scenarios' && <ScenarioEngine />}

                {activeTab === 'architecture' && <ArchitectureSimulator />}

                {activeTab === 'mock-interview' && <MockInterviewSimulator />}

                {activeTab === 'jd-analyzer' && (
                  <JobDescriptionAnalyzer onGeneratePlanClick={() => setActiveTab('learn')} />
                )}

                {activeTab === 'bookmarks' && (
                  <BookmarksAndProgress onSelectQuestion={handleSelectQuestion} />
                )}

                {activeTab === 'profile' && <UserProfileView />}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* EXPERIENCE 3: ADMIN PORTAL (PROTECTED RBAC GATE)        */}
        {/* ======================================================== */}
        {userMode === 'admin' && (
          <div className="animate-fadeIn">
            {!isAdminAuthenticated ? (
              <AdminLogin onAuthenticated={() => setIsAdminAuthenticated(true)} />
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                
                {/* Admin Sub-navigation Header */}
                <div className="glass-panel p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                      { id: 'questions', label: 'Questions', icon: HelpCircle },
                      { id: 'categories', label: 'Categories', icon: FolderTree },
                      { id: 'users', label: 'Candidate Profiles', icon: Users },
                      { id: 'funnel', label: 'Funnel Analytics', icon: TrendingDown },
                      { id: 'content-analytics', label: 'Search & Content', icon: Search },
                      { id: 'social-analytics', label: 'Social Analytics', icon: Share2 },
                      { id: 'settings', label: 'Admin Settings', icon: Settings },
                    ].map(tab => {
                      const IconC = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setAdminTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            adminTab === tab.id
                              ? 'bg-amber-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`}
                        >
                          <IconC className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Portal</span>
                  </button>
                </div>

                {/* Admin Views */}
                {adminTab === 'dashboard' && <AdminDashboard />}
                {adminTab === 'questions' && <QuestionManager />}
                {adminTab === 'categories' && <CategoryManager />}
                {adminTab === 'users' && <UserManager />}
                {adminTab === 'funnel' && <FunnelAnalytics />}
                {adminTab === 'content-analytics' && <ContentAndSearchAnalytics />}
                {adminTab === 'social-analytics' && <SocialAnalyticsDashboard />}
                {adminTab === 'settings' && <AdminSettings />}

              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Modals */}
      <QuestionPreviewModal 
        question={previewQuestion} 
        onClose={() => setPreviewQuestion(null)} 
      />

      <SignUpModal 
        onAuthenticated={() => setIsStudentAuthenticated(true)} 
        onNavigateToLogin={() => setIsStudentAuthenticated(false)}
      />

      <SocialShareGeneratorModal 
        question={activeShareModalQuestion} 
        onClose={() => setActiveShareModalQuestion(null)} 
      />

      {/* Footer */}
      <Footer onNavigateTab={(tab) => {
        setActiveTab(tab);
        setSelectedQuestion(null);
      }} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
