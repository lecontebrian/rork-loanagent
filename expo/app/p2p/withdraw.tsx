import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polyline } from 'react-native-svg';
import { ArrowLeft, Landmark, Zap, Info, Percent, TrendingUp } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '@/constants/colors';
import FeeBreakdown from '@/components/FeeBreakdown';
import { useP2PWallet } from '@/contexts/P2PWalletContext';
import { calculateFees, formatCurrencyExact } from '@/constants/fees';
import { formatNumberInputText, parseNumberInput } from '@/utils/formatters';

function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function CumulativeChart({ series, width, height }: { series: number[]; width: number; height: number }) {
  const points = useMemo(() => {
    if (!series.length) return [] as { x: number; y: number }[];

    const minV = Math.min(...series);
    const maxV = Math.max(...series);
    const range = maxV - minV;

    return series.map((v, i) => {
      const x = (i / Math.max(1, series.length - 1)) * width;
      const t = range === 0 ? 0.5 : (v - minV) / range;
      const y = height - clampNumber(t, 0, 1) * height;
      return { x, y };
    });
  }, [height, series, width]);

  const polylinePoints = useMemo(() => points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '), [points]);

  const fillPath = useMemo(() => {
    if (points.length < 2) return '';
    const start = points[0];
    const end = points[points.length - 1];
    const line = points.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ');
    return `M ${start.x.toFixed(2)} ${height.toFixed(2)} L ${line} L ${end.x.toFixed(2)} ${height.toFixed(2)} Z`;
  }, [height, points]);

  if (!points.length) return null;

  return (
    <View style={{ width, height }} testID="withdrawCumulativeChart">
      <Svg width={width} height={height}>
        <Path d={fillPath} fill="rgba(34, 197, 94, 0.14)" />
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke="rgba(34, 197, 94, 0.95)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

type WithdrawMethod = 'bank' | 'instant';

function safeAmountFromText(text: string): string {
  return formatNumberInputText(text, { allowDecimal: true, maxDecimals: 2, compactMillions: true });
}

export default function WithdrawScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, withdraw, linkedBanks, myInvestments } = useP2PWallet();

  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<WithdrawMethod>('bank');

  const userId = 'current-user';

  const investmentPerformance = useMemo(() => {
    const months = 12;
    const now = new Date();

    const monthKeys: { key: string; label: string; start: Date; end: Date }[] = [];
    for (let i = months - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
      const label = start.toLocaleDateString('en-US', { month: 'short' });
      monthKeys.push({ key, label, start, end });
    }

    const monthlyReturns = monthKeys.map((m) => {
      let total = 0;
      myInvestments.forEach((loan) => {
        const myInv = loan.investors.filter((inv) => inv.investorId === userId);
        if (myInv.length === 0) return;

        const apr = typeof loan.interestRate === 'number' ? loan.interestRate : 0;
        const monthlyRate = apr / 100 / 12;

        myInv.forEach((inv) => {
          const invDate = new Date(inv.date);
          if (invDate > m.end) return;
          total += inv.amount * monthlyRate;
        });
      });
      return { key: m.key, label: m.label, value: total };
    });

    const totalInvestedAmount = myInvestments.reduce((sum, loan) => {
      const myAmount = loan.investors
        .filter((inv) => inv.investorId === userId)
        .reduce((s, inv) => s + inv.amount, 0);
      return sum + myAmount;
    }, 0);

    const totalEarned12m = monthlyReturns.reduce((sum, m) => sum + m.value, 0);
    const roi12m = totalInvestedAmount > 0 ? (totalEarned12m / totalInvestedAmount) * 100 : 0;

    const cumulativeSeries: number[] = [];
    let running = 0;
    monthlyReturns.forEach((m) => {
      running += m.value;
      cumulativeSeries.push(running);
    });

    const maxReturn = Math.max(...monthlyReturns.map((m) => m.value), 1);
    const bestMonth = monthlyReturns.reduce(
      (best, cur) => (cur.value > best.value ? cur : best),
      { key: 'none', label: '—', value: 0 }
    );

    return {
      monthlyReturns,
      totalInvestedAmount,
      totalEarned12m,
      roi12m,
      maxReturn,
      cumulativeSeries,
      avgMonthly: totalEarned12m / Math.max(1, months),
      bestMonth,
    };
  }, [myInvestments]);

  const amountNum = useMemo(() => parseNumberInput(amount), [amount]);

  const feeData = useMemo(() => {
    if (amountNum <= 0) return null;
    return calculateFees(amountNum, method === 'instant' ? 'instant' : 'standard');
  }, [amountNum, method]);

  const canWithdraw = amountNum >= 10 && amountNum <= balance;

  const handleWithdraw = useCallback(() => {
    if (!canWithdraw) {
      Alert.alert(
        'Invalid amount',
        amountNum < 10 ? 'Minimum withdrawal is $10.00' : 'Amount exceeds your available balance.'
      );
      return;
    }

    if (method === 'bank' && linkedBanks.length === 0) {
      Alert.alert(
        'No bank linked',
        'Link a bank account to withdraw via ACH. You can still use Instant (debit) if available.',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Add funds / link bank',
            onPress: () => router.push('/p2p/add-funds' as any),
          },
        ]
      );
      return;
    }

    const eta = method === 'instant' ? 'within minutes' : '3–5 business days';

    Alert.alert(
      'Confirm withdrawal',
      `Withdraw ${formatCurrencyExact(amountNum)} to ${method === 'instant' ? 'Instant (debit)' : 'Bank (ACH)'}?\n\nEstimated arrival: ${eta}\nFees: ${formatCurrencyExact(feeData?.totalFees || 0)}\nNet after fees: ${formatCurrencyExact(feeData?.netAmount || 0)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: () => {
            try {
              console.log('[P2P Withdraw] withdraw()', { amount: amountNum, method, feeData });
              withdraw(amountNum, method);
              Alert.alert('Withdrawal started', `You’ll receive ${formatCurrencyExact(feeData?.netAmount || 0)} ${eta}.`);
              router.back();
            } catch (e) {
              console.error('[P2P Withdraw] withdraw failed', e);
              Alert.alert('Something went wrong', 'Please try again in a moment.');
            }
          },
        },
      ]
    );
  }, [amountNum, canWithdraw, feeData, linkedBanks.length, method, router, withdraw]);

  const defaultBankLabel = useMemo(() => {
    const bank = linkedBanks.find((b) => b.isDefault) ?? linkedBanks[0];
    if (!bank) return 'No bank linked';
    return `${bank.bankName} •••• ${bank.last4} (${bank.accountType})`;
  }, [linkedBanks]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 14 }]} testID="withdrawHeader">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            testID="withdrawBack"
          >
            <ArrowLeft color={colors.text} size={21} strokeWidth={2.4} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Withdraw cash</Text>
            <Text style={styles.headerSubtitle}>Move money from your wallet to your bank</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 140 }]}
          keyboardShouldPersistTaps="handled"
          testID="withdrawScroll"
        >
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.18)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroBalanceBlock}>
                <Text style={styles.heroLabel}>Available</Text>
                <Text style={styles.heroBalance}>{formatCurrencyExact(balance)}</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipText}>{method === 'instant' ? 'Instant payout' : 'Standard ACH'}</Text>
              </View>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroHint}>
              Withdrawals reduce your wallet balance immediately. Your payout arrives {method === 'instant' ? 'within minutes' : 'in 3–5 business days'}.
            </Text>
          </LinearGradient>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.amountInputContainer} testID="withdrawAmountContainer">
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                value={amount}
                onChangeText={(t) => setAmount(safeAmountFromText(t))}
                keyboardType="decimal-pad"
                testID="withdrawAmountInput"
              />
            </View>
            <View style={styles.amountMetaRow}>
              <Text style={styles.minAmountText}>Minimum: $10.00</Text>
              <Text style={[styles.minAmountText, { color: canWithdraw ? colors.success : colors.textSecondary }]}
                numberOfLines={1}
              >
                {amountNum > 0 ? `Remaining: ${formatCurrencyExact(Math.max(0, balance - amountNum))}` : `Balance: ${formatCurrencyExact(balance)}`}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Transfer method</Text>
            <View style={styles.methodOptions} testID="withdrawMethods">
              <TouchableOpacity
                style={[styles.methodOption, method === 'bank' && styles.methodOptionActive]}
                onPress={() => setMethod('bank')}
                activeOpacity={0.8}
                testID="withdrawMethod-bank"
              >
                <View style={styles.methodHeader}>
                  <Landmark color={method === 'bank' ? colors.primary : colors.textSecondary} size={20} strokeWidth={2.25} />
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, method === 'bank' && styles.methodTitleActive]}>Bank (ACH)</Text>
                    <Text style={styles.methodSubtext}>3–5 business days • Lowest fee</Text>
                  </View>
                </View>
                <Text style={styles.methodMeta}>{defaultBankLabel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodOption, method === 'instant' && styles.methodOptionActive]}
                onPress={() => setMethod('instant')}
                activeOpacity={0.8}
                testID="withdrawMethod-instant"
              >
                <View style={styles.methodHeader}>
                  <Zap color={method === 'instant' ? colors.primary : colors.textSecondary} size={20} strokeWidth={2.35} />
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, method === 'instant' && styles.methodTitleActive]}>Instant (debit)</Text>
                    <Text style={styles.methodSubtext}>Minutes • Higher fee</Text>
                  </View>
                </View>
                <Text style={styles.methodMeta}>Uses your debit network. Availability may vary.</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!!feeData && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fees & total</Text>
              <FeeBreakdown
                amount={feeData.grossAmount}
                processorFee={feeData.processorFee}
                processorFeePercent={feeData.processorFeePercent}
                appFee={feeData.appFee}
                appFeePercent={feeData.appFeePercent}
                totalFees={feeData.totalFees}
                netAmount={feeData.netAmount}
                variant="withdraw"
              />
            </View>
          )}

          <View style={styles.section} testID="withdrawPerformanceSection">
            <View style={styles.perfHeaderRow}>
              <Text style={styles.sectionLabel}>Returns & ROI</Text>
              <View style={styles.roiPill} testID="withdrawRoiPill">
                <Percent color={colors.success} size={14} strokeWidth={2.35} />
                <Text style={styles.roiPillText}>{investmentPerformance.roi12m.toFixed(2)}% (12m)</Text>
              </View>
            </View>

            <Text style={styles.perfSubtitle}>
              {investmentPerformance.totalInvestedAmount > 0
                ? `Invested: ${formatCurrencyExact(investmentPerformance.totalInvestedAmount)} • Est. earned: ${formatCurrencyExact(investmentPerformance.totalEarned12m)} (last 12 months)`
                : 'Start investing to see monthly returns and ROI.'}
            </Text>

            <View style={styles.perfCard} testID="withdrawMonthlyReturnsCard">
              <View style={styles.perfMetricsRow}>
                <View style={styles.perfMetric}>
                  <Text style={styles.perfMetricLabel}>Avg / month</Text>
                  <Text style={styles.perfMetricValue}>+{formatCurrencyExact(investmentPerformance.avgMonthly)}</Text>
                </View>
                <View style={styles.perfMetricDivider} />
                <View style={styles.perfMetric}>
                  <Text style={styles.perfMetricLabel}>Best month</Text>
                  <Text style={styles.perfMetricValue}>
                    {investmentPerformance.bestMonth.label} {investmentPerformance.bestMonth.value > 0 ? `+${formatCurrencyExact(investmentPerformance.bestMonth.value)}` : '—'}
                  </Text>
                </View>
              </View>

              <View style={styles.returnsChart} testID="withdrawMonthlyReturnsChart">
                {investmentPerformance.monthlyReturns.map((m, idx) => {
                  const barMaxHeight = 110;
                  const scaled = investmentPerformance.maxReturn > 0 ? (m.value / investmentPerformance.maxReturn) * barMaxHeight : 0;
                  const barHeight = clampNumber(Math.round(scaled), m.value > 0 ? 6 : 2, barMaxHeight);
                  const showLabel = idx === 0 || idx === investmentPerformance.monthlyReturns.length - 1 || idx % 3 === 0;
                  return (
                    <View key={m.key} style={styles.returnsBarCol}>
                      <View style={[styles.returnsBarTrack, { height: barMaxHeight }]}>
                        <View
                          style={[
                            styles.returnsBarFill,
                            {
                              height: barHeight,
                              backgroundColor: m.value > 0 ? 'rgba(34, 197, 94, 0.88)' : 'rgba(148, 163, 184, 0.20)',
                            },
                          ]}
                        />
                      </View>
                      {showLabel ? <Text style={styles.returnsLabel}>{m.label}</Text> : <Text style={styles.returnsLabelSpacer}> </Text>}
                    </View>
                  );
                })}
              </View>

              <View style={styles.cumulativeRow} testID="withdrawCumulativeRow">
                <View style={styles.cumulativeLeft}>
                  <View style={styles.cumulativeTitleRow}>
                    <TrendingUp color={colors.success} size={16} strokeWidth={2.3} />
                    <Text style={styles.cumulativeTitle}>Cumulative earnings</Text>
                  </View>
                  <Text style={styles.cumulativeHint}>Running total over the last 12 months</Text>
                </View>
                <CumulativeChart series={investmentPerformance.cumulativeSeries} width={150} height={70} />
              </View>

              <View style={styles.perfFinePrint} testID="withdrawPerfFinePrint">
                <Text style={styles.perfFinePrintText}>Estimates are for demo purposes and don’t guarantee future returns.</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard} testID="withdrawInfo">
            <Info color={colors.info} size={18} strokeWidth={2.25} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>What happens after I withdraw?</Text>
              <Text style={styles.infoText}>
                You’ll see a completed transaction in your wallet activity. This is a simulated payout flow for demo purposes.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]} testID="withdrawFooter">
          <TouchableOpacity
            style={[styles.withdrawButton, !canWithdraw && styles.withdrawButtonDisabled]}
            onPress={handleWithdraw}
            disabled={!canWithdraw}
            activeOpacity={0.9}
            testID="withdrawSubmit"
          >
            <Text style={styles.withdrawButtonText}>
              Withdraw {feeData ? formatCurrencyExact(feeData.netAmount) : formatCurrencyExact(0)}
            </Text>
            <Text style={styles.withdrawButtonSubtext}>
              {feeData
                ? `Fee: ${formatCurrencyExact(feeData.totalFees)} • ETA: ${method === 'instant' ? 'minutes' : '3–5 days'}`
                : 'Enter an amount to see fees'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 10, gap: 12 },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(17,24,39,0.08)', ...colors.shadow },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800' as const, color: colors.text },
  headerSubtitle: { marginTop: 2, fontSize: 12.5, fontWeight: '500' as const, color: colors.textSecondary },
  headerRight: { width: 40 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 8 },
  heroCard: { borderRadius: 18, padding: 18, marginBottom: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  heroBalanceBlock: { flex: 1 },
  heroLabel: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary, marginBottom: 6 },
  heroBalance: { fontSize: 30, fontWeight: '900' as const, color: colors.text, letterSpacing: -0.8 },
  heroChip: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(59,130,246,0.12)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.22)' },
  heroChipText: { fontSize: 12, fontWeight: '800' as const, color: colors.text },
  heroDivider: { height: 1, backgroundColor: colors.border, marginVertical: 14, opacity: 0.8 },
  heroHint: { fontSize: 13, fontWeight: '600' as const, color: colors.textSecondary, lineHeight: 18 },
  section: { marginBottom: 18 },
  sectionLabel: { fontSize: 15, fontWeight: '800' as const, color: colors.text, marginBottom: 10 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, borderWidth: 1, borderColor: colors.border },
  dollarSign: { fontSize: 22, fontWeight: '800' as const, color: colors.text, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 26, fontWeight: '800' as const, color: colors.text, paddingVertical: 0 },
  amountMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  minAmountText: { fontSize: 12, fontWeight: '700' as const, color: colors.textSecondary },
  methodOptions: { gap: 10 },
  methodOption: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 },
  methodOptionActive: { borderColor: 'rgba(59,130,246,0.55)', backgroundColor: 'rgba(59,130,246,0.08)' },
  methodHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodContent: { flex: 1 },
  methodTitle: { fontSize: 14.5, fontWeight: '800' as const, color: colors.text, marginBottom: 4 },
  methodTitleActive: { color: colors.primary },
  methodSubtext: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary },
  methodMeta: { marginTop: 10, fontSize: 12, fontWeight: '700' as const, color: colors.textSecondary },
  perfHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  roiPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.28)' },
  roiPillText: { fontSize: 12, fontWeight: '800' as const, color: colors.success },
  perfSubtitle: { fontSize: 13, fontWeight: '600' as const, color: colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  perfCard: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, overflow: 'hidden' },
  perfMetricsRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, paddingHorizontal: 14 },
  perfMetric: { flex: 1 },
  perfMetricLabel: { fontSize: 12, fontWeight: '700' as const, color: colors.textSecondary, marginBottom: 4 },
  perfMetricValue: { fontSize: 14.5, fontWeight: '900' as const, color: colors.text },
  perfMetricDivider: { width: 1, height: 36, backgroundColor: colors.border, marginHorizontal: 14 },
  returnsChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: 10, marginTop: 14 },
  returnsBarCol: { flex: 1, alignItems: 'center' },
  returnsBarTrack: { width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(148,163,184,0.10)', justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' },
  returnsBarFill: { width: '100%', borderRadius: 10 },
  returnsLabel: { fontSize: 10, fontWeight: '700' as const, color: colors.textTertiary, marginTop: 6 },
  returnsLabelSpacer: { fontSize: 10, marginTop: 6, color: 'transparent' },
  cumulativeRow: { marginTop: 12, borderRadius: 14, backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.20)', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cumulativeLeft: { flex: 1 },
  cumulativeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cumulativeTitle: { fontSize: 13, fontWeight: '900' as const, color: colors.text },
  cumulativeHint: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary, lineHeight: 16 },
  perfFinePrint: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  perfFinePrintText: { fontSize: 11.5, fontWeight: '600' as const, color: colors.textTertiary, lineHeight: 16 },
  infoCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, backgroundColor: 'rgba(29,155,240,0.08)', borderWidth: 1, borderColor: 'rgba(29,155,240,0.18)' },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '800' as const, color: colors.text, marginBottom: 4 },
  infoText: { fontSize: 12.5, fontWeight: '600' as const, color: colors.textSecondary, lineHeight: 18 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0)' },
  withdrawButton: { borderRadius: 16, backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  withdrawButtonDisabled: { opacity: 0.5 },
  withdrawButtonText: { fontSize: 16, fontWeight: '900' as const, color: colors.white },
  withdrawButtonSubtext: { marginTop: 4, fontSize: 12, fontWeight: '700' as const, color: 'rgba(255,255,255,0.85)' },
});
