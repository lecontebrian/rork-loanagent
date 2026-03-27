import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { CheckCircle, Clock, Sparkles } from 'lucide-react-native';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function CongratulationsScreen() {
  const router = useRouter();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: 200,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 400,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        delay: 500,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding/face-verify' as any);
    }, 4000);

    return () => clearTimeout(timer);
  }, [scaleAnim, fadeAnim, slideAnim, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#0A84FF', '#5E5CE6', '#AF52DE']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <CheckCircle color={colors.success} size={80} strokeWidth={2.5} />
          </View>
          <Animated.View
            style={[
              styles.sparkleContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Sparkles
              color={colors.white}
              size={32}
              strokeWidth={2}
              style={styles.sparkle1}
            />
            <Sparkles
              color={colors.white}
              size={24}
              strokeWidth={2}
              style={styles.sparkle2}
            />
            <Sparkles
              color={colors.white}
              size={28}
              strokeWidth={2}
              style={styles.sparkle3}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>
            Your ID has been successfully verified
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Clock color={colors.white} size={24} strokeWidth={2} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Estimated Approval Time</Text>
                <Text style={styles.infoValue}>24-48 hours</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.infoDescription}>
              Most applications are reviewed within one business day. You&apos;ll receive a notification once your application is processed.
            </Text>
          </View>

          <View style={styles.nextStepCard}>
            <Text style={styles.nextStepTitle}>Next Step</Text>
            <Text style={styles.nextStepText}>
              Face verification to complete your identity confirmation
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    position: 'relative' as const,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sparkleContainer: {
    position: 'absolute' as const,
    width: 240,
    height: 240,
  },
  sparkle1: {
    position: 'absolute' as const,
    top: 20,
    right: 20,
  },
  sparkle2: {
    position: 'absolute' as const,
    bottom: 30,
    left: 15,
  },
  sparkle3: {
    position: 'absolute' as const,
    top: 80,
    left: 10,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.95,
    letterSpacing: -0.3,
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.white,
    marginBottom: 4,
    opacity: 0.9,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.white,
    lineHeight: 21,
    opacity: 0.9,
    letterSpacing: -0.1,
  },
  nextStepCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextStepTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  nextStepText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.white,
    lineHeight: 21,
    opacity: 0.9,
    letterSpacing: -0.1,
  },
  progressContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: -0.1,
  },
});
