// ============================================
// CodeQuest — Database Type Definitions
// Maps to Supabase PostgreSQL schema
// ============================================

export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseType = 'mcq' | 'fill_blank' | 'code_trace' | 'debug' | 'write_code';
export type InterviewType = 'behavioral' | 'technical' | 'coding' | 'system_design';
export type InterviewStatus = 'active' | 'completed' | 'abandoned';
export type ProjectStatus = 'in_progress' | 'submitted' | 'reviewed' | 'completed';
export type XPSource = 'lesson' | 'streak' | 'project' | 'interview' | 'daily_bonus';

// ============================================
// USER & AUTH
// ============================================

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  country_code: string | null;
  created_at: string;
  updated_at: string;
  // Gamification
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  league: League;
  hearts: number;
  heart_refill_at: string | null;
  // Settings
  notifications_enabled: boolean;
  daily_goal_minutes: number;
  // Setup / Onboarding
  onboarded?: boolean;
  age_category?: 'kid' | 'teen' | 'adult';
  theme_template?: 'default' | 'boyish' | 'girly';
  favorite_language?: string;
}

export interface UserPreferences {
  user_id: string;
  color_mode: 'light' | 'dark' | 'amoled';
  accent_color: string;
  font_family: string;
  border_radius: 'sharp' | 'rounded' | 'pill';
  animation_level: 'reduced' | 'normal' | 'expressive';
  density: 'compact' | 'comfortable';
  custom_theme_id: string | null;
  updated_at: string;
}

// ============================================
// COURSES & CONTENT
// ============================================

export interface Language {
  id: string;
  slug: string;
  name: string;
  icon_url: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
}

export interface Course {
  id: string;
  language_id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  total_lessons: number;
  total_xp: number;
  thumbnail_url: string | null;
  is_premium: boolean;
  sort_order: number | null;
  created_at: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  unlock_xp: number;
  icon: string | null;
}

export interface Exercise {
  type: ExerciseType;
  question?: string;
  options?: string[];
  correct?: number;
  code?: string;
  blanks?: string[];
  expected_output?: string;
  buggy_code?: string;
  fixed_code?: string;
  prompt?: string;
  test_cases?: Array<{
    input: string;
    expected_output: string;
  }>;
}

export interface LessonContent {
  theory: {
    markdown: string;
    code_example?: string;
  };
  exercises: Exercise[];
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  sort_order: number;
  xp_reward: number;
  est_minutes: number;
  is_premium: boolean;
  content: LessonContent;
}

// ============================================
// PROGRESS TRACKING
// ============================================

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_pct: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  stars: number; // 0-3
  score_pct: number | null;
  hints_used: number;
  attempts: number;
  completed_at: string | null;
  time_spent_sec: number;
}

// ============================================
// XP & GAMIFICATION
// ============================================

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: XPSource;
  reference_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url: string | null;
  xp_reward: number;
  condition: {
    type: string;
    value: number;
  };
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

// ============================================
// COMPILER & CODE
// ============================================

export interface CodeSnippet {
  id: string;
  user_id: string;
  title: string;
  language: string;
  code: string;
  stdin: string | null;
  last_output: string | null;
  is_public: boolean;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// AI INTERVIEW
// ============================================

export interface InterviewSession {
  id: string;
  user_id: string;
  language: string;
  interview_type: InterviewType;
  difficulty: string;
  status: InterviewStatus;
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
  feedback: InterviewFeedback | null;
  overall_score: number | null;
}

export interface InterviewFeedback {
  session_id: string;
  duration_minutes: number;
  overall_score: number;
  sections: {
    technical_accuracy: { score: number; feedback: string };
    communication: { score: number; feedback: string };
    problem_solving: { score: number; feedback: string };
    code_quality: { score: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  recommended_topics: string[];
}

export interface InterviewMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ============================================
// LEADERBOARD
// ============================================

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  country_code: string | null;
  league: League;
  weekly_xp: number;
  rank: number;
}

// ============================================
// PROJECTS
// ============================================

export interface Project {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  description: string | null;
  language: string;
  code: string | null;
  status: ProjectStatus;
  is_published: boolean;
  likes_count: number;
  xp_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: string | null;
  starter_code: string | null;
  test_cases: Record<string, unknown> | null;
  required_lesson: string | null;
  is_premium: boolean;
}

// ============================================
// SOCIAL
// ============================================

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}
