import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Briefcase, DollarSign, ShieldCheck, User } from 'lucide-react-native';

import { formatNumberInputText, parseNumberInput } from '@/utils/formatters';
import colors from '@/constants/colors';
import { EmploymentInfo, FinancialInfo, PersonalReferences } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StepId = 'employment' | 'financial' | 'references';

interface Step {
  id: StepId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function QuestionnaireScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const offerId = params.offerId as string;
  const lenderName = params.lenderName as string || 'Lender';
  const amount = params.amount as string || '15000';
  const rate = params.rate as string;
  const term = params.term as string;
  const insets = useSafeAreaInsets();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [employmentInfo, setEmploymentInfo] = useState<Partial<EmploymentInfo>>({
    employmentType: 'full-time',
  });
  const [financialInfo, setFinancialInfo] = useState<Partial<FinancialInfo>>({
    hasExistingDebts: false,
  });
  const [references, setReferences] = useState<Partial<PersonalReferences>>({});
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const steps: Step[] = [
    {
      id: 'employment',
      title: 'Employment Information',
      subtitle: 'Current and previous employment details',
      icon: <Briefcase color={colors.primary} size={24} strokeWidth={2} />,
    },
    {
      id: 'financial',
      title: 'Financial Information',
      subtitle: 'Income and expenses overview',
      icon: <DollarSign color={colors.primary} size={24} strokeWidth={2} />,
    },
    {
      id: 'references',
      title: 'Personal References',
      subtitle: 'Contact information for references',
      icon: <User color={colors.primary} size={24} strokeWidth={2} />,
    },
  ];

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStepIndex, fadeAnim, slideAnim]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        slideAnim.setValue(20);
        fadeAnim.setValue(0);
      });
    } else {
      const formData = {
        offerId,
        lenderName: decodeURIComponent(lenderName),
        amount: Number(amount),
        rate: rate ? Number(rate) : undefined,
        term: term ? Number(term) : undefined,
        employmentInfo,
        financialInfo,
        references,
      };
      router.push(`/application/nda-disclaimer?data=${encodeURIComponent(JSON.stringify(formData))}` as any);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        slideAnim.setValue(-20);
        fadeAnim.setValue(0);
      });
    } else {
      router.back();
    }
  };

  const isStepValid = () => {
    switch (currentStep.id) {
      case 'employment':
        return employmentInfo.currentEmployer && 
               employmentInfo.currentPosition && 
               employmentInfo.currentEmploymentStartDate &&
               employmentInfo.currentAnnualIncome;
      case 'financial':
        return financialInfo.monthlyIncome && 
               financialInfo.monthlyExpenses &&
               financialInfo.socialSecurityNumber &&
               financialInfo.socialSecurityNumber.length === 11; // XXX-XX-XXXX is 11 chars
      case 'references':
        return references.reference1Name && 
               references.reference1Phone && 
               references.reference1Relationship;
      default:
        return false;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Application</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[
                styles.progressFill,
                { width: `${((currentStepIndex + 1) / steps.length) * 100}%` }
              ]}>
                <LinearGradient
                  colors={['#0A84FF', '#5E5CE6']}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressText}>
              Step {currentStepIndex + 1} of {steps.length}
            </Text>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepIcon}>{currentStep.icon}</View>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>
              </View>

              {currentStep.id === 'employment' && (
                <EmploymentForm 
                  data={employmentInfo} 
                  onChange={setEmploymentInfo} 
                />
              )}
              
              {currentStep.id === 'financial' && (
                <FinancialForm 
                  data={financialInfo} 
                  onChange={setFinancialInfo} 
                />
              )}
              
              {currentStep.id === 'references' && (
                <ReferencesForm 
                  data={references} 
                  onChange={setReferences} 
                />
              )}
              
              <View style={{ height: 40 }} />
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isStepValid() && styles.continueButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={!isStepValid()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isStepValid() ? ['#0A84FF', '#5E5CE6'] : [colors.textTertiary, colors.textTertiary]}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>
                  {currentStepIndex < steps.length - 1 ? 'Continue' : 'Next: Review & Sign'}
                </Text>
                <ArrowRight color={colors.white} size={20} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

function EmploymentForm({ 
  data, 
  onChange 
}: { 
  data: Partial<EmploymentInfo>; 
  onChange: (data: Partial<EmploymentInfo>) => void;
}) {
  const employmentTypes = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'self-employed', label: 'Self-Employed' },
    { value: 'contract', label: 'Contract' },
    { value: 'unemployed', label: 'Unemployed' },
  ] as const;

  return (
    <View style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Employment</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Employment Type</Text>
          <View style={styles.chipGroup}>
            {employmentTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  data.employmentType === type.value && styles.chipActive,
                ]}
                onPress={() => onChange({ ...data, employmentType: type.value })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  data.employmentType === type.value && styles.chipTextActive,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Current Employer *</Text>
          <TextInput
            style={styles.input}
            value={data.currentEmployer || ''}
            onChangeText={(text) => onChange({ ...data, currentEmployer: text })}
            placeholder="Company name"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Current Position *</Text>
          <TextInput
            style={styles.input}
            value={data.currentPosition || ''}
            onChangeText={(text) => onChange({ ...data, currentPosition: text })}
            placeholder="Job title"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Employment Start Date *</Text>
          <TextInput
            style={styles.input}
            value={data.currentEmploymentStartDate || ''}
            onChangeText={(text) => onChange({ ...data, currentEmploymentStartDate: text })}
            placeholder="MM/YYYY"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Annual Income *</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={formatNumberInputText(String(data.currentAnnualIncome ?? ''), { allowDecimal: false, compactMillions: true })}
              onChangeText={(text) => {
                const n = parseNumberInput(text);
                onChange({ ...data, currentAnnualIncome: Math.floor(n) });
              }}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Employment (Optional)</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Previous Employer</Text>
          <TextInput
            style={styles.input}
            value={data.previousEmployer || ''}
            onChangeText={(text) => onChange({ ...data, previousEmployer: text })}
            placeholder="Company name"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Previous Position</Text>
          <TextInput
            style={styles.input}
            value={data.previousPosition || ''}
            onChangeText={(text) => onChange({ ...data, previousPosition: text })}
            placeholder="Job title"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.fieldHalf]}>
            <Text style={styles.fieldLabel}>Start Date</Text>
            <TextInput
              style={styles.input}
              value={data.previousEmploymentStartDate || ''}
              onChangeText={(text) => onChange({ ...data, previousEmploymentStartDate: text })}
              placeholder="MM/YYYY"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={[styles.field, styles.fieldHalf]}>
            <Text style={styles.fieldLabel}>End Date</Text>
            <TextInput
              style={styles.input}
              value={data.previousEmploymentEndDate || ''}
              onChangeText={(text) => onChange({ ...data, previousEmploymentEndDate: text })}
              placeholder="MM/YYYY"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      </View>
    </View>
  );
}


