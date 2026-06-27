import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

interface GlassScreenProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Ambient color wash behind the glass. Defaults to the brand green. */
  tint?: string;
}

/**
 * Base screen surface for the Liquid Glass system. Renders the deep background
 * plus a soft ambient color wash at the top so translucent glass surfaces have
 * something subtle to refract — the foundation of the iOS 26 look.
 */
export default function GlassScreen({ children, style, tint = colors.primary }: GlassScreenProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={[tint + '24', 'transparent']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 0.55 }}
          style={styles.wash}
        />
        <LinearGradient
          colors={['transparent', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fade}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 420,
  },
  fade: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    height: 320,
  },
});
