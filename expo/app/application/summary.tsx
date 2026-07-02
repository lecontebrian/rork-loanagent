import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { Check, Download, Share, Bot } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function ApplicationSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const formData = React.useMemo(() => {
    if (!params.data) return null;
    try {
      const dataStr = Array.isArray(params.data) ? params.data[0] : params.data;
      if (typeof dataStr === 'string' && dataStr !== '[object Object]') {
        return JSON.parse(decodeURIComponent(dataStr));
      }
    } catch (e) {
      console.error('Error parsing params.data', e);
    }
    return null;
  }, [params.data]);
  const insets = useSafeAreaInsets();
  // const { addApplication } = useApp();
  
  const [submitting, setSubmitting] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    setTimeout(() => {
      console.log('Application submitted:', formData);
      setSubmitting(false);
      const lenderName = formData?.lenderName || 'Lender';
      const amount = formData?.amount || formData?.employmentInfo?.currentAnnualIncome || 15000;
      router.replace(`/application/pending-review?lenderName=${encodeURIComponent(lenderName)}&amount=${amount}` as any);
    }, 2000);
  };

  const handleExport = () => {
    Alert.alert('Export', 'Application data would be exported here in a real implementation.');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Application would be shared here in a real implementation.');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Application Summary</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.successBanner}>
              <LinearGradient
                colors={['#30D158', '#28B349']}
                style={styles.successGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.successIcon}>
                  <Check color={colors.white} size={32} strokeWidth={3} />
                </View>
                <Text style={styles.successTitle}>Ready to Submit</Text>
                <Text style={styles.successSubtitle}>
                  Review your application before final submission
                </Text>
              </LinearGradient>
            </View>

            {formData?.employmentInfo && (
              <SectionCard title="Employment Information">
                <DataRow label="Current Employer" value={formData.employmentInfo.currentEmployer} />
                <DataRow label="Position" value={formData.employmentInfo.currentPosition} />
                <DataRow label="Annual Income" value={`$${formData.employmentInfo.currentAnnualIncome?.toLocaleString()}`} />
                <DataRow label="Employment Type" value={formData.employmentInfo.employmentType} />
              </SectionCard>
            )}

            {formData?.financialInfo && (
              <SectionCard title="Financial Information">
                <DataRow label="Monthly Income" value={`$${formData.financialInfo.monthlyIncome?.toLocaleString()}`} />
                <DataRow label="Monthly Expenses" value={`$${formData.financialInfo.monthlyExpenses?.toLocaleString()}`} />
                {formData.financialInfo.hasExistingDebts && (
                  <DataRow label="Monthly Debt Payments" value={`$${formData.financialInfo.totalMonthlyDebtPayments?.toLocaleString()}`} />
                )}
              </SectionCard>
            )}

            {formData?.references && (
              <SectionCard title="Personal References">
                <DataRow label="Primary Reference" value={formData.references.reference1Name} />
                <DataRow label="Phone" value={formData.references.reference1Phone} />
                <DataRow label="Relationship" value={formData.references.reference1Relationship} />
              </SectionCard>
            )}

            {formData?.driversLicense && (
              <SectionCard title="Driver's License">
                <DataRow label="License Number" value={formData.driversLicense.licenseNumber} />
                <DataRow label="State" value={formData.driversLicense.state} />
                <DataRow label="Expiration" value={formData.driversLicense.expirationDate} />
              </SectionCard>
            )}

            {formData?.ndaAccepted && (
              <SectionCard title="Legal Agreements">
                <DataRow label="NDA Accepted" value="Yes" />
                <DataRow label="Accepted Date" value={new Date(formData.ndaAcceptedDate).toLocaleDateString()} />
                <DataRow label="Signature Date" value={new Date(formData.signatureDate).toLocaleDateString()} />
              </SectionCard>
            )}

            <TouchableOpacity
              style={styles.agentButton}
              onPress={() => router.push('/loan-agent' as any)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#0A84FF', '#30D158']}
                style={styles.agentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Bot color={colors.white} size={22} strokeWidth={2} />
                <View style={styles.agentTextContainer}>
                  <Text style={styles.agentLabel}>Review with AI Loan Agent</Text>
                  <Text style={styles.agentSubLabel}>
                    Multi-agent pipeline: DTI, LTV, risk analysis & policy review
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleExport}
                activeOpacity={0.7}
              >
                <Download color={colors.primary} size={20} strokeWidth={2} />
                <Text style={styles.actionButtonText}>Export PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Share color={colors.primary} size={20} strokeWidth={2} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={submitting ? [colors.textTertiary, colors.textTertiary] : ['#0A84FF', '#5E5CE6']}
              style={styles.submitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  successBanner: {
    marginBottom: 28,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  successGradient: {
    padding: 32,
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 16,
    ...colors.shadowMedium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionContent: {
    gap: 14,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
    flex: 1,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
    textAlign: 'right',
    flex: 1,
  },
  agentButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...colors.shadowMedium,
  },
  agentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  agentTextContainer: {
    flex: 1,
  },
  agentLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  agentSubLabel: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
    marginTop: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  footer: {
    padding: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
