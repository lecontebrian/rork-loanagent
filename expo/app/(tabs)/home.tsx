import { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
} from 'react-native';
import { Bell, Mic, Sparkles, Search, CreditCard, Calculator, FileText, RefreshCw, ArrowRight, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { HealthScoreCard } from '@/components/HealthScoreCard';
import { LoanCard } from '@/components/LoanCard';
import { Spacing, Typography } from '@/constants/theme';
import { loans, userProfile, primaryInsight } from '@/mocks/loanData';
import { formatCurrency, formatCurrencyWithDecimals, getGreeting } from '@/utils/formatters';

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const greeting = getGreeting();
  const mortgage = loans[0];
  const upcomingDays = 8;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleAskAI = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/ask-ai');
  };

  const handleNotification = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/profile');
  };

  const handleLoanPress = (loanId: string) => {
    router.push(`/loan-detail?id=${loanId}`);
  };

  const quickActions = [
    { id: 'pay', label: 'Make Payment', icon: CreditCard, color: '#16C784' },
    { id: 'refi', label: 'Refinance Check', icon: RefreshCw, color: '#3B9EFF' },
    { id: 'calc', label: 'Loan Calculator', icon: Calculator, color: '#F5A623' },
    { id: 'docs', label: 'Documents', icon: FileText, color: '#9B6BFF' },
  ];

  const handleQuickAction = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === 'docs') router.push('/(tabs)/documents');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.title2, { color: theme.text }]}>
              {greeting}, {userProfile.name} 👋
            </Text>
            <Text style={[Typography.subheadline, { color: theme.textMuted, marginTop: 4 }]}>
              Here's your loan snapshot for today.
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleNotification}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? theme.surfaceSecondary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Bell size={20} color={theme.text} />
              <View style={[styles.notificationDot, { backgroundColor: theme.primary }]} />
            </Pressable>
            <Pressable
              onPress={handleProfile}
              style={({ pressed }) => [
                styles.avatarButton,
                {
                  backgroundColor: pressed ? `${userProfile.avatarColor}DD` : userProfile.avatarColor,
                },
              ]}
            >
              <Text style={[Typography.headline, { color: '#FFFFFF', fontWeight: '700' }]}>
                {userProfile.initials}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Health Score Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <HealthScoreCard
            score={87}
            status="Excellent"
            insight={primaryInsight.body}
            onSeeRecommendation={() => router.push('/(tabs)/ask-ai')}
          />
        </View>

        {/* AI Input Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <Pressable onPress={handleAskAI}>
            <GlassCard padding={Spacing.md} intensity={30} pressable>
              <View style={styles.aiInputRow}>
                <View style={[styles.aiIconBox, { backgroundColor: `${theme.primary}22` }]}>
                  <Sparkles size={18} color={theme.primary} />
                </View>
                <Text style={[Typography.body, { color: theme.textMuted, flex: 1 }]}>
                  Ask your Loan Agent anything…
                </Text>
                <View style={[styles.micButton, { backgroundColor: theme.primary }]}>
                  <Mic size={18} color="#FFFFFF" />
                </View>
              </View>
            </GlassCard>
          </Pressable>
        </View>

        {/* Loan List */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.title3, { color: theme.text }]}>Your Loans</Text>
            <Pressable onPress={() => router.push('/(tabs)/loans')}>
              <Text style={[Typography.subheadline, { color: theme.primary, fontWeight: '600' }]}>
                See All
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: Spacing.md, gap: Spacing.md }}>
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onPress={() => handleLoanPress(loan.id)}
              />
            ))}
          </View>
        </View>

        {/* Upcoming Payment Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            Upcoming Payment
          </Text>
          <GlassCard padding={Spacing.lg} intensity={30} pressable onPress={() => handleLoanPress(mortgage.id)}>
            <View style={styles.upcomingTopRow}>
              <View style={[styles.upcomingIcon, { backgroundColor: `${mortgage.iconColor}22` }]}>
                <CreditCard size={20} color={mortgage.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.headline, { color: theme.text }]}>
                  {mortgage.name}
                </Text>
                <Text style={[Typography.caption1, { color: theme.textMuted, marginTop: 2 }]}>
                  Due in {upcomingDays} days
                </Text>
              </View>
              <Text style={[Typography.title2, { color: theme.text, fontWeight: '700' }]}>
                {formatCurrencyWithDecimals(mortgage.nextPaymentAmount)}
              </Text>
            </View>

            <View style={[styles.autoPayRow, { backgroundColor: `${theme.primary}12` }]}>
              <View style={styles.autoPayLeft}>
                <View style={[styles.autoPayDot, { backgroundColor: theme.primary }]} />
                <Text style={[Typography.subheadline, { color: theme.primary, fontWeight: '600' }]}>
                  Auto-pay enabled
                </Text>
              </View>
              <Pressable onPress={() => handleLoanPress(mortgage.id)}>
                <View style={styles.autoPayRight}>
                  <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                    View Payment Schedule
                  </Text>
                  <ArrowRight size={14} color={theme.textMuted} />
                </View>
              </Pressable>
            </View>
          </GlassCard>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.id}
                  onPress={() => handleQuickAction(action.id)}
                  style={({ pressed }) => [
                    styles.quickActionCard,
                    {
                      backgroundColor: pressed ? theme.surfaceSecondary : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}22` }]}>
                    <Icon size={22} color={action.color} />
                  </View>
                  <Text
                    style={[
                      Typography.caption1,
                      { color: theme.text, fontWeight: '600', marginTop: 8, textAlign: 'center' },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
    paddingTop: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upcomingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoPayRow: {
    marginTop: Spacing.md,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoPayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoPayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  autoPayRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: (320 - 36) / 2,
    padding: Spacing.md,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
