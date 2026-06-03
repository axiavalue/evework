// ============================================
// CodeQuest — App Constants
// ============================================

export const APP_NAME = 'CodeQuest';
export const APP_VERSION = '1.0.0';

// ── Gamification Constants ──────────────────
export const MAX_HEARTS = 5;
export const HEART_REFILL_HOURS = 4;
export const STREAK_XP_BONUS = 5;
export const DAILY_BONUS_XP = 10;

export const XP_MULTIPLIERS = {
  mcq: 1,
  fill_blank: 1.5,
  code_trace: 2,
  debug: 2.5,
  write_code: 3,
} as const;

export const STAR_THRESHOLDS = {
  one: 0,     // Any completion
  two: 80,    // 80%+ accuracy
  three: 100, // 100% + no hints
} as const;

export const LEAGUES = {
  bronze: { name: 'Bronze', color: '#CD7F32', minXP: 0, icon: '🥉' },
  silver: { name: 'Silver', color: '#C0C0C0', minXP: 500, icon: '🥈' },
  gold: { name: 'Gold', color: '#FFD700', minXP: 1500, icon: '🥇' },
  platinum: { name: 'Platinum', color: '#E5E4E2', minXP: 3500, icon: '💎' },
  diamond: { name: 'Diamond', color: '#B9F2FF', minXP: 7500, icon: '👑' },
} as const;

// ── Daily Goals ─────────────────────────────
export const DAILY_GOALS = [
  { minutes: 5, label: 'Casual', description: '5 min/day', emoji: '🌱' },
  { minutes: 10, label: 'Regular', description: '10 min/day', emoji: '📚' },
  { minutes: 15, label: 'Serious', description: '15 min/day', emoji: '🔥' },
  { minutes: 20, label: 'Intense', description: '20 min/day', emoji: '⚡' },
  { minutes: 30, label: 'Hardcore', description: '30 min/day', emoji: '🏆' },
] as const;

// ── Supported Languages ─────────────────────
export const CODING_LANGUAGES = [
  {
    slug: 'python',
    name: 'Python',
    icon: '🐍',
    color: '#3776AB',
    description: 'Perfect for beginners. Used in AI, data science, and web development.',
    judge0Id: 71,
  },
  {
    slug: 'cpp',
    name: 'C++',
    icon: '⚙️',
    color: '#00599C',
    description: 'Powerful systems language. Master algorithms and competitive programming.',
    judge0Id: 54,
  },
  {
    slug: 'java',
    name: 'Java',
    icon: '☕',
    color: '#ED8B00',
    description: 'Enterprise powerhouse. Build Android apps and enterprise systems.',
    judge0Id: 62,
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    icon: '🌐',
    color: '#F7DF1E',
    description: 'The language of the web. Build interactive websites and apps.',
    judge0Id: 63,
  },
] as const;

// ── Compiler Limits ─────────────────────────
export const COMPILER_LIMITS = {
  FREE_EXECUTIONS_PER_DAY: 20,
  PRO_EXECUTIONS_PER_DAY: -1, // Unlimited
  MAX_CODE_LENGTH: 50000,
  EXECUTION_TIMEOUT_SEC: 10,
  MAX_OUTPUT_LENGTH: 10000,
  MAX_SNIPPETS_FREE: 50,
} as const;

// ── Interview Limits ────────────────────────
export const INTERVIEW_LIMITS = {
  FREE_SESSIONS_PER_DAY: 1,
  PRO_SESSIONS_PER_DAY: 10,
  MAX_SESSION_DURATION_MIN: 30,
  MAX_CONVERSATION_TURNS: 50,
} as const;

// ── Animation Durations ─────────────────────
export const ANIMATION = {
  PRESS_SCALE: 0.96,
  TAB_TRANSITION_MS: 200,
  CARD_SPRING: { damping: 15, stiffness: 150, mass: 1 },
  BOUNCY_SPRING: { damping: 10, stiffness: 200, mass: 0.8 },
} as const;
