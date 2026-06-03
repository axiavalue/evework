// ============================================
// CodeQuest — useTheme Hook
// Convenience hook for accessing theme
// ============================================

import { useThemeContext } from '@/lib/theme/ThemeContext';

/**
 * Convenience hook for accessing the full theme context.
 * 
 * Usage:
 * ```tsx
 * const { theme, setAccentColor, isDark } = useTheme();
 * ```
 */
export function useTheme() {
  return useThemeContext();
}
