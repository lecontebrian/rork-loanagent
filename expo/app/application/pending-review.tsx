import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Clock, CheckCircle, FileText, Phone, ArrowRight, Home } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PendingReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const lenderName = params.lenderName ? decodeURIComponent(params.lenderName as string) : 'Lender';
  const amount = params.amount as string || '0';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const handleGoToDashboard = () => {
    router.replace('/dashboard' as any);
  };

  const steps = [
    {
      icon: <FileText color={colors.success} size={20} strokeWidth={2} />,
      title: 'Application Received',
      description: 'Your application has been submitted successfully',
      completed: true,
    },
    {
      icon: <Clock color={colors.warning} size={20} strokeWidth={2} />,
      title: 'Under Review',
      description: 'Our team is reviewing your application',
      completed: false,
      current: true,
    },
    {
      icon: <CheckCircle color={colors.textTertiary} size={20} strokeWidth={2} />,
      title: 'Decision',
      description: 'You will be notified of the decision',
      completed: false,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
            <Animated.View 
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Clock color={colors.white} size={48} strokeWidth={2} />
              </LinearGradient>
            </Animated.View>

            <Text style={styles.title}>Application Pending Review</Text>
            <Text style={styles.subtitle}>
              Your application for ${Number(amount).toLocaleString()} with {lenderName} has been submitted and is now being reviewed by our staff.
            </Text>

            <View style={styles.estimateCard}>
              <View style={styles.estimateHeader}>
                <Clock color={colors.warning} size={18} strokeWidth={2} />
                <Text style={styles.estimateLabel}>Estimated Review Time</Text>
              </View>
              <Text style={styles.estimateValue}>1-2 Business Days</Text>
              <Text style={styles.estimateNote}>
                You will receive a notification once your application has been reviewed
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Application Status</Text>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepIconContainer}>
                    <View style={[
                      styles.stepIconBg,
                      step.completed && styles.stepIconBgCompleted,
                      step.current && styles.stepIconBgCurrent,
                    ]}>
                      {step.icon}
                    </View>
                    {index < steps.length - 1 && (
                      <View style={[
                        styles.stepLine,
                        step.completed && styles.stepLineCompleted,
                      ]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleCompleted,
                      step.current && styles.stepTitleCurrent,
                    ]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                  {step.completed && (
                    <View style={styles.stepCheck}>
                      <CheckCircle color={colors.success} size={18} strokeWidth={2.5} />
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What happens next?</Text>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>
                  Our team will verify your information and documents
                </Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>
                  You may be contacted for additional information if needed
                </Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>
                  Once approved, funds will be disbursed to your account
                </Text>
              </View>
            </View>

            <View style={styles.contactCard}>
              <Phone color={colors.primary} size={20} strokeWidth={2} />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Need Help?</Text>
                <Text style={styles.contactText}>
                  Contact our support team if you have any questions
                </Text>
              </View>
              <ArrowRight color={colors.textTertiary} size={18} strokeWidth={2} />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={handleGoToDashboard}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#0A84FF', '#5E5CE6']}
              style={styles.dashboardButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Home color={colors.white} size={20} strokeWidth={2} />
              <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 28,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
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
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  estimateCard: {
    width: '100%',
    padding: 24,
    backgroundColor: colors.warningLight,
    borderRadius: 20,
    marginBottom: 28,
    alignItems: 'center',
  },
  estimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  estimateLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.warning,
    letterSpacing: -0.2,
  },
  estimateValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  estimateNote: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconBgCompleted: {
    backgroundColor: colors.successLight,
  },
  stepIconBgCurrent: {
    backgroundColor: colors.warningLight,
  },
  stepLine: {
    width: 2,
    height: 32,
    backgroundColor: colors.border,
    marginTop: 8,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  stepTitleCompleted: {
    color: colors.success,
  },
  stepTitleCurrent: {
    color: colors.warning,
  },
  stepDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
  },
  stepCheck: {
    paddingTop: 2,
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  contactCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dashboardButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  dashboardButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  dashboardButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
