import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Zap, Crown, Shield, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { images } from '@/constants/mediaAssets';
import React, { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, SubscriptionTier } from '@/contexts/AppContext';
import { TIER_CONFIG } from '@/constants/premium';



export default function PremiumScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { upgradeTier, subscriptionTier, tokens } = useApp();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleUpgrade = (tier: SubscriptionTier) => {
    upgradeTier(tier);
    router.replace('/dashboard' as any);
  };

  const renderTierCard = (tier: SubscriptionTier) => {
    const config = TIER_CONFIG[tier];
    const isCurrentTier = subscriptionTier === tier;
    const isPopular = tier === 'plus';

    return (
      <View key={tier} style={[styles.tierCard, isPopular && styles.popularCard]}>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{config.tagline}</Text>
          </View>
        )}
        
        <View style={styles.tierHeader}>
          <Text style={styles.tierName}>{config.name}</Text>
          {tier !== 'basic' && (
            <Text style={styles.tierTagline}>{tier === 'plus' ? 'Everyday plan' : 'Power user / Business'}</Text>
          )}
        </View>

        <View style={styles.pricingSection}>
          {tier === 'basic' ? (
            <View style={styles.trialBadgeSmall}>
              <Text style={styles.trialTextSmall}>7-Day Free Trial</Text>
              <Text style={styles.trialSubtextSmall}>Then free forever</Text>
            </View>
          ) : (
            <>
              <Text style={styles.tierPrice}>{config.displayPrice}</Text>
              <Text style={styles.tierPeriod}>/{config.period}</Text>
            </>
          )}
        </View>

        <View style={styles.tokenInfo}>
          <Zap color={colors.primary} size={16} fill={colors.primary} />
          <Text style={styles.tokenText}>
            {config.tokensRefill > 0 
              ? `${config.tokensRefill} tokens/month` 
              : `${config.tokens} tokens (one-time)`}
          </Text>
        </View>

        <View style={styles.prosConsSection}>
          <Text style={styles.sectionLabel}>Pros ({config.name})</Text>
          {config.pros.slice(0, 3).map((pro, idx) => (
            <View key={idx} style={styles.proRow}>
              <Check color={colors.primary} size={14} strokeWidth={3} />
              <Text style={styles.proText} numberOfLines={2}>{pro}</Text>
            </View>
          ))}
          
          <Text style={[styles.sectionLabel, styles.consLabel]}>Cons ({config.name})</Text>
          {config.cons.slice(0, 2).map((con, idx) => (
            <View key={idx} style={styles.conRow}>
              <View style={styles.conBullet} />
              <Text style={styles.conText} numberOfLines={2}>{con}</Text>
            </View>
          ))}
        </View>

        <View style={styles.whyChooseSection}>
          <Text style={styles.whyChooseLabel}>Why choose {config.name}?</Text>
          <Text style={styles.whyChooseText}>{config.whyChoose}</Text>
        </View>

        {isCurrentTier ? (
          <View style={styles.currentTierButton}>
            <Text style={styles.currentTierText}>Current Plan</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.selectButton, tier === 'plus' && styles.selectButtonPopular]}
            onPress={() => handleUpgrade(tier)}
            activeOpacity={0.8}
          >
            <Text style={[styles.selectButtonText, tier === 'plus' && styles.selectButtonTextPopular]}>
              {tier === 'basic' ? 'Continue with Basic' : `Upgrade to ${config.name}`}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.tierCta}>{config.cta}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={styles.backgroundGradient}
        />

        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + 16 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X color={colors.white} size={24} strokeWidth={2} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 40 }]}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.premiumHeroContainer}>
              <Image
                source={{ uri: images.premiumHero }}
                style={styles.premiumHeroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', '#0A0A0A']}
                style={styles.premiumHeroFade}
              />
              <View style={styles.crownOverlay}>
                <Crown color="#FFD700" size={36} fill="#FFD700" strokeWidth={2} />
              </View>
            </View>

            <Text style={styles.mainHeadline}>Choose Your Plan</Text>
            <Text style={styles.subheadline}>
              Start with a 7-day free trial. Advanced features are token-based.
            </Text>

            <View style={styles.currentStatus}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Current Plan:</Text>
                <Text style={styles.statusValue}>{TIER_CONFIG[subscriptionTier].name}</Text>
              </View>
              <View style={styles.statusRow}>
                <Zap color={colors.primary} size={18} fill={colors.primary} />
                <Text style={styles.statusLabel}>Tokens Remaining:</Text>
                <Text style={[styles.statusValue, tokens <= 2 && styles.lowTokens]}>{tokens}</Text>
              </View>
            </View>

            <View style={styles.tiersContainer}>
              {renderTierCard('basic')}
              {renderTierCard('plus')}
              {renderTierCard('pro')}
            </View>

            <View style={styles.tokenExplainer}>
              <Text style={styles.explainerTitle}>How Tokens Work</Text>
              <Text style={styles.explainerText}>
                • Each advanced action (deep comparison, what-if simulation, refinance scan, P2P request) costs 1 token
              </Text>
              <Text style={styles.explainerText}>
                • Plus and Pro plans refill monthly with fresh tokens
              </Text>
              <Text style={styles.explainerText}>
                • Unused tokens don&apos;t roll over to next month
              </Text>
            </View>

            <View style={styles.trustNote}>
              <Shield color={colors.textSecondary} size={16} />
              <Text style={styles.trustText}>
                No hidden fees. Cancel anytime. Licensed lenders only.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  crownContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumHeroContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumHeroImage: {
    width: '100%',
    height: '100%',
  },
  premiumHeroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  crownOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainHeadline: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
    lineHeight: 38,
  },
  subheadline: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  freeVsPremium: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  comparisonColumn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  premiumColumn: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  comparisonItem: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  premiumText: {
    color: colors.white,
    fontWeight: '500' as const,
  },
  planSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  selectedPlan: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: colors.black,
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  planSavings: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.white,
    marginTop: 4,
  },
  benefitsList: {
    gap: 0,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  benefitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  benefitContent: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  benefitDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  trustNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  upgradeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  upgradeButtonSubtext: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  continueButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  currentStatus: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    flex: 1,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  lowTokens: {
    color: '#FF4444',
  },
  tiersContainer: {
    gap: 20,
    marginBottom: 32,
  },
  tierCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popularCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(25, 197, 52, 0.08)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: 0.5,
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -0.5,
  },
  tierTagline: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginTop: 4,
  },
  pricingSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tierPrice: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -1,
  },
  tierPeriod: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(25, 197, 52, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  tokenText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
  },
  featuresSection: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  currentTierButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  currentTierText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectButtonPopular: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.white,
  },
  selectButtonTextPopular: {
    color: colors.white,
  },
  tierCta: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  tokenExplainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  explainerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 12,
  },
  explainerText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  prosConsSection: {
    gap: 10,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 8,
    marginTop: 4,
  },
  consLabel: {
    marginTop: 12,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  proText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  conRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  conBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginTop: 6,
  },
  conText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  whyChooseSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  whyChooseLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 6,
  },
  whyChooseText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  trialBadgeSmall: {
    alignItems: 'center',
  },
  trialTextSmall: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.primary,
    letterSpacing: -0.8,
  },
  trialSubtextSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
