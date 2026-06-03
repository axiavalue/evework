// ============================================
// CodeQuest — Theme Provider
// Wraps app with theme context + persistence
// ============================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, type ThemeContextValue } from './ThemeContext';
import { buildThemeConfig, DEFAULT_PREFERENCES } from './tokens';
import type {
  ThemePreferences,
  ColorMode,
  FontFamily,
  BorderRadiusPreset,
  AnimationLevel,
  DensityLevel,
} from '@/types/theme';

const THEME_STORAGE_KEY = '@codequest_theme_preferences';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preferences, setPreferences] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load persisted preferences ────────────
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<ThemePreferences>;
          setPreferences((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('Failed to load theme preferences:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // ── Persist on change ─────────────────────
  const persistPreferences = useCallback(async (prefs: ThemePreferences) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save theme preferences:', e);
    }
  }, []);

  const updatePreference = useCallback(
    <K extends keyof ThemePreferences>(key: K, value: ThemePreferences[K]) => {
      setPreferences((prev) => {
        const next = { ...prev, [key]: value };
        persistPreferences(next);
        return next;
      });
    },
    [persistPreferences],
  );

  // ── Setters ───────────────────────────────
  const setColorMode = useCallback(
    (mode: ColorMode) => updatePreference('colorMode', mode),
    [updatePreference],
  );

  const setAccentColor = useCallback(
    (hex: string) => updatePreference('accentColor', hex),
    [updatePreference],
  );

  const setFontFamily = useCallback(
    (font: FontFamily) => updatePreference('fontFamily', font),
    [updatePreference],
  );

  const setBorderRadius = useCallback(
    (preset: BorderRadiusPreset) => updatePreference('borderRadius', preset),
    [updatePreference],
  );

  const setAnimationLevel = useCallback(
    (level: AnimationLevel) => updatePreference('animationLevel', level),
    [updatePreference],
  );

  const setDensity = useCallback(
    (level: DensityLevel) => updatePreference('density', level),
    [updatePreference],
  );

  const setTemplate = useCallback(
    (template: 'default' | 'boyish' | 'girly') => updatePreference('template', template),
    [updatePreference],
  );

  const applyPreset = useCallback(
    (preset: ThemePreferences) => {
      setPreferences(preset);
      persistPreferences(preset);
    },
    [persistPreferences],
  );

  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    persistPreferences(DEFAULT_PREFERENCES);
  }, [persistPreferences]);

  // ── Build resolved theme ──────────────────
  const theme = useMemo(() => buildThemeConfig(preferences), [preferences]);

  const isDark = preferences.colorMode !== 'light';

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      preferences,
      setColorMode,
      setAccentColor,
      setFontFamily,
      setBorderRadius,
      setAnimationLevel,
      setDensity,
      setTemplate,
      applyPreset,
      resetToDefaults,
      isDark,
    }),
    [
      theme,
      preferences,
      setColorMode,
      setAccentColor,
      setFontFamily,
      setBorderRadius,
      setAnimationLevel,
      setDensity,
      setTemplate,
      applyPreset,
      resetToDefaults,
      isDark,
    ],
  );

  // Don't render children until theme is loaded from storage
  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
