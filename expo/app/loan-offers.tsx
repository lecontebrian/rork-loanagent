import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, Sparkles, Bell, ArrowRightLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { generateLoanOffers } from '@/mocks/loanData';
import { LoanOffer, LoanType } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import PaywallModal from '@/components/PaywallModal';

export default function LoanOffersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const loanType = params.type as LoanType;
  const amount = params.amount ? Number(params.amount) : 50000;
  const insets = useSafeAreaInsets();
  
  const { creditInfo, applyForLoan, isPremium } = useApp();
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    setTimeout(() => {
      const generated = generateLoanOffers(
        loanType || 'personal',
        amount,
        creditInfo?.score || 720
      );
      setOffers(generated);
      setLoading(false);
      
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
    }, 1500);
  }, [loanType, amount, creditInfo, fadeAnim, slideAnim]);

  const handleCompare = () => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    // Navigate to comparison logic (mock)
    alert('Comparison feature unlocked!');
  };

  const handleApply = (offer: LoanOffer) => {
    applyForLoan(offer);
    router.push(`/application/questionnaire?offerId=${offer.id}` as any);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinnerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={styles.loadingText}>Finding Your Perfect Match</Text>
            <Text style={styles.loadingSubtext}>
              Analyzing {creditInfo?.score || 720} credit score
            </Text>
            <View style={styles.loadingDots}>
              <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.loadingDot, { backgroundColor: colors.secondary }]} />
              <View style={[styles.loadingDot, { backgroundColor: colors.warning }]} />
            </View>
          </View>
        </View>
      </>
    );
  }

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
            <Text style={styles.headerTitle}>Your Offers</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleCompare}
              activeOpacity={0.7}
            >
              <ArrowRightLeft color={colors.text} size={22} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('/notifications' as any)}
              activeOpacity={0.7}
            >
              <Bell color={colors.text} size={22} strokeWidth={2} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>5</Text>
              </View>
            </TouchableOpacity>
          </View>
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
            <View style={styles.resultHeader}>
              <Text style={styles.title}>{offers.length} Personalized Offers</Text>
              <Text style={styles.description}>
                Matched to your credit profile
              </Text>
            </View>

            <View style={styles.offersList}>
              {offers.map((offer, index) => (
                <View key={offer.id} style={styles.offerCard}>
                  {index === 0 && (
                    <LinearGradient
                      colors={['#FF9F0A', '#FF6D00']}
                      style={styles.bestMatchBadge}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Sparkles color={colors.white} size={12} strokeWidth={2.5} />
                      <Text style={styles.bestMatchText}>BEST MATCH</Text>
                    </LinearGradient>
                  )}
                  
                  <View style={styles.offerHeader}>
                    <View style={styles.lenderInfo}>
                      <Image
                        source={{ uri: offer.lender.logo }}
                        style={styles.lenderLogo}
                        resizeMode="contain"
                      />
                      <View>
                        <Text style={styles.lenderName}>{offer.lender.name}</Text>
                        <View style={styles.approvalBadge}>
                          <View style={[styles.approvalDot, { backgroundColor: colors.success }]} />
                          <Text style={styles.approvalText}>{offer.approvalLikelihood}% approval</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.rateSection}>
                    <View style={styles.rateContainer}>
                      <Text style={styles.rate}>{offer.interestRate}%</Text>
                      <Text style={styles.rateLabel}>APR</Text>
                    </View>
                    <View style={styles.monthlySummary}>
                      <Text style={styles.monthlySummaryLabel}>Monthly</Text>
                      <Text style={styles.monthlySummaryValue}>
                        ${offer.monthlyPayment.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.offerDetails}>
                    <DetailRow
                      label="Loan Term"
                      value={`${offer.termMonths} months`}
                    />
                    <DetailRow
                      label="Total Payment"
                      value={`$${offer.totalPayment.toLocaleString()}`}
                    />
                  </View>

                  <View style={styles.features}>
                    {offer.features.slice(0, 3).map((feature, idx) => (
                      <View key={idx} style={styles.feature}>
                        <CheckCircle color={colors.success} size={16} strokeWidth={2} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.processingTime}>
                    <Clock color={colors.textTertiary} size={14} strokeWidth={2} />
                    <Text style={styles.processingText}>
                      {offer.processingTime}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApply(offer)}
                    activeOpacity={0.85}
                  >
                    {index === 0 ? (
                      <LinearGradient
                        colors={['#0A84FF', '#5E5CE6']}
                        style={styles.applyButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.applyButtonTextPrimary}>Apply Now</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.applyButtonSecondary}>
                        <Text style={styles.applyButtonText}>Apply Now</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>
      </View>
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName="Side-by-Side Comparison"
        benefitDescription="Compare APRs, fees, and terms of multiple loans instantly."
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.1,
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
  resultHeader: {
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  description: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  offersList: {
    gap: 24,
  },
  offerCard: {
    padding: 28,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMedium,
    position: 'relative' as const,
  },
  bestMatchBadge: {
    position: 'absolute' as const,
    top: -12,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    ...colors.shadow,
  },
  bestMatchText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: 0.8,
  },
  offerHeader: {
    marginBottom: 24,
    marginTop: 8,
  },
  lenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  lenderLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surfaceTertiary,
  },
  lenderName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  approvalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  approvalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  approvalText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  rateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  rate: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -1.5,
  },
  rateLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  monthlySummary: {
    alignItems: 'flex-end',
  },
  monthlySummaryLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  monthlySummaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  offerDetails: {
    gap: 14,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  features: {
    gap: 12,
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  processingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderSecondary,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  applyButtonSecondary: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 16,
  },
  applyButtonTextPrimary: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  loadingSpinnerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    ...colors.shadowMedium,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  loadingSubtext: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
