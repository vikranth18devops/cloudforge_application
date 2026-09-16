import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Question, 
  Category, 
  IncidentScenario, 
  MockInterviewSession, 
  UserProfile, 
  UserMode, 
  CloudProvider,
  AnalyticsEvent,
  SearchQueryLog
} from '../types';
import { 
  MOCK_QUESTIONS, 
  MOCK_CATEGORIES, 
  MOCK_SCENARIOS, 
  MOCK_MOCK_SESSIONS, 
  MOCK_ANALYTICS_EVENTS,
  MOCK_SEARCH_LOGS,
  MOCK_ALL_USERS
} from '../data/mockData';
import { 
  fetchQuestionsFromApi, 
  syncQuestionToApi, 
  syncUserProfileToApi 
} from '../api/client';

interface AppContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  categories: Category[];
  scenarios: IncidentScenario[];
  mockSessions: MockInterviewSession[];
  addMockSession: (session: MockInterviewSession) => void;
  selectedCloud: CloudProvider | 'All';
  setSelectedCloud: (cloud: CloudProvider | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeQuestion: Question | null;
  setActiveQuestion: (question: Question | null) => void;
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: (open: boolean) => void;
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (completed: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  markQuestionCompleted: (questionId: string) => void;
  markScenarioCompleted: (scenarioId: string) => void;
  resetUserProgress: () => void;
  analyticsEvents: AnalyticsEvent[];
  logEvent: (eventType: AnalyticsEvent['eventType'], contentId?: string, source?: AnalyticsEvent['source']) => void;
  searchLogs: SearchQueryLog[];
  activeShareModalQuestion: Question | null;
  setActiveShareModalQuestion: (question: Question | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage Helper Functions
const STORAGE_KEY_USER_PROFILE = 'cloud_interview_user_profile';
const STORAGE_KEY_USER_MODE = 'cloud_interview_user_mode';
const STORAGE_KEY_QUESTIONS = 'cloud_interview_questions';
const STORAGE_KEY_MOCK_SESSIONS = 'cloud_interview_mock_sessions';
const STORAGE_KEY_ALL_USERS = 'cloud_interview_all_users';

const syncUserProfileToAllUsers = (profile: UserProfile) => {
  if (!profile || !profile.email) return;
  try {
    const savedAll = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    let allUsers: UserProfile[] = savedAll ? JSON.parse(savedAll) : MOCK_ALL_USERS;
    
    // Filter out obsolete dummy mock users
    allUsers = allUsers.filter(u => u.id !== 'usr-102' && u.id !== 'usr-103' && u.id !== 'usr-104' && u.id !== 'usr-105');

    const idx = allUsers.findIndex(u => 
      u.id === profile.id || u.email.toLowerCase() === profile.email.toLowerCase()
    );

    if (idx >= 0) {
      allUsers[idx] = { ...allUsers[idx], ...profile };
    } else {
      allUsers.push(profile);
    }

    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));
  } catch (e) {
    console.error('Error syncing candidate userProfile to allUsers:', e);
  }
};

const loadSavedProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading userProfile from localStorage:', e);
  }
  return {
    id: 'usr-001',
    name: 'Alex Mercer',
    email: 'alex.mercer@clouddevops.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'Cloud Engineer',
    experienceLevel: '1-2 Years',
    targetCloud: 'AWS',
    readinessPercentage: 0,
    completedQuestionIds: [],
    completedScenarioIds: [],
    bookmarkedQuestionIds: [],
    xpPoints: 0,
    streakDays: 1,
    badges: [],
    targetInterviewDate: 'Oct 2026',
    targetSalary: '$145,000 - $170,000 / year',
    targetCompanies: ['Amazon Web Services', 'Datadog', 'Stripe'],
    bio: 'DevOps and Cloud Infrastructure practitioner preparing for high-impact SRE & Cloud Engineering interviews.'
  };
};

const loadSavedUserMode = (): UserMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER_MODE);
    if (saved === 'public' || saved === 'student' || saved === 'admin') return saved as UserMode;
  } catch (e) {
    console.error('Error reading userMode from localStorage:', e);
  }
  return 'public';
};

const loadSavedQuestions = (): Question[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    if (saved) {
      const parsed: Question[] = JSON.parse(saved);
      // Merge any new default mock questions that are not present in saved localStorage
      const existingIds = new Set(parsed.map(q => q.id));
      const missingDefaults = MOCK_QUESTIONS.filter(q => !existingIds.has(q.id));
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults];
        try {
          localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(merged));
        } catch (e) {
          console.error('Error saving merged questions to localStorage:', e);
        }
        return merged;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading questions from localStorage:', e);
  }
  return MOCK_QUESTIONS;
};

