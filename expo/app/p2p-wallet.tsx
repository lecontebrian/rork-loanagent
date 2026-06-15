import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Plus, TrendingUp, Wallet, Info, ArrowDownFromLine, Percent, SendHorizontal, HandCoins } from 'lucide-react-native';
import colors from '@/constants/colors';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useP2PWallet } from '@/contexts/P2PWalletContext';
import { formatCurrencyExact } from '@/constants/fees';

const { width } = Dimensions.get('window');

export default function P2PWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, totalSent, totalReceived, transactions, myInvestments } = useP2PWallet();

  const userId = 'current-user';

  const last30DaysData = useMemo(() => {
    const days = 30;
    const data = Array(days).fill(0);
    const today = new Date();
    
    transactions.forEach(txn => {
      const txnDate = new Date(txn.date);
      const daysDiff = Math.floor((today.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < days) {
        const index = days - 1 - daysDiff;
        if (txn.type === 'received' && txn.status === 'completed') {
          data[index] += txn.netAmount;
        } else if (txn.type === 'sent' && txn.status === 'completed') {
          data[index] -= txn.amount;
        }
      }
    });

    let runningBalance = balance;
    for (let i = data.length - 1; i >= 0; i--) {
      runningBalance -= data[i];
      data[i] = runningBalance;
    }
    
    return data;
  }, [transactions, balance]);

  const maxBalance = Math.max(...last30DaysData, balance);
  const minBalance = Math.min(...last30DaysData, 0);
  const range = maxBalance - minBalance || 1;

  const netChange30Days = useMemo(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentTxns = transactions.filter(txn => new Date(txn.date) >= thirtyDaysAgo);
    
    const received = recentTxns
      .filter(t => t.type === 'received' && t.status === 'completed')
      .reduce((sum, t) => sum + t.netAmount, 0);
    
    const sent = recentTxns
      .filter(t => t.type === 'sent' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount + t.totalFees), 0);
    
    return received - sent;
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  const investmentPerformance = useMemo(() => {
    const months = 12;
    const now = new Date();
    const monthKeys: { key: string; label: string; start: Date; end: Date }[] = [];

    for (let i = months - 1; i >= 0; i--) {
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
          if (loan.status === 'completed') {
            total += inv.amount * monthlyRate;
            return;
          }
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

    const maxReturn = Math.max(...monthlyReturns.map((m) => m.value), 1);

    return {
      monthlyReturns,
      totalInvestedAmount,
      totalEarned12m,
      roi12m,
      maxReturn,
    };
  }, [myInvestments]);

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
            <ArrowLeft color={colors.text} size={21} strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>P2P Wallet</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Info color={colors.textSecondary} size={19} strokeWidth={2.25} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        >
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#1E40AF', '#3B82F6', '#60A5FA']}
              style={styles.balanceGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceHeader}>
                <Wallet color={colors.white} size={25} strokeWidth={2.25} />
                <Text style={styles.balanceLabel}>Available Balance</Text>
              </View>
              
              <Text style={styles.balanceAmount}>{formatCurrencyExact(balance)}</Text>
              
              <View style={styles.balanceStats}>
                <View style={styles.balanceStat}>
                  <ArrowDownRight color={colors.white} size={16} strokeWidth={2.35} />
                  <View style={styles.balanceStatContent}>
                    <Text style={styles.balanceStatLabel}>Received</Text>
                    <Text style={styles.balanceStatValue}>{formatCurrencyExact(totalReceived)}</Text>
                  </View>
                </View>
                <View style={styles.balanceStatDivider} />
                <View style={styles.balanceStat}>
                  <ArrowUpRight color={colors.white} size={16} strokeWidth={2.35} />
                  <View style={styles.balanceStatContent}>
                    <Text style={styles.balanceStatLabel}>Sent</Text>
                    <Text style={styles.balanceStatValue}>{formatCurrencyExact(totalSent)}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.actionButtons} testID="p2pWalletActions">
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/p2p/send' as any)}
              activeOpacity={0.8}
              testID="p2pWalletSend"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <SendHorizontal color={colors.primary} size={19} strokeWidth={2.35} />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/p2p/request' as any)}
              activeOpacity={0.8}
              testID="p2pWalletRequest"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                <HandCoins color={colors.success} size={19} strokeWidth={2.35} />
              </View>
              <Text style={styles.actionText}>Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/p2p/add-funds' as any)}
              activeOpacity={0.8}
              testID="p2pWalletAddFunds"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
                <Plus color={colors.info} size={19} strokeWidth={2.45} />
              </View>
              <Text style={styles.actionText}>Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/p2p/withdraw' as any)}
              activeOpacity={0.8}
              testID="p2pWalletWithdraw"
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }] }>
                <ArrowDownFromLine color={colors.warning} size={19} strokeWidth={2.35} />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard} testID="p2pWalletBalanceTrend">
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Balance Trend</Text>
              <View style={styles.chartLegend}>
                <TrendingUp color={netChange30Days >= 0 ? colors.success : colors.error} size={16} strokeWidth={2.3} />
                <Text style={[styles.chartChange, { color: netChange30Days >= 0 ? colors.success : colors.error }]}>
                  {netChange30Days >= 0 ? '+' : ''}{formatCurrencyExact(netChange30Days)} (30d)
                </Text>
              </View>
            </View>
            
            <View style={styles.chart} testID="p2pWalletBalanceChart">
              {last30DaysData.map((value, index) => {
                const heightPercent = ((value - minBalance) / range) * 100;
                const isLast = index === last30DaysData.length - 1;
                
                return (
                  <View key={index} style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height: `${Math.max(heightPercent, 2)}%`,
                          backgroundColor: isLast ? colors.primary : 'rgba(59, 130, 246, 0.3)',
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
            
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>30d ago</Text>
              <Text style={styles.chartLabel}>Today</Text>
            </View>
          </View>

          <View style={styles.investmentCard} testID="p2pWalletInvestmentPerformance">
            <View style={styles.investmentHeader}>
              <View style={styles.investmentTitleRow}>
                <Text style={styles.investmentTitle}>Month-to-Month Returns</Text>
                <View style={styles.roiPill}>
                  <Percent color={colors.success} size={14} strokeWidth={2.35} />
                  <Text style={styles.roiPillText}>{investmentPerformance.roi12m.toFixed(2)}% ROI (12m)</Text>
                </View>
              </View>
              <Text style={styles.investmentSubtitle}>
                {investmentPerformance.totalInvestedAmount > 0
                  ? `Estimated earnings: ${formatCurrencyExact(investmentPerformance.totalEarned12m)} over the last 12 months`
                  : 'Invest in loans to start tracking returns'}
              </Text>
            </View>

            <View style={styles.returnsChart}>
              {investmentPerformance.monthlyReturns.map((m, idx) => {
                const height = (m.value / investmentPerformance.maxReturn) * 100;
                const showLabel = idx === 0 || idx === investmentPerformance.monthlyReturns.length - 1 || idx % 3 === 0;
                return (
                  <View key={m.key} style={styles.returnsBarCol}>
                    <View style={styles.returnsBarTrack}>
                      <View
                        style={[
                          styles.returnsBarFill,
                          {
                            height: `${Math.max(height, m.value > 0 ? 6 : 2)}%`,
                            backgroundColor: m.value > 0 ? 'rgba(34, 197, 94, 0.85)' : 'rgba(148, 163, 184, 0.25)',
                          },
                        ]}
                      />
                    </View>
                    {showLabel ? <Text style={styles.returnsLabel}>{m.label}</Text> : <Text style={styles.returnsLabelSpacer}> </Text>}
                  </View>
                );
              })}
            </View>

            <View style={styles.investmentSummaryRow}>
              <View style={styles.investmentMetric}>
                <Text style={styles.investmentMetricLabel}>Invested</Text>
                <Text style={styles.investmentMetricValue}>{formatCurrencyExact(investmentPerformance.totalInvestedAmount)}</Text>
              </View>
              <View style={styles.investmentMetricDivider} />
              <View style={styles.investmentMetric}>
                <Text style={styles.investmentMetricLabel}>Est. 12m Return</Text>
                <Text style={[styles.investmentMetricValue, { color: colors.success }]}>+{formatCurrencyExact(investmentPerformance.totalEarned12m)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/p2p/history' as any)} testID="p2pWalletSeeAll">
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Wallet color={colors.textTertiary} size={44} strokeWidth={1.75} />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Send or receive money to see your activity here
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {recentTransactions.map((txn) => (
                <TouchableOpacity
                  key={txn.id}
                  style={styles.transactionItem}
                  onPress={() => router.push(`/p2p/transaction/${txn.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.transactionIcon,
                    {
                      backgroundColor: txn.type === 'sent'
                        ? colors.error + '20'
                        : txn.type === 'pending'
                        ? colors.warning + '20'
                        : colors.success + '20',
                    },
                  ]}>
                    {txn.type === 'sent' ? (
                      <ArrowUpRight
                        color={colors.error}
                        size={17}
                        strokeWidth={2.35}
                      />
                    ) : (
                      <ArrowDownRight
                        color={txn.type === 'pending' ? colors.warning : colors.success}
                        size={17}
                        strokeWidth={2.35}
                      />
                    )}
                  </View>
                  
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionCounterparty}>{txn.counterparty}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(txn.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {txn.note && ` • ${txn.note}`}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionAmount}>
                    <Text
                      style={[
                        styles.transactionAmountText,
                        {
                          color: txn.type === 'sent'
                            ? colors.error
                            : txn.type === 'pending'
                            ? colors.warning
                            : colors.success,
                        },
                      ]}
                    >
                      {txn.type === 'sent' ? '-' : '+'}
                      {formatCurrencyExact(txn.type === 'sent' ? txn.amount : txn.netAmount)}
                    </Text>
                    {txn.status === 'pending' && (
                      <Text style={styles.transactionStatus}>Pending</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.feesLink}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Info color={colors.textSecondary} size={16} strokeWidth={2.25} />
            <Text style={styles.feesLinkText}>Fees & Limits</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(17,24,39,0.08)', ...colors.shadow },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  infoButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(17,24,39,0.08)' },
  scrollContent: { paddingHorizontal: 20 },
  balanceCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 24, ...colors.shadowMedium },
  balanceGradient: { padding: 24 },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  balanceLabel: { fontSize: 15, fontWeight: '600' as const, color: 'rgba(255,255,255,0.9)' },
  balanceAmount: { fontSize: 40, fontWeight: '800' as const, color: colors.white, marginBottom: 20, letterSpacing: -1 },
  balanceStats: { flexDirection: 'row', alignItems: 'center' },
  balanceStat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceStatContent: { flex: 1 },
  balanceStatLabel: { fontSize: 12, fontWeight: '500' as const, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  balanceStatValue: { fontSize: 16, fontWeight: '700' as const, color: colors.white },
  balanceStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 16 },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  actionButton: { width: (width - 40 - 12) / 2, alignItems: 'center', paddingVertical: 16, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  actionIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(17,24,39,0.06)' },
  actionText: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
  chartCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  chartLegend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chartChange: { fontSize: 14, fontWeight: '600' as const },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 2, marginBottom: 8 },
  chartBar: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  chartBarFill: { width: '100%', borderRadius: 2, minHeight: 2 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { fontSize: 11, fontWeight: '500' as const, color: colors.textTertiary },
  investmentCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  investmentHeader: { marginBottom: 14 },
  investmentTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 },
  investmentTitle: { fontSize: 16, fontWeight: '800' as const, color: colors.text, flex: 1 },
  roiPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.28)' },
  roiPillText: { fontSize: 12, fontWeight: '700' as const, color: colors.success },
  investmentSubtitle: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary, lineHeight: 18 },
  returnsChart: { flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 6, paddingTop: 6, marginBottom: 12 },
  returnsBarCol: { flex: 1, alignItems: 'center' },
  returnsBarTrack: { width: '100%', flex: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(148,163,184,0.10)', justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' },
  returnsBarFill: { width: '100%', borderRadius: 10 },
  returnsLabel: { fontSize: 10, fontWeight: '600' as const, color: colors.textTertiary, marginTop: 6 },
  returnsLabelSpacer: { fontSize: 10, marginTop: 6, color: 'transparent' },
  investmentSummaryRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, paddingHorizontal: 14 },
  investmentMetric: { flex: 1 },
  investmentMetricLabel: { fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary, marginBottom: 4 },
  investmentMetricValue: { fontSize: 16, fontWeight: '800' as const, color: colors.text },
  investmentMetricDivider: { width: 1, height: 36, backgroundColor: colors.border, marginHorizontal: 14 },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  transactionsTitle: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  seeAllLink: { fontSize: 14, fontWeight: '600' as const, color: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 16, fontWeight: '600' as const, color: colors.textSecondary, marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, fontWeight: '400' as const, color: colors.textTertiary, textAlign: 'center', paddingHorizontal: 40 },
  transactionsList: { gap: 0 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  transactionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(17,24,39,0.05)' },
  transactionContent: { flex: 1 },
  transactionCounterparty: { fontSize: 15, fontWeight: '600' as const, color: colors.text, marginBottom: 3 },
  transactionDate: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  transactionAmount: { alignItems: 'flex-end' },
  transactionAmountText: { fontSize: 16, fontWeight: '700' as const, marginBottom: 2 },
  transactionStatus: { fontSize: 11, fontWeight: '500' as const, color: colors.warning },
  feesLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 16, marginTop: 16 },
  feesLinkText: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary },
});
