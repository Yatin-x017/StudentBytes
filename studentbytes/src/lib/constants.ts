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
  NOTES: 'sb_notes',
  SESSIONS: 'sb_sessions',
  SETTINGS: 'sb_settings',
};

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
};
