import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, CreditCard, Plus, RefreshCw, Sparkles, TrendingDown, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { AIInsightCard } from '@/components/AIInsightCard';
import { AnimatedProgressRing } from '@/components/ProgressRing';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { loans, primaryInsight } from '@/mocks/loanData';
import { formatCurrency, formatPercent, formatCurrencyWithDecimals, getStatusColor, getStatusLabel } from '@/utils/formatters';
import type { Loan, AIInsight } from '@/types';

export default function LoanDetailScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const loan: Loan | undefined = loans.find((l) => l.id === id) || loans[0];
  const statusColor = getStatusColor(loan.status);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePayment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleExtraPayment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRefinance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Generate loan-specific AI insight
  const loanInsight: AIInsight = {
    title: 'AI Recommendation',
    body:
      loan.type === 'mortgage'
        ? 'Your mortgage rate of 4.25% is competitive. Paying an extra $150/month would save $21,400 in interest and reduce your term by 2 years. Consider refinancing only if rates drop below 4.0%.'
        : loan.type === 'auto'
        ? 'Your auto loan at 3.99% is near market rate. With 32 months remaining, focus on standard payments. An extra $50/month saves ~$200 in interest and pays off 3 months early.'
        : 'Your personal loan at 7.50% APR is your highest-cost debt. Prioritize paying this off early — an extra $100/month saves ~$340 in interest and clears the loan 7 months sooner.',
    savingAmount:
      loan.type === 'mortgage' ? 21400 : loan.type === 'auto' ? 200 : 340,
    timeSaved:
      loan.type === 'mortgage' ? '2 years' : loan.type === 'auto' ? '3 months' : '7 months',
    type: 'savings',
  };

  const detailRows = [
    { label: 'Original Loan Amount', value: formatCurrency(loan.originalAmount) },
    { label: 'Remaining Balance', value: formatCurrency(loan.remainingBalance) },
    { label: 'Interest Rate (APR)', value: formatPercent(loan.apr) },
    { label: 'Monthly Payment', value: formatCurrencyWithDecimals(loan.monthlyPayment) },
    { label: 'Loan Term', value: `${loan.termMonths} months` },
    { label: 'Months Remaining', value: `${loan.monthsRemaining} months` },
    { label: 'Start Date', value: loan.startDate },
    { label: 'Next Payment', value: `${loan.nextPaymentDate} · ${formatCurrencyWithDecimals(loan.nextPaymentAmount)}` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: Spacing.xxxl,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: pressed ? theme.surfaceSecondary : theme.surface, borderColor: theme.border },
            ]}
          >
            <ArrowLeft size={20} color={theme.text} />
          </Pressable>
          <Text style={[Typography.title3, { color: theme.text, flex: 1, marginLeft: Spacing.sm }]}>
            Loan Details
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[Typography.caption1, { color: statusColor, fontWeight: '600' }]}>
              {getStatusLabel(loan.status)}
            </Text>
          </View>
        </View>

        {/* Hero Balance Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <LinearGradient
            colors={theme.heroGradient as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroCard, theme.shadowStrong]}
          >
            <View style={styles.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.subheadline, { color: theme.primaryMint, fontWeight: '600' }]}>
                  {loan.name}
                </Text>
                <Text style={[Typography.caption1, { color: theme.primaryMint, opacity: 0.8, marginTop: 2 }]}>
                  {loan.lender}
                </Text>
              </View>
              <View style={styles.ringContainer}>
                <AnimatedProgressRing progress={loan.payoffProgress} size={72} strokeWidth={7} />
                <View style={styles.ringOverlay}>
                  <Text style={[Typography.headline, { color: '#FFFFFF', fontWeight: '800' }]}>
                    {loan.payoffProgress}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: Spacing.lg }}>
              <Text style={[Typography.caption1, { color: theme.primaryMint }]}>
                Remaining Balance
              </Text>
              <Text style={[Typography.largeTitle, { color: '#FFFFFF', fontWeight: '800', marginTop: 2 }]}>
                {formatCurrency(loan.remainingBalance)}
              </Text>
            </View>

            <View style={[styles.heroStats, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              <View style={styles.heroStatItem}>
                <Text style={[Typography.caption2, { color: theme.primaryMint }]}>APR</Text>
                <Text style={[Typography.headline, { color: '#FFFFFF', marginTop: 2 }]}>
                  {formatPercent(loan.apr)}
                </Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[Typography.caption2, { color: theme.primaryMint }]}>Monthly</Text>
                <Text style={[Typography.headline, { color: '#FFFFFF', marginTop: 2 }]}>
                  {formatCurrency(loan.monthlyPayment)}
                </Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[Typography.caption2, { color: theme.primaryMint }]}>Auto-pay</Text>
                <Text style={[Typography.headline, { color: '#FFFFFF', marginTop: 2 }]}>
                  {loan.autoPayEnabled ? 'On' : 'Off'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <GradientButton
                label="Make Payment"
                onPress={handlePayment}
                fullWidth
                size="md"
                icon={<CreditCard size={18} color={theme.textInverse} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GradientButton
                label="Extra Payment"
                onPress={handleExtraPayment}
                variant="secondary"
                fullWidth
                size="md"
                icon={<Plus size={18} color={theme.text} />}
              />
            </View>
          </View>
          <View style={{ marginTop: Spacing.sm }}>
            <GradientButton
              label="Refinance Options"
              onPress={handleRefinance}
              variant="ghost"
              fullWidth
              size="md"
              icon={<RefreshCw size={18} color={theme.text} />}
            />
          </View>
        </View>

        {/* Loan Details */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            Loan Information
          </Text>
          <GlassCard padding={0} intensity={30}>
            {detailRows.map((row, index) => (
              <View key={index}>
                <View style={styles.detailRow}>
                  <Text style={[Typography.subheadline, { color: theme.textMuted }]}>
                    {row.label}
                  </Text>
                  <Text style={[Typography.subheadline, { color: theme.text, fontWeight: '600' }]}>
                    {row.value}
                  </Text>
                </View>
                {index < detailRows.length - 1 && (
                  <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                )}
              </View>
            ))}
          </GlassCard>
        </View>

        {/* Payment History */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            Payment History
          </Text>
          <GlassCard padding={0} intensity={30}>
            {loan.payments.map((payment, index) => (
              <View key={payment.id}>
                <View style={styles.paymentRow}>
                  <View style={[styles.paymentIcon, { backgroundColor: `${theme.primary}22` }]}>
                    <Calendar size={16} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.subheadline, { color: theme.text, fontWeight: '600' }]}>
                      {payment.date}
                    </Text>
                    <Text style={[Typography.caption1, { color: theme.textMuted, marginTop: 2 }]}>
                      {payment.type === 'extra' ? 'Extra Payment' : 'Scheduled Payment'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[Typography.subheadline, { color: theme.text, fontWeight: '700' }]}>
                      {formatCurrencyWithDecimals(payment.amount)}
                    </Text>
                    <View style={styles.paymentStatusRow}>
                      <View style={[styles.paymentStatusDot, { backgroundColor: theme.primary }]} />
                      <Text style={[Typography.caption2, { color: theme.primary, fontWeight: '600' }]}>
                        Paid
                      </Text>
                    </View>
                  </View>
                </View>
                {index < loan.payments.length - 1 && (
                  <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                )}
              </View>
            ))}
          </GlassCard>
        </View>

        {/* AI Recommendation */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            AI Recommendation
          </Text>
          <AIInsightCard insight={loanInsight} onPress={() => router.push('/(tabs)/ask-ai')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroCard: {
    borderRadius: 28,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStats: {
    marginTop: Spacing.lg,
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  paymentStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
