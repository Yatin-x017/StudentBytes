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
  defaultLanguage: 'Python' | 'JavaScript' | 'Java' | 'C++';
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
