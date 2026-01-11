import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BANKS } from "@/constants/banks";
import colors from '@/constants/colors';

const { width } = Dimensions.get("window");

const ONBOARDING_SCREENS = [
  {
    id: "welcome",
    title: "Welcome to Loan Agent",
    subtitle: "Your all-in-one AI-powered loan platform",
    description: "Access loans, refinancing, and credit management—all in one secure place.",
    icon: "✨",
    gradient: ["#000000", "#16181C"],
  },
  {
    id: "unified",
    title: "One Profile, Every Loan",
    subtitle: "Apply everywhere with a single verified profile",
    description: "Auto, home, business, personal, education, or debt consolidation—all from one profile.",
    icon: "🎯",
    gradient: ["#16181C", "#000000"],
  },
  {
    id: "ai-matching",
    title: "AI-Powered Matching",
    subtitle: "Smart recommendations tailored to you",
    description: "Our AI compares 30+ lenders to deliver the best available offers, rates, and approval odds.",
    icon: "🤖",
    gradient: ["#000000", "#16181C"],
  },
  {
    id: "secure",
    title: "Bank-Level Security",
    subtitle: "Advanced facial ID and encryption",
    description: "Face verification, license scanning, and encryption protect your identity every step.",
    icon: "🔒",
    gradient: ["#16181C", "#000000"],
  },
  {
    id: "dashboard",
    title: "All-in-One Dashboard",
    subtitle: "Track everything that matters",
    description: "Credit score, borrowing power, active accounts, refinance opportunities—all updated in real-time.",
    icon: "📊",
    gradient: ["#000000", "#16181C"],
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.push("/onboarding/signup");
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({ x: width * prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, ONBOARDING_SCREENS.length - 1],
    outputRange: ["20%", "100%"],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={ONBOARDING_SCREENS[currentIndex].gradient as [string, string]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={goToPrevious} activeOpacity={0.7}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {ONBOARDING_SCREENS.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/onboarding/signup")}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {ONBOARDING_SCREENS.map((screen, index) => (
          <Animated.View
            key={screen.id}
            style={[
              styles.slide,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.slideContent}>
              {index === 0 ? (
                <View style={styles.welcomeLogoContainer}>
                  <Image
                    source={{ uri: 'https://r2-pub.rork.com/generated-images/4a376767-2249-4ad3-b355-e8b852b56f24.png' }}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <Text style={styles.iconEmoji}>{screen.icon}</Text>
                </View>
              )}

              <Text style={styles.slideTitle}>{screen.title}</Text>
              <Text style={styles.slideSubtitle}>{screen.subtitle}</Text>
              <Text style={styles.slideDescription}>{screen.description}</Text>

              {index === 0 && (
                <View style={styles.bankLogosSection}>
                  <Text style={styles.bankLogosTitle}>30+ Trusted Partners</Text>
                  <View style={styles.bankLogosGrid}>
                    {BANKS.slice(0, 6).map((bank) => (
                      <View key={bank.name} style={styles.bankLogoCard}>
                        <Image
                          source={{ uri: bank.logo }}
                          style={styles.bankLogoImage}
                          resizeMode="contain"
                        />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.bankLogosSubtext}>+ many more banks and lenders</Text>
                </View>
              )}

              {index === 2 && (
                <View style={styles.aiFeatures}>
                  <AIFeatureItem
                    icon="⚡"
                    title="Instant Matching"
                    description="Get offers in seconds"
                  />
                  <AIFeatureItem
                    icon="📈"
                    title="Credit Insights"
                    description="Personalized improvement tips"
                  />
                  <AIFeatureItem
                    icon="💰"
                    title="Smart Savings"
                    description="Find refinance opportunities"
                  />
                </View>
              )}
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dotsContainer}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={goToNext} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_SCREENS.length - 1 ? "Get Started" : "Next"}
          </Text>
          <ArrowRight size={20} color={colors.black} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AIFeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.aiFeatureItem}>
      <Text style={styles.aiFeatureIcon}>{icon}</Text>
      <View style={styles.aiFeatureText}>
        <Text style={styles.aiFeatureTitle}>{title}</Text>
        <Text style={styles.aiFeatureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flex: 1,
    gap: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  slide: {
    width: width,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: "center",
  },
  welcomeLogoContainer: {
    marginBottom: 32,
    width: 130,
    height: 130,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.8,
    shadowRadius: 28,
    elevation: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  iconEmoji: {
    fontSize: 48,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  slideSubtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  slideDescription: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  bankLogosSection: {
    marginTop: 40,
    alignItems: "center",
  },
  bankLogosTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 20,
  },
  bankLogosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  bankLogoCard: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bankLogoImage: {
    width: "100%",
    height: "100%",
  },
  bankLogosSubtext: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: "rgba(255, 255, 255, 0.8)",
  },
  aiFeatures: {
    marginTop: 40,
    gap: 20,
    width: "100%",
  },
  aiFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
  },
  aiFeatureIcon: {
    fontSize: 32,
  },
  aiFeatureText: {
    flex: 1,
  },
  aiFeatureTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  aiFeatureDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "rgba(255, 255, 255, 0.85)",
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.surfaceTertiary,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: colors.black,
    letterSpacing: -0.3,
  },
});
