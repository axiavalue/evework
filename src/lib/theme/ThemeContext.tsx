// ============================================
// CodeQuest — Theme Context
// React Context providing theme configuration
// ============================================

import React, { createContext, useContext } from 'react';
import type { ThemeConfig, ThemePreferences, ColorMode, FontFamily, BorderRadiusPreset, AnimationLevel, DensityLevel } from '@/types/theme';
import { buildThemeConfig, DEFAULT_PREFERENCES } from './tokens';

// ── Context Value Type ──────────────────────
export interface ThemeContextValue {
  theme: ThemeConfig;
  preferences: ThemePreferences;
  // Setters
  setColorMode: (mode: ColorMode) => void;
  setAccentColor: (hex: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setBorderRadius: (preset: BorderRadiusPreset) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  setDensity: (level: DensityLevel) => void;
  setTemplate: (template: 'default' | 'boyish' | 'girly') => void;
  applyPreset: (preferences: ThemePreferences) => void;
  resetToDefaults: () => void;
  // Utilities
  isDark: boolean;
}

// ── Create Context ──────────────────────────
const defaultTheme = buildThemeConfig(DEFAULT_PREFERENCES);

export const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  preferences: DEFAULT_PREFERENCES,
  setColorMode: () => {},
  setAccentColor: () => {},
  setFontFamily: () => {},
  setBorderRadius: () => {},
  setAnimationLevel: () => {},
  setDensity: () => {},
  setTemplate: () => {},
  applyPreset: () => {},
  resetToDefaults: () => {},
  isDark: true,
});

// ── Hook ────────────────────────────────────
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
