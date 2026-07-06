import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { preloadSounds, useSound } from '@/hooks/useSound';

export default function IndexScreen() {
  const router = useRouter();
  const { isOnboarded, isLoading } = useApp();
  
  const { play } = useSound();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    preloadSounds();
    play('splashSound');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (isOnboarded) {
          router.replace('/dashboard' as any);
        } else {
          router.replace('/onboarding/welcome' as any);
        }
      }, 1500);
    }
  }, [isOnboarded, isLoading, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#16181C', '#000000']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <Animated.View 
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: 'https://r2-pub.rork.com/generated-images/4a376767-2249-4ad3-b355-e8b852b56f24.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.appName}>Loan Agent</Text>
        <Text style={styles.tagline}>Your Intelligent Guide</Text>
      </Animated.View>

      <Animated.View style={[styles.dotsContainer, { opacity: fadeAnim }]}>
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </Animated.View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scaleAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  iconContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  appName: {
    fontSize: 42,
    fontWeight: Platform.select({ ios: '800', default: '800' }) as any,
    color: colors.white,
    letterSpacing: -1.5,
    marginBottom: 8,
    ...(Platform.OS === 'ios' && { fontFamily: 'System' }),
  },
  tagline: {
    fontSize: 17,
    fontWeight: Platform.select({ ios: '500', default: '500' }) as any,
    color: colors.textSecondary,
    letterSpacing: -0.4,
    ...(Platform.OS === 'ios' && { fontFamily: 'System' }),
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
