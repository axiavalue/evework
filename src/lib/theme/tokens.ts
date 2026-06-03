// ============================================
// CodeQuest — Theme Tokens
// Complete design token system
// ============================================

import type {
  ColorMode,
  AccentColor,
  FontFamily,
  BorderRadiusPreset,
  AnimationLevel,
  ColorTokens,
  TypographyTokens,
  ShapeTokens,
  MotionTokens,
  SpacingTokens,
  ShadowTokens,
  ThemeConfig,
  ThemePreferences,
} from '@/types/theme';
import { adjustColor, generatePalette } from './utils';

// ── Default Accent Colors ───────────────────
export const ACCENT_PRESETS: Record<string, { name: string; hex: string }> = {
  purple: { name: 'Purple', hex: '#6C63FF' },
  blue: { name: 'Blue', hex: '#3B82F6' },
  cyan: { name: 'Cyan', hex: '#06B6D4' },
  teal: { name: 'Teal', hex: '#14B8A6' },
  emerald: { name: 'Emerald', hex: '#22C55E' },
  lime: { name: 'Lime', hex: '#84CC16' },
  amber: { name: 'Amber', hex: '#F59E0B' },
  orange: { name: 'Orange', hex: '#F97316' },
  rose: { name: 'Rose', hex: '#F43F5E' },
  pink: { name: 'Pink', hex: '#EC4899' },
  fuchsia: { name: 'Fuchsia', hex: '#D946EF' },
  indigo: { name: 'Indigo', hex: '#6366F1' },
};

// ── Color Palettes by Mode ──────────────────
function getColorTokens(mode: ColorMode, accent: AccentColor, template?: 'default' | 'boyish' | 'girly'): ColorTokens {
  const palette = generatePalette(accent);

  const bases: Record<ColorMode, Omit<ColorTokens, 'primary' | 'primaryLight' | 'primaryDark' | 'secondary'>> = {
    dark: {
      background: template === 'boyish' ? '#0B0B1E' : '#0F0F14',
      surface: template === 'boyish' ? '#13132B' : '#1A1A24',
      surfaceElevated: template === 'boyish' ? '#1D1D3D' : '#242435',
      border: template === 'boyish' ? '#2B2B54' : '#2A2A3C',
      borderLight: template === 'boyish' ? '#3B3B6E' : '#353548',
      text: {
        primary: '#F5F5F7',
        secondary: '#A1A1B5',
        muted: '#6B6B80',
        inverse: template === 'boyish' ? '#0B0B1E' : '#0F0F14',
      },
      semantic: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      overlay: 'rgba(0, 0, 0, 0.6)',
      shimmer: 'rgba(255, 255, 255, 0.05)',
    },
    amoled: {
      background: '#000000',
      surface: '#0A0A0F',
      surfaceElevated: '#151520',
      border: '#1F1F2E',
      borderLight: '#2A2A3C',
      text: {
        primary: '#F5F5F7',
        secondary: '#A1A1B5',
        muted: '#6B6B80',
        inverse: '#000000',
      },
      semantic: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      overlay: 'rgba(0, 0, 0, 0.8)',
      shimmer: 'rgba(255, 255, 255, 0.03)',
    },
    light: {
      background: template === 'girly' ? '#FFF5F7' : '#F8F9FC',
      surface: template === 'girly' ? '#FFFFFF' : '#FFFFFF',
      surfaceElevated: template === 'girly' ? '#FFFDFE' : '#FFFFFF',
      border: template === 'girly' ? '#FFD6E0' : '#E2E4EA',
      borderLight: template === 'girly' ? '#FFEAF0' : '#F0F1F5',
      text: {
        primary: template === 'girly' ? '#4A1525' : '#1A1A2E',
        secondary: template === 'girly' ? '#9A5A6C' : '#5A5A72',
        muted: template === 'girly' ? '#CFA0AC' : '#9CA3AF',
        inverse: '#FFFFFF',
      },
      semantic: {
        success: template === 'girly' ? '#FF6B8B' : '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        info: '#2563EB',
      },
      overlay: template === 'girly' ? 'rgba(74, 21, 37, 0.2)' : 'rgba(0, 0, 0, 0.4)',
      shimmer: 'rgba(0, 0, 0, 0.04)',
    },
  };

  return {
    primary: accent,
    primaryLight: palette.light,
    primaryDark: palette.dark,
    secondary: adjustColor(accent, 30),
    ...bases[mode],
  };
}

// ── Typography ──────────────────────────────
const FONT_MAP: Record<FontFamily, string> = {
  Inter: 'Inter',
  FiraCode: 'Fira Code',
  Nunito: 'Nunito',
  JetBrainsMono: 'JetBrains Mono',
  Poppins: 'Poppins',
};

