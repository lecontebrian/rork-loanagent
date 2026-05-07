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
import { ArrowLeft, Landmark, CreditCard, Info, TrendingUp } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '@/constants/colors';
import FeeBreakdown from '@/components/FeeBreakdown';
import { useP2PWallet } from '@/contexts/P2PWalletContext';
import { calculateFees, formatCurrencyExact } from '@/constants/fees';
import { formatNumberInputText, parseNumberInput } from '@/utils/formatters';

type Method = 'bank' | 'card';

type ReturnPreset = 'conservative' | 'balanced' | 'aggressive';

const RETURN_PRESETS: Record<ReturnPreset, { title: string; subtitle: string; rate: number; tint: string }> = {
  conservative: { title: 'Conservative', subtitle: 'Lower volatility • steady', rate: 0.06, tint: 'rgba(29, 155, 240, 0.14)' },
  balanced: { title: 'Balanced', subtitle: 'Typical P2P mix', rate: 0.1, tint: 'rgba(25, 197, 52, 0.14)' },
  aggressive: { title: 'Aggressive', subtitle: 'Higher risk • higher APR', rate: 0.14, tint: 'rgba(255, 212, 0, 0.14)' },
};

function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function safeAmountFromText(text: string) {
  return formatNumberInputText(text, { allowDecimal: true, maxDecimals: 2, compactMillions: true });
}

function computeProjectionSeries(principal: number, annualRate: number, months: number) {
  const safePrincipal = Math.max(0, principal);
  const r = annualRate / 12;
  const series: number[] = [];
  for (let m = 0; m <= months; m += 1) {
    series.push(safePrincipal * Math.pow(1 + r, m));
  }
  return series;
}

