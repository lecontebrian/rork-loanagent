import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/contexts/ThemeContext';

interface AIOrbProps {
  size?: number;
  pulsing?: boolean;
  active?: boolean;
}

export function AIOrb({ size = 64, pulsing = true, active = false }: AIOrbProps) {
  const { theme } = useAppTheme();
  const pulse = useRef(new Animated.Value(0.85)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pulsing) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.85,
            duration: 1600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
  }, [pulsing, pulse]);

  useEffect(() => {
    if (active) {
      const rotateLoop = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );
      rotateLoop.start();
      return () => rotateLoop.stop();
    }
  }, [active, rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
            backgroundColor: theme.primary,
            opacity: pulse.interpolate({
              inputRange: [0.85, 1],
              outputRange: [0.08, 0.2],
            }),
            transform: [{ scale: pulse }],
          },
        ]}
      />
      {/* Mid glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.15,
            height: size * 1.15,
            borderRadius: size * 0.575,
            backgroundColor: theme.primaryLight,
            opacity: pulse.interpolate({
              inputRange: [0.85, 1],
              outputRange: [0.12, 0.25],
            }),
          },
        ]}
      />
      {/* Core orb */}
      <Animated.View style={[styles.core, { transform: active ? [{ rotate: spin }] : [] }]}>
        <LinearGradient
          colors={[theme.primaryLight, theme.primary, theme.primaryDeep]}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 0.7, y: 0.7 }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            ...theme.glowShadow,
          }}
        >
          {/* Inner highlight */}
          <View
            style={{
              position: 'absolute',
              top: size * 0.15,
              left: size * 0.2,
              width: size * 0.35,
              height: size * 0.25,
              borderRadius: size * 0.175,
              backgroundColor: 'rgba(255,255,255,0.35)',
            }}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  core: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
