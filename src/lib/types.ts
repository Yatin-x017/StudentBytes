export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
  retryContent?: string;
}

export interface Session {
  id: string;
  topic: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  subjectId?: string;
  attachedFile?: {
    name: string;
    text: string;
    pageCount: number;
    sizeKb: number;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  createdAt: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  code?: string | null;
  difficulty?: string;
  concept?: string;
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: string;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  due_at: string | null;
  points_possible: number;
  course_id: number;
  html_url: string;
  submission_types: string[];
  description: string | null;
}

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  course_id: number;
}

export interface AppSettings {
  defaultLanguage: 'Python' | 'JavaScript' | 'Java' | 'C++' | 'TypeScript' | 'Go';
  provider: 'anthropic' | 'gemini';
  geminiApiKey: string;
}

export interface User {
  name: string;
  xp: number;
  level: number;
}

export interface DbSession {
  id: string;
  user_id: string;
  topic: string;
  subject_id?: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface DbNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  topic: string;
  created_at: string;
}

export interface DbQuizHistory {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  total: number;
  xp_earned: number;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  default_language: string;
  provider: 'anthropic' | 'gemini';
  xp: number;
  level: number;
  updated_at: string;
}

export interface ClassSlot {
  id: string;
  subject: string;
  instructor?: string;
  room?: string;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 1=Mon...
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  color: string;     // tailwind color class e.g. "bg-primary/20 text-primary"
}

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  college: string | null;
  year: number | null;
  branch: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  preferred_language: string;
  is_public: boolean;
  custom_theme: string;
  age: number | null;
  course: string | null;
  created_at: string;
  updated_at: string;
}

export interface PerformanceScore {
  id: string;
  user_id: string;
  subject: string;
  score: number;
  max_score: number;
  type: 'quiz' | 'assignment' | 'test' | 'exam';
  title: string | null;
  recorded_at: string;
}

export interface AppState {
  apiKey: string;
  notes: Note[];
  sessions: Session[];
  settings: AppSettings;
  user: User;
}

export type AppAction =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'UPSERT_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_DATA' };
