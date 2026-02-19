import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Shield, CheckCircle, Star, Zap, TrendingUp, Award, Lock, ChevronRight, Users, FileText, Clock } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const MONTHLY_PRICE = 295.99;

const BENEFITS = [
  {
    icon: FileText,
    title: 'Full Credit Report Analysis',
    description: 'Expert review of all 3 bureau reports to identify disputable items',
  },
  {
    icon: Shield,
    title: 'Professional Dispute Filing',
    description: 'Nationwide Credit files disputes directly with bureaus on your behalf',
  },
  {
    icon: TrendingUp,
    title: 'Score Improvement Tracking',
    description: 'Monthly progress reports showing your credit score improvements',
  },
  {
    icon: Clock,
    title: 'Ongoing Monitoring',
    description: '24/7 credit monitoring with real-time alerts for changes',
  },
  {
    icon: Users,
    title: 'Dedicated Credit Specialist',
    description: 'Personal advisor assigned to manage your case from start to finish',
  },
  {
    icon: Award,
    title: 'Results Guarantee',
    description: 'Nationwide Credit guarantees measurable improvement or your money back',
  },
];

const RESULTS = [
  { label: 'Avg. Items Removed', value: '7.2', suffix: 'items' },
  { label: 'Avg. Score Increase', value: '85', suffix: 'pts' },
  { label: 'Client Satisfaction', value: '97', suffix: '%' },
];

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    score: '+112 pts',
    text: 'Nationwide Credit removed 9 negative items from my report in just 3 months. My score went from 520 to 632!',
  },
  {
    name: 'Keisha R.',
    score: '+94 pts',
    text: 'I was denied a mortgage twice. After working with Nationwide Credit, I qualified and closed on my first home.',
  },
  {
    name: 'David L.',
    score: '+78 pts',
    text: 'Professional, responsive, and they actually deliver results. Best investment I\'ve made in my financial future.',
  },
];