function ProjectionChart({ series, width, height }: { series: number[]; width: number; height: number }) {
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
    <View style={{ width, height }} testID="projectionChart">
      <Svg width={width} height={height}>
        <Path d={fillPath} fill="rgba(25, 197, 52, 0.12)" />
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default function AddFundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, addFunds } = useP2PWallet();

  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<Method>('bank');
  const [preset, setPreset] = useState<ReturnPreset>('balanced');

  const amountNum = useMemo(() => parseNumberInput(amount), [amount]);

  const feeData = useMemo(() => {
    if (amountNum <= 0) return null;
    return calculateFees(amountNum, method === 'card' ? 'card' : 'bank');
  }, [amountNum, method]);

  const canAdd = amountNum >= 10;

  const projection = useMemo(() => {
    const annualRate = RETURN_PRESETS[preset].rate;
    const principal = feeData?.netAmount ?? amountNum;
    const months = 12;
    const series = computeProjectionSeries(principal, annualRate, months);
    const futureValue = series[series.length - 1] ?? principal;
    const earnings = Math.max(0, futureValue - principal);
    return { principal, annualRate, months, series, futureValue, earnings };
  }, [amountNum, feeData?.netAmount, preset]);

  const handleAdd = useCallback(() => {
    if (!canAdd) {
      Alert.alert('Minimum Amount', 'Please add at least $10.00');
      return;
    }

    Alert.alert(
      'Confirm Add Funds',
      `Add ${formatCurrencyExact(amountNum)} to your wallet?\n\nTotal fees: ${formatCurrencyExact(feeData?.totalFees || 0)}\nYou\'ll be charged: ${formatCurrencyExact((feeData?.grossAmount || 0) + (feeData?.totalFees || 0))}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Funds',
          onPress: () => {
            try {
              console.log('[P2P AddFunds] addFunds()', { amount: amountNum, method, feeData });
              addFunds(amountNum, method);
              Alert.alert('Success', `${formatCurrencyExact(feeData?.netAmount || 0)} added to your wallet`);
              router.back();
            } catch (e) {
              console.error('[P2P AddFunds] addFunds failed', e);
              Alert.alert('Something went wrong', 'Please try again in a moment.');
            }
          },
        },
      ]
    );
  }, [addFunds, amountNum, canAdd, feeData, method, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 14 }]} testID="addFundsHeader">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            testID="addFundsBack"
          >
            <ArrowLeft color={colors.text} size={21} strokeWidth={2.4} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Add funds</Text>
            <Text style={styles.headerSubtitle}>Top up your wallet so you can invest instantly</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 130 }]}
          keyboardShouldPersistTaps="handled"
          testID="addFundsScroll"
        >
          <LinearGradient
            colors={['rgba(25, 197, 52, 0.18)', 'rgba(29, 155, 240, 0.10)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroBalanceBlock}>
                <Text style={styles.heroLabel}>Wallet balance</Text>
                <Text style={styles.heroBalance}>{formatCurrencyExact(balance)}</Text>
              </View>
              <View style={styles.heroChip}>
                <TrendingUp color={colors.primary} size={16} strokeWidth={2.35} />
                <Text style={styles.heroChipText}>Ready to invest</Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroSteps}>
              <View style={styles.heroStep}>
                <View style={styles.heroStepDot} />
                <Text style={styles.heroStepText}>Add money once</Text>
              </View>
              <View style={styles.heroStep}>
                <View style={[styles.heroStepDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.heroStepText}>Choose a loan to invest in</Text>
              </View>
              <View style={styles.heroStep}>
                <View style={[styles.heroStepDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.heroStepText}>Track earnings inside your wallet</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Amount to add</Text>
            <View style={styles.amountInputContainer} testID="addFundsAmountContainer">
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                value={amount}
                onChangeText={(t) => setAmount(safeAmountFromText(t))}
                keyboardType="decimal-pad"
                testID="addFundsAmountInput"
              />
            </View>
            <View style={styles.amountMetaRow}>
              <Text style={styles.minAmountText}>Minimum: $10.00</Text>
              {!!feeData?.netAmount && feeData.netAmount !== amountNum ? (
                <Text style={styles.netAmountHint}>Net in wallet: {formatCurrencyExact(feeData.netAmount)}</Text>
              ) : (
                <View />
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Potential earnings</Text>
              <Text style={styles.sectionCaption}>Example 12-month projection</Text>
            </View>

            <View style={styles.chartCard} testID="addFundsProjectionCard">
              <View style={styles.chartTopRow}>
                <View style={styles.chartMetric}>
                  <Text style={styles.chartMetricLabel}>Invested</Text>
                  <Text style={styles.chartMetricValue}>{formatCurrencyExact(projection.principal)}</Text>
                </View>
                <View style={styles.chartMetricRight}>
                  <Text style={styles.chartMetricLabel}>Potential earnings</Text>
                  <Text style={styles.chartMetricValueAccent}>+{formatCurrencyExact(projection.earnings)}</Text>
                </View>
              </View>

              <View style={styles.chartCanvasRow}>
                <ProjectionChart
                  series={projection.series.filter((_, idx) => idx % 2 === 0)}
                  width={260}
                  height={110}
                />
                <View style={styles.chartLegend}>
                  <Text style={styles.chartLegendTitle}>Assumption</Text>
                  <Text style={styles.chartLegendText}>{Math.round(projection.annualRate * 100)}% APR</Text>
                  <Text style={styles.chartLegendText}>Compounded monthly</Text>
                  <Text style={styles.chartLegendFine}>This is an estimate — returns are not guaranteed.</Text>
                </View>
              </View>

              <View style={styles.presetRow}>
                {(Object.keys(RETURN_PRESETS) as ReturnPreset[]).map((k) => {
                  const item = RETURN_PRESETS[k];
                  const active = k === preset;
                  return (
                    <TouchableOpacity
                      key={k}
                      style={[styles.presetChip, { backgroundColor: item.tint }, active && styles.presetChipActive]}
                      onPress={() => setPreset(k)}
                      activeOpacity={0.85}
                      testID={`addFundsPreset-${k}`}
                    >
                      <Text style={[styles.presetTitle, active && styles.presetTitleActive]}>{item.title}</Text>
                      <Text style={styles.presetSub}>{item.subtitle}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Funding method</Text>
            <View style={styles.methodOptions} testID="addFundsMethods">
              <TouchableOpacity
                style={[styles.methodOption, method === 'bank' && styles.methodOptionActive]}
                onPress={() => setMethod('bank')}
                activeOpacity={0.7}
                testID="addFundsMethod-bank"
              >
                <View style={styles.methodHeader}>
                  <Landmark color={method === 'bank' ? colors.primary : colors.textSecondary} size={20} strokeWidth={2.25} />
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, method === 'bank' && styles.methodTitleActive]}>Bank account (ACH)</Text>
                    <Text style={styles.methodSubtext}>1–3 business days • Lower fees</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodOption, method === 'card' && styles.methodOptionActive]}
                onPress={() => setMethod('card')}
                activeOpacity={0.7}
                testID="addFundsMethod-card"
              >
                <View style={styles.methodHeader}>
                  <CreditCard color={method === 'card' ? colors.primary : colors.textSecondary} size={20} strokeWidth={2.25} />
                  <View style={styles.methodContent}>
                    <Text style={[styles.methodTitle, method === 'card' && styles.methodTitleActive]}>Debit/credit card</Text>
                    <Text style={styles.methodSubtext}>Instant • Standard card fees</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {feeData && (
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
                variant="add"
              />
            </View>
          )}

          <View style={styles.infoCard} testID="addFundsInfo">
            <Info color={colors.info} size={18} strokeWidth={2.25} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>When will my funds be available?</Text>
              <Text style={styles.infoText}>
                {method === 'bank'
                  ? "Bank transfers typically take 1–3 business days. You'll be able to invest once the transfer clears."
                  : 'Card payments are processed instantly and funds are available immediately.'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]} testID="addFundsFooter">
          <TouchableOpacity
            style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!canAdd}
            activeOpacity={0.9}
            testID="addFundsSubmit"
          >
            <Text style={styles.addButtonText}>Add {feeData ? formatCurrencyExact(feeData.netAmount) : '$0.00'}</Text>
            {feeData ? (
              <Text style={styles.addButtonSubtext}>Total charge: {formatCurrencyExact(feeData.grossAmount + feeData.totalFees)}</Text>
            ) : (
              <Text style={styles.addButtonSubtext}>Enter an amount to see fees & projection</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    ...colors.shadow,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  heroCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroBalanceBlock: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  heroBalance: {
    fontSize: 30,
    fontWeight: '900' as const,
    color: colors.text,
    letterSpacing: -0.8,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(25, 197, 52, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(25, 197, 52, 0.24)',
  },
  heroChipText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.text,
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
    opacity: 0.8,
  },
  heroSteps: {
    gap: 10,
  },
  heroStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroStepDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  heroStepText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },

  section: {
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: colors.text,
  },
  sectionCaption: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },

  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dollarSign: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800' as const,
    color: colors.text,
    paddingVertical: 0,
  },
  amountMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  minAmountText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  netAmountHint: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.primary,
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  chartMetric: {
    flex: 1,
  },
  chartMetricRight: {
    alignItems: 'flex-end',
  },
  chartMetricLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  chartMetricValue: {
    fontSize: 18,
    fontWeight: '900' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  chartMetricValueAccent: {
    fontSize: 18,
    fontWeight: '900' as const,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  chartCanvasRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  chartLegend: {
    flex: 1,
  },
  chartLegendTitle: {
    fontSize: 12,
    fontWeight: '900' as const,
    color: colors.text,
    marginBottom: 6,
  },
  chartLegendText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  chartLegendFine: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.textTertiary,
    lineHeight: 14,
  },

  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  presetChip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(47, 51, 54, 0.9)',
  },
  presetChipActive: {
    borderColor: 'rgba(25, 197, 52, 0.55)',
  },
  presetTitle: {
    fontSize: 12.5,
    fontWeight: '900' as const,
    color: colors.text,
    marginBottom: 4,
  },
  presetTitleActive: {
    color: colors.primary,
  },
  presetSub: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    lineHeight: 14,
  },

  methodOptions: {
    gap: 12,
  },
  methodOption: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(25, 197, 52, 0.08)',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
  },
  methodTitleActive: {
    color: colors.primary,
  },
  methodSubtext: {
    fontSize: 12.5,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.infoLight,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(29, 155, 240, 0.22)',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '900' as const,
    color: colors.info,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12.5,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    ...colors.shadowMedium,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '900' as const,
    color: colors.white,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  addButtonSubtext: {
    fontSize: 12.5,
    fontWeight: '700' as const,
    color: 'rgba(255, 255, 255, 0.82)',
  },
});
