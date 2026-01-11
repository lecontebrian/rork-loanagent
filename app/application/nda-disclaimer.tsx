import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function NDADisclaimerScreen() {
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
  
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  
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

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isCloseToBottom && !scrolledToBottom) {
      setScrolledToBottom(true);
    }
  };

  const handleContinue = () => {
    if (!agreed) return;
    
    const updatedFormData = {
      ...formData,
      ndaAccepted: true,
      ndaAcceptedDate: new Date().toISOString(),
    };
    
    router.push(`/application/license-scan?data=${encodeURIComponent(JSON.stringify(updatedFormData))}` as any);
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
            <Text style={styles.headerTitle}>Disclosure & Agreement</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Shield color={colors.primary} size={40} strokeWidth={2} />
              </View>
            </View>

            <Text style={styles.title}>Non-Disclosure Agreement & Privacy Policy</Text>
            <Text style={styles.subtitle}>
              Please read carefully before proceeding with your loan application
            </Text>

            <View style={styles.disclaimerCard}>
              <View style={styles.disclaimerHeader}>
                <AlertCircle color={colors.warning} size={20} strokeWidth={2} />
                <Text style={styles.disclaimerHeaderText}>Important Notice</Text>
              </View>
              <Text style={styles.disclaimerText}>
                By proceeding with this application, you acknowledge that you have read and understood the terms outlined below.
              </Text>
            </View>

            <View style={styles.termsContainer}>
              <Section 
                title="1. Information Collection" 
                content="We collect personal information including but not limited to: full name, date of birth, Social Security Number, employment history, income information, financial statements, credit history, and contact information. This information is necessary to process your loan application and determine eligibility."
              />
              
              <Section 
                title="2. Use of Information" 
                content="Your information will be used solely for the purpose of processing your loan application, verifying your identity, assessing creditworthiness, and complying with legal requirements. We may share your information with credit bureaus, lending institutions, and verification services as part of the normal loan application process."
              />
              
              <Section 
                title="3. Confidentiality" 
                content="All information provided will be kept strictly confidential and will not be sold, rented, or shared with third parties except as required for loan processing or as mandated by law. We employ bank-level security measures including 256-bit encryption to protect your data."
              />
              
              <Section 
                title="4. Credit Check Authorization" 
                content="By accepting these terms, you authorize us to obtain your credit report from one or more credit reporting agencies for the purpose of evaluating your loan application. This may result in a hard inquiry on your credit report."
              />
              
              <Section 
                title="5. Accuracy of Information" 
                content="You certify that all information provided in this application is true, accurate, and complete to the best of your knowledge. You understand that providing false or misleading information may result in denial of your application or legal action."
              />
              
              <Section 
                title="6. Electronic Signature" 
                content="You agree that your electronic signature on this application has the same legal effect as a handwritten signature. Your electronic signature indicates your intent to be bound by these terms and the information provided in your application."
              />
              
              <Section 
                title="7. Data Retention" 
                content="We will retain your personal information for the duration of the loan application process and for a period thereafter as required by law or as necessary for our legitimate business purposes, including regulatory compliance and dispute resolution."
              />
              
              <Section 
                title="8. Your Rights" 
                content="You have the right to access, correct, or request deletion of your personal information at any time, subject to legal and regulatory requirements. You may also withdraw your consent for data processing, which may result in the inability to process your loan application."
              />
              
              <Section 
                title="9. Contact Information" 
                content="If you have any questions about this agreement or how we handle your information, please contact our Privacy Officer at privacy@loanagent.com or call 1-800-LOANAGENT."
              />
              
              <Section 
                title="10. Amendments" 
                content="We reserve the right to modify this agreement at any time. Any changes will be communicated to you and will take effect immediately upon posting. Continued use of our services constitutes acceptance of any modifications."
              />
            </View>

            {scrolledToBottom && (
              <Animated.View 
                style={[
                  styles.agreementSection,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreed(!agreed)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                    {agreed && <View style={styles.checkboxCheck} />}
                  </View>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxLabel}>
                      I have read and agree to the terms and conditions
                    </Text>
                    <Text style={styles.checkboxSubtext}>
                      By checking this box, you consent to our collection and use of your information as described above
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}

            {!scrolledToBottom && (
              <View style={styles.scrollPrompt}>
                <AlertCircle color={colors.textSecondary} size={18} strokeWidth={2} />
                <Text style={styles.scrollPromptText}>
                  Please scroll to the bottom to continue
                </Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>

        {scrolledToBottom && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !agreed && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!agreed}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={agreed ? ['#0A84FF', '#5E5CE6'] : [colors.textTertiary, colors.textTertiary]}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>Continue to ID Verification</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadowMedium,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  disclaimerCard: {
    padding: 20,
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.warning + '40',
    marginBottom: 28,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  disclaimerHeaderText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  disclaimerText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
  termsContainer: {
    gap: 24,
    marginBottom: 32,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 23,
    letterSpacing: -0.1,
  },
  agreementSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    width: 14,
    height: 14,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  checkboxTextContainer: {
    flex: 1,
    gap: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  checkboxSubtext: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  scrollPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 14,
    marginBottom: 24,
  },
  scrollPromptText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  footer: {
    padding: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
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
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
