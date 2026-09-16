# 📄 Product Requirement Document (PRD)
## ☁️ CloudForge — Interactive Cloud & DevOps Interview Preparation Platform

**Version:** 2.4.0  
**Status:** Production Ready  
**Target Release Date:** Q3/Q4 2026  
**Web Application URL:** `http://localhost:5173/`  
**Candidate Portal:** `http://localhost:5173/#/@alex-mercer/dashboard`  
**Admin Portal:** `http://localhost:5173/#/admin-portal/dashboard`

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**CloudForge** is an enterprise-grade, high-frequency interview preparation and skill assessment web application built for Cloud Engineers, DevOps Practitioners, Site Reliability Engineers (SREs), DevSecOps Specialists, and Cloud Architects. 

Unlike generic flashcard software, CloudForge simulates real-world production incident response, architectural topology evaluation, multi-cloud question practice, and AI-driven voice/text mock interviews with real-time feedback metrics.

### 1.2 Core Objectives
- **Empower Candidates**: Accelerate candidate readiness through structured preparation across 14 cloud ecosystems (AWS, Kubernetes, Terraform, Azure, GCP, Docker, Helm, ArgoCD, Jenkins, SRE, Observability, DevSecOps, FinOps).
- **Seamless Ingestion**: Provide admins with a zero-code 7-field ingestion engine supporting Excel (`.xlsx`), CSV, JSON, and Plain Text uploads.
- **Real-Time Live Synchronization**: Guarantee instant live synchronization of candidate directories, question repositories, and category question counts across Admin and Candidate UI views.

---

## 2. Target Audience & User Personas

| Persona | Role | Primary Goal | Key Pain Point Solved |
| :--- | :--- | :--- | :--- |
| **Candidate (Alex Mercer)** | DevOps / SRE Engineer | Prepare for high-paying cloud interviews ($145k–$170k+). | Lack of real-world architecture questions and outage scenario practice. |
| **System Admin** | Super Administrator / Content Lead | Manage question repositories, import questions from Excel/CSV, and track candidate progress. | Difficulty ingesting bulk multi-field questions and syncing UI real-time. |
| **Recruiter / Hiring Manager** | Talent Acquisition | Evaluate candidate readiness scores and verified cloud certifications. | Unreliable candidate self-assessment scores. |

---

## 3. Technology Stack & Architecture

### 3.1 Core Architecture
- **Framework**: React 18 with TypeScript 5
- **Build Tooling**: Vite 8.3
- **State Management**: React Context API (`AppContext.tsx`) + `localStorage` persistence
- **Excel Parser**: SheetJS (`xlsx` v0.18.5)
- **Styling**: Tailwind CSS v4, Vanilla CSS Design Tokens, Custom Glassmorphism (`.glass-panel`, `.glass-card`)
- **Icons**: Lucide React
- **Visual Effects**: Canvas Confetti, Keyframe CSS Orbs, Scanbeam animations

---

## 4. Platform Modules & Functional Requirements

### 4.1 Candidate User Experience

#### 4.1.1 Authentication & State Persistence
- **One-Click SSO & Email Login**: Supports 1-Click Google, GitHub, and custom email/password authentication.
- **Local Persistence**: Maintains active login session, completed questions, incident scenarios, bookmarked items, custom target clouds, and XP points across browser reloads.
- **Dynamic Readiness Gauge**: Automatically updates readiness percentage score based on question completions (+10%) and outage scenario resolves (+15%).

#### 4.1.2 Learn & Practice Question Directory (`TopicDirectory.tsx`)
- **Cloud Provider Navigation Tabs**: Filter questions by cloud platform with live question count badges (`AWS (7)`, `Kubernetes (1)`, `Docker (1)`, `Terraform (1)`).
- **Dynamic 5-Column Ultra-Compact Category Grid**: Resizable 5-column layout displaying category icons, titles, and live question counters (`7 Questions`, `1 Question`).
- **Interactive Question Detail View (`QuestionDetailView.tsx`)**:
  - *Think & Answer First Mode*: Formulate answer in text field before revealing solution.
  - *Expected Interviewer Answer*: Detailed architecture explanation.
  - *Production Real-World Examples & Terminal Topology*: High-contrast ASCII/Unicode architecture topology diagrams.
  - *Candidate Pitfalls & Follow-up Questions*: Common candidate mistakes and interviewer follow-up hints.
  - *Action Toolbar*: Bookmark, Share Social Card modal, and "Practice Similar Questions" navigation.

#### 4.1.3 Incident Scenario Engine (`ScenarioEngine.tsx`)
- Real-world production outage troubleshooting (e.g., *EKS Pod CrashLoopBackOff OOMKilled*, *Terraform State Lock Failure*).
- Terminal log inspector, step-by-step diagnostic options, root cause analysis, and XP awards.

