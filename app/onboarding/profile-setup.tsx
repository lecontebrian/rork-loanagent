import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, DollarSign, Building2, CheckCircle, Shield, CreditCard, Landmark, ChevronRight, Zap, Lock } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { UserProfile, CreditInfo } from '@/types';
import * as Haptics from 'expo-haptics';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUserProfile, setCreditInfo, connectBank } = useApp();
  
  const [formData, setFormData] = useState({
    annualIncome: '',
    employer: '',
    employmentStatus: '',
  });
  
  const [experianConnected, setExperianConnected] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [purchasingPower, setPurchasingPower] = useState<number | null>(null);
  const [isConnectingExperian, setIsConnectingExperian] = useState(false);
  const [isConnectingBank, setIsConnectingBank] = useState(false);

  const experianAnim = useRef(new Animated.Value(0)).current;
  const bankAnim = useRef(new Animated.Value(0)).current;
  const purchasingPowerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (experianConnected && bankConnected && formData.annualIncome) {
      const income = Number(formData.annualIncome) || 0;
      const score = creditScore || 700;
      
      let multiplier = 0.3;
      if (score >= 800) multiplier = 0.5;
      else if (score >= 740) multiplier = 0.45;
      else if (score >= 670) multiplier = 0.35;
      else if (score >= 580) multiplier = 0.25;
      else multiplier = 0.15;
      
      const power = Math.round(income * multiplier);
      setPurchasingPower(power);
      
      Animated.spring(purchasingPowerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [experianConnected, bankConnected, formData.annualIncome, creditScore, purchasingPowerAnim]);

  const handleConnectExperian = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsConnectingExperian(true);
    
    setTimeout(() => {
      const simulatedScore = Math.floor(Math.random() * (850 - 580)) + 580;
      setCreditScore(simulatedScore);
      setExperianConnected(true);
      setIsConnectingExperian(false);
      
      Animated.spring(experianAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 2000);
  };

  const handleConnectBank = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsConnectingBank(true);
    
    setTimeout(() => {
      setBankConnected(true);
      setIsConnectingBank(false);
      connectBank();
      
      Animated.spring(bankAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 2000);
  };

  const handleContinue = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '01/01/1990',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
      },
      employment: {
        status: 'employed' as const,
        employer: formData.employer || 'Acme Corp',
        annualIncome: Number(formData.annualIncome) || 75000,
        monthsEmployed: 24,
      },
      faceVerified: false,
      idVerified: false,
    };

    const score = creditScore || 720;
    let rating: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
    if (score >= 740) rating = 'excellent';
    else if (score >= 670) rating = 'good';
    else if (score >= 580) rating = 'fair';
    else rating = 'poor';

    const credit: CreditInfo = {
      score,
      rating,
      lastUpdated: new Date().toISOString(),
      factors: {
        paymentHistory: Math.floor(Math.random() * 20) + 80,
        creditUtilization: Math.floor(Math.random() * 30) + 10,
        creditAge: Math.floor(Math.random() * 30) + 50,
        creditMix: Math.floor(Math.random() * 20) + 70,
        newCredit: Math.floor(Math.random() * 20) + 75,
      },
    };

    setUserProfile(profile);
    setCreditInfo(credit);
    router.push('/subscription' as any);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return '#059669';
    if (score >= 740) return '#10B981';
    if (score >= 670) return colors.primary;
    if (score >= 580) return '#F59E0B';
    return '#EF4444';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const canContinue = formData.annualIncome && experianConnected && bankConnected;

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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.description}>
              Connect your accounts to unlock your purchasing power and get personalized loan offers
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Income Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Annual Income</Text>
                <View style={[styles.inputWrapper, formData.annualIncome && styles.inputWrapperFocused]}>
                  <DollarSign color={colors.textSecondary} size={20} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    placeholder="75,000"
                    placeholderTextColor={colors.textTertiary}
                    value={formData.annualIncome}
                    onChangeText={(text) => setFormData({ ...formData, annualIncome: text.replace(/[^0-9]/g, '') })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Employer (Optional)</Text>
                <View style={[styles.inputWrapper, formData.employer && styles.inputWrapperFocused]}>
                  <Building2 color={colors.textSecondary} size={20} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    placeholder="Company name"
                    placeholderTextColor={colors.textTertiary}
                    value={formData.employer}
                    onChangeText={(text) => setFormData({ ...formData, employer: text })}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Link Your Accounts</Text>
              <Text style={styles.sectionDescription}>
                Securely connect to verify your financial profile
              </Text>

              <TouchableOpacity
                style={[
                  styles.linkCard,
                  experianConnected && styles.linkCardConnected,
                  isConnectingExperian && styles.linkCardLoading,
                ]}
                onPress={handleConnectExperian}
                disabled={experianConnected || isConnectingExperian}
                activeOpacity={0.8}
              >
                <View style={[styles.linkIconContainer, experianConnected && styles.linkIconConnected]}>
                  {experianConnected ? (
                    <CheckCircle color={colors.white} size={24} strokeWidth={2} />
                  ) : (
                    <CreditCard color={experianConnected ? colors.white : colors.primary} size={24} strokeWidth={2} />
                  )}
                </View>
                <View style={styles.linkContent}>
                  <View style={styles.linkHeader}>
                    <Text style={styles.linkTitle}>Experian Credit</Text>
                    <View style={styles.secureTag}>
                      <Lock color={colors.textTertiary} size={10} strokeWidth={2.5} />
                      <Text style={styles.secureTagText}>Secure</Text>
                    </View>
                  </View>
                  <Text style={styles.linkDescription}>
                    {isConnectingExperian 
                      ? 'Connecting to Experian...' 
                      : experianConnected 
                        ? `Credit Score: ${creditScore}` 
                        : 'Pull your credit score instantly'}
                  </Text>
                  {experianConnected && creditScore && (
                    <Animated.View 
                      style={[
                        styles.creditScoreBadge,
                        { backgroundColor: getCreditScoreColor(creditScore) + '20' },
                        { opacity: experianAnim, transform: [{ scale: experianAnim }] }
                      ]}
                    >
                      <Text style={[styles.creditScoreText, { color: getCreditScoreColor(creditScore) }]}>
                        {getCreditScoreLabel(creditScore)}
                      </Text>
                    </Animated.View>
                  )}
                </View>
                {!experianConnected && !isConnectingExperian && (
                  <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.linkCard,
                  bankConnected && styles.linkCardConnected,
                  isConnectingBank && styles.linkCardLoading,
                ]}
                onPress={handleConnectBank}
                disabled={bankConnected || isConnectingBank}
                activeOpacity={0.8}
              >
                <View style={[styles.linkIconContainer, bankConnected && styles.linkIconConnected]}>
                  {bankConnected ? (
                    <CheckCircle color={colors.white} size={24} strokeWidth={2} />
                  ) : (
                    <Landmark color={bankConnected ? colors.white : colors.primary} size={24} strokeWidth={2} />
                  )}
                </View>
                <View style={styles.linkContent}>
                  <View style={styles.linkHeader}>
                    <Text style={styles.linkTitle}>Bank Account</Text>
                    <View style={styles.secureTag}>
                      <Shield color={colors.textTertiary} size={10} strokeWidth={2.5} />
                      <Text style={styles.secureTagText}>256-bit SSL</Text>
                    </View>
                  </View>
                  <Text style={styles.linkDescription}>
                    {isConnectingBank 
                      ? 'Connecting to your bank...' 
                      : bankConnected 
                        ? 'Bank account verified' 
                        : 'Verify income & account balance'}
                  </Text>
                </View>
                {!bankConnected && !isConnectingBank && (
                  <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {purchasingPower && (
              <Animated.View 
                style={[
                  styles.purchasingPowerCard,
                  { 
                    opacity: purchasingPowerAnim,
                    transform: [{ 
                      translateY: purchasingPowerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.purchasingPowerHeader}>
                  <Zap color={colors.primary} size={24} strokeWidth={2} />
                  <Text style={styles.purchasingPowerTitle}>Your Purchasing Power</Text>
                </View>
                <Text style={styles.purchasingPowerAmount}>
                  ${purchasingPower.toLocaleString()}
                </Text>
                <Text style={styles.purchasingPowerDescription}>
                  Based on your income and credit score, you may qualify for loans up to this amount
                </Text>
              </Animated.View>
            )}

            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Shield color={colors.primary} size={16} strokeWidth={2} />
                <Text style={styles.trustBadgeText}>Bank-level security</Text>
              </View>
              <View style={styles.trustBadge}>
                <Lock color={colors.primary} size={16} strokeWidth={2} />
                <Text style={styles.trustBadgeText}>Data encrypted</Text>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          {!canContinue && (
            <Text style={styles.footerHint}>
              Enter income and connect both accounts to continue
            </Text>
          )}
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
    paddingHorizontal: 24,
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  linkCardConnected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  linkCardLoading: {
    opacity: 0.7,
  },
  linkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  linkIconConnected: {
    backgroundColor: colors.primary,
  },
  linkContent: {
    flex: 1,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  secureTagText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  linkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  creditScoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  creditScoreText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  purchasingPowerCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    marginBottom: 24,
  },
  purchasingPowerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  purchasingPowerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  purchasingPowerAmount: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  purchasingPowerDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    ...colors.shadow,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textQuaternary,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  footerHint: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 12,
  },
});
