import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, Lock, ChevronRight, CheckCircle, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function IntegrationPrompt() {
  const { 
    hasConnectedBank, 
    bankConnectionDismissed, 
    connectBank, 
    dismissBankConnection 
  } = useApp();

  if (hasConnectedBank) {
    return (
      <View style={styles.connectedCard}>
        <View style={styles.connectedHeader}>
          <View style={styles.connectedIcon}>
            <CheckCircle color={colors.success} size={16} strokeWidth={3} />
          </View>
          <Text style={styles.connectedTitle}>Accounts Connected</Text>
        </View>
        <Text style={styles.connectedSubtext}>
          Experian and Chase Bank linked · Last updated just now
        </Text>
      </View>
    );
  }

  if (bankConnectionDismissed) {
    return (
      <TouchableOpacity style={styles.reminderCard} onPress={connectBank} activeOpacity={0.7}>
        <View style={styles.reminderContent}>
          <View style={styles.reminderIcon}>
            <Shield color={colors.primary} size={18} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.reminderTitle}>Complete Your Profile</Text>
            <Text style={styles.reminderSubtext}>Connect accounts for better rates</Text>
          </View>
        </View>
        <ChevronRight color={colors.textTertiary} size={20} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.surface, colors.surface]}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lock color={colors.primary} size={24} strokeWidth={2.5} />
          </View>
          <TouchableOpacity onPress={dismissBankConnection} hitSlop={10}>
            <X color={colors.textTertiary} size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Unlock Accurate Rates</Text>
        <Text style={styles.description}>
          Connect your credit and bank info to see real loan matches and exact savings estimates.
        </Text>

        <View style={styles.trustBadges}>
          <View style={styles.badge}>
            <Shield color={colors.textSecondary} size={12} />
            <Text style={styles.badgeText}>Bank-level Security</Text>
          </View>
          <View style={styles.badge}>
            <Lock color={colors.textSecondary} size={12} />
            <Text style={styles.badgeText}>256-bit Encryption</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.connectButton} 
            onPress={connectBank}
            activeOpacity={0.8}
          >
            <Text style={styles.connectButtonText}>Connect Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.laterButton} 
            onPress={dismissBankConnection}
            activeOpacity={0.7}
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 28,
    marginBottom: 24,
    borderRadius: 20,
    ...colors.shadowMedium,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceTertiary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  laterButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  laterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reminderCard: {
    marginHorizontal: 28,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...colors.shadow,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  reminderSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  connectedCard: {
    marginHorizontal: 28,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  connectedIcon: {
    marginRight: 2,
  },
  connectedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  connectedSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 26,
  },
});
