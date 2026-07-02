import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, TrendingDown, DollarSign, Clock, Shield, Zap, ArrowRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RefinanceIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const benefits = [
    {
      icon: TrendingDown,
      title: 'Lower Your Rate',
      description: 'Save money with better interest rates',
      color: colors.success,
    },
    {
      icon: DollarSign,
      title: 'Reduce Payment',
      description: 'Lower your monthly obligations',
      color: colors.primary,
    },
    {
      icon: Clock,
      title: 'Change Term',
      description: 'Adjust your loan timeline',
      color: colors.warning,
    },
    {
      icon: Shield,
      title: 'Consolidate Debt',
      description: 'Combine multiple loans into one',
      color: colors.secondary,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Refinance Options</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.heroSection}>
              <LinearGradient
                colors={['#20B2AA', '#5FD4CC']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.heroBadge}>
                  <Zap color={colors.white} size={16} strokeWidth={2.5} />
                  <Text style={styles.heroBadgeText}>SMART REFINANCING</Text>
                </View>
                <Text style={styles.heroTitle}>Save Thousands</Text>
                <Text style={styles.heroSubtitle}>with Our AI-Powered Refinance Matching</Text>
                <View style={styles.heroStats}>
                  <View style={styles.heroStat}>
                    <Text style={styles.heroStatValue}>$284</Text>
                    <Text style={styles.heroStatLabel}>Avg. Monthly Savings</Text>
                  </View>
                  <View style={styles.heroStatDivider} />
                  <View style={styles.heroStat}>
                    <Text style={styles.heroStatValue}>2.3%</Text>
                    <Text style={styles.heroStatLabel}>Avg. Rate Reduction</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>Why Refinance?</Text>
            <Text style={styles.sectionDescription}>
              Refinancing can help you achieve your financial goals
            </Text>

            <View style={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitCard}>
                  <View style={[styles.benefitIcon, { backgroundColor: benefit.color + '15' }]}>
                    <benefit.icon color={benefit.color} size={24} strokeWidth={2} />
                  </View>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.processSection}>
              <Text style={styles.sectionTitle}>Simple Process</Text>
              <View style={styles.processSteps}>
                <ProcessStep
                  number={1}
                  title="Tell Us About Your Loan"
                  description="Share details about your current loan"
                />
                <ProcessStep
                  number={2}
                  title="AI Finds Best Options"
                  description="We match you with top offers instantly"
                />
                <ProcessStep
                  number={3}
                  title="Compare & Save"
                  description="Choose the best refinance option for you"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/refinance/loan-type' as any)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#20B2AA', '#1A8F8A']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <ArrowRight color={colors.white} size={20} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

function ProcessStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <View style={styles.processStep}>
      <View style={styles.processStepNumber}>
        <Text style={styles.processStepNumberText}>{number}</Text>
      </View>
      <View style={styles.processStepContent}>
        <Text style={styles.processStepTitle}>{title}</Text>
        <Text style={styles.processStepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  heroSection: {
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  heroGradient: {
    padding: 28,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 16,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    letterSpacing: -0.2,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
  },
  heroStatValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  heroStatLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 40,
  },
  benefitCard: {
    width: '47.5%',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  benefitDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  processSection: {
    marginBottom: 32,
  },
  processSteps: {
    gap: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  processStepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processStepNumberText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: colors.primary,
  },
  processStepContent: {
    flex: 1,
  },
  processStepTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  processStepDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
