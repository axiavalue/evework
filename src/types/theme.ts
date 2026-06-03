// ============================================
// CodeQuest — Theme Type Definitions
// Full design token type system
// ============================================

export type ColorMode = 'light' | 'dark' | 'amoled';
export type AccentColor = string; // hex color
export type FontFamily = 'Inter' | 'FiraCode' | 'Nunito' | 'JetBrainsMono' | 'Poppins';
export type BorderRadiusPreset = 'sharp' | 'rounded' | 'pill';
export type AnimationLevel = 'reduced' | 'normal' | 'expressive';
export type DensityLevel = 'compact' | 'comfortable';

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface ColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  text: TextColors;
  semantic: SemanticColors;
  overlay: string;
  shimmer: string;
}

export interface TypographyTokens {
  fontFamily: FontFamily;
  scale: DensityLevel;
  sizes: {
    xs: number;
    sm: number;
    base: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  weights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
}

export interface ShapeTokens {
  borderRadius: BorderRadiusPreset;
  radii: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export interface MotionTokens {
  speed: AnimationLevel;
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  spring: SpringConfig;
  springBouncy: SpringConfig;
}

export interface SpacingTokens {
  xs: number;   // 4
  sm: number;   // 8
  md: number;   // 12
  base: number; // 16
  lg: number;   // 20
  xl: number;   // 24
  '2xl': number; // 32
  '3xl': number; // 40
  '4xl': number; // 48
  '5xl': number; // 64
}

export interface ShadowTokens {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  glow: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

/** Complete resolved theme configuration */
export interface ThemeConfig {
  id: string;
  name: string;
  colorMode: ColorMode;
  accentColor: AccentColor;
  colors: ColorTokens;
  typography: TypographyTokens;
  shape: ShapeTokens;
  motion: MotionTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  template: 'default' | 'boyish' | 'girly';
}

/** User-persisted theme preferences (minimal) */
export interface ThemePreferences {
  colorMode: ColorMode;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  borderRadius: BorderRadiusPreset;
  animationLevel: AnimationLevel;
  density: DensityLevel;
  template?: 'default' | 'boyish' | 'girly';
}

/** Theme preset (pre-built theme configurations) */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: {
    background: string;
    accent: string;
    surface: string;
  };
  preferences: ThemePreferences;
  isPremium: boolean;
}
