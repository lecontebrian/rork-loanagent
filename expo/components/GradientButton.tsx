import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Radii } from '@/constants/theme';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  disabled = false,
}: GradientButtonProps) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => scale.stopAnimation();
  }, [scale]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 400,
      friction: 22,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 22,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeConfig = {
    sm: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 14 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 },
  }[size];

  if (variant === 'ghost') {
    return (
      <Animated.View
        style={[
          { transform: [{ scale }] },
          { opacity: disabled ? 0.4 : 1 },
          fullWidth && { width: '100%' },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.ghostContainer,
            {
              paddingVertical: sizeConfig.paddingVertical,
              paddingHorizontal: sizeConfig.paddingHorizontal,
              backgroundColor: pressed ? theme.surfaceSecondary : 'transparent',
              borderColor: theme.border,
            },
            fullWidth && { width: '100%' },
          ]}
        >
          {icon}
          <Text
            style={[
              { color: theme.text, fontSize: sizeConfig.fontSize },
              styles.label,
            ]}
          >
            {label}
          </Text>
          {icon && <View style={{ width: 20 }} />}
        </Pressable>
      </Animated.View>
    );
  }

  const colors =
    variant === 'primary'
      ? [theme.primary, theme.primaryDark]
      : [theme.surfaceSecondary, theme.surfaceTertiary];

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        fullWidth && { width: '100%' },
        { opacity: disabled ? 0.4 : 1 },
        variant === 'primary' && theme.glowShadow,
        style,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
      >
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientContainer,
            {
              paddingVertical: sizeConfig.paddingVertical,
              paddingHorizontal: sizeConfig.paddingHorizontal,
              borderWidth: variant === 'secondary' ? 1 : 0,
              borderColor: theme.border,
            },
            fullWidth && { width: '100%' },
          ]}
        >
          {icon}
          <Text
            style={[
              {
                color: variant === 'primary' ? theme.textInverse : theme.text,
                fontSize: sizeConfig.fontSize,
                fontWeight: '700',
              },
              styles.label,
            ]}
          >
            {label}
          </Text>
          {icon && <View style={{ width: 20 }} />}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ghostContainer: {
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },
  label: {
    letterSpacing: -0.2,
  },
});
