import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { formatNumberInputText } from '@/utils/formatters';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CurrentLoanScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [currentBalance, setCurrentBalance] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [remainingMonths, setRemainingMonths] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [currentLender, setCurrentLender] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const isFormValid = currentBalance && currentRate && remainingMonths && monthlyPayment;

  const handleContinue = () => {
    if (!isFormValid) return;
    
    router.push({
      pathname: '/refinance/refinance-goal' as any,
      params: {
        type,
        currentBalance,
        currentRate,
        remainingMonths,
        monthlyPayment,
        currentLender,
      },
    });
  };

  const getLoanTypeName = () => {
    switch (type) {
      case 'auto':
        return 'Auto Loan';
      case 'home':
        return 'Mortgage';
      case 'personal':
        return 'Personal Loan';
      case 'student':
        return 'Student Loan';
      default:
        return 'Loan';
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
            <Text style={styles.headerTitle}>Current Loan Details</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Tell us about your current {getLoanTypeName().toLowerCase()}</Text>
            <Text style={styles.description}>
              This helps us find the best refinance options for you
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Balance *</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={styles.input}
                    value={currentBalance}
                    onChangeText={(t) => setCurrentBalance(formatNumberInputText(t, { allowDecimal: false, compactMillions: true }))}
                    placeholder="25,000"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Interest Rate *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { paddingLeft: 20 }]}
                    value={currentRate}
                    onChangeText={setCurrentRate}
                    placeholder="6.5"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.inputSuffix}>%</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Remaining Term *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { paddingLeft: 20 }]}
                    value={remainingMonths}
                    onChangeText={(t) => setRemainingMonths(formatNumberInputText(t, { allowDecimal: false, compactMillions: false }))}
                    placeholder="48"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>months</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Monthly Payment *</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={styles.input}
                    value={monthlyPayment}
                    onChangeText={(t) => setMonthlyPayment(formatNumberInputText(t, { allowDecimal: false, compactMillions: true }))}
                    placeholder="450"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Lender (Optional)</Text>
                <TextInput
                  style={[styles.inputContainer, { paddingHorizontal: 20 }]}
                  value={currentLender}
                  onChangeText={setCurrentLender}
                  placeholder="e.g., Chase Bank"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💡 Having your loan details handy? Check your latest statement for accurate information.
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
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  inputContainer: {
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
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    paddingVertical: 0,
  },
  inputSuffix: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    paddingRight: 20,
  },
  infoBox: {
    padding: 16,
    backgroundColor: colors.infoLight,
    borderRadius: 14,
    marginTop: 8,
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
