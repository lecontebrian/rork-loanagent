import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { glass, radius as themeRadius, elevation } from '@/constants/theme';

type GlassWeight = 'chrome' | 'card' | 'soft';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  radius?: number;
  weight?: GlassWeight;
  /** Adds a soft top-edge highlight that mimics light refraction. */
  highlight?: boolean;
  /** Soft floating shadow under the card. */
  shadow?: keyof typeof elevation | 'none';
  onPress?: () => void;
  haptic?: boolean;
  testID?: string;
}

const fillForWeight: Record<GlassWeight, string> = {
  chrome: glass.fillStrong,
  card: glass.fill,
  soft: glass.fillSoft,
};

/**
 * Liquid Glass surface: blurred backdrop + translucent fill + hairline border
 * + a refraction highlight. The optional press state adds a subtle spring +
 * haptic, matching iOS 26 interaction feel.
 */
export default function GlassCard({
  children,
  style,
  contentStyle,
  radius = themeRadius.xl,
  weight = 'card',
  highlight = true,
  shadow = 'low',
  onPress,
  haptic = true,
  testID,
}: GlassCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  const handlePress = () => {
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.();
  };

  const shadowStyle = shadow === 'none' ? undefined : elevation[shadow];

  const inner = (
    <View style={[styles.wrapper, { borderRadius: radius }, shadowStyle]} testID={testID}>
      <BlurView
        intensity={glass.intensity[weight]}
        tint={glass.tint}
        experimentalBlurMethod="dimezisBlurView"
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, backgroundColor: fillForWeight[weight] }]} />
      {highlight ? (
        <View style={[styles.highlight, { borderRadius: radius }]} pointerEvents="none" />
      ) : null}
      <View style={[styles.border, { borderRadius: radius }]} pointerEvents="none" />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (!onPress) {
    return <View style={style}>{inner}</View>;
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={handlePress} onPressIn={pressIn} onPressOut={pressOut}>
        {inner}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  content: {
    padding: 18,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.border,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: glass.highlight,
    opacity: 0.5,
  },
});
