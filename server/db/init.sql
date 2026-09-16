-- CloudForge PostgreSQL Initial Schema Migration & Seed Script

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(100) DEFAULT 'DevOps Engineer',
  experience_level VARCHAR(100) DEFAULT '3-5 Years',
  target_cloud VARCHAR(100) DEFAULT 'AWS',
  target_interview_date VARCHAR(100),
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  target_salary VARCHAR(100),
  target_companies JSONB DEFAULT '[]'::jsonb,
  account_type VARCHAR(50) DEFAULT 'Free Candidate',
  readiness_percentage INT DEFAULT 0,
  completed_question_ids JSONB DEFAULT '[]'::jsonb,
  bookmarked_question_ids JSONB DEFAULT '[]'::jsonb,
  completed_scenario_ids JSONB DEFAULT '[]'::jsonb,
  streak_days INT DEFAULT 1,
  xp_points INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(100) PRIMARY KEY,
  cloud VARCHAR(100) NOT NULL,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  preview_answer TEXT NOT NULL,
  full_answer TEXT NOT NULL,
  real_world_example TEXT,
  architecture_diagram TEXT,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  follow_up_questions JSONB DEFAULT '[]'::jsonb,
  difficulty VARCHAR(50) NOT NULL,
  target_experience VARCHAR(100) DEFAULT '1-2 Years',
  is_locked BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  bookmarks_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  signups_converted INT DEFAULT 0,
  published_at VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  cloud VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  question_count INT DEFAULT 0,
  subcategories JSONB DEFAULT '[]'::jsonb,
  icon_name VARCHAR(100) DEFAULT 'Cloud'
);

CREATE TABLE IF NOT EXISTS scenarios (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  difficulty VARCHAR(50),
  scenario_type VARCHAR(100),
  description TEXT,
  logs TEXT,
  steps JSONB DEFAULT '[]'::jsonb,
  xp_reward INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS mock_sessions (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100),
  date VARCHAR(100),
  target_role VARCHAR(100),
  score INT,
  duration_minutes INT,
  competencies JSONB DEFAULT '{}'::jsonb,
  feedback JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'Completed'
);

-- Seed Default Candidate Profile (Alex Mercer)
INSERT INTO users (
  id, name, email, avatar_url, role, experience_level, target_cloud, target_interview_date,
  bio, github_url, linkedin_url, target_salary, target_companies, account_type, readiness_percentage,
  completed_question_ids, bookmarked_question_ids, completed_scenario_ids, streak_days, xp_points
) VALUES (
  'usr-101', 'Alex Mercer', 'alex.mercer@clouddevops.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'DevOps Engineer', '3-5 Years', 'AWS', '2026-10-15',
  'Passionate DevOps and Cloud Infrastructure Specialist focused on Kubernetes orchestration, Terraform automation, and AWS multi-account governance.',
  'https://github.com/alex-mercer-devops', 'https://linkedin.com/in/alex-mercer-cloud',
  '$145,000 - $170,000 / year', '["AWS", "Datadog", "HashiCorp", "Stripe"]'::jsonb,
  'Pro Member', 72,
  '["aws-ec2-001", "tf-state-004"]'::jsonb,
  '["aws-iam-002", "k8s-net-003"]'::jsonb,
  '["scen-001"]'::jsonb, 7, 1250
) ON CONFLICT (email) DO NOTHING;

-- Seed Default Admin User
INSERT INTO users (
  id, name, email, avatar_url, role, experience_level, target_cloud, target_interview_date,
  bio, target_salary, target_companies, account_type, readiness_percentage, streak_days, xp_points
) VALUES (
  'usr-admin', 'System Super Admin', 'admin@cloudinterviewlab.com',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'Cloud Architect', '8+ Years', 'Multi-cloud', '2026-12-31',
  'Platform Lead & Super Admin overseeing CloudForge DevOps question repository, candidate directories, and analytics.',
  '$200,000+ / year', '["AWS", "Google Cloud", "Microsoft"]'::jsonb,
  'Enterprise', 100, 30, 9999
) ON CONFLICT (email) DO NOTHING;
