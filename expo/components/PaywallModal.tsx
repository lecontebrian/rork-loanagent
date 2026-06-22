import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { X, Check, Crown, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const { height } = Dimensions.get('window');

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  featureName: string;
  benefitDescription: string;
  context?: 'comparison' | 'simulation' | 'alerts' | 'generic';
}

export default function PaywallModal({ visible, onClose, featureName, benefitDescription, context = 'generic' }: PaywallModalProps) {
  const { upgradeToPremium } = useApp();
  const [show, setShow] = useState(visible);
  const slideAnim = useState(new Animated.Value(height))[0];
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const contextualFeatures = {
    comparison: [
      'Unlimited side-by-side comparisons',
      'Export-ready summary PDFs',
      'Smart highlight of best option',
    ],
    simulation: [
      'Unlimited what-if scenarios',
      'AI insights on payoff timeline',
      'Auto alerts when viable',
    ],
    alerts: [
      'Daily Experian + lender scans',
      'Push alerts when savings > $50/mo',
      'Concierge review before notifying',
    ],
    generic: [
      'Unlimited Loan Comparisons',
      'Advanced What-If Simulator',
      'Auto-Refinance Alerts',
      'Priority Concierge Support',
    ],
  };

  const features = contextualFeatures[context] || contextualFeatures.generic;

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShow(false));
    }
  }, [visible]);

  const handleUpgrade = () => {
    upgradeToPremium();
    onClose();
  };

  if (!show) return null;

  return (
    <Modal transparent visible={show} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={colors.textTertiary} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown color={colors.white} size={32} strokeWidth={2.5} />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Unlock {featureName}</Text>
            <Text style={styles.subtitle}>{benefitDescription}</Text>

            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.checkContainer}>
                    <Check color={colors.success} size={14} strokeWidth={3} />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.plansContainer}>
              <TouchableOpacity
                style={[styles.planCard, selectedPlan === 'yearly' && styles.selectedPlan]}
                onPress={() => setSelectedPlan('yearly')}
                activeOpacity={0.9}
              >
                {selectedPlan === 'yearly' && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>Annual</Text>
                  <Text style={styles.planPrice}>$99.99<Text style={styles.period}>/yr</Text></Text>
                </View>
                <Text style={styles.planSavings}>Save 17% ($8.33/mo)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlan]}
                onPress={() => setSelectedPlan('monthly')}
                activeOpacity={0.9}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>Monthly</Text>
                  <Text style={styles.planPrice}>$19.99<Text style={styles.period}>/mo</Text></Text>
                </View>
                <Text style={styles.planSavings}>Flexible, cancel anytime</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.privacyNote}>
              <Shield color={colors.textTertiary} size={14} />
              <Text style={styles.privacyText}>
                We respect your privacy. No data selling. Licensed lenders only.
              </Text>
            </View>

            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FFD700', '#FF8C00']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.upgradeText}>Unlock Premium for {selectedPlan === 'yearly' ? '$99.99' : '$19.99'}</Text>
                <Text style={styles.upgradeSubtext}>{selectedPlan === 'yearly' ? 'Per year • Cancel anytime' : 'Per month • Cancel anytime'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noThanksButton} onPress={onClose}>
              <Text style={styles.noThanksText}>Continue with Free Plan</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    ...colors.shadowStrong,
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadowMedium,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  plansContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  selectedPlan: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD700' + '10',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.black,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 8,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  period: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  planSavings: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.success,
    marginTop: 4,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    ...colors.shadowMedium,
  },
  upgradeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  upgradeSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  noThanksButton: {
    paddingVertical: 10,
  },
  noThanksText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
