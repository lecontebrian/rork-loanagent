export default {
  primary: '#19c534',
  primaryDark: '#15a82b',
  primaryLight: '#3dd657',
  primaryTint: 'rgba(25, 197, 52, 0.1)',
  
  secondary: '#1D9BF0',
  secondaryDark: '#1A8CD8',
  secondaryLight: '#4DB8FF',
  secondaryTint: 'rgba(29, 155, 240, 0.1)',
  
  accent: '#FFD400',
  accentDark: '#E6BE00',
  accentLight: '#FFE34D',
  accentTint: 'rgba(255, 212, 0, 0.1)',
  
  success: '#19c534',
  successLight: 'rgba(25, 197, 52, 0.15)',
  warning: '#FFD400',
  warningLight: 'rgba(255, 212, 0, 0.15)',
  error: '#F4212E',
  errorLight: 'rgba(244, 33, 46, 0.15)',
  info: '#1D9BF0',
  infoLight: 'rgba(29, 155, 240, 0.12)',
  
  background: '#000000',
  backgroundElevated: '#17191F',
  surface: '#191C23',
  surfaceLight: '#1F232B',
  surfaceSecondary: '#23272F',
  surfaceTertiary: '#2F3336',
  
  text: '#E7E9EA',
  textSecondary: '#8B9097',
  textTertiary: '#5C636B',
  textQuaternary: '#3E4347',
  
  // White hairline borders are the signature edge of modern iOS surfaces.
  border: 'rgba(255, 255, 255, 0.10)',
  borderLight: 'rgba(255, 255, 255, 0.06)',
  borderSecondary: 'rgba(255, 255, 255, 0.16)',
  
  white: '#FFFFFF',
  black: '#000000',
  
  overlay: 'rgba(91, 112, 131, 0.4)',
  overlayLight: 'rgba(91, 112, 131, 0.2)',
  overlayHeavy: 'rgba(0, 0, 0, 0.8)',
  
  appleGreen: '#19c534',
  appleGreenDark: '#15a82b',
  appleGreenLight: '#E7F9F0',
  
  creditExcellent: '#19c534',
  creditGood: '#3dd657',
  creditFair: '#FFD400',
  creditPoor: '#F4212E',
  
  // Calmer, single-hue analogous gradients for a restrained, content-first
  // iOS 26 aesthetic (no opposing-temperature multi-stop blends).
  gradients: {
    primary: ['#19c534', '#15a82b'],
    secondary: ['#1D9BF0', '#1A8CD8'],
    accent: ['#FFD400', '#E6BE00'],
    dark: ['#000000', '#16181C'],
    premium: ['#19c534', '#3dd657'],
    ocean: ['#1D9BF0', '#4DB8FF'],
    sunset: ['#FFB800', '#FF8A00'],
    hero: ['#000000', '#16181C'],
    modern: ['#19c534', '#15a82b'],
    apple: ['#19c534', '#3dd657'] as const,
  },
  
  // Softer, more diffuse shadows for a floating "Liquid Glass" feel.
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 8,
  },
  
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.4,
    shadowRadius: 34,
    elevation: 16,
  },
  
  glassBackground: 'rgba(28, 31, 38, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
};
