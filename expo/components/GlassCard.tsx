import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Radii, Spacing } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  glow?: boolean;
  padding?: number;
  radius?: number;
  onPress?: () => void;
  pressable?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  glow = false,
  padding = Spacing.lg,
  radius = Radii.lg,
  onPress,
  pressable = false,
}: GlassCardProps) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      scale.stopAnimation();
    };
  }, [scale]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const cardStyle: ViewStyle = {
    borderRadius: radius,
    overflow: 'hidden',
    ...(glow ? theme.glowShadow : theme.shadowMedium),
  };

  const innerContent = (
    <BlurView
      intensity={intensity}
      tint={theme.isDark ? 'dark' : 'light'}
      style={[
        {
          borderRadius: radius,
          borderWidth: 1,
          borderColor: theme.glassBorder,
          padding,
        },
        style as ViewStyle,
      ]}
    >
      {children}
    </BlurView>
  );

  if (pressable && onPress) {
    return (
      <Animated.View style={[cardStyle, { transform: [{ scale }] }]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          style={{ borderRadius: radius }}
        >
          {innerContent}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[cardStyle]}>{innerContent}</View>;
}