function FinancialForm({ 
  data, 
  onChange 
}: { 
  data: Partial<FinancialInfo>; 
  onChange: (data: Partial<FinancialInfo>) => void;
}) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identity Verification</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Social Security Number *</Text>
          <View style={styles.inputWithIcon}>
            <ShieldCheck color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={data.socialSecurityNumber || ''}
              onChangeText={(text) => {
                 // Format as XXX-XX-XXXX
                 const cleaned = text.replace(/\D/g, '');
                 let formatted = cleaned;
                 if (cleaned.length > 3) {
                   formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
                 }
                 if (cleaned.length > 5) {
                   formatted = formatted.slice(0, 7) + '-' + cleaned.slice(5, 9);
                 }
                 if (cleaned.length > 9) return;
                 
                 onChange({ ...data, socialSecurityNumber: formatted });
              }}
              placeholder="XXX-XX-XXXX"
              keyboardType="numeric"
              secureTextEntry
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <Text style={styles.helperText}>
            We use 256-bit encryption to protect your data. Your SSN is only used for identity verification and credit checks.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Income & Expenses</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Monthly Income *</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={data.monthlyIncome?.toString() || ''}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                onChange({ ...data, monthlyIncome: Number(num) });
              }}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Monthly Expenses *</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={data.monthlyExpenses?.toString() || ''}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                onChange({ ...data, monthlyExpenses: Number(num) });
              }}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Rent/Mortgage Payment</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={data.rentOrMortgagePayment?.toString() || ''}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                onChange({ ...data, rentOrMortgagePayment: Number(num) });
              }}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Income (Optional)</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Other Income Source</Text>
          <TextInput
            style={styles.input}
            value={data.otherIncomeSource || ''}
            onChangeText={(text) => onChange({ ...data, otherIncomeSource: text })}
            placeholder="e.g., Freelance, Investments"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Other Monthly Income</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={data.otherMonthlyIncome?.toString() || ''}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                onChange({ ...data, otherMonthlyIncome: Number(num) });
              }}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Existing Debts</Text>
        
        <View style={styles.field}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                data.hasExistingDebts && styles.checkboxActive,
              ]}
              onPress={() => onChange({ ...data, hasExistingDebts: !data.hasExistingDebts })}
              activeOpacity={0.7}
            >
              {data.hasExistingDebts && <View style={styles.checkboxCheck} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>I have existing debts</Text>
          </View>
        </View>

        {data.hasExistingDebts && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Total Monthly Debt Payments</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
              <TextInput
                style={[styles.input, styles.inputWithIconInput]}
                value={data.totalMonthlyDebtPayments?.toString() || ''}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, '');
                  onChange({ ...data, totalMonthlyDebtPayments: Number(num) });
                }}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ReferencesForm({ 
  data, 
  onChange 
}: { 
  data: Partial<PersonalReferences>; 
  onChange: (data: Partial<PersonalReferences>) => void;
}) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Reference *</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={data.reference1Name || ''}
            onChangeText={(text) => onChange({ ...data, reference1Name: text })}
            placeholder="John Doe"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={data.reference1Phone || ''}
            onChangeText={(text) => onChange({ ...data, reference1Phone: text })}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Relationship *</Text>
          <TextInput
            style={styles.input}
            value={data.reference1Relationship || ''}
            onChangeText={(text) => onChange({ ...data, reference1Relationship: text })}
            placeholder="e.g., Friend, Family, Colleague"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Secondary Reference (Optional)</Text>
        
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={data.reference2Name || ''}
            onChangeText={(text) => onChange({ ...data, reference2Name: text })}
            placeholder="Jane Smith"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={data.reference2Phone || ''}
            onChangeText={(text) => onChange({ ...data, reference2Phone: text })}
            placeholder="(555) 987-6543"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Relationship</Text>
          <TextInput
            style={styles.input}
            value={data.reference2Relationship || ''}
            onChangeText={(text) => onChange({ ...data, reference2Relationship: text })}
            placeholder="e.g., Friend, Family, Colleague"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  progressContainer: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  formContainer: {
    gap: 28,
  },
  section: {
    gap: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
  },
  inputWithIconInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  chipTextActive: {
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  fieldHalf: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  helperText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 6,
    lineHeight: 16,
  },
  footer: {
    padding: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
