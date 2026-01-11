import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Share, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calculator, TrendingUp, AlertCircle, Lightbulb, ChevronDown, Save, Share2, History, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { LoanSimulationInput, LoanSimulationResult, LoanType } from '@/types';
import TokenGate from '@/components/TokenGate';
import TokenDisplay from '@/components/TokenDisplay';

export default function LoanSimulatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, creditInfo } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [inputs, setInputs] = useState<LoanSimulationInput>({
    income: userProfile?.employment.annualIncome || 50000,
    creditScore: creditInfo?.score || 700,
    existingDebts: 500,
    employmentMonths: 24,
    loanAmount: 20000,
    loanType: 'personal' as LoanType,
    customInterestRate: undefined,
    customTaxRate: 0,
    customFees: 0,
  });

  const [result, setResult] = useState<LoanSimulationResult | null>(null);
  const [showLoanTypePicker, setShowLoanTypePicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loanTypes: { value: LoanType; label: string }[] = [
    { value: 'personal', label: 'Personal Loan' },
    { value: 'auto', label: 'Auto Loan' },
    { value: 'home', label: 'Home Loan' },
    { value: 'business', label: 'Business Loan' },
    { value: 'education', label: 'Education Loan' },
    { value: 'debt', label: 'Debt Consolidation' },
  ];

  const performSimulation = () => {

    const monthlyIncome = inputs.income / 12;
    const dti = (inputs.existingDebts / monthlyIncome) * 100;
    
    // Use custom fees if provided, otherwise estimate 5% (which is high but safe estimate)
    // const fees = inputs.customFees !== undefined ? inputs.customFees : (inputs.loanAmount * 0.05);
    const estimatedPayment = (inputs.loanAmount * 0.05) / 12; // Rough initial estimate for DTI
    const newDti = ((inputs.existingDebts + estimatedPayment) / monthlyIncome) * 100;

    let baseRate = 8.0;
    if (inputs.creditScore >= 750) baseRate = 5.5;
    else if (inputs.creditScore >= 700) baseRate = 7.0;
    else if (inputs.creditScore >= 650) baseRate = 9.5;
    else baseRate = 12.5;

    if (inputs.loanType === 'auto') baseRate -= 1.5;
    else if (inputs.loanType === 'home') baseRate -= 2.0;
    else if (inputs.loanType === 'business') baseRate += 2.0;
    
    // Override with custom interest rate if provided
    if (inputs.customInterestRate) {
        baseRate = inputs.customInterestRate;
    }
    
    // Add tax rate effect if applicable (e.g. for property tax in monthly payment)
    let taxMonthly = 0;
    if (inputs.customTaxRate) {
        // Assuming tax rate is annual on the loan amount (simplified for vehicle/property)
        taxMonthly = (inputs.loanAmount * (inputs.customTaxRate / 100)) / 12;
    }

    const approvalScore = 
      (inputs.creditScore / 850 * 40) +
      (Math.max(0, 100 - dti) / 100 * 30) +
      (Math.min(inputs.employmentMonths / 24, 1) * 20) +
      (newDti < 43 ? 10 : 0);

    const monthlyPayment = 
      (inputs.loanAmount * (baseRate / 100 / 12) * Math.pow(1 + baseRate / 100 / 12, 60) /
      (Math.pow(1 + baseRate / 100 / 12, 60) - 1)) + taxMonthly;

    const affordability = Math.max(0, 100 - (monthlyPayment / monthlyIncome * 100) * 2);

    const recommendations: string[] = [];
    if (inputs.creditScore < 700) {
      recommendations.push('Improve your credit score to get better rates');
    }
    if (dti > 36) {
      recommendations.push('Reduce existing debts to improve approval chances');
    }
    if (inputs.employmentMonths < 12) {
      recommendations.push('Wait for more stable employment history');
    }
    if (newDti > 43) {
      recommendations.push('Consider a smaller loan amount for better affordability');
    }
    if (affordability < 70) {
      recommendations.push('This loan may strain your budget significantly');
    }

    setResult({
      approvalLikelihood: Math.min(100, Math.round(approvalScore)),
      estimatedRate: parseFloat(baseRate.toFixed(2)),
      monthlyPayment: Math.round(monthlyPayment),
      affordabilityScore: Math.round(affordability),
      recommendations,
    });
  };

  const updateInput = (key: keyof LoanSimulationInput, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setResult(null);
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
            <Text style={styles.headerTitle}>Loan Simulator</Text>
            <Text style={styles.headerSubtitle}>What-If Scenarios</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Save,
                label: 'Save Simulation',
                onPress: () => Alert.alert('Save', 'Simulation saved to your profile'),
                color: colors.primary,
              },
              {
                icon: Share2,
                label: 'Share Results',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out my loan simulation results!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.success,
              },
              {
                icon: History,
                label: 'View History',
                onPress: () => Alert.alert('History', 'View past simulations'),
                color: colors.info,
              },
              {
                icon: Settings,
                label: 'Simulator Settings',
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
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
            <View style={styles.infoIconContainer}>
              <Calculator color={colors.primary} size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.infoText}>
              Adjust variables to see how changes in your financial situation affect loan approval and rates.
            </Text>
          </Animated.View>

          <View style={styles.inputsSection}>
            <Text style={styles.sectionTitle}>Your Financial Profile</Text>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Annual Income</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  value={inputs.income.toString()}
                  onChangeText={(text) => updateInput('income', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholder="50000"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Credit Score</Text>
              <TextInput
                style={styles.inputFull}
                value={inputs.creditScore.toString()}
                onChangeText={(text) => updateInput('creditScore', parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="700"
                placeholderTextColor={colors.textTertiary}
              />
              <View style={styles.sliderInfo}>
                <Text style={styles.sliderLabel}>300</Text>
                <View style={styles.sliderBar}>
                  <View style={[styles.sliderFill, { width: `${((inputs.creditScore - 300) / 550) * 100}%` }]} />
                </View>
                <Text style={styles.sliderLabel}>850</Text>
              </View>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Monthly Debt Payments</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  value={inputs.existingDebts.toString()}
                  onChangeText={(text) => updateInput('existingDebts', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Employment Duration (months)</Text>
              <TextInput
                style={styles.inputFull}
                value={inputs.employmentMonths.toString()}
                onChangeText={(text) => updateInput('employmentMonths', parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="24"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputsSection}>
            <Text style={styles.sectionTitle}>Loan Details</Text>

            <TouchableOpacity
              style={styles.inputCard}
              onPress={() => setShowLoanTypePicker(!showLoanTypePicker)}
              activeOpacity={0.7}
            >
              <Text style={styles.inputLabel}>Loan Type</Text>
              <View style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>
                  {loanTypes.find(t => t.value === inputs.loanType)?.label}
                </Text>
                <ChevronDown color={colors.textSecondary} size={20} strokeWidth={2} />
              </View>
            </TouchableOpacity>

            {showLoanTypePicker && (
              <View style={styles.pickerContainer}>
                {loanTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      updateInput('loanType', type.value);
                      setShowLoanTypePicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      inputs.loanType === type.value && styles.pickerOptionTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Loan Amount</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  value={inputs.loanAmount.toString()}
                  onChangeText={(text) => updateInput('loanAmount', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholder="20000"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>

            <View style={styles.inputsSection}>
            <TouchableOpacity 
                style={styles.advancedToggle}
                onPress={() => setShowAdvanced(!showAdvanced)}
            >
                <Text style={styles.advancedToggleText}>
                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Rate, Tax, Fees)'}
                </Text>
                <ChevronDown 
                    color={colors.primary} 
                    size={20} 
                    strokeWidth={2} 
                    style={{ transform: [{ rotate: showAdvanced ? '180deg' : '0deg' }] }}
                />
            </TouchableOpacity>

            {showAdvanced && (
                <View style={styles.advancedSection}>
                    <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Custom Interest Rate (%)</Text>
                        <TextInput
                            style={styles.input}
                            value={inputs.customInterestRate?.toString() || ''}
                            onChangeText={(text) => updateInput('customInterestRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="e.g. 5.5"
                            placeholderTextColor={colors.textTertiary}
                        />
                    </View>
                    <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Local Tax Rate (%)</Text>
                        <TextInput
                            style={styles.input}
                            value={inputs.customTaxRate?.toString() || ''}
                            onChangeText={(text) => updateInput('customTaxRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="e.g. 8.25"
                            placeholderTextColor={colors.textTertiary}
                        />
                    </View>
                    <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Additional Fees ($)</Text>
                        <TextInput
                            style={styles.input}
                            value={inputs.customFees?.toString() || ''}
                            onChangeText={(text) => updateInput('customFees', parseInt(text) || 0)}
                            keyboardType="numeric"
                            placeholder="e.g. 500"
                            placeholderTextColor={colors.textTertiary}
                        />
                    </View>
                </View>
            )}
            </View>

          <TokenGate
            actionType="whatIfSimulation"
            onSuccess={performSimulation}
          >
            {(handleAction) => (
              <TouchableOpacity style={styles.simulateButton} onPress={handleAction} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#0A84FF', '#5E5CE6']}
                  style={styles.simulateButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Calculator color={colors.white} size={22} strokeWidth={2.5} />
                  <Text style={styles.simulateButtonText}>Run Simulation (1 Token)</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </TokenGate>

          {result && (
            <Animated.View style={[styles.resultsSection, { opacity: fadeAnim }]}>
              <Text style={styles.sectionTitle}>Simulation Results</Text>

              <View style={styles.resultCard}>
                <LinearGradient
                  colors={
                    result.approvalLikelihood >= 75
                      ? ['#30D158', '#28B349']
                      : result.approvalLikelihood >= 50
                      ? ['#FF9500', '#FF6B00']
                      : ['#FF375F', '#FF1744']
                  }
                  style={styles.resultGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.resultLabel}>Approval Likelihood</Text>
                  <Text style={styles.resultValue}>{result.approvalLikelihood}%</Text>
                  <View style={styles.resultProgressBar}>
                    <View style={[styles.resultProgressFill, { width: `${result.approvalLikelihood}%` }]} />
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.resultMetrics}>
                <View style={styles.resultMetricCard}>
                  <Text style={styles.resultMetricLabel}>Estimated APR</Text>
                  <Text style={styles.resultMetricValue}>{result.estimatedRate}%</Text>
                </View>
                <View style={styles.resultMetricCard}>
                  <Text style={styles.resultMetricLabel}>Monthly Payment</Text>
                  <Text style={styles.resultMetricValue}>${result.monthlyPayment.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.affordabilityCard}>
                <View style={styles.affordabilityHeader}>
                  <TrendingUp
                    color={result.affordabilityScore >= 70 ? colors.success : colors.warning}
                    size={20}
                    strokeWidth={2.5}
                  />
                  <Text style={styles.affordabilityTitle}>Affordability Score</Text>
                </View>
                <Text style={styles.affordabilityValue}>{result.affordabilityScore}/100</Text>
                <View style={styles.affordabilityBar}>
                  <View
                    style={[
                      styles.affordabilityFill,
                      {
                        width: `${result.affordabilityScore}%`,
                        backgroundColor: result.affordabilityScore >= 70 ? colors.success : colors.warning
                      }
                    ]}
                  />
                </View>
              </View>

              {result.recommendations.length > 0 && (
                <View style={styles.recommendationsCard}>
                  <View style={styles.recommendationsHeader}>
                    <Lightbulb color={colors.warning} size={20} strokeWidth={2.5} />
                    <Text style={styles.recommendationsTitle}>Recommendations</Text>
                  </View>
                  {result.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendation}>
                      <AlertCircle color={colors.primary} size={16} strokeWidth={2.5} />
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          <TokenDisplay variant="default" showUpgrade />

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
  infoCard: {
    flexDirection: 'row',
    padding: 18,
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    gap: 14,
    marginBottom: 24,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  inputsSection: {
    marginBottom: 24,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  advancedSection: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  inputCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...colors.shadow,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputPrefix: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  inputFull: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  sliderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
  },
  sliderBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  pickerContainer: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 8,
  },
  pickerOption: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  pickerOptionText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  pickerOptionTextActive: {
    color: colors.white,
    fontWeight: '600' as const,
  },
  simulateButton: {
    marginBottom: 24,
    borderRadius: 18,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  simulateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  simulateButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  resultsSection: {
    gap: 16,
  },
  resultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  resultGradient: {
    padding: 24,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  resultProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  resultProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  resultMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  resultMetricCard: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  resultMetricLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  resultMetricValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  affordabilityCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  affordabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  affordabilityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  affordabilityValue: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -1,
  },
  affordabilityBar: {
    height: 8,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  affordabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationsCard: {
    padding: 20,
    backgroundColor: colors.warningLight,
    borderRadius: 18,
    gap: 14,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
