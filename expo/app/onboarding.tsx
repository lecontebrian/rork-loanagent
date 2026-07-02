import { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  type ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, BarChart3, PiggyBank } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AIOrb } from '@/components/AIOrb';
import { GradientButton } from '@/components/GradientButton';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { onboardingSlides } from '@/mocks/loanData';
import type { OnboardingSlide } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@loanagent_onboarded';

export default function OnboardingScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (index !== currentIndex) {
        setCurrentIndex(index);
        Haptics.selectionAsync();
      }
    },
    [currentIndex]
  );

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // ignore
    }
    router.replace('/(tabs)/home');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      {/* Illustration area */}
      <View style={styles.illustrationArea}>
        {item.illustration === 'orb' && (
          <AIOrb size={140} pulsing active />
        )}
        {item.illustration === 'chart' && (
          <ChartIllustration />
        )}
        {item.illustration === 'savings' && (
          <SavingsIllustration />
        )}
      </View>

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={[Typography.title1, { color: theme.text, textAlign: 'center' }]}>
          {item.title}
        </Text>
        <Text
          style={[
            Typography.body,
            {
              color: theme.textMuted,
              textAlign: 'center',
              marginTop: Spacing.md,
              paddingHorizontal: Spacing.xl,
              lineHeight: 24,
            },
          ]}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        <Text style={[Typography.caption1, { color: theme.primary, fontWeight: '700' }]}>
          Step {index + 1} of {onboardingSlides.length}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Background gradient overlay */}
      <LinearGradient
        colors={[`${theme.primary}08`, 'transparent', `${theme.primaryDeep}06`]}
        style={styles.bgGradient}
      />

      {/* Skip button */}
      <Pressable
        style={[styles.skipButton, { top: insets.top + Spacing.md }]}
        onPress={handleFinish}
      >
        <Text style={[Typography.subheadline, { color: theme.textMuted, fontWeight: '600' }]}>
          Skip
        </Text>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        bounces={false}
        contentContainerStyle={{ paddingTop: insets.top + Spacing.xxxl }}
      />

      {/* Bottom controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {/* Pagination dots */}
        <View style={styles.dotsContainer}>
          {onboardingSlides.map((slide, index) => (
            <Pressable
              key={slide.id}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? theme.primary : theme.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <View style={{ width: '100%', marginTop: Spacing.xl }}>
          <GradientButton
            label={currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}
            onPress={handleNext}
            fullWidth
            size="lg"
            icon={
              currentIndex < onboardingSlides.length - 1 ? (
                <ArrowRight size={20} color={theme.textInverse} />
              ) : undefined
            }
          />
        </View>
      </View>
    </View>
  );
}

// ===== Illustration Components =====

function ChartIllustration() {
  const { theme } = useAppTheme();
  const barHeights = [40, 65, 50, 85, 70, 95, 60];

  return (
    <View style={styles.illustrationBox}>
      {/* Glow background */}
      <View style={[styles.illustGlow, { backgroundColor: theme.primary, opacity: 0.1 }]} />
      <View style={styles.chartBars}>
        {barHeights.map((h, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: h * 1.8,
                backgroundColor: i === 5 ? theme.primary : `${theme.primary}40`,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.chartIconBox}>
        <BarChart3 size={28} color={theme.primary} />
      </View>
    </View>
  );
}

function SavingsIllustration() {
  const { theme } = useAppTheme();

  return (
    <View style={styles.illustrationBox}>
      <View style={[styles.illustGlow, { backgroundColor: theme.primaryMint, opacity: 0.15 }]} />
      <LinearGradient
        colors={[theme.primaryLight, theme.primary, theme.primaryDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.savingsOrb, theme.glowShadow]}
      >
        <PiggyBank size={52} color="#FFFFFF" />
      </LinearGradient>
      {/* Floating coins */}
      <View style={[styles.floatCoin, { top: 20, right: 30 }]}>
        <LinearGradient
          colors={[theme.primaryLight, theme.primary]}
          style={styles.coin}
        />
      </View>
      <View style={[styles.floatCoin, { bottom: 30, left: 25 }]}>
        <LinearGradient
          colors={[theme.primaryLight, theme.primary]}
          style={[styles.coin, { width: 28, height: 28, borderRadius: 14 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  skipButton: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationArea: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  illustrationBox: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  bar: {
    width: 18,
    borderRadius: 6,
  },
  chartIconBox: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatCoin: {
    position: 'absolute',
  },
  coin: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textContent: {
    alignItems: 'center',
  },
  stepIndicator: {
    marginTop: Spacing.xl,
  },
  bottomControls: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
