const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB schema automatically if tables do not exist
const initDbSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'db', 'init.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ PostgreSQL Schema initialized successfully');
    }
  } catch (err) {
    console.error('⚠️ DB schema initialization error (non-fatal):', err.message);
  }
};

initDbSchema();

// 1. Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', database: 'connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Questions API Endpoints
app.get('/api/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
    const questions = result.rows.map(row => ({
      id: row.id,
      cloud: row.cloud,
      category: row.category,
      subcategory: row.subcategory,
      title: row.title,
      previewAnswer: row.preview_answer,
      fullAnswer: row.full_answer,
      realWorldExample: row.real_world_example || '',
      architectureDiagram: row.architecture_diagram || '',
      commonMistakes: row.common_mistakes || [],
      followUpQuestions: row.follow_up_questions || [],
      difficulty: row.difficulty,
      targetExperience: row.target_experience || '1-2 Years',
      isLocked: row.is_locked,
      viewsCount: row.views_count || 0,
      bookmarksCount: row.bookmarks_count || 0,
      sharesCount: row.shares_count || 0,
      signupsConverted: row.signups_converted || 0,
      publishedAt: row.published_at || new Date().toISOString().split('T')[0]
    }));
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const inserted = [];

    for (const item of items) {
      const query = `
        INSERT INTO questions (
          id, cloud, category, subcategory, title, preview_answer, full_answer,
          real_world_example, architecture_diagram, common_mistakes, follow_up_questions,
          difficulty, target_experience, is_locked, views_count, bookmarks_count,
          shares_count, signups_converted, published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) ON CONFLICT (id) DO UPDATE SET
          cloud = EXCLUDED.cloud,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          title = EXCLUDED.title,
          preview_answer = EXCLUDED.preview_answer,
          full_answer = EXCLUDED.full_answer,
          real_world_example = EXCLUDED.real_world_example,
          architecture_diagram = EXCLUDED.architecture_diagram,
          common_mistakes = EXCLUDED.common_mistakes,
          follow_up_questions = EXCLUDED.follow_up_questions,
          difficulty = EXCLUDED.difficulty
        RETURNING *;
      `;

      const values = [
        item.id || `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        item.cloud || 'AWS',
        item.category || 'General',
        item.subcategory || 'General',
        item.title,
        item.previewAnswer || '',
        item.fullAnswer || '',
        item.realWorldExample || '',
        item.architectureDiagram || '',
        JSON.stringify(item.commonMistakes || []),
        JSON.stringify(item.followUpQuestions || []),
        item.difficulty || 'Intermediate',
        item.targetExperience || '1-2 Years',
        item.isLocked || false,
        item.viewsCount || 0,
        item.bookmarksCount || 0,
        item.sharesCount || 0,
        item.signupsConverted || 0,
        item.publishedAt || new Date().toISOString().split('T')[0]
      ];

      const result = await pool.query(query, values);
      inserted.push(result.rows[0]);
    }

    res.status(201).json({ count: inserted.length, inserted });
  } catch (err) {
    console.error('Error inserting question:', err);
    res.status(500).json({ error: 'Failed to insert questions into PostgreSQL' });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
    res.json({ message: 'Question deleted successfully', id });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// 3. Candidate Users API Endpoints
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    const users = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url,
      role: row.role,
      experienceLevel: row.experience_level,
      targetCloud: row.target_cloud,
      targetInterviewDate: row.target_interview_date,
      bio: row.bio,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      targetSalary: row.target_salary,
      targetCompanies: row.target_companies || [],
      accountType: row.account_type,
      readinessPercentage: row.readiness_percentage,
      completedQuestionIds: row.completed_question_ids || [],
      bookmarkedQuestionIds: row.bookmarked_question_ids || [],
      completedScenarioIds: row.completed_scenario_ids || [],
      streakDays: row.streak_days,
      xpPoints: row.xp_points,
      badges: row.badges || [],
      certifications: row.certifications || []
    }));
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ error: 'User profile email is required' });
    }

    const query = `
      INSERT INTO users (
        id, name, email, avatar_url, role, experience_level, target_cloud,
        target_interview_date, bio, github_url, linkedin_url, target_salary,
        target_companies, account_type, readiness_percentage, completed_question_ids,
        bookmarked_question_ids, completed_scenario_ids, streak_days, xp_points,
        badges, certifications
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        role = EXCLUDED.role,
        experience_level = EXCLUDED.experience_level,
        target_cloud = EXCLUDED.target_cloud,
        readiness_percentage = EXCLUDED.readiness_percentage,
        completed_question_ids = EXCLUDED.completed_question_ids,
        bookmarked_question_ids = EXCLUDED.bookmarked_question_ids,
        completed_scenario_ids = EXCLUDED.completed_scenario_ids,
        streak_days = EXCLUDED.streak_days,
        xp_points = EXCLUDED.xp_points
      RETURNING *;
    `;

    const values = [
      user.id || `usr-${Date.now()}`,
      user.name || 'Candidate',
      user.email,
      user.avatarUrl || '',
      user.role || 'DevOps Engineer',
      user.experienceLevel || '3-5 Years',
      user.targetCloud || 'AWS',
      user.targetInterviewDate || '',
      user.bio || '',
      user.githubUrl || '',
      user.linkedinUrl || '',
      user.targetSalary || '',
      JSON.stringify(user.targetCompanies || []),
      user.accountType || 'Free Candidate',
      user.readinessPercentage || 0,
      JSON.stringify(user.completedQuestionIds || []),
      JSON.stringify(user.bookmarkedQuestionIds || []),
      JSON.stringify(user.completedScenarioIds || []),
      user.streakDays || 1,
      user.xpPoints || 0,
      JSON.stringify(user.badges || []),
      JSON.stringify(user.certifications || [])
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error syncing user:', err);
    res.status(500).json({ error: 'Failed to sync candidate profile to PostgreSQL' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CloudForge Express Backend Server running on port ${PORT}`);
});
