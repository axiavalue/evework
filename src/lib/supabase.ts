// ============================================
// CodeQuest — Supabase Client
// Initialization with SSR-Safe Storage
// ============================================

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const isBrowser = typeof window !== 'undefined';

// Safe storage adapter to prevent ReferenceError: window is not defined during Node/SSR bundling
const ssrSafeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (!isBrowser) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!isBrowser) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {}
  },
  removeItem: async (key: string): Promise<void> => {
    if (!isBrowser) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isBrowser && Platform.OS === 'web',
  },
});

