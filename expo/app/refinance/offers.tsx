import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, TrendingDown, DollarSign, Zap, CheckCircle2, ArrowRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateLoanOffers } from '@/mocks/loanData';

export default function RefinanceOffersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { currentBalance, currentRate, creditScore } = params as any;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const offers = generateLoanOffers('auto', parseInt(currentBalance) || 25000, parseInt(creditScore) || 720);

  const calculateSavings = (newRate: number, newPayment: number) => {
    const currentRateNum = parseFloat(currentRate) || 6.5;
    const currentPaymentNum = parseFloat(params.monthlyPayment as string) || 450;
    
    const rateSavings = ((currentRateNum - newRate) / currentRateNum * 100).toFixed(1);
    const paymentSavings = (currentPaymentNum - newPayment).toFixed(0);
    
    return { rateSavings, paymentSavings };
  };

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
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.successBanner}>
              <LinearGradient
                colors={['#20B2AA', '#5FD4CC']}
                style={styles.successGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.successBadge}>
                  <Zap color={colors.white} size={14} strokeWidth={2.5} />
                  <Text style={styles.successBadgeText}>MATCHED</Text>
                </View>
                <Text style={styles.successTitle}>We Found {offers.length} Great Options!</Text>
                <Text style={styles.successSubtitle}>Personalized refinance offers based on your profile</Text>
              </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>Recommended for You</Text>

            <View style={styles.offersContainer}>
              {offers.map((offer, index) => {
                const savings = calculateSavings(offer.interestRate, offer.monthlyPayment);
                return (
                  <View key={offer.id} style={styles.offerCard}>
                    {index === 0 && (
                      <View style={styles.bestMatchBadge}>
                        <Text style={styles.bestMatchText}>BEST MATCH</Text>
                      </View>
                    )}
                    
                    <View style={styles.offerHeader}>
                      <Image
                        source={{ uri: offer.lender.logo }}
                        style={styles.lenderLogo}
                        resizeMode="contain"
                      />
                      <View style={styles.approvalBadge}>
                        <Text style={styles.approvalText}>{offer.approvalLikelihood}% Match</Text>
                      </View>
                    </View>

                    <Text style={styles.lenderName}>{offer.lender.name}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.rating}>⭐ {offer.lender.rating}</Text>
                      <Text style={styles.reviews}>({offer.lender.reviewCount} reviews)</Text>
                    </View>

                    <View style={styles.savingsBanner}>
                      <View style={styles.savingsItem}>
                        <TrendingDown color={colors.success} size={16} strokeWidth={2} />
                        <Text style={styles.savingsLabel}>Rate Reduction</Text>
                        <Text style={styles.savingsValue}>{savings.rateSavings}%</Text>
                      </View>
                      <View style={styles.savingsDivider} />
                      <View style={styles.savingsItem}>
                        <DollarSign color={colors.success} size={16} strokeWidth={2} />
                        <Text style={styles.savingsLabel}>Monthly Savings</Text>
                        <Text style={styles.savingsValue}>${savings.paymentSavings}</Text>
                      </View>
                    </View>

                    <View style={styles.offerDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>New APR</Text>
                        <Text style={styles.detailValue}>{offer.interestRate}%</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>New Monthly Payment</Text>
                        <Text style={styles.detailValue}>${offer.monthlyPayment.toFixed(0)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Term</Text>
                        <Text style={styles.detailValue}>{offer.termMonths} months</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processing Time</Text>
                        <Text style={styles.detailValue}>{offer.processingTime}</Text>
                      </View>
                    </View>

                    <View style={styles.features}>
                      {offer.features.slice(0, 3).map((feature, idx) => (
                        <View key={idx} style={styles.featureRow}>
                          <CheckCircle2 color={colors.success} size={16} strokeWidth={2} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.applyButton}
                      activeOpacity={0.85}
                      onPress={() => {}}
                    >
                      <LinearGradient
                        colors={['#20B2AA', '#1A8F8A']}
                        style={styles.applyGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.applyText}>Apply Now</Text>
                        <ArrowRight color={colors.white} size={18} strokeWidth={2.5} />
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.detailsButton} activeOpacity={0.7}>
                      <Text style={styles.detailsButtonText}>View Full Details</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💡 What&apos;s Next?</Text>
              <Text style={styles.infoText}>
                Choose an offer and complete your application. Most lenders provide a decision within 24-48 hours. Your current loan won&apos;t be affected until you accept and close on a new one.
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
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
  successBanner: {
    marginBottom: 28,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  successGradient: {
    padding: 24,
    alignItems: 'center',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 12,
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: 0.8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  successSubtitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  offersContainer: {
    gap: 20,
  },
  offerCard: {
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMedium,
  },
  bestMatchBadge: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.warning,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 24,
  },
  bestMatchText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: 0.8,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lenderLogo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceTertiary,
  },
  approvalBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.successLight,
    borderRadius: 10,
  },
  approvalText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  lenderName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  reviews: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  savingsBanner: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    marginBottom: 20,
  },
  savingsItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  savingsLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -0.4,
  },
  savingsDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  offerDetails: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  features: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...colors.shadowMedium,
  },
  applyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  applyText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  detailsButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  infoBox: {
    padding: 20,
    backgroundColor: colors.infoLight,
    borderRadius: 18,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
});
