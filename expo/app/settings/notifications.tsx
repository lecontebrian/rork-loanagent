import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Mail, MessageSquare, DollarSign, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { notificationsEnabled, toggleNotifications } = useApp();
  const insets = useSafeAreaInsets();

  const [pushNotifications, setPushNotifications] = useState(notificationsEnabled);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const [loanUpdates, setLoanUpdates] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [newOffers, setNewOffers] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [creditScoreChanges, setCreditScoreChanges] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(true);

  const handlePushToggle = (value: boolean) => {
    setPushNotifications(value);
    toggleNotifications(value);
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
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>NOTIFICATION CHANNELS</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<Bell color={colors.primary} size={20} strokeWidth={2} />}
                  title="Push Notifications"
                  subtitle="Get notified on your device"
                  value={pushNotifications}
                  onValueChange={handlePushToggle}
                />
                <ToggleItem
                  icon={<Mail color={colors.primary} size={20} strokeWidth={2} />}
                  title="Email Notifications"
                  subtitle="Receive updates via email"
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                />
                <ToggleItem
                  icon={<MessageSquare color={colors.primary} size={20} strokeWidth={2} />}
                  title="SMS Notifications"
                  subtitle="Get text message alerts"
                  value={smsNotifications}
                  onValueChange={setSmsNotifications}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LOAN & PAYMENT ALERTS</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<DollarSign color={colors.primary} size={20} strokeWidth={2} />}
                  title="Loan Updates"
                  subtitle="Changes to your loan status"
                  value={loanUpdates}
                  onValueChange={setLoanUpdates}
                />
                <ToggleItem
                  icon={<AlertCircle color={colors.primary} size={20} strokeWidth={2} />}
                  title="Payment Reminders"
                  subtitle="Upcoming payment due dates"
                  value={paymentReminders}
                  onValueChange={setPaymentReminders}
                />
                <ToggleItem
                  icon={<CheckCircle color={colors.primary} size={20} strokeWidth={2} />}
                  title="Application Status"
                  subtitle="Updates on your applications"
                  value={applicationStatus}
                  onValueChange={setApplicationStatus}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FINANCIAL INSIGHTS</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<TrendingUp color={colors.primary} size={20} strokeWidth={2} />}
                  title="Credit Score Changes"
                  subtitle="When your credit score updates"
                  value={creditScoreChanges}
                  onValueChange={setCreditScoreChanges}
                />
                <ToggleItem
                  icon={<Bell color={colors.primary} size={20} strokeWidth={2} />}
                  title="New Loan Offers"
                  subtitle="Personalized loan opportunities"
                  value={newOffers}
                  onValueChange={setNewOffers}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MARKETING</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<Mail color={colors.primary} size={20} strokeWidth={2} />}
                  title="Marketing Emails"
                  subtitle="Product updates and promotions"
                  value={marketingEmails}
                  onValueChange={setMarketingEmails}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.noticeBox}>
              <AlertCircle color={colors.textSecondary} size={20} strokeWidth={2} />
              <Text style={styles.noticeText}>
                Some notifications are required for account security and cannot be disabled.
              </Text>
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function ToggleItem({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
}) {
  return (
    <>
      <View style={styles.toggleItem}>
        <View style={styles.toggleIcon}>
          {icon}
        </View>
        <View style={styles.toggleContent}>
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.borderSecondary, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
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
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: colors.primaryTint,
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSecondary,
    marginLeft: 74,
  },
  noticeBox: {
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
  noticeText: {
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