#### 4.1.4 Architecture Simulator (`ArchitectureSimulator.tsx`)
- Topology layout visualizer for multi-tier AWS/EKS architectures.
- Node inspection for security vulnerabilities, FinOps cost optimization, and HA redundancy checks.

#### 4.1.5 AI Mock Interview Simulator (`MockInterviewSimulator.tsx`)
- Voice and text interactive AI interviewer.
- Evaluates candidate answers across 6 core competency axes (Conceptual Depth, Architecture Tradeoffs, Security Guardrails, Production Experience, Communication Clarity, Troubleshooting Logic).

#### 4.1.6 Job Description (JD) Skill Gap Analyzer (`JobDescriptionAnalyzer.tsx`)
- Paste raw job descriptions to analyze required skills.
- Highlights missing knowledge gaps and generates custom target study roadmaps.

---

### 4.2 Admin Portal Experience

#### 4.2.1 Admin Portal Access & Credentials
- **Access Route**: `http://localhost:5173/#/admin-portal/dashboard`
- **Default Admin Account**: `admin@cloudinterviewlab.com` / `admin123` (1-Click Demo Login button provided).

#### 4.2.2 Hierarchical Category & Question Ingestion Engine (`CategoryManager.tsx`)
- **7 Required Ingestion Fields**:
  1. `Cloud Provider` (AWS, Kubernetes, Azure, GCP, Docker, Helm, ArgoCD, Jenkins, SRE, Observability, Terraform, DevSecOps, FinOps)
  2. `Category` *(Interactive `<select>` Dropdown + `+ Enter Custom Category`)*
  3. `Difficulty` *(Beginner, Intermediate, Advanced)*
  4. `Subcategory` *(Interactive `<select>` Dropdown + `+ Enter Custom Subcategory`)*
  5. `Question Title`
  6. `Short Answer (Public Teaser)`
  7. `Detailed Interview Answer`
- **File Upload & Parsing Formats**:
  - **Excel Spreadsheets (`.xlsx`, `.xls`)** parsed via SheetJS `readAsArrayBuffer`.
  - **CSV (`.csv`)**, **JSON (`.json`)**, and **Plain Text (`.txt`)**.
- **One-Click Sample Templates**: Downloadable sample `.xlsx`, `.csv`, and `.json` template files.

#### 4.2.3 Candidate User Directory & Profile Manager (`UserManager.tsx`)
- Displays registered candidate accounts (e.g., `alex.mercer@clouddevops.com`, `admin@cloudinterviewlab.com`).
- Live synchronization: automatically registers newly signed-up/logged-in candidates into Admin directory storage.
- Individual candidate inspection drawer, Pro account tier upgrades, and Candidate CSV export (`cloud_interview_lab_candidates.csv`).

#### 4.2.4 Analytics & Platform Settings
- **Executive KPI Dashboard**: Visitor trends, conversion funnels, top performing cloud topics.
- **Social & Search Analytics**: Top search query logs, missing topic alerts, social share tracking.
- **Admin Settings & RBAC**: Feature flag toggles (*AI Mock Interviewer*, *JD Analyzer*, *Auto Content Lock*).

---

## 5. Data Schemas & Types

### 5.1 Question Interface
```typescript
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
  publishedAt: string;
}
```

### 5.2 UserProfile Interface
```typescript
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
  targetSalary?: string;
  targetCompanies?: string[];
  accountType?: 'Free Candidate' | 'Pro Member' | 'Enterprise';
  readinessPercentage: number;
  completedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  completedScenarioIds: string[];
  streakDays: number;
  xpPoints: number;
  badges: UserBadge[];
  certifications?: UserCertification[];
}
```

---

## 6. Non-Functional Requirements

- **Performance**: Initial bundle loads in <2s with fast DOM rendering.
- **Build Quality**: Zero TypeScript compilation errors (`tsc -b && vite build`).
- **Responsive Layout**: Full layout responsiveness across Mobile (375px+), Tablet (768px+), Desktop (1024px+), and Ultrawide (1440px+).

---

## 7. Verification & Acceptance Criteria

1. **Question Import**: Admin can upload `.xlsx`, `.csv`, `.json`, or `.txt` files containing 7 fields and instantly see imported questions in Candidate view.
2. **Category Question Count**: Cloud tabs, category cards, and subcategories display accurate, real-time question counts.
3. **Candidate Directory Sync**: Any user who signs up or logs in automatically appears in the Admin Candidate Directory.
4. **Navigation Integrity**: "Practice Similar Questions" and "Back to Questions" buttons navigate smoothly without blank screens.
