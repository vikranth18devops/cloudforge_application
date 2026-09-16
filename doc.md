# ☁️ CloudForge — Platform Documentation

Welcome to **CloudForge** — an interactive cloud & DevOps interview preparation web application designed for cloud engineers, DevOps practitioners, SREs, and solutions architects.

---

## 🌐 Application URLs & Dynamic Routing

- **Live Application URL**: **[http://localhost:5173/](http://localhost:5173/)**
- **Public Explorer View**: **`http://localhost:5173/#/explore`**
- **Candidate User Profile URL**: **`http://localhost:5173/#/@alex-mercer/dashboard`** (Reflects candidate handle `@alex-mercer`)
- **Admin Portal Access**: Scroll to site footer and click **`[ 🛡️ Admin Portal ]`** (`http://localhost:5173/#/admin-portal/dashboard`)

---

## 👤 Student / Candidate Account Details

### Candidate Login & State Persistence
- **Demo Candidate Account Credentials**:
  - **Email**: `alex.mercer@clouddevops.com`
  - **Password**: *(Any password, e.g. `password123`)*
  - **Name**: `Alex Mercer` (Cloud / DevOps Engineer)
- **⚡ One-Click SSO Logins**:
  - Click **`[ Continue with Google ]`**
  - Click **`[ Continue with GitHub ]`**
  - Or enter any custom Name & Email in the Sign In modal to create a new profile.
- **LocalStorage State Persistence**: All candidate user profiles, logged-in session, completed practice questions, completed outage scenarios, bookmarked items, target cloud selections, and question edits are automatically saved to `localStorage` across page reloads.
- **Dynamic Readiness Gauge**: Candidate readiness percentage calculates dynamically from completed practice questions (+10% per question) and incident scenarios (+15% per scenario). Includes a **Reset Progress** option in User Profile.

### Student Platform Modules
1. **Readiness Dashboard**: Dynamic readiness gauge, study streak, XP points, and daily interview challenge cards.
2. **Interactive Question Directory**: Categorized AWS, Azure, GCP, Kubernetes, Docker, Helm, ArgoCD, Jenkins, SRE, Observability, Terraform, DevSecOps, and FinOps interview questions with "Think & Answer" mode, production hints, common candidate mistakes, and follow-up interviewer questions.
3. **Interactive Production Scenarios**: Troubleshooting engine for real-world outage logs (e.g. *EKS Pod CrashLoopBackOff OOMKilled*, *Terraform State Locking Lock ID Failure*).
4. **Interactive Architecture Simulator**: Topology explorer for multi-tier AWS/EKS production architectures with component security and FinOps inspection.
5. **AI Mock Interview Engine**: Voice and text AI interviewer simulation generating 6-axis radar feedback charts.
6. **Job Description (JD) Skill Matcher**: Paste job descriptions to parse required skills, detect missing knowledge gaps, and generate tailored study plans.
7. **Candidate User Profile (`My Profile`)**: Personalized career roadmap, target salary range ($145k - $170k/yr), target companies (AWS, Datadog, Stripe), verified industry certifications (AWS Solutions Architect, CKA, Terraform Associate), and profile edit settings.

---

## 🛡️ Admin Portal Account Details

### Admin Credentials & Access
- **Portal Access**: Scroll to footer and click **`[ 🛡️ Admin Portal ]`** or visit `http://localhost:5173/#/admin-portal/dashboard`
- **Admin Email**: `admin@cloudinterviewlab.com`
- **Admin Password**: `admin123`
- **Quick Access**: Click **`⚡ One-Click Demo Admin Login`** button on admin authentication screen.

### Admin Portal Modules & Data Ingestion
1. **Executive KPI Dashboard**: Total visitors (100k+), conversion funnel, monthly recurring signups, top performing cloud topics.
2. **Category-Wise Question Manager**: View, edit, create, and manage questions categorized by cloud provider and category tabs (`[ Category Wise ]` vs `[ All Questions ]`). Features **Single Question Delete** and **Multi-Select Bulk Delete** with confirmation modal.
3. **Hierarchical Category Manager & Ingestion Engine**:
   - **Real-Time User UI Synchronization & Category-Wise Question Counts**: Whenever an admin uploads, imports, edits, or deletes questions in the Admin portal, the exact question counts for each Cloud Provider (`AWS (7)`), Category (`Networking (2)`, `Storage (2)`, `Compute (1)`, `Security (1)`, `Containers (1)`), and Subcategory (`VPC (2)`, `S3 (2)`, `EC2 (1)`, `IAM (1)`, `EKS (1)`) immediately update in real-time in the frontend User UI (`http://localhost:5173/#/@alex-mercer/learn`), with interactive category and subcategory pill badges.
   - **Import Options**: Click **`[ 📥 Import Questions ]`** on top category bar or inside selected Category inspector drawer.
   - **7 Required Ingestion Fields**:
     1. `Cloud Provider` (AWS, Kubernetes, Azure, GCP, Docker, Helm, ArgoCD, Jenkins, SRE, Observability, Terraform, DevSecOps, FinOps)
     2. `Category` *(Interactive Dropdown + Custom Category option)*
     3. `Difficulty` *(Beginner, Intermediate, Advanced)*
     4. `Subcategory` *(Interactive Dropdown dynamically populated with category subcategories + Custom Subcategory option)*
     5. `Question Title`
     6. `Short Answer (Public Teaser)`
     7. `Detailed Interview Answer`
   - **File Upload & Parsing Options**:
     - Drag-and-Drop file picker supporting **Excel Spreadsheets (`.xlsx`, `.xls`)**, **CSV (`.csv`)**, **JSON Arrays (`.json`)**, and **Plain Text (`.txt`)**.
     - Raw text preview & editing before processing bulk imports.
   - **One-Click Template Generators**:
     - **`[ 📊 Excel (.xlsx) Template ]`**
     - **`[ 📥 CSV Template ]`**
     - **`[ ⚙️ JSON Template ]`**
4. **Candidate Profiles Manager**: User directory showing registered candidate profiles, interview readiness scores, Pro tier status, and CSV export.
5. **Funnel & Conversion Analytics**: Visual funnel tracking visitor conversion rates through preview unlocks and mock interview sessions.
6. **Search & Content Analytics**: Real-time log of top student search queries and missing search topic alerts.
7. **Social Analytics Dashboard**: Track candidate referrals and signups from LinkedIn, X (Twitter), and WhatsApp.
8. **Admin Settings & RBAC Control**: Team admin roles (*Super Admin, Content Admin, Analyst*) and live feature flag toggles (*AI Mock Interviewer, JD Analyzer, Auto Content Lock*).

---

## 🛠️ Technical Stack & Architecture

- **Frontend**: React 18, TypeScript 5, Vite
- **Excel Spreadsheet Parser**: SheetJS (`xlsx`)
- **Styling**: Tailwind CSS v4, Vanilla CSS Design Tokens, Glassmorphism (`.glass-panel`, `.glass-card`)
- **Icons**: Lucide React
- **Animations**: Flowing brand color gradient (`colorFlowLeftRight`), CSS Keyframe Orbs (`animate-orb-1`), Cyber Horizon Scanbeam (`animate-scanbeam`), Radial Cursor Follower Spotlight
