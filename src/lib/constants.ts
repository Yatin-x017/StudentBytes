export const CS_SUBJECTS = [
  'DSA',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'OOP',
  'System Design',
  'Algorithms',
  'General Programming',
];

export const SUBJECTS = [
  { id: 'dsa', name: 'DSA' },
  { id: 'os', name: 'Operating Systems' },
  { id: 'dbms', name: 'DBMS' },
  { id: 'cn', name: 'Computer Networks' },
  { id: 'oop', name: 'OOP' },
  { id: 'sd', name: 'System Design' },
  { id: 'algo', name: 'Algorithms' },
  { id: 'gen', name: 'General Programming' },
];

export const DEFAULT_LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++'] as const;

export const STORAGE_KEYS = {
  API_KEY: 'sb_api_key',
  GEMINI_KEY: 'sb_gemini_key',
  NOTES: 'sb_notes',
  SESSIONS: 'sb_sessions',
  SETTINGS: 'sb_settings',
  CANVAS_TOKEN: 'sb_canvas_token',
  CANVAS_DOMAIN: 'sb_canvas_domain',
};

export const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    model: 'claude-sonnet-4-5',
    description: 'Most capable model. $5 free credits for new users.',
    link: 'https://console.anthropic.com',
    linkLabel: 'Get Anthropic key →',
    badge: 'Paid',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-1.5-flash',
    description: 'Blazing fast and completely free with rate limits.',
    link: 'https://aistudio.google.com',
    linkLabel: 'Get Gemini key →',
    badge: 'Free',
  },
] as const;

export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  STUDY: '/study',
  QUIZ: '/quiz',
  NOTES: '/notes',
  SETTINGS: '/settings',
  ANALYTICS: '/analytics',
  COMMUNITY: '/community',
  PROFILE: '/profile',
  CANVAS: '/canvas',
  LOGIN: '/login',
  SHARED_NOTE: '/shared',
  TIMETABLE: '/timetable',
};

export const CLASS_COLORS = [
  'bg-primary/20 text-primary border-primary/30',
  'bg-success/20 text-success border-success/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
