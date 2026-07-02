import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, TrendingDown, DollarSign, Clock, PiggyBank } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const refinanceGoals = [
  {
    id: 'lower_rate',
    title: 'Lower My Interest Rate',
    description: 'Reduce the cost of borrowing',
    icon: TrendingDown,
    color: colors.success,
  },
  {
    id: 'lower_payment',
    title: 'Reduce Monthly Payment',
    description: 'Free up cash flow each month',
    icon: DollarSign,
    color: colors.primary,
  },
  {
    id: 'shorten_term',
    title: 'Pay Off Faster',
    description: 'Shorten the loan term',
    icon: Clock,
    color: colors.warning,
  },
  {
    id: 'cash_out',
    title: 'Cash Out Equity',
    description: 'Access funds from your equity',
    icon: PiggyBank,
    color: colors.secondary,
  },
];

export default function RefinanceGoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleContinue = () => {
    if (!selectedGoal) return;

    router.push({
      pathname: '/refinance/credit-situation' as any,
      params: {
        ...params,
        goal: selectedGoal,
      },
    });
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
            <Text style={styles.headerTitle}>Refinance Goal</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>What&apos;s your main goal?</Text>
            <Text style={styles.description}>
              This helps us prioritize the best offers for you
            </Text>

            <View style={styles.goalsContainer}>
              {refinanceGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    selectedGoal === goal.id && styles.goalCardSelected,
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + '15' }]}>
                    <goal.icon color={goal.color} size={28} strokeWidth={2} />
                  </View>
                  <View style={styles.goalContent}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                  <View style={[styles.goalRadio, selectedGoal === goal.id && styles.goalRadioSelected]}>
                    {selectedGoal === goal.id && <View style={styles.goalRadioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={[styles.continueButton, !selectedGoal && styles.continueButtonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!selectedGoal}
          >
            <LinearGradient
              colors={selectedGoal ? ['#20B2AA', '#1A8F8A'] : ['#9AACBD', '#7A8C9D']}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  description: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  goalsContainer: {
    gap: 14,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    ...colors.shadow,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  goalIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  goalDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  goalRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  goalRadioSelected: {
    borderColor: colors.primary,
  },
  goalRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  continueButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
