import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Share, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, TrendingDown, TrendingUp, Wallet, ShoppingBag, Home, Car, Coffee, ChevronRight, Calendar, Download, Share2, Bell, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { BudgetCategory, Transaction } from '@/types';

const sampleCategories: BudgetCategory[] = [
  { id: 'housing', name: 'Housing', icon: 'home', budgeted: 1800, spent: 1800, color: '#FF375F' },
  { id: 'transport', name: 'Transportation', icon: 'car', budgeted: 500, spent: 380, color: '#0A84FF' },
  { id: 'food', name: 'Food & Dining', icon: 'coffee', budgeted: 600, spent: 520, color: '#FF9500' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping', budgeted: 400, spent: 285, color: '#BF5AF2' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'wallet', budgeted: 350, spent: 340, color: '#30D158' },
];

const sampleTransactions: Transaction[] = [
  { id: '1', date: new Date().toISOString(), description: 'Rent Payment', amount: 1800, category: 'housing', type: 'expense' },
  { id: '2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'Grocery Store', amount: 125, category: 'food', type: 'expense' },
  { id: '3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Gas Station', amount: 65, category: 'transport', type: 'expense' },
  { id: '4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Salary Deposit', amount: 5000, category: 'income', type: 'income' },
  { id: '5', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), description: 'Online Shopping', amount: 145, category: 'shopping', type: 'expense' },
];

export default function BudgetTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categories] = useState(sampleCategories);
  const [transactions] = useState(sampleTransactions);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions'>('overview');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalBudgeted - totalSpent;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  const getIconForCategory = (icon: string) => {
    switch (icon) {
      case 'home': return Home;
      case 'car': return Car;
      case 'coffee': return Coffee;
      case 'shopping': return ShoppingBag;
      default: return Wallet;
    }
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
            <Text style={styles.headerTitle}>Budget Tracker</Text>
            <Text style={styles.headerSubtitle}>Manage Your Money</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Plus,
                label: 'Add Transaction',
                onPress: () => Alert.alert('Add Transaction', 'Record a new expense or income'),
                color: colors.primary,
              },
              {
                icon: Download,
                label: 'Export Report',
                onPress: () => Alert.alert('Export', 'Download your budget report as PDF'),
                color: colors.success,
              },
              {
                icon: Share2,
                label: 'Share Budget',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out my budget tracking!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.info,
              },
              {
                icon: Bell,
                label: 'Budget Alerts',
                onPress: () => Alert.alert('Alerts', 'Manage budget threshold notifications'),
                color: colors.warning,
              },
              {
                icon: Settings,
                label: 'Budget Settings',
                onPress: () => router.push('/settings' as any),
                color: colors.textSecondary,
              },
            ]}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['#30D158', '#28B349']}
              style={styles.summaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Total Budget</Text>
                <View style={styles.summaryPeriod}>
                  <Calendar color={colors.white} size={14} strokeWidth={2.5} />
                  <Text style={styles.summaryPeriodText}>This Month</Text>
                </View>
              </View>
              <Text style={styles.summaryAmount}>${totalBudgeted.toLocaleString()}</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <TrendingDown color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2.5} />
                  <Text style={styles.summaryStatLabel}>Spent</Text>
                  <Text style={styles.summaryStatValue}>${totalSpent.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStatItem}>
                  <TrendingUp color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2.5} />
                  <Text style={styles.summaryStatLabel}>Remaining</Text>
                  <Text style={styles.summaryStatValue}>${remaining.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(totalSpent / totalBudgeted) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {((totalSpent / totalBudgeted) * 100).toFixed(0)}% of budget used
              </Text>
            </LinearGradient>
          </Animated.View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Monthly Income</Text>
              <Text style={styles.metricValue}>${totalIncome.toLocaleString()}</Text>
              <View style={styles.metricBadge}>
                <TrendingUp color={colors.success} size={14} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Savings Rate</Text>
              <Text style={styles.metricValue}>{savingsRate.toFixed(1)}%</Text>
              <View style={styles.metricBadge}>
                <Wallet color={colors.primary} size={14} strokeWidth={2.5} />
              </View>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
              onPress={() => setSelectedTab('overview')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
                Categories
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'transactions' && styles.tabActive]}
              onPress={() => setSelectedTab('transactions')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === 'transactions' && styles.tabTextActive]}>
                Transactions
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'overview' ? (
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Budget Categories</Text>
              {categories.map((category) => {
                const IconComponent = getIconForCategory(category.icon);
                const percentage = (category.spent / category.budgeted) * 100;
                const isOverBudget = percentage > 100;

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    activeOpacity={0.85}
                  >
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                          <IconComponent color={category.color} size={20} strokeWidth={2.5} />
                        </View>
                        <View>
                          <Text style={styles.categoryName}>{category.name}</Text>
                          <Text style={styles.categoryBudget}>
                            ${category.spent.toLocaleString()} of ${category.budgeted.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.categoryRight}>
                        <Text style={[styles.categoryPercentage, isOverBudget && styles.categoryPercentageOver]}>
                          {percentage.toFixed(0)}%
                        </Text>
                        <ChevronRight color={colors.textTertiary} size={18} strokeWidth={2} />
                      </View>
                    </View>
                    <View style={styles.categoryProgressBar}>
                      <View
                        style={[
                          styles.categoryProgressFill,
                          { width: `${Math.min(percentage, 100)}%`, backgroundColor: isOverBudget ? colors.error : category.color }
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.transactionsContainer}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === 'income';
                return (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionLeft}>
                      <View
                        style={[
                          styles.transactionIcon,
                          { backgroundColor: isIncome ? colors.successLight : colors.errorLight }
                        ]}
                      >
                        {isIncome ? (
                          <TrendingUp color={colors.success} size={18} strokeWidth={2.5} />
                        ) : (
                          <TrendingDown color={colors.error} size={18} strokeWidth={2.5} />
                        )}
                      </View>
                      <View>
                        <Text style={styles.transactionDescription}>{transaction.description}</Text>
                        <Text style={styles.transactionDate}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        { color: isIncome ? colors.success : colors.error }
                      ]}
                    >
                      {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 40 }} />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
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
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  summaryCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  summaryGradient: {
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: -0.2,
  },
  summaryPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
  },
  summaryPeriodText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  summaryAmount: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  summaryStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryStatLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative' as const,
    ...colors.shadow,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  metricBadge: {
    position: 'absolute' as const,
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    padding: 4,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  categoryBudget: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  categoryPercentageOver: {
    color: colors.error,
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  transactionsContainer: {
    gap: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  transactionDate: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
});
