export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'DevOps' | 'DevSecOps' | 'FinOps' | 'Kubernetes' | 'Terraform' | 'Docker' | 'Helm' | 'ArgoCD' | 'Jenkins' | 'SRE' | 'Observability';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ExperienceLevel = '0-1 Years (Fresher)' | '1-2 Years' | '3-5 Years' | '5-8 Years' | '8+ Years';

export type TargetRole = 'Cloud Engineer' | 'DevOps Engineer' | 'DevSecOps Engineer' | 'SRE' | 'Platform Engineer' | 'Cloud Architect' | 'FinOps Engineer';

export type UserMode = 'public' | 'student' | 'admin';

export type AdminRole = 'Super Admin' | 'Content Admin' | 'Analyst' | 'Support Admin';

export interface FollowUpQuestion {
  id: string;
  question: string;
  expectedAnswerHint: string;
}

export interface Question {
  id: string;
  cloud: CloudProvider;
  category: string;
  subcategory: string;
  title: string;
  previewAnswer: string;
  fullAnswer: string;
  realWorldExample: string;
  architectureDiagram?: string;
  commonMistakes: string[];
  followUpQuestions: FollowUpQuestion[];
  difficulty: DifficultyLevel;
  targetExperience: ExperienceLevel;
  isLocked: boolean;
  viewsCount: number;
  bookmarksCount: number;
  sharesCount: number;
  signupsConverted: number;
  seoTitle?: string;
  seoMetaDescription?: string;
  publishedAt: string;
  status: 'Published' | 'Draft' | 'Review';
}

export interface Category {
  id: string;
  cloud: CloudProvider;
  name: string;
  description: string;
  questionCount: number;
  subcategories: string[];
  iconName: string;
}

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  followupStep?: string;
}

export interface IncidentScenario {
  id: string;
  title: string;
  cloud: CloudProvider;
  difficulty: DifficultyLevel;
  description: string;
  logsOutput: string;
  initialQuestion: string;
  options: DiagnosticOption[];
  rootCauseAnalysis: string;
  bestPracticePrevention: string;
}

export interface MockInterviewSession {
  id: string;
  role: TargetRole;
  cloud: CloudProvider;
  difficulty: DifficultyLevel;
  date: string;
  durationMinutes: number;
  radarScores: {
    technicalKnowledge: number;
    architecture: number;
    troubleshooting: number;
    communication: number;
    security: number;
    finops: number;
  };
  overallScore: number;
  keyStrengths: string[];
  areasToImprove: string[];
  interviewerFeedback: string;
}

export interface JDAnalysisResult {
  jobTitle: string;
  companyName: string;
  matchPercentage: number;
  detectedSkills: { name: string; percentage: number; isMatch: boolean }[];
  missingCriticalSkills: string[];
  recommendedPreparationPlan: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId?: string;
  verifyUrl?: string;
}

export interface UserSkillRating {
  skill: string;
  category: CloudProvider;
  percentage: number;
  status: 'Mastered' | 'Proficient' | 'Learning';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: TargetRole;
  experienceLevel: ExperienceLevel;
  targetCloud: CloudProvider | 'Multi-cloud';
  targetInterviewDate?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  targetSalary?: string;
  targetCompanies?: string[];
  accountType?: 'Free Candidate' | 'Pro Member' | 'Enterprise';
  readinessPercentage: number;
  completedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  completedScenarioIds: string[];
  streakDays: number;
  xpPoints: number;
  badges: { id: string; title: string; icon: string; unlockedAt: string }[];
  certifications?: Certification[];
  skillsBreakdown?: UserSkillRating[];
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_viewed' | 'question_viewed' | 'answer_unlocked' | 'signup_completed' | 'share_clicked' | 'scenario_completed' | 'mock_interview_completed' | 'search_performed';
  userId?: string;
  contentId?: string;
  metadata?: Record<string, any>;
  source: 'google' | 'linkedin' | 'whatsapp' | 'x' | 'direct' | 'other';
  device: 'desktop' | 'mobile' | 'tablet';
  timestamp: string;
}

export interface SearchQueryLog {
  query: string;
  count: number;
  hasResult: boolean;
  conversionRate: number;
}
