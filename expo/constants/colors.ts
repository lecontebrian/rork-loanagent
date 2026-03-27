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
  backgroundElevated: '#16181C',
  surface: '#16181C',
  surfaceLight: '#1C1F26',
  surfaceSecondary: '#202327',
  surfaceTertiary: '#2F3336',
  
  text: '#E7E9EA',
  textSecondary: '#71767B',
  textTertiary: '#545A60',
  textQuaternary: '#3E4347',
  
  border: '#2F3336',
  borderLight: '#202327',
  borderSecondary: '#3E4347',
  
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
  
  gradients: {
    primary: ['#19c534', '#15a82b'],
    secondary: ['#1D9BF0', '#1A8CD8'],
    accent: ['#FFD400', '#E6BE00'],
    dark: ['#000000', '#16181C'],
    premium: ['#19c534', '#1D9BF0'],
    ocean: ['#1D9BF0', '#4DB8FF'],
    sunset: ['#FFD400', '#F4212E'],
    hero: ['#000000', '#16181C'],
    modern: ['#19c534', '#1D9BF0', '#FFD400'],
    apple: ['#19c534', '#3dd657'] as const,
  },
  
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  
  glassBackground: 'rgba(22, 24, 28, 0.72)',
  glassBorder: 'rgba(47, 51, 54, 0.5)',
};
