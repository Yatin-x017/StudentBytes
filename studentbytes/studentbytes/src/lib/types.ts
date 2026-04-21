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

export interface AppSettings {
  defaultLanguage: 'Python' | 'JavaScript' | 'Java' | 'C++';
}

export interface User {
  name: string;
  xp: number;
  level: number;
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
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_DATA' };
