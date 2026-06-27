import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { glass, radius as themeRadius, typography, elevation } from '@/constants/theme';
import { PremiumIcon } from '@/components/PremiumIcon';

type Variant = 'primary' | 'glass' | 'tinted';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  /** Solid color used for primary / tint used for tinted. */
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

/**
 * Primary action button. `primary` is a solid brand pill, `glass` is a
 * translucent Liquid Glass pill, and `tinted` is a soft color-washed pill.
 */
export default function GlassButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  color = colors.primary,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  testID,
}: GlassButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onPress();
  };

  const isPrimary = variant === 'primary';
  const isTinted = variant === 'tinted';
  const textColor = isPrimary ? colors.white : isTinted ? color : colors.text;

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        testID={testID}
        style={[styles.base, isPrimary && { backgroundColor: color }, isPrimary && elevation.low]}
      >
        {!isPrimary ? (
          <>
            <BlurView
              intensity={glass.intensity.chrome}
              tint={glass.tint}
              experimentalBlurMethod="dimezisBlurView"
              style={[StyleSheet.absoluteFill, styles.rounded]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.rounded,
                { backgroundColor: isTinted ? color + '22' : glass.fill },
              ]}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.rounded,
                styles.border,
                isTinted && { borderColor: color + '44' },
              ]}
            />
          </>
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.rounded, styles.topHighlight]} pointerEvents="none" />
        )}

        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon ? <PremiumIcon icon={icon} color={textColor} size={20} strokeWidth={2.2} /> : null}
            <Text style={[styles.label, { color: textColor }, textStyle]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  base: {
    height: 56,
    borderRadius: themeRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  rounded: {
    borderRadius: themeRadius.lg,
  },
  border: {
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.borderStrong,
  },
  topHighlight: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.headline,
    fontWeight: '700',
  },
});
