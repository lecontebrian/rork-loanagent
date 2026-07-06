import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Dimensions, type DimensionValue } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Plus, FileText, Settings, ArrowRight, DollarSign, Activity, AlertCircle, ChevronRight, Zap, TrendingDown, Grid, Bell, Clock, Eye, Users, Brain, Wallet, Calculator, FolderLock, MapPin, Bot } from 'lucide-react-native';
import colors from '@/constants/colors';
import { ICON_SIZES, ICON_STROKE, PremiumIcon, PremiumIconContainer } from '@/components/PremiumIcon';
import { useApp } from '@/contexts/AppContext';
import { useAffiliate } from '@/contexts/AffiliateContext';
import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateLoanOffers } from '@/mocks/loanData';
import { LoanOffer } from '@/types';
import IntegrationPrompt from '@/components/IntegrationPrompt';
import { formatCompactNumber } from '@/utils/formatters';
import ReviewPrompt from '@/components/ReviewPrompt';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { userProfile, creditInfo, applications, activeLoans, hasRatedApp, lastRatingPromptDate } = useApp();
  const { isAffiliate, enrollAsAffiliate, affiliateProfile } = useAffiliate();
  const insets = useSafeAreaInsets();
  const [suggestedOffers, setSuggestedOffers] = useState<LoanOffer[]>([]);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Logic to trigger review prompt
  useEffect(() => {
    if (hasRatedApp) return;

    // Check if we should show it (snooze logic)
    const now = new Date();
    const lastPrompt = lastRatingPromptDate ? new Date(lastRatingPromptDate) : null;
    const daysSinceLastPrompt = lastPrompt ? (now.getTime() - lastPrompt.getTime()) / (1000 * 3600 * 24) : 999;

    if (daysSinceLastPrompt < 7) return;

    // "A-ha" moment: User has savings opportunity or high credit score
    const hasSavings = applications.length > 0; // Simplified for demo
    const highCredit = creditInfo && creditInfo.score > 700;

    if (hasSavings || highCredit) {
      // Delay it a bit so it's not instant
      const timer = setTimeout(() => {
        setShowReviewPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasRatedApp, lastRatingPromptDate, applications, creditInfo]);


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
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (creditInfo) {
      const offers = generateLoanOffers('personal', 15000, creditInfo.score);
      setSuggestedOffers(offers.slice(0, 3));
    }
  }, [creditInfo]);

  const getCreditScoreData = () => {
    if (!creditInfo) return { color: '#6B7280', label: 'N/A' };
    const score = creditInfo.score;
    
    if (score >= 800) {
      return { color: '#15803D', label: 'EXCELLENT' }; // Dark green
    }
    if (score >= 740) {
      return { color: '#22C55E', label: 'VERY GOOD' }; // Green
    }
    if (score >= 670) {
      return { color: '#3dd657', label: 'GOOD' }; // Green (app theme)
    }
    if (score >= 580) {
      return { color: '#F97316', label: 'FAIR' }; // Orange
    }
    return { color: '#DC2626', label: 'VERY POOR' }; // Red
  };

  const creditScoreData = getCreditScoreData();

  const calculateBorrowingPower = () => {
    if (!userProfile || !creditInfo) return 0;
    const baseMultiplier = creditInfo.score >= 750 ? 5 : creditInfo.score >= 700 ? 4 : creditInfo.score >= 650 ? 3 : 2;
    return Math.floor((userProfile.employment.annualIncome * baseMultiplier) / 1000) * 1000;
  };

  const calculateRefinanceSavings = () => {
    if (applications.length === 0) return 0;
    const avgCurrentPayment = applications.reduce((sum, app) => sum + app.monthlyPayment, 0) / applications.length;
    return Math.floor(avgCurrentPayment * 0.15);
  };

  const getCreditScoreTrend = () => {
    if (!creditInfo) return 0;
    const baseScore = 680;
    return creditInfo.score - baseScore;
  };

  const getCreditHealthTips = () => {
    if (!creditInfo) return [];
    const tips = [];
    if (creditInfo.factors.creditUtilization > 50) {
      tips.push('Lower your credit utilization below 30%');
    }
    if (creditInfo.factors.paymentHistory < 90) {
      tips.push('Make all payments on time to improve history');
    }
    if (creditInfo.factors.creditAge < 70) {
      tips.push('Keep older accounts open to increase credit age');
    }
    return tips.slice(0, 3);
  };

  const borrowingPower = calculateBorrowingPower();
  const refinanceSavings = calculateRefinanceSavings();
  const creditTrend = getCreditScoreTrend();
  const creditTips = getCreditHealthTips();

  const pendingApplications = applications.filter(
    app => app.status === 'submitted' || app.status === 'processing'
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={true} contentContainerStyle={{ paddingTop: insets.top }}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://r2-pub.rork.com/generated-images/4a376767-2249-4ad3-b355-e8b852b56f24.png' }}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.greeting}>Welcome back</Text>
                <Text style={styles.name}>{userProfile?.firstName || 'User'}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => router.push('/notifications' as any)}
                activeOpacity={0.7}
              >
                <PremiumIcon icon={Bell} color={colors.text} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{applications.length > 0 ? applications.length : ''}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/settings' as any)}
                activeOpacity={0.7}
              >
                <PremiumIcon icon={Settings} color={colors.text} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
              </TouchableOpacity>
            </View>
          </View>

          <IntegrationPrompt />

          {refinanceSavings > 0 && (
            <Animated.View
              style={[
                styles.refinanceBanner,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={colors.gradients.ocean as any}
                style={styles.refinanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.refinanceBadge}>
                  <PremiumIcon icon={Zap} color={colors.white} size={14} strokeWidth={ICON_STROKE.emphasized} />
                  <Text style={styles.refinanceBadgeText}>OPPORTUNITY</Text>
                </View>
                <Text style={styles.refinanceTitle}>You Could Save</Text>
                <Text style={styles.refinanceSavings}>${refinanceSavings}/month</Text>
                <Text style={styles.refinanceSubtext}>by refinancing your current loans</Text>
                <TouchableOpacity
                  style={styles.refinanceButton}
                  activeOpacity={0.8}
                  onPress={() => router.push('/refinance' as any)}
                >
                  <Text style={styles.refinanceButtonText}>Explore Refinance Options</Text>
                  <PremiumIcon icon={ArrowRight} color={colors.white} size={18} strokeWidth={ICON_STROKE.emphasized} />
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}

          <View style={styles.metricsRow}>
            <Animated.View
              style={[
                styles.metricCard,
                { flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.metricIconContainer}>
                <DollarSign color={colors.success} size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.metricLabel}>Borrowing Power</Text>
              <Text style={styles.metricValue}>${formatCompactNumber(borrowingPower)}</Text>
              <View style={styles.metricFactors}>
                <View style={[styles.metricFactorDot, { backgroundColor: colors.success }]} />
                <Text style={styles.metricFactorText}>Based on your profile</Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.creditScoreCardWrapper,
                { 
                  flex: 1, 
                  opacity: fadeAnim, 
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View
                style={[styles.creditScoreCard, { backgroundColor: creditScoreData.color }]}
              >
                <View style={styles.creditScoreIconRow}>
                  <View style={styles.creditScoreIconBg}>
                    <Activity color={colors.white} size={20} strokeWidth={2.5} />
                  </View>
                  <View style={styles.creditTrendPill}>
                    {creditTrend >= 0 ? (
                      <TrendingUp color={colors.white} size={10} strokeWidth={3} />
                    ) : (
                      <TrendingDown color={colors.white} size={10} strokeWidth={3} />
                    )}
                    <Text style={styles.creditTrendPillText}>{creditTrend >= 0 ? '+' : ''}{creditTrend}</Text>
                  </View>
                </View>
                <Text style={styles.creditScoreValue}>{creditInfo?.score || 0}</Text>
                <View style={styles.creditScoreLabelRow}>
                  <View style={[styles.creditScoreLabelDot, { backgroundColor: colors.white }]} />
                  <Text style={styles.creditScoreLabelText}>{creditScoreData.label}</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {suggestedOffers.length > 0 && (
            <View style={styles.offersSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Suggested Offers</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/loan-categories' as any)}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.offersScrollContent}
                snapToInterval={width - 80}
                decelerationRate="fast"
              >
                {suggestedOffers.map((offer) => (
                  <TouchableOpacity
                    key={offer.id}
                    style={styles.offerCard}
                    activeOpacity={0.85}
                  >
                    <View style={styles.offerHeader}>
                      <Image
                        source={{ uri: offer.lender.logo }}
                        style={styles.offerLenderLogo}
                        resizeMode="contain"
                      />
                      <View style={styles.offerPrequalBadge}>
                        <Text style={styles.offerPrequalText}>{offer.approvalLikelihood}% Match</Text>
                      </View>
                    </View>
                    <Text style={styles.offerLenderName}>{offer.lender.name}</Text>
                    <Text style={styles.offerType}>{offer.loanType.toUpperCase()} LOAN</Text>
                    <View style={styles.offerDivider} />
                    <View style={styles.offerDetails}>
                      <View style={styles.offerDetailItem}>
                        <Text style={styles.offerDetailLabel}>APR</Text>
                        <Text style={styles.offerDetailValue}>{offer.interestRate}%</Text>
                      </View>
                      <View style={styles.offerDetailItem}>
                        <Text style={styles.offerDetailLabel}>Monthly</Text>
                        <Text style={styles.offerDetailValue}>${offer.monthlyPayment.toFixed(0)}</Text>
                      </View>
                      <View style={styles.offerDetailItem}>
                        <Text style={styles.offerDetailLabel}>Term</Text>
                        <Text style={styles.offerDetailValue}>{offer.termMonths}mo</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.offerApplyButton} 
                      activeOpacity={0.8}
                      onPress={() => router.push(`/application/questionnaire?offerId=${offer.id}&lenderName=${encodeURIComponent(offer.lender.name)}&amount=${offer.amount}&rate=${offer.interestRate}&term=${offer.termMonths}` as any)}
                    >
                      <Text style={styles.offerApplyButtonText}>Apply Now</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {creditInfo && (
            <View style={styles.creditHealthSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Credit Health Snapshot</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <ChevronRight color={colors.primary} size={22} strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <View style={styles.creditHealthCard}>
                <View style={styles.creditFactorsGrid}>
                  <CreditFactorItem
                    label="Payment History"
                    value={creditInfo.factors.paymentHistory}
                    color={colors.success}
                  />
                  <CreditFactorItem
                    label="Utilization"
                    value={creditInfo.factors.creditUtilization}
                    color={creditInfo.factors.creditUtilization > 50 ? colors.warning : colors.success}
                  />
                  <CreditFactorItem
                    label="Credit Age"
                    value={creditInfo.factors.creditAge}
                    color={colors.info}
                  />
                  <CreditFactorItem
                    label="Credit Mix"
                    value={creditInfo.factors.creditMix}
                    color={colors.secondary}
                  />
                </View>
                {creditTips.length > 0 && (
                  <View style={styles.creditTipsContainer}>
                    <View style={styles.creditTipsHeader}>
                      <AlertCircle color={colors.primary} size={16} strokeWidth={2.5} />
                      <Text style={styles.creditTipsTitle}>Ways to Improve</Text>
                    </View>
                    {creditTips.map((tip, index) => (
                      <View key={index} style={styles.creditTip}>
                        <View style={styles.creditTipBullet} />
                        <Text style={styles.creditTipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {activeLoans.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Credit Accounts</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.accountsList}>
                {activeLoans.map((loan) => (
                  <ActiveLoanCard key={loan.id} loan={loan} />
                ))}
              </View>
            </View>
          )}

          {applications.length > 0 ? (
            <View style={styles.ongoingSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.ongoingSectionTitle}>In Progress</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.ongoingCard}
                activeOpacity={0.85}
              >
                <View style={styles.ongoingHeader}>
                  <View style={styles.ongoingLenderInfo}>
                    <Image
                      source={{ uri: applications[0].lender.logo }}
                      style={styles.ongoingLenderLogo}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={styles.ongoingLenderName}>{applications[0].lender.name}</Text>
                      <Text style={styles.ongoingLoanType}>{applications[0].loanType.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={[styles.ongoingStatusBadge, { backgroundColor: getStatusColor(applications[0].status) + '20' }]}>
                    <Text style={[styles.ongoingStatusText, { color: getStatusColor(applications[0].status) }]}>{applications[0].status}</Text>
                  </View>
                </View>
                <Text style={styles.ongoingAmount}>${applications[0].amount.toLocaleString()}</Text>
                <View style={styles.ongoingDetailsRow}>
                  <Text style={styles.ongoingDetails}>
                    {applications[0].interestRate}% APR
                  </Text>
                  <View style={styles.ongoingDetailsDot} />
                  <Text style={styles.ongoingDetails}>
                    {applications[0].termMonths} months
                  </Text>
                </View>
                <View style={styles.ongoingProgress}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={colors.gradients.ocean as any}
                      style={[styles.progressFill, { width: applications[0].status === 'submitted' ? '25%' : applications[0].status === 'processing' ? '50%' : applications[0].status === 'approved' ? '75%' : '100%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {applications[0].status === 'submitted' ? 'Application submitted' : applications[0].status === 'processing' ? 'Under review' : applications[0].status === 'approved' ? 'Approved - awaiting funding' : 'Complete'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => router.push('/loan-categories' as any)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={colors.gradients.ocean as any}
              style={styles.applyButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.applyButtonIcon}>
                <Plus color={colors.white} size={24} strokeWidth={3} />
              </View>
              <View style={styles.applyButtonText}>
                <Text style={styles.applyButtonTitle}>
                  {applications.length > 0 ? 'Apply for Another Loan' : 'Apply for a Loan'}
                </Text>
                <Text style={styles.applyButtonSubtitle}>Smart matching in seconds</Text>
              </View>
              <ArrowRight color="rgba(255, 255, 255, 0.6)" size={20} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          {applications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <FileText color={colors.textTertiary} size={32} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyText}>No Applications Yet</Text>
              <Text style={styles.emptySubtext}>Start your journey to financial freedom</Text>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Applications</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.applicationsList}>
                {applications.slice(0, 3).map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    style={styles.applicationCard}
                    activeOpacity={0.85}
                  >
                    <View style={styles.applicationHeader}>
                      <View style={styles.applicationLenderInfo}>
                        <Image
                          source={{ uri: app.lender.logo }}
                          style={styles.applicationLenderLogo}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.applicationLender}>{app.lender.name}</Text>
                          <Text style={styles.applicationType}>{app.loanType.toUpperCase()}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>{app.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.applicationAmount}>
                      ${app.amount.toLocaleString()}
                    </Text>
                    <Text style={styles.applicationDetails}>
                      {app.interestRate}% APR · {app.termMonths} months
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="Total Applied"
                value={`$${applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}`}
                color={colors.primary}
              />
              <StatCard
                label="Active Loans"
                value={applications.length.toString()}
                color={colors.secondary}
              />
            </View>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Features</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/features-menu' as any)}
              >
                <PremiumIcon icon={Grid} color={colors.primary} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
              </TouchableOpacity>
            </View>
            <View style={styles.featuresGrid}>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/p2p-marketplace' as any)}>
                <PremiumIconContainer icon={Users} tone="secondary" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.secondary + '18'} borderColor={colors.secondary + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>P2P Lending</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/financial-coach' as any)}>
                <PremiumIconContainer icon={Brain} tone="warning" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.warning + '18'} borderColor={colors.warning + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>AI Coach</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/budget-tracker' as any)}>
                <PremiumIconContainer icon={Wallet} tone="success" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.success + '18'} borderColor={colors.success + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/loan-simulator' as any)}>
                <PremiumIconContainer icon={Calculator} tone="secondary" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.info + '18'} borderColor={colors.info + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Simulator</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/credit-builder' as any)}>
                <PremiumIconContainer icon={TrendingUp} tone="danger" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.error + '18'} borderColor={colors.error + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Credit Builder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/document-vault' as any)}>
                <PremiumIconContainer icon={FolderLock} tone="primary" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.primary + '18'} borderColor={colors.primary + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Vault</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/local-lenders' as any)}>
                <PremiumIconContainer icon={MapPin} tone="success" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.success + '18'} borderColor={colors.success + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Local</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/ai-assistant' as any)}>
                <PremiumIconContainer icon={Bot} tone="secondary" size={ICON_SIZES.card} containerSize={44} radius={15} backgroundColor={colors.secondary + '18'} borderColor={colors.secondary + '28'} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Assistant</Text>
              </TouchableOpacity>
            </View>
          </View>

          {pendingApplications.length > 0 && (
            <View style={styles.pendingSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.pendingSectionTitleRow}>
                  <Clock color={colors.warning} size={20} strokeWidth={2.5} />
                  <Text style={styles.sectionTitle}>Pending Applications</Text>
                </View>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>{pendingApplications.length}</Text>
                </View>
              </View>
              <View style={styles.pendingList}>
                {pendingApplications.map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    style={styles.pendingCard}
                    activeOpacity={0.85}
                    onPress={() => router.push('/application/pending-review' as any)}
                  >
                    <View style={styles.pendingCardHeader}>
                      <View style={styles.pendingLenderInfo}>
                        <Image
                          source={{ uri: app.lender.logo }}
                          style={styles.pendingLenderLogo}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.pendingLenderName}>{app.lender.name}</Text>
                          <Text style={styles.pendingLoanType}>{app.loanType.toUpperCase()} LOAN</Text>
                        </View>
                      </View>
                      <View style={[styles.pendingStatusBadge, { backgroundColor: getStatusColor(app.status) + '20' }]}>
                        <Text style={[styles.pendingStatusText, { color: getStatusColor(app.status) }]}>
                          {app.status === 'processing' ? 'Under Review' : app.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pendingCardBody}>
                      <View style={styles.pendingAmountRow}>
                        <Text style={styles.pendingAmount}>${app.amount.toLocaleString()}</Text>
                        <View style={styles.pendingDetailsRow}>
                          <Text style={styles.pendingDetails}>{app.interestRate}% APR</Text>
                          <View style={styles.pendingDetailsDot} />
                          <Text style={styles.pendingDetails}>{app.termMonths} months</Text>
                        </View>
                      </View>
                      <View style={styles.pendingProgressContainer}>
                        <View style={styles.pendingProgressBar}>
                          <LinearGradient
                            colors={[colors.warning, '#E6BE00'] as any}
                            style={[
                              styles.pendingProgressFill,
                              {
                                width: app.status === 'submitted' ? '50%' : '75%'
                              }
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                        <Text style={styles.pendingProgressText}>
                          {app.status === 'submitted' ? 'Submitted - Awaiting Review' : 'Processing - Under Review'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pendingCardFooter}>
                      <Text style={styles.pendingSubmittedDate}>
                        Submitted {new Date(app.submittedDate).toLocaleDateString()}
                      </Text>
                      <View style={styles.pendingViewButton}>
                        <Eye color={colors.primary} size={16} strokeWidth={2.5} />
                        <Text style={styles.pendingViewText}>View Status</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {!isAffiliate && (
            <View style={styles.affiliateSection}>
              <LinearGradient
                colors={['#FF6B5A', '#FFB347']}
                style={styles.affiliateGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.affiliateIcon}>
                  <Text style={styles.affiliateIconText}>💰</Text>
                </View>
                <Text style={styles.affiliateTitle}>Earn Money with Referrals</Text>
                <Text style={styles.affiliateSubtext}>
                  Join our affiliate program and earn up to $300 per funded loan
                </Text>
                <View style={styles.affiliateFeatures}>
                  <View style={styles.affiliateFeature}>
                    <View style={styles.affiliateFeatureDot} />
                    <Text style={styles.affiliateFeatureText}>Up to $30 per registration</Text>
                  </View>
                  <View style={styles.affiliateFeature}>
                    <View style={styles.affiliateFeatureDot} />
                    <Text style={styles.affiliateFeatureText}>$75 per application</Text>
                  </View>
                  <View style={styles.affiliateFeature}>
                    <View style={styles.affiliateFeatureDot} />
                    <Text style={styles.affiliateFeatureText}>$300 per funded loan</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.affiliateButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (userProfile) {
                      void enrollAsAffiliate(userProfile.id, userProfile.email);
                      setTimeout(() => {
                        router.push('/affiliate-dashboard' as any);
                      }, 500);
                    }
                  }}
                >
                  <Text style={styles.affiliateButtonText}>Join Affiliate Program</Text>
                  <PremiumIcon icon={ArrowRight} color={colors.white} size={18} strokeWidth={ICON_STROKE.emphasized} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {isAffiliate && (
            <TouchableOpacity
              style={styles.affiliateDashboardCard}
              activeOpacity={0.85}
              onPress={() => router.push('/affiliate-dashboard' as any)}
            >
              <LinearGradient
                colors={['#9B59B6', '#E74C3C']}
                style={styles.affiliateDashboardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.affiliateDashboardHeader}>
                  <View style={styles.affiliateDashboardBadge}>
                    <DollarSign color={colors.white} size={14} strokeWidth={2.5} />
                    <Text style={styles.affiliateDashboardBadgeText}>AFFILIATE</Text>
                  </View>
                  <ArrowRight color={colors.white} size={20} strokeWidth={2.5} />
                </View>
                <Text style={styles.affiliateDashboardTitle}>Affiliate Dashboard</Text>
                <View style={styles.affiliateDashboardStats}>
                  <View style={styles.affiliateDashboardStat}>
                    <Text style={styles.affiliateDashboardStatValue}>
                      ${affiliateProfile?.totalEarnings.toFixed(0) || '0'}
                    </Text>
                    <Text style={styles.affiliateDashboardStatLabel}>Total Earned</Text>
                  </View>
                  <View style={styles.affiliateDashboardDivider} />
                  <View style={styles.affiliateDashboardStat}>
                    <Text style={styles.affiliateDashboardStatValue}>
                      {affiliateProfile?.totalReferrals || 0}
                    </Text>
                    <Text style={styles.affiliateDashboardStatLabel}>Referrals</Text>
                  </View>
                  <View style={styles.affiliateDashboardDivider} />
                  <View style={styles.affiliateDashboardStat}>
                    <Text style={styles.affiliateDashboardStatValue}>
                      ${affiliateProfile?.pendingEarnings.toFixed(0) || '0'}
                    </Text>
                    <Text style={styles.affiliateDashboardStatLabel}>Pending</Text>
                  </View>
                </View>
                <Text style={styles.affiliateDashboardCta}>View full dashboard →</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
      <ReviewPrompt 
        visible={showReviewPrompt} 
        onClose={() => setShowReviewPrompt(false)}
        triggerEvent={refinanceSavings > 0 ? 'savings' : 'approval'}
      />
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statColorBar, { backgroundColor: color }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CreditFactorItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.creditFactorItem}>
      <Text style={styles.creditFactorLabel}>{label}</Text>
      <View style={styles.creditFactorBar}>
        <View style={[styles.creditFactorFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.creditFactorValue}>{value}%</Text>
    </View>
  );
}

function ActiveLoanCard({ loan }: { loan: any }) {
  const router = useRouter();
  const utilization = ((loan.currentBalance / loan.originalAmount) * 100).toFixed(0);
  const utilizationWidth = `${utilization}%` as DimensionValue;

  return (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <Image
            source={{ uri: loan.lender.logo }}
            style={styles.accountLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.accountLender}>{loan.lender.name}</Text>
            <Text style={styles.accountType}>{loan.loanType.toUpperCase()} LOAN</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.accountActionButton}
          activeOpacity={0.7}
          onPress={() => router.push('/refinance' as any)}
        >
          <Text style={styles.accountActionText}>Refinance</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.accountBalanceRow}>
        <View style={styles.accountBalanceItem}>
          <Text style={styles.accountBalanceLabel}>Balance</Text>
          <Text style={styles.accountBalanceValue}>${loan.currentBalance.toLocaleString()}</Text>
        </View>
        <View style={styles.accountBalanceDivider} />
        <View style={styles.accountBalanceItem}>
          <Text style={styles.accountBalanceLabel}>Utilization</Text>
          <Text style={styles.accountBalanceValue}>{utilization}%</Text>
        </View>
      </View>
      <View style={styles.accountUtilizationBar}>
        <View style={[styles.accountUtilizationFill, { width: utilizationWidth }]} />
      </View>
      <View style={styles.accountFooter}>
        <Text style={styles.accountPaymentText}>Next payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}</Text>
        <Text style={styles.accountPaymentAmount}>${loan.monthlyPayment.toFixed(0)}/mo</Text>
      </View>
    </View>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return colors.success;
    case 'processing':
      return colors.warning;
    case 'submitted':
      return colors.info;
    case 'rejected':
      return colors.error;
    default:
      return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, paddingTop: 64, paddingBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 48, height: 48, borderRadius: 12 },
  greeting: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' as const },
  name: { fontSize: 32, fontWeight: '700' as const, color: colors.text, marginTop: 2 },
  headerButtons: { flexDirection: 'row', gap: 10 },
  notificationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  notificationBadge: { position: 'absolute' as const, top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { fontSize: 10, fontWeight: '700' as const, color: colors.white },
  settingsButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  ongoingSection: { marginHorizontal: 28, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  ongoingSectionTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  viewAllText: { fontSize: 15, fontWeight: '500' as const, color: colors.white },
  ongoingCard: { padding: 24, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  ongoingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  ongoingLenderInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ongoingLenderLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceTertiary },
  ongoingLenderName: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  ongoingLoanType: { fontSize: 11, fontWeight: '600' as const, color: colors.textSecondary, marginTop: 2 },
  ongoingStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ongoingStatusText: { fontSize: 12, fontWeight: '600' as const, textTransform: 'capitalize' },
  ongoingAmount: { fontSize: 36, fontWeight: '800' as const, color: colors.text, marginBottom: 8 },
  ongoingDetailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  ongoingDetails: { fontSize: 15, fontWeight: '500' as const, color: colors.textSecondary },
  ongoingDetailsDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  ongoingProgress: { gap: 10 },
  progressBar: { height: 5, backgroundColor: colors.surfaceTertiary, borderRadius: 2.5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2.5 },
  progressText: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  applyButton: { marginHorizontal: 28, marginBottom: 32, borderRadius: 20, overflow: 'hidden' },
  applyButtonGradient: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16 },
  applyButtonIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  applyButtonText: { flex: 1 },
  applyButtonTitle: { fontSize: 18, fontWeight: '700' as const, color: colors.white, marginBottom: 4 },
  applyButtonSubtitle: { fontSize: 14, fontWeight: '500' as const, color: 'rgba(255,255,255,0.85)' },
  section: { paddingHorizontal: 28, marginBottom: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.text, marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 56, paddingHorizontal: 32, marginHorizontal: 28, marginBottom: 32, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surfaceTertiary, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: '600' as const, color: colors.text, marginBottom: 6 },
  emptySubtext: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  applicationsList: { gap: 14 },
  applicationCard: { padding: 20, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  applicationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  applicationLenderInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  applicationLenderLogo: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceTertiary },
  applicationLender: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  applicationType: { fontSize: 11, fontWeight: '600' as const, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7 },
  statusText: { fontSize: 12, fontWeight: '600' as const, textTransform: 'capitalize' },
  applicationAmount: { fontSize: 28, fontWeight: '700' as const, color: colors.text, marginBottom: 6 },
  applicationDetails: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary },
  statsGrid: { flexDirection: 'row', gap: 14 },
  statCard: { flex: 1, padding: 20, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  statColorBar: { width: 32, height: 4, borderRadius: 2, marginBottom: 16 },
  statValue: { fontSize: 26, fontWeight: '700' as const, color: colors.text, marginBottom: 6 },
  statLabel: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  refinanceBanner: { marginHorizontal: 28, marginBottom: 20, borderRadius: 24, overflow: 'hidden' },
  refinanceGradient: { padding: 28 },
  refinanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' as const, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 16 },
  refinanceBadgeText: { fontSize: 11, fontWeight: '700' as const, color: colors.white },
  refinanceTitle: { fontSize: 15, fontWeight: '600' as const, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  refinanceSavings: { fontSize: 48, fontWeight: '800' as const, color: colors.white, marginBottom: 6 },
  refinanceSubtext: { fontSize: 15, fontWeight: '500' as const, color: 'rgba(255,255,255,0.75)', marginBottom: 20 },
  refinanceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)' },
  refinanceButtonText: { fontSize: 16, fontWeight: '600' as const, color: colors.white },
  metricsRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 28, marginBottom: 28 },
  metricCard: { padding: 20, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  metricIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  metricLabel: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 8 },
  metricValue: { fontSize: 32, fontWeight: '800' as const, color: colors.text, marginBottom: 10 },
  metricFactors: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricFactorDot: { width: 6, height: 6, borderRadius: 3 },
  metricFactorText: { fontSize: 12, fontWeight: '500' as const, color: colors.textTertiary },
  creditScoreCardWrapper: { borderRadius: 20, overflow: 'visible' },
  creditScoreCard: { padding: 16, borderRadius: 20, overflow: 'hidden', position: 'relative' as const },
  creditScoreIconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  creditScoreIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  creditTrendPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)' },
  creditTrendPillText: { fontSize: 11, fontWeight: '700' as const, color: colors.white },
  creditScoreValue: { fontSize: 44, fontWeight: '800' as const, color: colors.white, marginBottom: 8 },
  creditScoreLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  creditScoreLabelDot: { width: 6, height: 6, borderRadius: 3 },
  creditScoreLabelText: { fontSize: 11, fontWeight: '700' as const, color: 'rgba(255,255,255,0.9)' },
  offersSection: { marginBottom: 28 },
  offersScrollContent: { paddingHorizontal: 28, gap: 14 },
  offerCard: { width: width - 80, padding: 24, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  offerLenderLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.surfaceTertiary },
  offerPrequalBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.successLight },
  offerPrequalText: { fontSize: 12, fontWeight: '600' as const, color: colors.white },
  offerLenderName: { fontSize: 20, fontWeight: '700' as const, color: colors.text, marginBottom: 4 },
  offerType: { fontSize: 11, fontWeight: '600' as const, color: colors.textSecondary, marginBottom: 20 },
  offerDivider: { height: 1, backgroundColor: colors.border, marginBottom: 20 },
  offerDetails: { flexDirection: 'row', marginBottom: 20 },
  offerDetailItem: { flex: 1 },
  offerDetailLabel: { fontSize: 12, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 6 },
  offerDetailValue: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  offerApplyButton: { paddingVertical: 14, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center' },
  offerApplyButtonText: { fontSize: 16, fontWeight: '700' as const, color: colors.black },
  creditHealthSection: { paddingHorizontal: 28, marginBottom: 28 },
  creditHealthCard: { padding: 24, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  creditFactorsGrid: { gap: 20, marginBottom: 24 },
  creditFactorItem: { gap: 8 },
  creditFactorLabel: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary },
  creditFactorBar: { height: 8, backgroundColor: colors.surfaceTertiary, borderRadius: 4, overflow: 'hidden' },
  creditFactorFill: { height: '100%', borderRadius: 4 },
  creditFactorValue: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  creditTipsContainer: { padding: 16, backgroundColor: colors.infoLight, borderRadius: 14 },
  creditTipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  creditTipsTitle: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
  creditTip: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  creditTipBullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.primary, marginTop: 6 },
  creditTipText: { flex: 1, fontSize: 13, fontWeight: '500' as const, color: colors.text, lineHeight: 18 },
  accountsList: { gap: 14 },
  accountCard: { padding: 20, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  accountHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  accountInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accountLogo: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surfaceTertiary },
  accountLender: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  accountType: { fontSize: 11, fontWeight: '600' as const, color: colors.textSecondary, marginTop: 2 },
  accountActionButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.primaryLight },
  accountActionText: { fontSize: 13, fontWeight: '600' as const, color: colors.white },
  accountBalanceRow: { flexDirection: 'row', marginBottom: 14 },
  accountBalanceItem: { flex: 1 },
  accountBalanceLabel: { fontSize: 12, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 6 },
  accountBalanceValue: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  accountBalanceDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  accountUtilizationBar: { height: 6, backgroundColor: colors.surfaceTertiary, borderRadius: 3, overflow: 'hidden', marginBottom: 14 },
  accountUtilizationFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  accountFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountPaymentText: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  accountPaymentAmount: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  featuresSection: { paddingHorizontal: 28, marginBottom: 32 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  featureCard: { width: '22%', aspectRatio: 1, padding: 12, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  featureIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featureIconText: { fontSize: 24 },
  featureTitle: { fontSize: 11, fontWeight: '600' as const, color: colors.text, textAlign: 'center' },
  affiliateSection: { marginHorizontal: 28, marginBottom: 28, borderRadius: 24, overflow: 'hidden' },
  affiliateGradient: { padding: 28 },
  affiliateIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  affiliateIconText: { fontSize: 28 },
  affiliateTitle: { fontSize: 24, fontWeight: '800' as const, color: colors.white, marginBottom: 8 },
  affiliateSubtext: { fontSize: 15, fontWeight: '500' as const, color: 'rgba(255,255,255,0.9)', marginBottom: 20, lineHeight: 22 },
  affiliateFeatures: { gap: 10, marginBottom: 24 },
  affiliateFeature: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  affiliateFeatureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  affiliateFeatureText: { fontSize: 14, fontWeight: '600' as const, color: colors.white },
  affiliateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)' },
  affiliateButtonText: { fontSize: 16, fontWeight: '700' as const, color: colors.white },
  affiliateDashboardCard: { marginHorizontal: 28, marginBottom: 28, borderRadius: 24, overflow: 'hidden' },
  affiliateDashboardGradient: { padding: 24 },
  affiliateDashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  affiliateDashboardBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)' },
  affiliateDashboardBadgeText: { fontSize: 11, fontWeight: '700' as const, color: colors.white },
  affiliateDashboardTitle: { fontSize: 26, fontWeight: '800' as const, color: colors.white, marginBottom: 20 },
  affiliateDashboardStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  affiliateDashboardStat: { flex: 1, alignItems: 'center' },
  affiliateDashboardStatValue: { fontSize: 24, fontWeight: '800' as const, color: colors.white, marginBottom: 4 },
  affiliateDashboardStatLabel: { fontSize: 12, fontWeight: '500' as const, color: 'rgba(255,255,255,0.85)' },
  affiliateDashboardDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },
  affiliateDashboardCta: { fontSize: 14, fontWeight: '600' as const, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  pendingSection: { paddingHorizontal: 28, marginBottom: 28 },
  pendingSectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pendingBadge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  pendingBadgeText: { fontSize: 12, fontWeight: '700' as const, color: colors.white },
  pendingList: { gap: 14 },
  pendingCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.warning + '40', overflow: 'hidden' },
  pendingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  pendingLenderInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pendingLenderLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceTertiary },
  pendingLenderName: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  pendingLoanType: { fontSize: 11, fontWeight: '600' as const, color: colors.textSecondary, marginTop: 2 },
  pendingStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  pendingStatusText: { fontSize: 12, fontWeight: '600' as const, textTransform: 'capitalize' },
  pendingCardBody: { padding: 20, paddingTop: 16, paddingBottom: 16 },
  pendingAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pendingAmount: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  pendingDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pendingDetails: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary },
  pendingDetailsDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  pendingProgressContainer: { gap: 8 },
  pendingProgressBar: { height: 6, backgroundColor: colors.surfaceTertiary, borderRadius: 3, overflow: 'hidden' },
  pendingProgressFill: { height: '100%', borderRadius: 3 },
  pendingProgressText: { fontSize: 13, fontWeight: '500' as const, color: colors.warning },
  pendingCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: colors.surfaceSecondary },
  pendingSubmittedDate: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  pendingViewButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pendingViewText: { fontSize: 14, fontWeight: '600' as const, color: colors.primary },
});
