import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ROUTES } from '@/lib/constants';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  age: number | null;
  course: string | null;
  username: string | null;
  display_name: string | null;
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
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithDiscord: () => Promise<{ error: AuthError | null }>;
  signInWithTwitter: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, pass: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // If Supabase not configured, skip loading entirely
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      // Use abortSignal to prevent hanging queries
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .abortSignal(controller.signal);

      clearTimeout(timer);
      if (!error && data) setProfile(data);
    } catch {
      // Silently fail — profile is optional, don't block the app
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // SAFETY NET: always unblock after 3 seconds no matter what
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Get initial session with timeout race
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 2500)
    );

    Promise.race([sessionPromise, timeoutPromise])
      .then((result) => {
        if (result && 'data' in result) {
          const currentUser = (result as any).data.session?.user ?? null;
          setUser(currentUser);
          // Don't await fetchProfile — fire and forget
          if (currentUser) fetchProfile(currentUser.id);
        }
      })
      .catch(() => {
        // Supabase failed — just unblock the app
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id); // fire and forget, no await
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') as any };
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error('Supabase not configured') as any };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signInWithDiscord = async () => {
    if (!supabase) return { error: new Error('Supabase not configured') as any };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signInWithTwitter = async () => {
    if (!supabase) return { error: new Error('Supabase not configured') as any };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') as any };
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
        redirectTo: `${window.location.origin}${ROUTES.ONBOARDING}`
      }
    });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      signInWithTwitter,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
