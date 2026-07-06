import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Share, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, Target, CheckCircle, AlertCircle, Calendar, ChevronRight, Star, Award, Plus, Share2, FileText, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface CreditGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  status: 'completed' | 'in-progress' | 'pending';
  impact: string;
}

interface CreditAction {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: number;
  timeframe: string;
}

export default function CreditBuilderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { creditInfo } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [goals] = useState<CreditGoal[]>([
    {
      id: '1',
      title: 'Reduce Credit Utilization',
      current: 45,
      target: 30,
      status: 'in-progress',
      impact: '+20 points',
    },
    {
      id: '2',
      title: 'Remove Hard Inquiries',
      current: 3,
      target: 0,
      status: 'in-progress',
      impact: '+15 points',
    },
    {
      id: '3',
      title: 'Dispute Inaccurate Items',
      current: 1,
      target: 0,
      status: 'pending',
      impact: '+25 points',
    },
    {
      id: '4',
      title: 'Build Payment History',
      current: 88,
      target: 100,
      status: 'in-progress',
      impact: '+30 points',
    },
  ]);

  const [actions] = useState<CreditAction[]>([
    {
      id: '1',
      title: 'Pay Down Credit Cards',
      description: 'Reduce balances to below 30% of credit limits',
      difficulty: 'medium',
      impact: 25,
      timeframe: '1-2 months',
    },
    {
      id: '2',
      title: 'Become Authorized User',
      description: 'Ask someone with good credit to add you as an authorized user',
      difficulty: 'easy',
      impact: 15,
      timeframe: '1 month',
    },
    {
      id: '3',
      title: 'Request Credit Limit Increase',
      description: 'Ask for higher limits to improve utilization ratio',
      difficulty: 'easy',
      impact: 20,
      timeframe: 'Immediate',
    },
    {
      id: '4',
      title: 'Diversify Credit Mix',
      description: 'Add different types of credit accounts responsibly',
      difficulty: 'hard',
      impact: 10,
      timeframe: '3-6 months',
    },
    {
      id: '5',
      title: 'Set Up Autopay',
      description: 'Never miss a payment with automatic bill pay',
      difficulty: 'easy',
      impact: 30,
      timeframe: 'Immediate',
    },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const targetScore = (creditInfo?.score || 700) + 50;
  const progress = ((creditInfo?.score || 700) / targetScore) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color={colors.success} size={20} strokeWidth={2.5} />;
      case 'in-progress':
        return <TrendingUp color={colors.primary} size={20} strokeWidth={2.5} />;
      default:
        return <AlertCircle color={colors.textTertiary} size={20} strokeWidth={2.5} />;
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
            <Text style={styles.headerTitle}>Credit Builder</Text>
            <Text style={styles.headerSubtitle}>Build & Repair</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Plus,
                label: 'Add Custom Goal',
                onPress: () => Alert.alert('New Goal', 'Create a custom credit building goal'),
                color: colors.primary,
              },
              {
                icon: FileText,
                label: 'Credit Report',
                onPress: () => Alert.alert('Credit Report', 'View full credit report'),
                color: colors.info,
              },
              {
                icon: Share2,
                label: 'Share Progress',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out my credit building progress!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.success,
              },
              {
                icon: Settings,
                label: 'Builder Settings',
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
          <Animated.View style={[styles.scoreCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['#FF375F', '#FF1744']}
              style={styles.scoreGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.scoreHeader}>
                <View style={styles.scoreIcon}>
                  <Award color={colors.white} size={28} strokeWidth={2.5} />
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreLabel}>Current Score</Text>
                  <Text style={styles.scoreValue}>{creditInfo?.score || 700}</Text>
                </View>
              </View>
              <View style={styles.scoreTarget}>
                <Text style={styles.scoreTargetLabel}>Target Score: {targetScore}</Text>
                <View style={styles.scoreProgressBar}>
                  <View style={[styles.scoreProgressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.scoreProgressText}>
                  {targetScore - (creditInfo?.score || 700)} points to go
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Star color={colors.warning} size={20} strokeWidth={2.5} />
              <Text style={styles.statValue}>+50</Text>
              <Text style={styles.statLabel}>Potential Gain</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar color={colors.primary} size={20} strokeWidth={2.5} />
              <Text style={styles.statValue}>3-6</Text>
              <Text style={styles.statLabel}>Months</Text>
            </View>
            <View style={styles.statCard}>
              <Target color={colors.success} size={20} strokeWidth={2.5} />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
            </View>
          </View>

          <View style={styles.goalsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Credit Goals</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.viewAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {goals.map((goal) => {
              const goalProgress = (goal.current / goal.target) * 100;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  activeOpacity={0.85}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      {getStatusIcon(goal.status)}
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                    </View>
                    <View style={styles.goalImpact}>
                      <Text style={styles.goalImpactText}>{goal.impact}</Text>
                    </View>
                  </View>
                  <View style={styles.goalProgress}>
                    <Text style={styles.goalProgressText}>
                      {goal.current} / {goal.target}
                    </Text>
                    <View style={styles.goalProgressBar}>
                      <View
                        style={[
                          styles.goalProgressFill,
                          {
                            width: `${Math.min(goalProgress, 100)}%`,
                            backgroundColor:
                              goal.status === 'completed'
                                ? colors.success
                                : goal.status === 'in-progress'
                                ? colors.primary
                                : colors.textTertiary
                          }
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Actions</Text>
            </View>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                activeOpacity={0.85}
              >
                <View style={styles.actionHeader}>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                  <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2} />
                </View>
                <View style={styles.actionFooter}>
                  <View style={styles.actionBadges}>
                    <View style={[styles.actionBadge, { backgroundColor: getDifficultyColor(action.difficulty) + '20' }]}>
                      <Text style={[styles.actionBadgeText, { color: getDifficultyColor(action.difficulty) }]}>
                        {action.difficulty}
                      </Text>
                    </View>
                    <View style={styles.actionBadge}>
                      <TrendingUp color={colors.success} size={12} strokeWidth={2.5} />
                      <Text style={styles.actionImpactText}>+{action.impact} pts</Text>
                    </View>
                  </View>
                  <Text style={styles.actionTimeframe}>{action.timeframe}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.disputeButton}
            onPress={() => router.push('/credit-disputes' as any)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#5E5CE6', '#BF5AF2']}
              style={styles.disputeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <AlertCircle color={colors.white} size={22} strokeWidth={2.5} />
              <Text style={styles.disputeButtonText}>File Credit Dispute</Text>
              <ChevronRight color="rgba(255, 255, 255, 0.8)" size={20} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

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
  scoreCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  scoreGradient: {
    padding: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  scoreIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -1.5,
  },
  scoreTarget: {
    gap: 10,
  },
  scoreTargetLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  scoreProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  scoreProgressText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
    ...colors.shadow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  goalsSection: {
    marginBottom: 24,
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
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  goalCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...colors.shadow,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  goalImpact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.successLight,
    borderRadius: 8,
  },
  goalImpactText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  goalProgress: {
    gap: 8,
  },
  goalProgressText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...colors.shadow,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 8,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
    letterSpacing: -0.1,
  },
  actionImpactText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.success,
    letterSpacing: -0.1,
  },
  actionTimeframe: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  disputeButton: {
    marginBottom: 24,
    borderRadius: 18,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  disputeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  disputeButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
