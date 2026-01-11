import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, AlertCircle, ShieldCheck, CheckCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useP2PWallet } from '@/contexts/P2PWalletContext';

const PURPOSES = [
  'Debt Consolidation',
  'Home Improvement',
  'Medical Expenses',
  'Business Expansion',
  'Education',
  'Vehicle Purchase',
  'Emergency',
  'Other',
];

export default function RequestP2PLoanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createLoanRequest } = useP2PWallet();
  
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [maxRate, setMaxRate] = useState('12');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = () => {
    const amountNum = parseFloat(amount.replace(/,/g, ''));
    const termNum = parseInt(term);
    const maxRateNum = parseFloat(maxRate);

    if (isNaN(amountNum) || amountNum < 500) {
      Alert.alert('Invalid Amount', 'Please enter a loan amount of at least $500');
      return;
    }

    if (isNaN(termNum) || termNum < 3 || termNum > 60) {
      Alert.alert('Invalid Term', 'Please enter a term between 3 and 60 months');
      return;
    }

    setIsSubmitting(true);

    const riskLevel = amountNum > 20000 ? 'medium' : amountNum > 10000 ? 'low' : 'low';
    const interestRate = Math.min(maxRateNum, Math.max(6, maxRateNum - 2));

    createLoanRequest({
      borrowerName: 'You',
      amount: amountNum,
      termMonths: termNum,
      purpose: selectedPurpose,
      description,
      maxRate: maxRateNum,
      interestRate,
      fundingGoal: amountNum,
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
      creditScore: 720,
      verified: true,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Request Submitted!',
        'Your loan request is now visible to investors. You\'ll be notified when funding starts.',
        [
          {
            text: 'View Marketplace',
            onPress: () => router.replace('/p2p-marketplace'),
          },
        ]
      );
    }, 1000);
  };

  const isValid = amount && term && selectedPurpose && description && parseFloat(amount.replace(/,/g, '')) >= 500;

  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') return '';
    const num = parseInt(cleaned);
    return num.toLocaleString();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Request a Loan</Text>
              <Text style={styles.headerSubtitle}>Get funded by investors</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.infoCard}>
              <ShieldCheck color={colors.success} size={24} strokeWidth={2} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>How it works</Text>
                <Text style={styles.infoText}>
                  Submit your request and investors will review your profile. Once funded, money is deposited directly to your linked account.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Loan Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={(text) => setAmount(formatAmount(text))}
                  placeholder="5,000"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <Text style={styles.fieldHint}>Minimum $500 • Maximum $50,000</Text>
            </View>

            <View style={styles.rowSection}>
              <View style={styles.halfSection}>
                <Text style={styles.sectionTitle}>Term</Text>
                <View style={styles.inputWithIcon}>
                  <Calendar color={colors.textSecondary} size={20} strokeWidth={2} />
                  <TextInput
                    style={styles.inputWithIconInput}
                    value={term}
                    onChangeText={setTerm}
                    placeholder="24"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <Text style={styles.inputSuffix}>months</Text>
                </View>
              </View>

              <View style={styles.halfSection}>
                <Text style={styles.sectionTitle}>Max Rate</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.inputWithIconInput, { paddingLeft: 16 }]}
                    value={maxRate}
                    onChangeText={setMaxRate}
                    placeholder="12"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <Text style={styles.inputSuffix}>% APR</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Purpose</Text>
              <View style={styles.purposeGrid}>
                {PURPOSES.map((purpose) => (
                  <TouchableOpacity
                    key={purpose}
                    style={[
                      styles.purposeChip,
                      selectedPurpose === purpose && styles.purposeChipActive,
                    ]}
                    onPress={() => setSelectedPurpose(purpose)}
                    activeOpacity={0.7}
                  >
                    {selectedPurpose === purpose && (
                      <CheckCircle color={colors.white} size={14} strokeWidth={2.5} />
                    )}
                    <Text
                      style={[
                        styles.purposeChipText,
                        selectedPurpose === purpose && styles.purposeChipTextActive,
                      ]}
                    >
                      {purpose}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tell Investors About Your Loan</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Explain why you need this loan and how you plan to repay it. Be specific - investors appreciate transparency..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.fieldHint}>{description.length}/500 characters</Text>
            </View>

            <View style={styles.estimateCard}>
              <Text style={styles.estimateTitle}>Estimated Monthly Payment</Text>
              <Text style={styles.estimateValue}>
                ${amount ? Math.round((parseFloat(amount.replace(/,/g, '')) * (1 + (parseFloat(maxRate) || 12) / 100 * (parseInt(term) || 24) / 12)) / (parseInt(term) || 24)).toLocaleString() : '---'}
              </Text>
              <Text style={styles.estimateNote}>Based on your max rate of {maxRate || '12'}% APR</Text>
            </View>

            <View style={styles.noteContainer}>
              <AlertCircle color={colors.warning} size={18} strokeWidth={2} />
              <Text style={styles.noteText}>
                Your credit score and verification status will be shown to investors. Standard platform fees apply upon funding.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
              onPress={isValid && !isSubmitting ? handleRequest : undefined}
              disabled={!isValid || isSubmitting}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isValid && !isSubmitting ? ['#FF9500', '#FF6B35'] : [colors.surfaceTertiary, colors.surfaceTertiary]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Loan Request'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.successLight || 'rgba(52, 199, 89, 0.1)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  dollarSign: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  fieldHint: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    marginTop: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  inputWithIconInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  purposeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  purposeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  purposeChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  purposeChipTextActive: {
    color: colors.white,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    minHeight: 120,
    lineHeight: 22,
  },
  estimateCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  estimateValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
  },
  estimateNote: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
  },
});
