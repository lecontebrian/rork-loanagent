import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Home, Car, User, GraduationCap, Briefcase, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { formatCurrency, formatPercent, getStatusColor, getStatusLabel } from '@/utils/formatters';
import type { Loan } from '@/types';

interface LoanCardProps {
  loan: Loan;
  onPress?: () => void;
  style?: ViewStyle;
}

const loanIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  mortgage: Home,
  auto: Car,
  personal: User,
  student: GraduationCap,
  business: Briefcase,
};

export function LoanCard({ loan, onPress, style }: LoanCardProps) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: loan.payoffProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [loan.payoffProgress, progressWidth]);

  useEffect(() => () => scale.stopAnimation(), [scale]);

  const Icon = loanIcons[loan.type] || FileText;
  const statusColor = getStatusColor(loan.status);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 20 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 20 }).start();
  };
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], ...(style as ViewStyle) }}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
        <GlassCard padding={Spacing.lg} intensity={30}>
          {/* Top row: icon + status */}
          <View style={styles.topRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${loan.iconColor}22` }]}>
              <Icon size={22} color={loan.iconColor} />
            </View>
            <View style={styles.headerCenter}>
              <Text style={[Typography.headline, { color: theme.text }]}>{loan.name}</Text>
              <Text style={[Typography.caption1, { color: theme.textMuted, marginTop: 2 }]}>
                {loan.lender}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[Typography.caption1, { color: statusColor, fontWeight: '600' }]}>
                {getStatusLabel(loan.status)}
              </Text>
            </View>
          </View>

          {/* Balance + APR */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[Typography.caption1, { color: theme.textMuted }]}>Remaining</Text>
              <Text style={[Typography.title2, { color: theme.text, marginTop: 2 }]}>
                {formatCurrency(loan.remainingBalance)}
              </Text>
            </View>
            <View style={styles.statDivider}>
              <View style={{ width: 1, height: 36, backgroundColor: theme.border }} />
            </View>
            <View style={styles.statItem}>
              <Text style={[Typography.caption1, { color: theme.textMuted }]}>APR</Text>
              <Text style={[Typography.title2, { color: theme.text, marginTop: 2 }]}>
                {formatPercent(loan.apr)}
              </Text>
            </View>
            <View style={styles.statDivider}>
              <View style={{ width: 1, height: 36, backgroundColor: theme.border }} />
            </View>
            <View style={styles.statItem}>
              <Text style={[Typography.caption1, { color: theme.textMuted }]}>Monthly</Text>
              <Text style={[Typography.title2, { color: theme.text, marginTop: 2 }]}>
                {formatCurrency(loan.monthlyPayment)}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ marginTop: Spacing.md }}>
            <View style={styles.progressHeader}>
              <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                Payoff Progress
              </Text>
              <Text style={[Typography.caption1, { color: theme.primary, fontWeight: '700' }]}>
                {loan.payoffProgress}%
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: theme.isDark ? '#1F2A25' : '#E5E9EB' }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: loan.iconColor,
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[Typography.caption1, { color: theme.textMuted, marginTop: Spacing.sm }]}>
              Next payment: {loan.nextPaymentDate}
            </Text>
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: Spacing.sm,
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    marginHorizontal: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
