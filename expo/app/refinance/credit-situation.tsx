import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, TrendingUp, DollarSign, Briefcase } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreditSituationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [creditScore, setCreditScore] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const isFormValid = creditScore && annualIncome && employmentStatus;

  const handleContinue = () => {
    if (!isFormValid) return;

    router.push({
      pathname: '/refinance/offers' as any,
      params: {
        ...params,
        creditScore,
        annualIncome,
        employmentStatus,
      },
    });
  };

  const employmentOptions = [
    { id: 'employed', label: 'Full-time Employed' },
    { id: 'self-employed', label: 'Self-Employed' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'retired', label: 'Retired' },
  ];

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
            <Text style={styles.headerTitle}>Financial Profile</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Tell us about your financial situation</Text>
            <Text style={styles.description}>
              This information helps us match you with the right lenders
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <TrendingUp color={colors.success} size={18} strokeWidth={2} />
                  <Text style={styles.label}>Credit Score (Estimated)</Text>
                </View>
                <TextInput
                  style={styles.inputContainer}
                  value={creditScore}
                  onChangeText={setCreditScore}
                  placeholder="e.g., 720"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                />
                <Text style={styles.helperText}>Don&apos;t know? Enter your best estimate</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <DollarSign color={colors.primary} size={18} strokeWidth={2} />
                  <Text style={styles.label}>Annual Income</Text>
                </View>
                <View style={styles.inputWithPrefix}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={styles.inputFlex}
                    value={annualIncome}
                    onChangeText={setAnnualIncome}
                    placeholder="65,000"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Briefcase color={colors.warning} size={18} strokeWidth={2} />
                  <Text style={styles.label}>Employment Status</Text>
                </View>
                <View style={styles.optionsGrid}>
                  {employmentOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        employmentStatus === option.id && styles.optionButtonSelected,
                      ]}
                      onPress={() => setEmploymentStatus(option.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          employmentStatus === option.id && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  🔒 Your information is encrypted and secure. We never share your data without permission.
                </Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!isFormValid}
          >
            <LinearGradient
              colors={isFormValid ? ['#20B2AA', '#1A8F8A'] : ['#9AACBD', '#7A8C9D']}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.continueText}>See My Offers</Text>
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
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  inputContainer: {
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    ...colors.shadow,
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  inputPrefix: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    paddingLeft: 20,
    paddingRight: 4,
  },
  inputFlex: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    paddingVertical: 0,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  infoBox: {
    padding: 16,
    backgroundColor: colors.successLight,
    borderRadius: 14,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
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
