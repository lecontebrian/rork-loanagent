import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/contexts/ThemeContext';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animated?: boolean;
}

export function AnimatedProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
}: ProgressRingProps) {
  const { theme } = useAppTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const AnimatedCircleComp = useRef<React.ComponentType<any>>(
    Animated.createAnimatedComponent(Circle)
  ).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Defs>
        <LinearGradient id={`ringGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.primaryLight} />
          <Stop offset="100%" stopColor={theme.primary} />
        </LinearGradient>
      </Defs>
      {/* Track */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={theme.isDark ? '#1F2A25' : '#E5E9EB'}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress */}
      <AnimatedCircleComp
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#ringGrad-${size})`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={
          animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [circumference, strokeDashoffset],
          }) as any
        }
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