function getTypographyTokens(
  fontFamily: FontFamily,
  density: 'compact' | 'comfortable',
): TypographyTokens {
  const scaleMultiplier = density === 'compact' ? 0.9 : 1;

  return {
    fontFamily,
    scale: density,
    sizes: {
      xs: Math.round(10 * scaleMultiplier),
      sm: Math.round(12 * scaleMultiplier),
      base: Math.round(14 * scaleMultiplier),
      md: Math.round(16 * scaleMultiplier),
      lg: Math.round(18 * scaleMultiplier),
      xl: Math.round(20 * scaleMultiplier),
      '2xl': Math.round(24 * scaleMultiplier),
      '3xl': Math.round(30 * scaleMultiplier),
      '4xl': Math.round(36 * scaleMultiplier),
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  };
}

// ── Shape ───────────────────────────────────
const RADIUS_MAP: Record<BorderRadiusPreset, ShapeTokens['radii']> = {
  sharp: { none: 0, xs: 2, sm: 4, md: 6, lg: 8, xl: 10, full: 999 },
  rounded: { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, full: 999 },
  pill: { none: 0, xs: 8, sm: 16, md: 20, lg: 24, xl: 32, full: 999 },
};

function getShapeTokens(preset: BorderRadiusPreset): ShapeTokens {
  return {
    borderRadius: preset,
    radii: RADIUS_MAP[preset],
  };
}

// ── Motion ──────────────────────────────────
function getMotionTokens(level: AnimationLevel): MotionTokens {
  const configs: Record<AnimationLevel, MotionTokens> = {
    reduced: {
      speed: 'reduced',
      duration: { instant: 0, fast: 0, normal: 0, slow: 0 },
      spring: { damping: 30, stiffness: 300, mass: 1 },
      springBouncy: { damping: 30, stiffness: 300, mass: 1 },
    },
    normal: {
      speed: 'normal',
      duration: { instant: 50, fast: 150, normal: 300, slow: 500 },
      spring: { damping: 15, stiffness: 150, mass: 1 },
      springBouncy: { damping: 10, stiffness: 200, mass: 0.8 },
    },
    expressive: {
      speed: 'expressive',
      duration: { instant: 80, fast: 200, normal: 400, slow: 700 },
      spring: { damping: 12, stiffness: 120, mass: 1 },
      springBouncy: { damping: 8, stiffness: 180, mass: 0.6 },
    },
  };

  return configs[level];
}

// ── Spacing ─────────────────────────────────
const SPACING: SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// ── Shadows ─────────────────────────────────
function getShadowTokens(mode: ColorMode, accent: AccentColor): ShadowTokens {
  const isLight = mode === 'light';
  const shadowColor = isLight ? '#000' : '#000';

  return {
    sm: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isLight ? 0.08 : 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isLight ? 0.12 : 0.4,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isLight ? 0.16 : 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    glow: {
      shadowColor: accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
  };
}

// ── Build Full Theme Config ─────────────────
export function buildThemeConfig(preferences: ThemePreferences): ThemeConfig {
  const { colorMode, accentColor, fontFamily, borderRadius, animationLevel, density, template = 'default' } = preferences;

  // Resolve template overrides
  let resolvedColorMode = colorMode;
  let resolvedAccentColor = accentColor;
  let resolvedFontFamily = fontFamily;
  let resolvedBorderRadius = borderRadius;

  if (template === 'girly') {
    resolvedColorMode = 'light';
    resolvedAccentColor = '#FF6B8B'; // Sweet Cherry Blossom Pink
    resolvedFontFamily = 'Poppins';
    resolvedBorderRadius = 'pill';
  } else if (template === 'boyish') {
    resolvedColorMode = 'dark';
    resolvedAccentColor = '#8A3FFC'; // Cyberpunk Purple
    resolvedFontFamily = 'Inter';
    resolvedBorderRadius = 'rounded';
  }

  return {
    id: `${resolvedColorMode}-${resolvedAccentColor.replace('#', '')}`,
    name: `Custom Theme`,
    colorMode: resolvedColorMode,
    accentColor: resolvedAccentColor,
    colors: getColorTokens(resolvedColorMode, resolvedAccentColor, template),
    typography: getTypographyTokens(resolvedFontFamily, density),
    shape: getShapeTokens(resolvedBorderRadius),
    motion: getMotionTokens(animationLevel),
    spacing: SPACING,
    shadows: getShadowTokens(resolvedColorMode, resolvedAccentColor),
    template,
  };
}

// ── Default Preferences ─────────────────────
export const DEFAULT_PREFERENCES: ThemePreferences = {
  colorMode: 'dark',
  accentColor: '#6C63FF',
  fontFamily: 'Inter',
  borderRadius: 'rounded',
  animationLevel: 'normal',
  density: 'comfortable',
  template: 'default',
};
