// iOS 26 "Liquid Glass" design tokens.
// Centralized spacing, radius, typography, and glass material values so every
// screen shares one cohesive, modern Apple-style system.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
  pill: 999,
} as const;

// SF Pro-inspired type scale. Sizes pair with tight tracking on large text.
export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 41 },
  title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.6, lineHeight: 34 },
  title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.4, lineHeight: 28 },
  title3: { fontSize: 19, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 24 },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '500' as const, letterSpacing: -0.2, lineHeight: 22 },
  callout: { fontSize: 15, fontWeight: '500' as const, letterSpacing: -0.1, lineHeight: 20 },
  subhead: { fontSize: 14, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 19 },
  footnote: { fontSize: 13, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.2, lineHeight: 16 },
} as const;

// Liquid Glass material recipes. Each surface = blurred backdrop + translucent
// fill + a hairline light border + a soft top highlight that mimics refraction.
export const glass = {
  // Layered, translucent fills that sit on top of the BlurView.
  fillStrong: 'rgba(28, 31, 38, 0.62)',
  fill: 'rgba(28, 31, 38, 0.48)',
  fillSoft: 'rgba(40, 44, 52, 0.34)',
  fillFaint: 'rgba(255, 255, 255, 0.04)',

  // Hairline borders + the refraction highlight along the top edge.
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  highlight: 'rgba(255, 255, 255, 0.22)',

  // Default blur intensities for each material weight.
  intensity: {
    chrome: 40,
    card: 26,
    soft: 18,
  },

  tint: 'dark' as const,
} as const;

// Softer, more diffuse shadows than the originals for a floating-glass feel.
export const elevation = {
  low: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 8,
  },
  high: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.4,
    shadowRadius: 34,
    elevation: 16,
  },
} as const;

export default { spacing, radius, typography, glass, elevation };