export default function CreditDisputesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnims = useRef(BENEFITS.map(() => new Animated.Value(30))).current;
  const slideOpacities = useRef(BENEFITS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        delay: 200 + index * 80,
        useNativeDriver: true,
      }).start();
    });
    slideOpacities.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 80,
        useNativeDriver: true,
      }).start();
    });

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleSubscribe = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    Alert.alert(
      'Subscribe to Nationwide Credit',
      `You will be charged $${MONTHLY_PRICE}/month for professional credit repair services. Nationwide Credit specialists will begin working on your disputes within 24 hours.\n\nCancel anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe Now',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            setIsSubscribed(true);
            Alert.alert(
              'Welcome to Nationwide Credit!',
              'A credit specialist will contact you within 24 hours to begin your credit repair journey. Check your email for next steps.',
              [{ text: 'Got It' }]
            );
          },
        },
      ]
    );
  }, []);

  const handleLearnMore = useCallback(() => {
    Linking.openURL('https://www.nationwidecredit.com').catch(() => {
      console.log('Could not open Nationwide Credit website');
    });
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            testID="back-button"
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Credit Repair</Text>
            <Text style={styles.headerSubtitle}>Powered by Nationwide Credit</Text>
          </View>
          <View style={styles.backButton}>
            <Shield color="#00C853" size={22} strokeWidth={2.5} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={['#00C853', '#009624']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.partnerBadge}>
                <Text style={styles.partnerBadgeText}>OFFICIAL PARTNER</Text>
              </View>

              <View style={styles.heroLogoContainer}>
                <View style={styles.heroLogo}>
                  <Shield color="#FFFFFF" size={36} strokeWidth={2} />
                </View>
              </View>

              <Text style={styles.heroTitle}>Nationwide Credit</Text>
              <Text style={styles.heroTagline}>Professional Credit Repair Services</Text>

              <View style={styles.heroDivider} />

              <Text style={styles.heroDescription}>
                Let certified credit specialists dispute inaccurate, unfair, and unverifiable items on your credit report. Average clients see 85+ point improvements.
              </Text>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Monthly Service Fee</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceCurrency}>$</Text>
                  <Text style={styles.priceAmount}>295</Text>
                  <Text style={styles.priceCents}>.99</Text>
                  <Text style={styles.pricePeriod}>/mo</Text>
                </View>
                <Text style={styles.priceNote}>Cancel anytime - No long-term contracts</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.resultsSection}>
            <Text style={styles.resultsLabel}>PROVEN RESULTS</Text>
            <View style={styles.resultsRow}>
              {RESULTS.map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultValueRow}>
                    <Text style={styles.resultValue}>{result.value}</Text>
                    <Text style={styles.resultSuffix}>{result.suffix}</Text>
                  </View>
                  <Text style={styles.resultLabel}>{result.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>What You Get</Text>
            {BENEFITS.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.benefitCard,
                    {
                      opacity: slideOpacities[index],
                      transform: [{ translateY: slideAnims[index] }],
                    },
                  ]}
                >
                  <View style={styles.benefitIconContainer}>
                    <IconComp color="#00C853" size={22} strokeWidth={2} />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </View>
                  <CheckCircle color="#00C853" size={18} strokeWidth={2.5} />
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.testimonialSection}>
            <Text style={styles.sectionTitle}>Client Success Stories</Text>
            {TESTIMONIALS.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.testimonialAvatar}>
                    <Text style={styles.testimonialAvatarText}>
                      {testimonial.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.testimonialMeta}>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} color="#FFD400" size={14} fill="#FFD400" strokeWidth={0} />
                      ))}
                    </View>
                  </View>
                  <View style={styles.scoreBadge}>
                    <TrendingUp color="#00C853" size={14} strokeWidth={2.5} />
                    <Text style={styles.scoreBadgeText}>{testimonial.score}</Text>
                  </View>
                </View>
                <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              </View>
            ))}
          </View>

          <View style={styles.processSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            {[
              { step: '1', title: 'Subscribe & Connect', desc: 'Sign up and a specialist contacts you within 24 hours' },
              { step: '2', title: 'Credit Analysis', desc: 'We pull and analyze all 3 bureau reports for errors' },
              { step: '3', title: 'Dispute Filing', desc: 'Professional disputes filed with bureaus and creditors' },
              { step: '4', title: 'Track Progress', desc: 'Monthly updates on removed items and score changes' },
            ].map((item, index) => (
              <View key={index} style={styles.processItem}>
                <View style={styles.processStepContainer}>
                  <LinearGradient
                    colors={['#00C853', '#009624']}
                    style={styles.processStep}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.processStepText}>{item.step}</Text>
                  </LinearGradient>
                  {index < 3 && <View style={styles.processLine} />}
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>{item.title}</Text>
                  <Text style={styles.processDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.subscribeButton}
              activeOpacity={0.85}
              onPress={handleSubscribe}
              testID="subscribe-button"
            >
              <LinearGradient
                colors={isSubscribed ? ['#2F3336', '#2F3336'] : ['#00C853', '#009624']}
                style={styles.subscribeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle color="#00C853" size={24} strokeWidth={2.5} />
                    <Text style={[styles.subscribeButtonText, { color: '#00C853' }]}>Subscribed - Active</Text>
                  </>
                ) : (
                  <>
                    <Zap color={colors.white} size={24} strokeWidth={2.5} />
                    <Text style={styles.subscribeButtonText}>Start Credit Repair - ${MONTHLY_PRICE}/mo</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.learnMoreButton}
            activeOpacity={0.7}
            onPress={handleLearnMore}
            testID="learn-more-button"
          >
            <Text style={styles.learnMoreText}>Learn More About Nationwide Credit</Text>
            <ChevronRight color={colors.textSecondary} size={18} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.disclaimerContainer}>
            <Lock color={colors.textTertiary} size={14} strokeWidth={2} />
            <Text style={styles.disclaimerText}>
              Secure payment processed by Nationwide Credit. By subscribing, you agree to Nationwide Credit's Terms of Service and authorize a recurring charge of ${MONTHLY_PRICE}/month. Results may vary. Nationwide Credit is a registered credit repair organization.
            </Text>
          </View>

          <View style={{ height: insets.bottom + 40 }} />
        </ScrollView>
      </View>
    </>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#00C853',
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  heroGradient: {
    padding: 28,
    alignItems: 'center',
  },
  partnerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: 1.5,
  },
  heroLogoContainer: {
    marginBottom: 16,
  },
  heroLogo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  heroDivider: {
    width: 50,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
    letterSpacing: -0.1,
  },
  priceContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceCurrency: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.white,
    marginTop: 6,
  },
  priceAmount: {
    fontSize: 52,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -2,
    lineHeight: 56,
  },
  priceCents: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.white,
    marginTop: 6,
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 6,
    marginLeft: 4,
  },
  priceNote: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: -0.1,
  },
  resultsSection: {
    marginBottom: 28,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 14,
    textAlign: 'center',
  },
  resultsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resultCard: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...colors.shadow,
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#00C853',
    letterSpacing: -1,
  },
  resultSuffix: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#00C853',
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  benefitsSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    ...colors.shadow,
  },
  benefitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  benefitContent: {
    flex: 1,
    marginRight: 10,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  benefitDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  testimonialSection: {
    marginBottom: 28,
  },
  testimonialCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...colors.shadow,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testimonialAvatarText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#00C853',
  },
  testimonialMeta: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#00C853',
    letterSpacing: -0.3,
  },
  testimonialText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 21,
    fontStyle: 'italic',
    letterSpacing: -0.1,
  },
  processSection: {
    marginBottom: 32,
  },
  processItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  processStepContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  processStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processStepText: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: colors.white,
  },
  processLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(0, 200, 83, 0.25)',
    marginVertical: 4,
  },
  processContent: {
    flex: 1,
    paddingBottom: 20,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  processDesc: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  subscribeButton: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  subscribeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    marginBottom: 20,
  },
  learnMoreText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400' as const,
    color: colors.textTertiary,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
});
