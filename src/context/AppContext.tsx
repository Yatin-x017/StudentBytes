import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

const initialState: AppState = {
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  notes: [],
  sessions: [],
  settings: { defaultLanguage: 'Python', provider: 'anthropic', geminiApiKey: '' },
  user: { name: 'Student', xp: 0, level: 1 },
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'UPSERT_SESSION': {
      const exists = state.sessions.some(s => s.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          sessions: state.sessions.map(s =>
            s.id === action.payload.id ? action.payload : s
          )
        };
      }
      return { ...state, sessions: [action.payload, ...state.sessions] };
    }
    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_DATA':
      return {
        apiKey: '',
        notes: [],
        sessions: [],
        settings: { defaultLanguage: 'Python', provider: 'anthropic', geminiApiKey: '' },
        user: { name: 'Student', xp: 0, level: 1 },
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, state.apiKey);
  }, [state.apiKey]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
