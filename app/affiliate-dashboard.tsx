import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Copy,
  Share2,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Eye,
  UserCheck,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAffiliate, affiliateTiers } from '@/contexts/AffiliateContext';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AffiliateDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    affiliateProfile,
    referrals,
    commissions,
    analytics,
    getReferralLink,
  } = useAffiliate();

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  const referralLink = getReferralLink();

  const handleCopyLink = async () => {
    Clipboard.setString(referralLink);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const handleShareLink = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Join Loan Agent',
            text: `Join Loan Agent using my referral link and get the best loan offers!`,
            url: referralLink,
          });
        } else {
          await handleCopyLink();
          Alert.alert('Link Copied', 'Share link copied to clipboard. You can now paste it anywhere!');
        }
      } else {
        await Share.share({
          message: `Join Loan Agent using my referral link and get the best loan offers! ${referralLink}`,
          title: 'Join Loan Agent',
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        Alert.alert('Unable to Share', 'Please try copying the link instead.');
      }
    }
  };

  const currentTier = affiliateTiers.find((t) => t.tier === affiliateProfile?.tier);
  const nextTier = affiliateTiers.find(
    (t) => t.minReferrals > (affiliateProfile?.totalReferrals || 0)
  );

  const progressToNextTier = nextTier
    ? ((affiliateProfile?.totalReferrals || 0) / nextTier.minReferrals) * 100
    : 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Affiliate Program</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.tierCard}>
            <LinearGradient
              colors={[currentTier?.color || '#8E8E93', currentTier?.color + 'CC' || '#8E8E93CC']}
              style={styles.tierGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.tierBadge}>
                <Award color={colors.white} size={16} strokeWidth={2.5} />
                <Text style={styles.tierBadgeText}>{currentTier?.name.toUpperCase()} TIER</Text>
              </View>
              <Text style={styles.tierTitle}>Your Affiliate Status</Text>
              <Text style={styles.tierReferrals}>
                {affiliateProfile?.totalReferrals || 0} Total Referrals
              </Text>
              {nextTier && (
                <>
                  <View style={styles.tierProgressBar}>
                    <View style={[styles.tierProgressFill, { width: `${progressToNextTier}%` }]} />
                  </View>
                  <Text style={styles.tierProgressText}>
                    {nextTier.minReferrals - (affiliateProfile?.totalReferrals || 0)} more referrals
                    to {nextTier.name}
                  </Text>
                </>
              )}
            </LinearGradient>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
                <DollarSign color={colors.success} size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>${affiliateProfile?.totalEarnings.toFixed(2) || '0.00'}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
                <Clock color={colors.warning} size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>
                ${affiliateProfile?.pendingEarnings.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
                <Users color={colors.primary} size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>{affiliateProfile?.activeReferrals || 0}</Text>
              <Text style={styles.statLabel}>Active Referrals</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.infoLight }]}>
                <TrendingUp color={colors.info} size={20} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>{analytics?.conversionRate.toFixed(1) || '0.0'}%</Text>
              <Text style={styles.statLabel}>Conversion</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Referral Link</Text>
            <View style={styles.linkCard}>
              <View style={styles.linkTextContainer}>
                <Sparkles color={colors.primary} size={18} strokeWidth={2} />
                <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                  {referralLink}
                </Text>
              </View>
              <View style={styles.linkActions}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleCopyLink}
                  activeOpacity={0.7}
                >
                  <Copy color={colors.primary} size={18} strokeWidth={2} />
                  <Text style={styles.linkButtonText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleShareLink}
                  activeOpacity={0.7}
                >
                  <Share2 color={colors.primary} size={18} strokeWidth={2} />
                  <Text style={styles.linkButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {analytics && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Performance</Text>
                <View style={styles.periodSelector}>
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.periodButtonActive,
                      ]}
                      onPress={() => setSelectedPeriod(period)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          selectedPeriod === period && styles.periodButtonTextActive,
                        ]}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsRow}>
                  <AnalyticsItem
                    icon={Eye}
                    label="Clicks"
                    value={analytics.clicks.toString()}
                    color={colors.info}
                  />
                  <AnalyticsItem
                    icon={UserCheck}
                    label="Registrations"
                    value={analytics.registrations.toString()}
                    color={colors.success}
                  />
                </View>
                <View style={styles.analyticsDivider} />
                <View style={styles.analyticsRow}>
                  <AnalyticsItem
                    icon={FileText}
                    label="Applications"
                    value={analytics.applications.toString()}
                    color={colors.warning}
                  />
                  <AnalyticsItem
                    icon={CheckCircle}
                    label="Funded"
                    value={analytics.funded.toString()}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.analyticsDivider} />
                <View style={styles.analyticsFooter}>
                  <View style={styles.analyticsFooterItem}>
                    <Text style={styles.analyticsFooterLabel}>Avg Loan Amount</Text>
                    <Text style={styles.analyticsFooterValue}>
                      ${analytics.avgLoanAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.analyticsFooterDivider} />
                  <View style={styles.analyticsFooterItem}>
                    <Text style={styles.analyticsFooterLabel}>Total Earnings</Text>
                    <Text style={styles.analyticsFooterValue}>
                      ${analytics.earnings.toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Referrals</Text>
              <Text style={styles.viewAllText}>{referrals.length} Total</Text>
            </View>
            <View style={styles.referralsList}>
              {referrals.slice(0, 5).map((referral) => (
                <View key={referral.id} style={styles.referralCard}>
                  <View style={styles.referralHeader}>
                    <View style={styles.referralInfo}>
                      <Text style={styles.referralName}>{referral.referredUserName}</Text>
                      <Text style={styles.referralDate}>
                        {new Date(referral.registeredDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.referralStatusBadge,
                        { backgroundColor: getStatusColor(referral.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.referralStatusText, { color: getStatusColor(referral.status) }]}
                      >
                        {referral.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.referralFooter}>
                    <Text style={styles.referralCommission}>
                      Commission: ${referral.commission.toFixed(2)}
                    </Text>
                    {referral.loanAmount && (
                      <Text style={styles.referralLoanAmount}>
                        {referral.loanType?.toUpperCase()} · ${referral.loanAmount.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commission Structure</Text>
            <View style={styles.commissionCard}>
              {currentTier?.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitBullet} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Tiers</Text>
            <View style={styles.tiersList}>
              {affiliateTiers.map((tier) => (
                <TouchableOpacity
                  key={tier.tier}
                  style={[
                    styles.tierListCard,
                    tier.tier === affiliateProfile?.tier && styles.tierListCardActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.tierListHeader}>
                    <View style={[styles.tierColorDot, { backgroundColor: tier.color }]} />
                    <Text style={styles.tierListName}>{tier.name}</Text>
                    {tier.tier === affiliateProfile?.tier && (
                      <View style={styles.currentTierBadge}>
                        <Text style={styles.currentTierText}>CURRENT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.tierListRequirement}>
                    {tier.minReferrals} referrals required
                  </Text>
                  <View style={styles.tierListEarnings}>
                    <Text style={styles.tierListEarningsLabel}>Registration:</Text>
                    <Text style={styles.tierListEarningsValue}>${tier.registrationBonus}</Text>
                  </View>
                  <View style={styles.tierListEarnings}>
                    <Text style={styles.tierListEarningsLabel}>Application:</Text>
                    <Text style={styles.tierListEarningsValue}>${tier.applicationCommission}</Text>
                  </View>
                  <View style={styles.tierListEarnings}>
                    <Text style={styles.tierListEarningsLabel}>Funding:</Text>
                    <Text style={styles.tierListEarningsValue}>${tier.fundingCommission}</Text>
                  </View>
                  {tier.monthlyBonus > 0 && (
                    <View style={styles.tierListBonus}>
                      <Sparkles color={tier.color} size={14} strokeWidth={2} />
                      <Text style={styles.tierListBonusText}>
                        ${tier.monthlyBonus} monthly bonus
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

function AnalyticsItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.analyticsItem}>
      <View style={[styles.analyticsIcon, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={18} strokeWidth={2} />
      </View>
      <Text style={styles.analyticsValue}>{value}</Text>
      <Text style={styles.analyticsLabel}>{label}</Text>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'funded':
      return colors.success;
    case 'approved':
      return colors.primary;
    case 'applied':
      return colors.warning;
    case 'registered':
      return colors.info;
    default:
      return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tierCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  tierGradient: {
    padding: 28,
  },
  tierBadge: {
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
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: 0.8,
  },
  tierTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  tierReferrals: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 20,
    letterSpacing: -1.2,
  },
  tierProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tierProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  tierProgressText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  linkCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    ...colors.shadow,
  },
  linkTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.primary,
    letterSpacing: -0.1,
  },
  linkActions: {
    flexDirection: 'row',
    gap: 10,
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceTertiary,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  analyticsCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  analyticsItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  analyticsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  analyticsLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  analyticsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  analyticsFooter: {
    flexDirection: 'row',
    paddingTop: 16,
  },
  analyticsFooterItem: {
    flex: 1,
    alignItems: 'center',
  },
  analyticsFooterDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  analyticsFooterLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  analyticsFooterValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  referralsList: {
    gap: 12,
  },
  referralCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  referralDate: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  referralStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  referralStatusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
    letterSpacing: -0.1,
  },
  referralFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralCommission: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.success,
    letterSpacing: -0.2,
  },
  referralLoanAmount: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  commissionCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    ...colors.shadow,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginTop: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  tiersList: {
    gap: 14,
  },
  tierListCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  tierListCardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tierListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tierColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tierListName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  currentTierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    marginLeft: 'auto' as const,
  },
  currentTierText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tierListRequirement: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  tierListEarnings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierListEarningsLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  tierListEarningsValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  tierListBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tierListBonusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.success,
    letterSpacing: -0.1,
  },
});
