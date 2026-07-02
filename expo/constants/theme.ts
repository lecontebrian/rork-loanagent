import { useColorScheme } from 'react-native';

// ===== Brand Palette =====
export const Palette = {
  primary: '#16C784',
  primaryDeep: '#003D2B',
  primaryMint: '#C8FFE1',
  primaryDark: '#0E9C68',
  primaryLight: '#3BD99A',

  // Light mode
  bgLight: '#F5F7F8',
  surfaceLight: '#FFFFFF',
  surfaceLightSecondary: '#EEF2F0',
  surfaceLightTertiary: '#E1E6E4',
  textLight: '#0B1720',
  textMutedLight: '#6B7280',
  borderLight: '#E5E9EB',

  // Dark mode
  bgDark: '#050807',
  surfaceDark: '#0D1311',
  surfaceDarkSecondary: '#131A17',
  surfaceDarkTertiary: '#1B2520',
  textDark: '#F0F5F3',
  textMutedDark: '#7A8A85',
  borderDark: '#1F2A25',

  // Status
  success: '#16C784',
  warning: '#F5A623',
  error: '#FF4D6D',
  info: '#3B9EFF',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  isDark: boolean;

  // Backgrounds
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;

  // Text
  text: string;
  textMuted: string;
  textInverse: string;

  // Borders
  border: string;

  // Glass
  glassBg: string;
  glassBorder: string;

  // Brand
  primary: string;
  primaryDeep: string;
  primaryMint: string;
  primaryDark: string;
  primaryLight: string;

  // Gradients
  heroGradient: readonly [string, string, string];
  orbGradient: readonly [string, string, string];
  cardGradient: readonly [string, string];

  // Shadows
  shadow: object;
  shadowMedium: object;
  shadowStrong: object;
  glowShadow: object;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  isDark: false,
  bg: Palette.bgLight,
  bgElevated: Palette.surfaceLight,
  surface: Palette.surfaceLight,
  surfaceSecondary: Palette.surfaceLightSecondary,
  surfaceTertiary: Palette.surfaceLightTertiary,
  text: Palette.textLight,
  textMuted: Palette.textMutedLight,
  textInverse: Palette.white,
  border: Palette.borderLight,
  glassBg: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',
  primary: Palette.primary,
  primaryDeep: Palette.primaryDeep,
  primaryMint: Palette.primaryMint,
  primaryDark: Palette.primaryDark,
  primaryLight: Palette.primaryLight,
  heroGradient: ['#003D2B', '#0E9C68', '#16C784'] as const,
  orbGradient: ['#16C784', '#0E9C68', '#003D2B'] as const,
  cardGradient: ['#16C784', '#0E9C68'] as const,
  shadow: {
    shadowColor: '#003D2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#003D2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  shadowStrong: {
    shadowColor: '#003D2B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  glowShadow: {
    shadowColor: '#16C784',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  isDark: true,
  bg: Palette.bgDark,
  bgElevated: Palette.surfaceDark,
  surface: Palette.surfaceDark,
  surfaceSecondary: Palette.surfaceDarkSecondary,
  surfaceTertiary: Palette.surfaceDarkTertiary,
  text: Palette.textDark,
  textMuted: Palette.textMutedDark,
  textInverse: Palette.textLight,
  border: Palette.borderDark,
  glassBg: 'rgba(13, 19, 17, 0.72)',
  glassBorder: 'rgba(31, 42, 37, 0.6)',
  primary: Palette.primary,
  primaryDeep: Palette.primaryDeep,
  primaryMint: Palette.primaryMint,
  primaryDark: Palette.primaryDark,
  primaryLight: Palette.primaryLight,
  heroGradient: ['#001A12', '#003D2B', '#0E9C68'] as const,
  orbGradient: ['#16C784', '#0E9C68', '#003D2B'] as const,
  cardGradient: ['#0E9C68', '#003D2B'] as const,
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  shadowStrong: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  glowShadow: {
    shadowColor: '#16C784',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
};

// ===== Spacing =====
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

// ===== Radii =====
export const Radii = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 32,
  pill: 999,
} as const;

// ===== Typography =====
export const Typography = {
  largeTitle: { fontSize: 34, fontWeight: '800' as const, lineHeight: 41 },
  title1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  title2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  title3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 25 },
  headline: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 17, fontWeight: '400' as const, lineHeight: 22 },
  callout: { fontSize: 16, fontWeight: '400' as const, lineHeight: 21 },
  subheadline: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  caption1: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption2: { fontSize: 11, fontWeight: '400' as const, lineHeight: 13 },
} as const;

// ===== Hooks =====
export function useTheme(darkMode: boolean): AppTheme {
  return darkMode ? darkTheme : lightTheme;
}
