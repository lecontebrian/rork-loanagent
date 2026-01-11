import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Building2, Plus, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConnectedAccountsScreen() {
  const router = useRouter();
  const { hasConnectedBank, connectBank } = useApp();
  const insets = useSafeAreaInsets();

  const handleConnectBank = () => {
    Alert.alert(
      'Connect Bank Account',
      'Connect your bank account securely using Plaid',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Connect', 
          onPress: () => {
            connectBank();
            Alert.alert('Success', 'Bank account connected successfully!');
          }
        }
      ]
    );
  };

  const handleDisconnectBank = () => {
    Alert.alert(
      'Disconnect Bank Account',
      'Are you sure you want to disconnect your bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => console.log('Disconnected') }
      ]
    );
  };

  const handleConnectCreditBureau = () => {
    Alert.alert('Connect Credit Bureau', 'Feature coming soon - Link your credit bureau accounts to track your credit score');
  };

  const handleConnectPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'Feature coming soon - Add a credit or debit card for payments');
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
            <Text style={styles.headerTitle}>Connected Accounts</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BANKING</Text>
              {hasConnectedBank ? (
                <View style={styles.settingsGroup}>
                  <ConnectedAccountItem
                    icon={<Building2 color={colors.success} size={20} strokeWidth={2} />}
                    title="Chase Bank"
                    subtitle="****1234 - Connected"
                    status="connected"
                    onPress={handleDisconnectBank}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addAccountButton}
                  onPress={handleConnectBank}
                  activeOpacity={0.7}
                >
                  <View style={styles.addIconContainer}>
                    <Plus color={colors.primary} size={24} strokeWidth={2} />
                  </View>
                  <View style={styles.addTextContainer}>
                    <Text style={styles.addTitle}>Connect Bank Account</Text>
                    <Text style={styles.addSubtitle}>Securely link your bank via Plaid</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CREDIT MONITORING</Text>
              <TouchableOpacity
                style={styles.addAccountButton}
                onPress={handleConnectCreditBureau}
                activeOpacity={0.7}
              >
                <View style={styles.addIconContainer}>
                  <Plus color={colors.primary} size={24} strokeWidth={2} />
                </View>
                <View style={styles.addTextContainer}>
                  <Text style={styles.addTitle}>Connect Credit Bureau</Text>
                  <Text style={styles.addSubtitle}>Link Experian, Equifax, or TransUnion</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PAYMENT METHODS</Text>
              <TouchableOpacity
                style={styles.addAccountButton}
                onPress={handleConnectPaymentMethod}
                activeOpacity={0.7}
              >
                <View style={styles.addIconContainer}>
                  <Plus color={colors.primary} size={24} strokeWidth={2} />
                </View>
                <View style={styles.addTextContainer}>
                  <Text style={styles.addTitle}>Add Payment Method</Text>
                  <Text style={styles.addSubtitle}>Credit or debit card for payments</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <AlertCircle color={colors.primary} size={20} strokeWidth={2} />
              <Text style={styles.infoText}>
                Your financial data is encrypted and securely stored. We never store your banking credentials.
              </Text>
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function ConnectedAccountItem({
  icon,
  title,
  subtitle,
  status,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: 'connected' | 'disconnected';
  onPress: () => void;
}) {
  return (
    <View style={styles.connectedItem}>
      <View style={[styles.connectedIcon, { backgroundColor: status === 'connected' ? '#E6F7ED' : '#FFE6E6' }]}>
        {icon}
      </View>
      <View style={styles.connectedContent}>
        <Text style={styles.connectedTitle}>{title}</Text>
        <Text style={styles.connectedSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.disconnectButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.disconnectText}>Disconnect</Text>
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...colors.shadow,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 20,
    ...colors.shadow,
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addTextContainer: {
    flex: 1,
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  addSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  connectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  connectedIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  connectedContent: {
    flex: 1,
  },
  connectedTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  connectedSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFE6E6',
  },
  disconnectText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.error,
    letterSpacing: -0.1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 28,
    marginTop: 24,
    gap: 12,
    ...colors.shadow,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  bottomPadding: {
    height: 40,
  },
});
