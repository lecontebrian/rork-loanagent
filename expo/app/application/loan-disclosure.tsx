import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function LoanDisclosureScreen() {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState(false);

  const loanDetails = {
    loanAmount: 25000,
    apr: 6.5,
    monthlyPayment: 485,
    term: 60,
    totalPayments: 29100,
    financeCharge: 4100,
    closingCosts: 1250,
  };

  const handleContinue = () => {
    router.push('/application/nda-disclaimer' as any);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan Disclosure</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <FileText color={colors.primary} size={32} />
              <Text style={styles.title}>Truth in Lending Disclosure</Text>
              <Text style={styles.subtitle}>
                Federal law requires us to provide this information
              </Text>
            </View>

            <View style={styles.disclosureCard}>
              <Text style={styles.cardTitle}>Annual Percentage Rate (APR)</Text>
              <Text style={styles.cardValue}>{loanDetails.apr.toFixed(2)}%</Text>
              <Text style={styles.cardDescription}>
                The cost of your credit as a yearly rate
              </Text>
            </View>

            <View style={styles.disclosureCard}>
              <Text style={styles.cardTitle}>Finance Charge</Text>
              <Text style={styles.cardValue}>${loanDetails.financeCharge.toLocaleString()}</Text>
              <Text style={styles.cardDescription}>
                The dollar amount the credit will cost you
              </Text>
            </View>

            <View style={styles.disclosureCard}>
              <Text style={styles.cardTitle}>Amount Financed</Text>
              <Text style={styles.cardValue}>${loanDetails.loanAmount.toLocaleString()}</Text>
              <Text style={styles.cardDescription}>
                The amount of credit provided to you
              </Text>
            </View>

            <View style={styles.disclosureCard}>
              <Text style={styles.cardTitle}>Total of Payments</Text>
              <Text style={styles.cardValue}>${loanDetails.totalPayments.toLocaleString()}</Text>
              <Text style={styles.cardDescription}>
                The amount you will have paid after making all {loanDetails.term} payments
              </Text>
            </View>

            <View style={styles.paymentSchedule}>
              <Text style={styles.scheduleTitle}>Payment Schedule</Text>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>Number of Payments</Text>
                <Text style={styles.scheduleValue}>{loanDetails.term}</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>Monthly Payment</Text>
                <Text style={styles.scheduleValue}>${loanDetails.monthlyPayment}</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>Payment Due</Text>
                <Text style={styles.scheduleValue}>1st of each month</Text>
              </View>
            </View>

            <View style={styles.additionalCosts}>
              <Text style={styles.costsTitle}>Settlement Costs (RESPA)</Text>
              <Text style={styles.costsDescription}>
                Additional costs you may pay in connection with this loan:
              </Text>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Origination Fee</Text>
                <Text style={styles.costValue}>$750</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Application Fee</Text>
                <Text style={styles.costValue}>$250</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Document Prep</Text>
                <Text style={styles.costValue}>$150</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Credit Report</Text>
                <Text style={styles.costValue}>$100</Text>
              </View>
              <View style={[styles.costRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Closing Costs</Text>
                <Text style={styles.totalValue}>${loanDetails.closingCosts.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeTitle}>Important Information</Text>
              <Text style={styles.noticeText}>
                • This disclosure reflects estimated costs and terms{'\n'}
                • Final terms may vary based on underwriting{'\n'}
                • You are not obligated to complete this transaction{'\n'}
                • You have the right to shop for settlement services{'\n'}
                • Late payments may result in additional fees{'\n'}
                • Prepayment penalty: None
              </Text>
            </View>

            <TouchableOpacity
              style={styles.acknowledgeButton}
              onPress={() => setAcknowledged(!acknowledged)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
                {acknowledged && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.acknowledgeText}>
                I acknowledge that I have received and reviewed the Truth in Lending and RESPA disclosures
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !acknowledged && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!acknowledged}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue Application</Text>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  disclosureCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  paymentSchedule: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  scheduleValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  additionalCosts: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  costsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  costsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  noticeBox: {
    backgroundColor: colors.infoLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  acknowledgeText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    ...colors.shadow,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
  },
});
