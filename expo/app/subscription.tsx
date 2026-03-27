import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Zap, Shield, TrendingUp, Star, Check, Sparkles, ArrowRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, SubscriptionTier } from '@/contexts/AppContext';
import { TIER_CONFIG } from '@/constants/premium';

const TOKEN_BENEFITS = [
  {
    icon: Zap,
    title: 'Deep Loan Comparisons',
    description: 'See total cost, payoff dates, interest vs principal breakdown',
    gradient: ['#34C759', '#30D158'] as const,
  },
  {
    icon: TrendingUp,
    title: 'What-If Simulations',
    description: 'Test changes to terms, payments, or payoff strategies',
    gradient: ['#32AE63', '#43E97B'] as const,
  },
  {
    icon: Shield,
    title: 'Refinance Scans',
    description: 'Automatic scanning for better rates to save you money',
    gradient: ['#2E9D5A', '#38F9D7'] as const,
  },
  {
    icon: Star,
    title: 'Priority Support',
    description: 'Get help faster with dedicated priority support',
    gradient: ['#28A745', '#6FCF97'] as const,
  },
];

const SUBSCRIPTION_TIERS: SubscriptionTier[] = ['basic', 'plus', 'pro'];

const TIER_GRADIENTS: Record<SubscriptionTier, readonly [string, string, string]> = {
  basic: ['#0a1f0d', '#0d2912', '#0a1f0d'] as const,
  plus: ['#0a1f12', '#123524', '#1a4a2e'] as const,
  pro: ['#0d2915', '#1a4a2e', '#0d2915'] as const,
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { upgradeTier, subscriptionTier, tokens, completeOnboarding } = useApp();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('plus');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);



  const handleUpgrade = (tier: SubscriptionTier) => {
    upgradeTier(tier);
    completeOnboarding();
    router.replace('/dashboard' as any);
  };

  const currentTierConfig = TIER_CONFIG[selectedTier];
  const isCurrentTier = subscriptionTier === selectedTier;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={TIER_GRADIENTS[selectedTier]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.meshOverlay}>
          <View style={[styles.meshCircle, styles.meshCircle1]} />
          <View style={[styles.meshCircle, styles.meshCircle2]} />
        </View>

        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace('/dashboard' as any)}
            activeOpacity={0.7}
          >
            <X color="rgba(255,255,255,0.7)" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
          
          <View style={styles.tokenStatus}>
            <Zap color={tokens <= 2 ? '#FF6B6B' : '#34C759'} size={14} fill={tokens <= 2 ? '#FF6B6B' : '#34C759'} />
            <Text style={[styles.tokenCount, tokens <= 2 && styles.tokenCountLow]}>{tokens}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 70 }]}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }}>
            <View style={styles.heroSection}>
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={['rgba(52, 199, 89, 0.2)', 'rgba(67, 233, 123, 0.1)']}
                  style={styles.badge}
                >
                  <Sparkles color="#34C759" size={14} />
                  <Text style={styles.badgeText}>PREMIUM</Text>
                </LinearGradient>
              </View>

              <Text style={styles.mainTitle}>Level Up Your{"\n"}Financial Game</Text>
              <Text style={styles.subtitle}>
                Unlock powerful tools that help you save money, track loans, and make smarter decisions.
              </Text>
            </View>

            <View style={styles.tierCardsContainer}>
              {SUBSCRIPTION_TIERS.map((tier) => {
                const config = TIER_CONFIG[tier];
                const isSelected = selectedTier === tier;
                const isPopular = tier === 'plus';
                
                return (
                  <TouchableOpacity
                    key={tier}
                    style={[
                      styles.tierCard,
                      isSelected && styles.tierCardSelected,
                      isPopular && styles.tierCardPopular,
                    ]}
                    onPress={() => setSelectedTier(tier)}
                    activeOpacity={0.8}
                  >
                    {isPopular && (
                      <View style={styles.popularTag}>
                        <Text style={styles.popularTagText}>BEST VALUE</Text>
                      </View>
                    )}
                    
                    <Text style={[styles.tierName, isSelected && styles.tierNameSelected]}>
                      {config.name}
                    </Text>
                    
                    <View style={styles.tierPriceContainer}>
                      <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>
                        {config.displayPrice}
                      </Text>
                      <Text style={styles.tierPeriod}>/{config.period}</Text>
                    </View>
                    
                    <View style={[styles.tierTokens, isSelected && styles.tierTokensSelected]}>
                      <Zap color={isSelected ? '#34C759' : 'rgba(255,255,255,0.5)'} size={12} fill={isSelected ? '#34C759' : 'rgba(255,255,255,0.3)'} />
                      <Text style={[styles.tierTokensText, isSelected && styles.tierTokensTextSelected]}>
                        {config.tokensRefill > 0 ? `${config.tokensRefill}/mo` : `${config.tokens}`}
                      </Text>
                    </View>
                    
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Check color="#fff" size={14} strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.selectedPlanDetails}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planTitle}>{currentTierConfig.name} Plan</Text>
                  <Text style={styles.planDescription}>{currentTierConfig.description}</Text>
                </View>
                {selectedTier === 'basic' && (
                  <View style={styles.trialBadge}>
                    <Text style={styles.trialBadgeText}>7-DAY FREE</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.benefitsList}>
                {currentTierConfig.pros.slice(0, 4).map((pro, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <View style={styles.benefitCheck}>
                      <Check color="#43E97B" size={12} strokeWidth={3} />
                    </View>
                    <Text style={styles.benefitText}>{pro}</Text>
                  </View>
                ))}
              </View>
              
              {currentTierConfig.cons.length > 0 && (
                <View style={styles.limitationsContainer}>
                  {currentTierConfig.cons.slice(0, 2).map((con, idx) => (
                    <Text key={idx} style={styles.limitationText}>• {con}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>What tokens unlock</Text>
              <Text style={styles.featuresSubtitle}>Each premium action costs 1 token</Text>
              
              <View style={styles.featuresGrid}>
                {TOKEN_BENEFITS.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <View key={index} style={styles.featureCard}>
                      <LinearGradient
                        colors={feature.gradient}
                        style={styles.featureIconBg}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Icon color="#fff" size={18} strokeWidth={2.5} />
                      </LinearGradient>
                      <Text style={styles.featureCardTitle}>{feature.title}</Text>
                      <Text style={styles.featureCardDesc}>{feature.description}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            
            <View style={styles.trustSection}>
              <View style={styles.trustItem}>
                <Shield color="rgba(255,255,255,0.6)" size={16} />
                <Text style={styles.trustText}>Cancel anytime</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Check color="rgba(255,255,255,0.6)" size={16} />
                <Text style={styles.trustText}>7-day free trial</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)', '#000']}
          style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}
        >
          {isCurrentTier ? (
            <View style={styles.currentPlanButton}>
              <Text style={styles.currentPlanText}>Current Plan</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleUpgrade(selectedTier)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#34C759', '#30D158']}
                style={styles.subscribeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.subscribeText}>
                  {selectedTier === 'basic' ? 'Start Free Trial' : `Get ${currentTierConfig.name}`}
                </Text>
                <ArrowRight color="#fff" size={18} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <Text style={styles.footerNote}>
            {selectedTier === 'basic' 
              ? 'Try free for 7 days, then $9.99/mo'
              : `${currentTierConfig.displayPrice}/mo after 7-day trial`}
          </Text>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms. Subscriptions auto-renew.{' '}
            <Text style={styles.termsLink}>Cancel anytime.</Text>
          </Text>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  meshOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  meshCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  meshCircle1: {
    width: 400,
    height: 400,
    backgroundColor: '#34C759',
    top: -100,
    right: -150,
  },
  meshCircle2: {
    width: 300,
    height: 300,
    backgroundColor: '#30D158',
    bottom: 200,
    left: -100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tokenCount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
  tokenCountLow: {
    color: '#FF6B6B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#34C759',
    letterSpacing: 1.5,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  tierCardsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  tierCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  tierCardSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    borderColor: '#34C759',
  },
  tierCardPopular: {
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  popularTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#34C759',
    paddingVertical: 3,
  },
  popularTagText: {
    fontSize: 8,
    fontWeight: '800' as const,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  tierName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
    marginBottom: 4,
  },
  tierNameSelected: {
    color: '#fff',
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.7)',
  },
  tierPriceSelected: {
    color: '#fff',
  },
  tierPeriod: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.4)',
  },
  tierTokens: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tierTokensSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
  },
  tierTokensText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.5)',
  },
  tierTokensTextSelected: {
    color: '#34C759',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPlanDetails: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.5)',
    maxWidth: 200,
  },
  trialBadge: {
    backgroundColor: 'rgba(67, 233, 123, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  trialBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#43E97B',
    letterSpacing: 0.5,
  },
  benefitsList: {
    gap: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(67, 233, 123, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  limitationsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  limitationText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  featuresSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 4,
  },
  featureCardDesc: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 16,
  },
  trustSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.6)',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  subscribeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  currentPlanButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlanText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.5)',
  },
  footerNote: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline' as const,
  },
});
