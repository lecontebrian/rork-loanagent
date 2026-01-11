import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  PiggyBank, 
  ArrowUpRight,
  ChevronRight,
  Calendar,
  BarChart3,
  CircleDollarSign,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useP2PWallet } from '@/contexts/P2PWalletContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ViewMode = 'overview' | 'investments' | 'earnings';
type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';

const generateMonthlyData = (months: number = 12) => {
  const data = [];
  let cumulative = 0;
  for (let i = 0; i < months; i++) {
    const monthReturn = Math.random() * 3 + 0.5;
    cumulative += monthReturn;
    data.push({
      month: new Date(Date.now() - (months - 1 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
      return: monthReturn,
      cumulative,
    });
  }
  return data;
};

export default function P2PPortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, totalInvested, myInvestments, transactions, linkedBanks } = useP2PWallet();
  
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const monthlyData = useMemo(() => generateMonthlyData(12), []);
  
  const investmentTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'investment' && t.status === 'completed');
  }, [transactions]);

  const totalEarnings = useMemo(() => {
    return investmentTransactions.reduce((sum, t) => {
      const loan = myInvestments.find(l => l.id === t.loanId);
      if (loan) {
        const monthsInvested = Math.floor((Date.now() - new Date(t.date).getTime()) / (30 * 24 * 60 * 60 * 1000));
        return sum + (t.amount * loan.interestRate / 100 * monthsInvested / 12);
      }
      return sum;
    }, 0);
  }, [investmentTransactions, myInvestments]);

  const currentValue = totalInvested + totalEarnings;
  const totalROI = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
  const avgMonthlyReturn = monthlyData.length > 0 
    ? monthlyData.reduce((sum, d) => sum + d.return, 0) / monthlyData.length 
    : 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const maxReturn = Math.max(...monthlyData.map(d => d.return), 1);

  const renderOverviewTab = () => (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.portfolioValueCard}>
        <LinearGradient
          colors={['#0A84FF', '#5E5CE6', '#BF5AF2']}
          style={styles.portfolioValueGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.portfolioValueHeader}>
            <Text style={styles.portfolioValueLabel}>Portfolio Value</Text>
            <View style={[styles.roiBadge, totalROI >= 0 ? styles.roiBadgePositive : styles.roiBadgeNegative]}>
              {totalROI >= 0 ? (
                <TrendingUp color="#34C759" size={12} strokeWidth={2.5} />
              ) : (
                <TrendingDown color="#FF3B30" size={12} strokeWidth={2.5} />
              )}
              <Text style={[styles.roiBadgeText, { color: totalROI >= 0 ? '#34C759' : '#FF3B30' }]}>
                {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
              </Text>
            </View>
          </View>
          <Text style={styles.portfolioValueAmount}>${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          
          <View style={styles.portfolioStatsRow}>
            <View style={styles.portfolioStatItem}>
              <Text style={styles.portfolioStatLabel}>Total Invested</Text>
              <Text style={styles.portfolioStatValue}>${totalInvested.toLocaleString()}</Text>
            </View>
            <View style={styles.portfolioStatDivider} />
            <View style={styles.portfolioStatItem}>
              <Text style={styles.portfolioStatLabel}>Total Earnings</Text>
              <Text style={[styles.portfolioStatValue, { color: '#34C759' }]}>
                +${totalEarnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.quickActionsRow}>
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => router.push('/p2p/withdraw')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
            <Building2 color={colors.success} size={22} strokeWidth={2} />
          </View>
          <Text style={styles.quickActionTitle}>Withdraw</Text>
          <Text style={styles.quickActionSubtitle}>To Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => router.push('/p2p/add-funds')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
            <CircleDollarSign color={colors.primary} size={22} strokeWidth={2} />
          </View>
          <Text style={styles.quickActionTitle}>Add Funds</Text>
          <Text style={styles.quickActionSubtitle}>Invest More</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => router.push('/p2p-marketplace')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(175, 82, 222, 0.15)' }]}>
            <PiggyBank color="#AF52DE" size={22} strokeWidth={2} />
          </View>
          <Text style={styles.quickActionTitle}>Browse</Text>
          <Text style={styles.quickActionSubtitle}>New Loans</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Monthly Returns</Text>
          <View style={styles.timeRangeRow}>
            {(['1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.timeRangeChip, timeRange === range && styles.timeRangeChipActive]}
                onPress={() => setTimeRange(range)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.barChart}>
            {monthlyData.map((data, index) => (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { 
                        height: `${(data.return / maxReturn) * 100}%`,
                        backgroundColor: data.return >= avgMonthlyReturn ? colors.success : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{data.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Above Avg</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Below Avg</Text>
          </View>
          <Text style={styles.legendAvg}>Avg: {avgMonthlyReturn.toFixed(2)}%/mo</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <TrendingUp color={colors.success} size={18} strokeWidth={2.5} />
          </View>
          <Text style={styles.metricValue}>{avgMonthlyReturn.toFixed(2)}%</Text>
          <Text style={styles.metricLabel}>Avg Monthly</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <ArrowUpRight color={colors.primary} size={18} strokeWidth={2.5} />
          </View>
          <Text style={styles.metricValue}>{Math.max(...monthlyData.map(d => d.return)).toFixed(2)}%</Text>
          <Text style={styles.metricLabel}>Best Month</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <BarChart3 color="#AF52DE" size={18} strokeWidth={2.5} />
          </View>
          <Text style={styles.metricValue}>{myInvestments.length}</Text>
          <Text style={styles.metricLabel}>Active Loans</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <Calendar color={colors.warning} size={18} strokeWidth={2.5} />
          </View>
          <Text style={styles.metricValue}>{totalROI.toFixed(1)}%</Text>
          <Text style={styles.metricLabel}>Total ROI</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderInvestmentsTab = () => (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.investmentSummary}>
        <View style={styles.investmentSummaryItem}>
          <Text style={styles.investmentSummaryValue}>${totalInvested.toLocaleString()}</Text>
          <Text style={styles.investmentSummaryLabel}>Principal</Text>
        </View>
        <View style={styles.investmentSummaryDivider} />
        <View style={styles.investmentSummaryItem}>
          <Text style={[styles.investmentSummaryValue, { color: colors.success }]}>+${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.investmentSummaryLabel}>Earnings</Text>
        </View>
        <View style={styles.investmentSummaryDivider} />
        <View style={styles.investmentSummaryItem}>
          <Text style={styles.investmentSummaryValue}>{myInvestments.length}</Text>
          <Text style={styles.investmentSummaryLabel}>Loans</Text>
        </View>
      </View>

      {investmentTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <PiggyBank color={colors.textTertiary} size={48} strokeWidth={1.5} />
          <Text style={styles.emptyStateTitle}>No investments yet</Text>
          <Text style={styles.emptyStateText}>Start investing in P2P loans to see your portfolio here</Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => router.push('/p2p-marketplace')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyStateButtonText}>Browse Loans</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.investmentsList}>
          {investmentTransactions.map((transaction) => {
            const loan = myInvestments.find(l => l.id === transaction.loanId);
            const monthsInvested = Math.floor((Date.now() - new Date(transaction.date).getTime()) / (30 * 24 * 60 * 60 * 1000));
            const earnings = loan ? transaction.amount * loan.interestRate / 100 * monthsInvested / 12 : 0;
            const currentVal = transaction.amount + earnings;
            const roi = (earnings / transaction.amount) * 100;

            return (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.investmentCard,
                  selectedInvestment === transaction.id && styles.investmentCardSelected,
                ]}
                onPress={() => setSelectedInvestment(
                  selectedInvestment === transaction.id ? null : transaction.id
                )}
                activeOpacity={0.9}
              >
                <View style={styles.investmentCardHeader}>
                  <View style={styles.investmentBorrower}>
                    <View style={styles.borrowerAvatar}>
                      <Text style={styles.borrowerInitial}>{transaction.counterparty[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.investmentBorrowerName}>{transaction.counterparty}</Text>
                      <Text style={styles.investmentPurpose}>{transaction.note}</Text>
                    </View>
                  </View>
                  <View style={styles.investmentStatus}>
                    {loan?.status === 'funded' || loan?.status === 'active' ? (
                      <CheckCircle color={colors.success} size={16} strokeWidth={2.5} />
                    ) : (
                      <Clock color={colors.warning} size={16} strokeWidth={2.5} />
                    )}
                    <Text style={[
                      styles.investmentStatusText,
                      { color: loan?.status === 'funded' || loan?.status === 'active' ? colors.success : colors.warning }
                    ]}>
                      {loan?.status === 'funded' ? 'Active' : loan?.status || 'Funding'}
                    </Text>
                  </View>
                </View>

                <View style={styles.investmentAmounts}>
                  <View style={styles.investmentAmountItem}>
                    <Text style={styles.investmentAmountLabel}>Invested</Text>
                    <Text style={styles.investmentAmountValue}>${transaction.amount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.investmentAmountItem}>
                    <Text style={styles.investmentAmountLabel}>Current Value</Text>
                    <Text style={[styles.investmentAmountValue, { color: colors.success }]}>
                      ${currentVal.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.investmentAmountItem}>
                    <Text style={styles.investmentAmountLabel}>ROI</Text>
                    <View style={styles.roiPill}>
                      <ArrowUpRight color={colors.success} size={12} strokeWidth={2.5} />
                      <Text style={styles.roiPillText}>+{roi.toFixed(1)}%</Text>
                    </View>
                  </View>
                </View>

                {selectedInvestment === transaction.id && (
                  <View style={styles.investmentDetails}>
                    <View style={styles.investmentDetailRow}>
                      <Text style={styles.investmentDetailLabel}>Interest Rate</Text>
                      <Text style={styles.investmentDetailValue}>{loan?.interestRate || 0}% APR</Text>
                    </View>
                    <View style={styles.investmentDetailRow}>
                      <Text style={styles.investmentDetailLabel}>Term</Text>
                      <Text style={styles.investmentDetailValue}>{loan?.termMonths || 0} months</Text>
                    </View>
                    <View style={styles.investmentDetailRow}>
                      <Text style={styles.investmentDetailLabel}>Months Active</Text>
                      <Text style={styles.investmentDetailValue}>{monthsInvested} months</Text>
                    </View>
                    <View style={styles.investmentDetailRow}>
                      <Text style={styles.investmentDetailLabel}>Earned So Far</Text>
                      <Text style={[styles.investmentDetailValue, { color: colors.success }]}>+${earnings.toFixed(2)}</Text>
                    </View>
                    <View style={styles.investmentDetailRow}>
                      <Text style={styles.investmentDetailLabel}>Projected Total</Text>
                      <Text style={styles.investmentDetailValue}>
                        ${(transaction.amount * (1 + (loan?.interestRate || 0) / 100 * (loan?.termMonths || 0) / 12)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.investmentCardFooter}>
                  <Text style={styles.investmentDate}>
                    Invested {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                  <ChevronRight 
                    color={colors.textSecondary} 
                    size={16} 
                    strokeWidth={2}
                    style={{ transform: [{ rotate: selectedInvestment === transaction.id ? '90deg' : '0deg' }] }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </Animated.View>
  );

  const renderEarningsTab = () => (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.earningsOverview}>
        <LinearGradient
          colors={['rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)']}
          style={styles.earningsGradient}
        >
          <View style={styles.earningsHeader}>
            <TrendingUp color={colors.success} size={24} strokeWidth={2} />
            <Text style={styles.earningsTitle}>Total Earnings</Text>
          </View>
          <Text style={styles.earningsAmount}>+${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.earningsSubtext}>From {investmentTransactions.length} investments</Text>
        </LinearGradient>
      </View>

      <View style={styles.withdrawSection}>
        <Text style={styles.sectionTitle}>Withdraw Earnings</Text>
        <View style={styles.withdrawCard}>
          <View style={styles.withdrawInfo}>
            <Text style={styles.withdrawLabel}>Available to Withdraw</Text>
            <Text style={styles.withdrawAmount}>${balance.toFixed(2)}</Text>
            <Text style={styles.withdrawNote}>Earnings + Wallet Balance</Text>
          </View>
          
          {linkedBanks.length > 0 ? (
            <View style={styles.withdrawBankInfo}>
              <Building2 color={colors.textSecondary} size={18} strokeWidth={2} />
              <Text style={styles.withdrawBankText}>
                {linkedBanks[0].bankName} ••{linkedBanks[0].last4}
              </Text>
            </View>
          ) : (
            <View style={styles.withdrawBankInfo}>
              <AlertCircle color={colors.warning} size={18} strokeWidth={2} />
              <Text style={[styles.withdrawBankText, { color: colors.warning }]}>
                Link a bank account to withdraw
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => router.push('/p2p/withdraw')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#34C759', '#30B350']}
              style={styles.withdrawButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
              <ChevronRight color={colors.white} size={18} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.earningsBreakdown}>
        <Text style={styles.sectionTitle}>Earnings by Investment</Text>
        {investmentTransactions.map((transaction) => {
          const loan = myInvestments.find(l => l.id === transaction.loanId);
          const monthsInvested = Math.floor((Date.now() - new Date(transaction.date).getTime()) / (30 * 24 * 60 * 60 * 1000));
          const earnings = loan ? transaction.amount * loan.interestRate / 100 * monthsInvested / 12 : 0;

          return (
            <View key={transaction.id} style={styles.earningsItem}>
              <View style={styles.earningsItemLeft}>
                <View style={styles.earningsItemAvatar}>
                  <Text style={styles.earningsItemInitial}>{transaction.counterparty[0]}</Text>
                </View>
                <View>
                  <Text style={styles.earningsItemName}>{transaction.counterparty}</Text>
                  <Text style={styles.earningsItemRate}>{loan?.interestRate || 0}% APR</Text>
                </View>
              </View>
              <View style={styles.earningsItemRight}>
                <Text style={styles.earningsItemAmount}>+${earnings.toFixed(2)}</Text>
                <Text style={styles.earningsItemPrincipal}>on ${transaction.amount.toLocaleString()}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        <LinearGradient
          colors={["#050607", "#0B0D10", "#050607"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.bgOrb1} pointerEvents="none" />
        <View style={styles.bgOrb2} pointerEvents="none" />

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
              <Text style={styles.headerTitle}>My Portfolio</Text>
              <Text style={styles.headerSubtitle}>Track your P2P investments</Text>
            </View>
            <TouchableOpacity
              style={styles.walletButton}
              onPress={() => router.push('/p2p-wallet')}
              activeOpacity={0.7}
            >
              <Wallet color={colors.text} size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            {(['overview', 'investments', 'earnings'] as ViewMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.tab, viewMode === mode && styles.tabActive]}
                onPress={() => setViewMode(mode)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, viewMode === mode && styles.tabTextActive]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {viewMode === 'overview' && renderOverviewTab()}
            {viewMode === 'investments' && renderInvestmentsTab()}
            {viewMode === 'earnings' && renderEarningsTab()}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgOrb1: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -160,
    right: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(52, 199, 89, 0.10)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 24, 28, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(47, 51, 54, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  walletButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 24, 28, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(47, 51, 54, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(14, 16, 20, 0.92)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.3)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  portfolioValueCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  portfolioValueGradient: {
    padding: 24,
  },
  portfolioValueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioValueLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roiBadgePositive: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  roiBadgeNegative: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  roiBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  portfolioValueAmount: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -1,
    marginBottom: 20,
  },
  portfolioStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  portfolioStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  portfolioStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  portfolioStatLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  portfolioStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  chartSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  timeRangeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  timeRangeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
  },
  timeRangeChipActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  timeRangeTextActive: {
    color: colors.white,
  },
  chartContainer: {
    height: 140,
    marginBottom: 16,
  },
  barChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: '500' as const,
    color: colors.textTertiary,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  legendAvg: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  investmentSummary: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  investmentSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  investmentSummaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  investmentSummaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  investmentSummaryLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.white,
  },
  investmentsList: {
    gap: 14,
  },
  investmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  investmentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(10, 132, 255, 0.05)',
  },
  investmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  investmentBorrower: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  borrowerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borrowerInitial: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
  },
  investmentBorrowerName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  investmentPurpose: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 2,
  },
  investmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  investmentStatusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  investmentAmounts: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  investmentAmountItem: {
    flex: 1,
    alignItems: 'center',
  },
  investmentAmountLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  investmentAmountValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
  },
  roiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roiPillText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.success,
  },
  investmentDetails: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  investmentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentDetailLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  investmentDetailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },
  investmentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentDate: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
  },
  earningsOverview: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  earningsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  earningsAmount: {
    fontSize: 44,
    fontWeight: '800' as const,
    color: colors.success,
    letterSpacing: -1,
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  withdrawSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 14,
  },
  withdrawCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  withdrawInfo: {
    marginBottom: 16,
  },
  withdrawLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  withdrawAmount: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  withdrawNote: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    marginTop: 4,
  },
  withdrawBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  withdrawBankText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
  },
  withdrawButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  withdrawButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  earningsBreakdown: {
    marginBottom: 20,
  },
  earningsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  earningsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  earningsItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsItemInitial: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  earningsItemName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  earningsItemRate: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 2,
  },
  earningsItemRight: {
    alignItems: 'flex-end',
  },
  earningsItemAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.success,
  },
  earningsItemPrincipal: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
