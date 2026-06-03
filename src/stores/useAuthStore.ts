// ============================================
// CodeQuest — Auth Store (Zustand)
// Manages authentication state
// ============================================

import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  setSession: (session: Session | null) => void;
}

const isPlaceholder =
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL.includes('placeholder');

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    if (isPlaceholder) {
      // Immediately initialize in local/mock testing mode
      set({ user: null, session: null, profile: null, isLoading: false, isInitialized: true });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, session, isLoading: false, isInitialized: true });
        // Fetch profile in background
        get().fetchProfile(session.user.id);
      } else {
        set({ user: null, session: null, isLoading: false, isInitialized: true });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, session });
        if (session?.user) {
          get().fetchProfile(session.user.id);
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true });
    if (isPlaceholder) {
      // Simulate network response
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser = {
        id: 'mock-user-123',
        email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;
      const mockSession = {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      } as Session;
      const mockProfile = {
        id: 'mock-user-123',
        username: email.split('@')[0],
        display_name: email.split('@')[0].toUpperCase(),
        total_xp: 120,
        hearts: 5,
        current_streak: 3,
        avatar_url: null,
      } as any;
      set({ user: mockUser, session: mockSession, profile: mockProfile, isLoading: false });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    return { error: error?.message ?? null };
  },

  signUpWithEmail: async (email, password, username) => {
    set({ isLoading: true });
    if (isPlaceholder) {
      // Simulate network response
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser = {
        id: 'mock-user-123',
        email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;
      const mockSession = {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      } as Session;
      const mockProfile = {
        id: 'mock-user-123',
        username,
        display_name: username,
        total_xp: 0,
        hearts: 5,
        current_streak: 1,
        avatar_url: null,
      } as any;
      set({ user: mockUser, session: mockSession, profile: mockProfile, isLoading: false });
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
      },
    });

    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }

    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    set({ isLoading: false });
    return { error: null };
  },

  signOut: async () => {
    set({ isLoading: true });
    if (!isPlaceholder) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, profile: null, isLoading: false });
  },

  fetchProfile: async (userId) => {
    if (isPlaceholder) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      set({ profile: data as Profile });
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return { error: 'Not authenticated' };

    if (isPlaceholder) {
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      }));
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      }));
    }

    return { error: error?.message ?? null };
  },

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },
}));
