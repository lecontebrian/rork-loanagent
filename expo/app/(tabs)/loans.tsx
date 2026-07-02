import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/contexts/ThemeContext';
import { LoanCard } from '@/components/LoanCard';
import { GlassCard } from '@/components/GlassCard';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { loans } from '@/mocks/loanData';
import { formatCurrency } from '@/utils/formatters';

type FilterType = 'all' | 'active' | 'mortgage' | 'auto' | 'personal';

export default function LoansScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredLoans = loans.filter((loan) => {
    if (filter === 'all') return true;
    if (filter === 'active') return loan.status === 'active';
    return loan.type === filter;
  });

  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalMonthly = loans.reduce((sum, l) => sum + l.monthlyPayment, 0);

  const handleFilter = (f: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(f);
  };

  const handleLoanPress = (loanId: string) => {
    router.push(`/loan-detail?id=${loanId}`);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'mortgage', label: 'Mortgage' },
    { id: 'auto', label: 'Auto' },
    { id: 'personal', label: 'Personal' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <Text style={[Typography.title1, { color: theme.text }]}>My Loans</Text>
          <Text style={[Typography.subheadline, { color: theme.textMuted, marginTop: 4 }]}>
            Track and manage all your loans
          </Text>
        </View>

        {/* Summary Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <GlassCard padding={Spacing.lg} intensity={30}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[Typography.caption1, { color: theme.textMuted }]}>Total Debt</Text>
                <Text style={[Typography.title2, { color: theme.text, marginTop: 4 }]}>
                  {formatCurrency(totalRemaining)}
                </Text>
              </View>
              <View style={{ width: 1, height: 44, backgroundColor: theme.border }} />
              <View style={styles.summaryItem}>
                <Text style={[Typography.caption1, { color: theme.textMuted }]}>Monthly</Text>
                <Text style={[Typography.title2, { color: theme.text, marginTop: 4 }]}>
                  {formatCurrency(totalMonthly)}
                </Text>
              </View>
              <View style={{ width: 1, height: 44, backgroundColor: theme.border }} />
              <View style={styles.summaryItem}>
                <Text style={[Typography.caption1, { color: theme.textMuted }]}>Active</Text>
                <Text style={[Typography.title2, { color: theme.text, marginTop: 4 }]}>
                  {loans.length}
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Filter chips */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => handleFilter(f.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filter === f.id ? theme.primary : theme.surface,
                    borderColor: filter === f.id ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.subheadline,
                    {
                      color: filter === f.id ? '#FFFFFF' : theme.textMuted,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Loan cards */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, gap: Spacing.md }}>
          {filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onPress={() => handleLoanPress(loan.id)}
            />
          ))}
        </View>

        {filteredLoans.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[Typography.body, { color: theme.textMuted, textAlign: 'center' }]}>
              No loans match this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  emptyState: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
});