const loadSavedMockSessions = (): MockInterviewSession[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MOCK_SESSIONS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading mockSessions from localStorage:', e);
  }
  return MOCK_MOCK_SESSIONS;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(loadSavedUserMode);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadSavedProfile);
  const [questions, setQuestions] = useState<Question[]>(loadSavedQuestions);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [scenarios] = useState<IncidentScenario[]>(MOCK_SCENARIOS);
  const [mockSessions, setMockSessions] = useState<MockInterviewSession[]>(loadSavedMockSessions);
  const [selectedCloud, setSelectedCloud] = useState<CloudProvider | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(MOCK_ANALYTICS_EVENTS);
  const [searchLogs] = useState<SearchQueryLog[]>(MOCK_SEARCH_LOGS);
  const [activeShareModalQuestion, setActiveShareModalQuestion] = useState<Question | null>(null);

  // Synchronize state changes to localStorage and PostgreSQL API
  useEffect(() => {
    // Attempt background fetch from PostgreSQL API if server is online
    fetchQuestionsFromApi().then(apiQuestions => {
      if (apiQuestions && apiQuestions.length > 0) {
        setQuestions(apiQuestions);
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(userProfile));
      syncUserProfileToAllUsers(userProfile);
      syncUserProfileToApi(userProfile);
    } catch (e) {
      console.error('Error saving userProfile to localStorage:', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_MODE, userMode);
    } catch (e) {
      console.error('Error saving userMode to localStorage:', e);
    }
  }, [userMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
      syncQuestionToApi(questions);
    } catch (e) {
      console.error('Error saving questions to localStorage:', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOCK_SESSIONS, JSON.stringify(mockSessions));
    } catch (e) {
      console.error('Error saving mockSessions to localStorage:', e);
    }
  }, [mockSessions]);

  const logEvent = (eventType: AnalyticsEvent['eventType'], contentId?: string, source: AnalyticsEvent['source'] = 'direct') => {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType,
      contentId,
      source,
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAnalyticsEvents(prev => [newEvent, ...prev]);
  };

  const toggleBookmark = (questionId: string) => {
    setUserProfile(prev => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      const updated = isBookmarked
        ? prev.bookmarkedQuestionIds.filter(id => id !== questionId)
        : [...prev.bookmarkedQuestionIds, questionId];
      return { ...prev, bookmarkedQuestionIds: updated };
    });
  };

  const markQuestionCompleted = (questionId: string) => {
    setUserProfile(prev => {
      const isAlreadyCompleted = prev.completedQuestionIds.includes(questionId);
      const updatedQuestions = isAlreadyCompleted 
        ? prev.completedQuestionIds 
        : [...prev.completedQuestionIds, questionId];
      
      const newReadiness = Math.min(100, (updatedQuestions.length * 10) + (prev.completedScenarioIds.length * 15));
      return {
        ...prev,
        completedQuestionIds: updatedQuestions,
        xpPoints: isAlreadyCompleted ? prev.xpPoints : prev.xpPoints + 50,
        readinessPercentage: newReadiness
      };
    });
  };

  const markScenarioCompleted = (scenarioId: string) => {
    setUserProfile(prev => {
      const isAlreadyCompleted = prev.completedScenarioIds.includes(scenarioId);
      const updatedScenarios = isAlreadyCompleted 
        ? prev.completedScenarioIds 
        : [...prev.completedScenarioIds, scenarioId];

      const newReadiness = Math.min(100, (prev.completedQuestionIds.length * 10) + (updatedScenarios.length * 15));
      return {
        ...prev,
        completedScenarioIds: updatedScenarios,
        xpPoints: isAlreadyCompleted ? prev.xpPoints : prev.xpPoints + 100,
        readinessPercentage: newReadiness
      };
    });
  };

  const resetUserProgress = () => {
    setUserProfile(prev => ({
      ...prev,
      completedQuestionIds: [],
      completedScenarioIds: [],
      bookmarkedQuestionIds: [],
      readinessPercentage: 0,
      xpPoints: 0
    }));
  };

  const addMockSession = (session: MockInterviewSession) => {
    setMockSessions(prev => [session, ...prev]);
    setUserProfile(prev => {
      const newReadiness = Math.min(100, Math.round(prev.readinessPercentage + (session.overallScore * 0.15)));
      return {
        ...prev,
        xpPoints: prev.xpPoints + 150,
        readinessPercentage: newReadiness
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        userMode,
        setUserMode,
        userProfile,
        setUserProfile,
        questions,
        setQuestions,
        categories,
        scenarios,
        mockSessions,
        addMockSession,
        selectedCloud,
        setSelectedCloud,
        searchQuery,
        setSearchQuery,
        activeQuestion,
        setActiveQuestion,
        isSignUpModalOpen,
        setIsSignUpModalOpen,
        isOnboardingCompleted,
        setIsOnboardingCompleted,
        toggleBookmark,
        markQuestionCompleted,
        markScenarioCompleted,
        resetUserProgress,
        analyticsEvents,
        logEvent,
        searchLogs,
        activeShareModalQuestion,
        setActiveShareModalQuestion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
