import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, X, Crown, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { TIER_CONFIG, TOKEN_ACTIONS } from '@/constants/premium';
import colors from '@/constants/colors';

interface TokenGateProps {
  actionType: keyof typeof TOKEN_ACTIONS;
  onSuccess: () => void;
  onCancel?: () => void;
  children: (handleAction: () => void) => ReactNode;
}

export default function TokenGate({ actionType, onSuccess, onCancel, children }: TokenGateProps) {
  const { tokens, subscriptionTier, consumeToken } = useApp();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const action = TOKEN_ACTIONS[actionType];
  const currentTier = TIER_CONFIG[subscriptionTier];
  const canAfford = tokens >= action.cost;

  const handleAction = () => {
    if (canAfford) {
      const success = consumeToken();
      if (success) {
        onSuccess();
      }
    } else {
      setShowModal(true);
    }
  };

  const handleUpgrade = () => {
    setShowModal(false);
    router.push('/premium' as any);
  };

  const handleContinue = () => {
    setShowModal(false);
    if (onCancel) {
      onCancel();
    }
  };

  const getUpgradeMessage = () => {
    if (subscriptionTier === 'basic') {
      return {
        title: 'Out of Tokens',
        message: `You've used all your free tokens. Upgrade to Plus for 20 tokens/month or Pro for 80 tokens/month.`,
        ctaPrimary: 'Upgrade to Plus',
        ctaSecondary: 'Continue with Basic',
      };
    } else if (subscriptionTier === 'plus') {
      return {
        title: 'Token Limit Reached',
        message: `You've used all your Plus tokens this month. Upgrade to Pro for 80 tokens/month and never worry about running out.`,
        ctaPrimary: 'Upgrade to Pro',
        ctaSecondary: 'Continue with Plus',
      };
    } else {
      return {
        title: 'No Tokens Available',
        message: `You've used all your tokens this month. Your tokens will refresh on your next billing date.`,
        ctaPrimary: 'View Plans',
        ctaSecondary: 'Got It',
      };
    }
  };

  const upgradeInfo = getUpgradeMessage();

  return (
    <>
      {children(handleAction)}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleContinue}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1A1A1A', '#0F0F0F']}
              style={styles.gradientBackground}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleContinue}
              activeOpacity={0.7}
            >
              <X color={colors.white} size={20} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Zap color="#FFA500" size={48} fill="#FFA500" />
            </View>

            <Text style={styles.modalTitle}>{upgradeInfo.title}</Text>
            <Text style={styles.modalMessage}>{upgradeInfo.message}</Text>

            <View style={styles.actionInfo}>
              <AlertCircle color={colors.textSecondary} size={16} />
              <Text style={styles.actionText}>
                This action requires {action.cost} token: <Text style={styles.actionName}>{action.name}</Text>
              </Text>
            </View>

            <View style={styles.currentStatus}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Current Plan</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusValue}>{currentTier.name}</Text>
                </View>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Tokens Left</Text>
                <View style={[styles.statusBadge, styles.tokensBadge]}>
                  <Zap color="#FF4444" size={14} fill="#FF4444" />
                  <Text style={[styles.statusValue, styles.noTokens]}>{tokens}</Text>
                </View>
              </View>
            </View>

            {subscriptionTier !== 'pro' && (
              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>Upgrade Benefits:</Text>
                {subscriptionTier === 'basic' ? (
                  <>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>20 tokens/month with Plus</Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>80 tokens/month with Pro</Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>Advanced features & priority support</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>80 tokens/month (4x more than Plus)</Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>Business tools & AI integration</Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Crown color={colors.primary} size={16} />
                      <Text style={styles.benefitText}>Concierge support & faster responses</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.primary, '#0EA52B']}
                  style={styles.upgradeButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeButtonText}>{upgradeInfo.ctaPrimary}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.7}
              >
                <Text style={styles.continueButtonText}>{upgradeInfo.ctaSecondary}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionName: {
    fontWeight: '600' as const,
    color: colors.white,
  },
  currentStatus: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  tokensBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  noTokens: {
    color: '#FF4444',
  },
  benefitsSection: {
    backgroundColor: 'rgba(25, 197, 52, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    flex: 1,
  },
  buttonsContainer: {
    gap: 12,
  },
  upgradeButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  continueButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
});
