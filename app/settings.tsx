import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut, Trash2, ChevronRight, Shield, CreditCard, Palette, Download, FileText, MessageCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import React from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const router = useRouter();
  const { userProfile, reset } = useApp();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/' as any);
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your data and applications. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/' as any);
          },
        },
      ]
    );
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
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <View style={styles.content}>
            <View style={styles.profileSection}>
              <LinearGradient
                colors={['#0A84FF', '#5E5CE6']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>
                  {userProfile?.firstName?.[0] || 'U'}{userProfile?.lastName?.[0] || ''}
                </Text>
              </LinearGradient>
              <Text style={styles.profileName}>
                {userProfile?.firstName || 'User'} {userProfile?.lastName || ''}
              </Text>
              <Text style={styles.profileEmail}>{userProfile?.email || 'user@example.com'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACCOUNT</Text>
              <View style={styles.settingsGroup}>
                <SettingItem
                  icon={<User color={colors.primary} size={20} strokeWidth={2} />}
                  title="Profile Information"
                  subtitle="Update your personal details"
                  onPress={() => router.push('/settings/profile' as any)}
                />
                <SettingItem
                  icon={<Lock color={colors.primary} size={20} strokeWidth={2} />}
                  title="Security & Privacy"
                  subtitle="Password, biometrics, and privacy"
                  onPress={() => router.push('/settings/security' as any)}
                />
                <SettingItem
                  icon={<CreditCard color={colors.primary} size={20} strokeWidth={2} />}
                  title="Connected Accounts"
                  subtitle="Bank accounts and integrations"
                  onPress={() => router.push('/settings/accounts' as any)}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PREFERENCES</Text>
              <View style={styles.settingsGroup}>
                <SettingItem
                  icon={<Bell color={colors.primary} size={20} strokeWidth={2} />}
                  title="Notifications"
                  subtitle="Manage your notification preferences"
                  onPress={() => router.push('/settings/notifications' as any)}
                />
                <SettingItem
                  icon={<Palette color={colors.primary} size={20} strokeWidth={2} />}
                  title="App Preferences"
                  subtitle="Theme, language, and display options"
                  onPress={() => router.push('/settings/preferences' as any)}
                />
                <SettingItem
                  icon={<Download color={colors.primary} size={20} strokeWidth={2} />}
                  title="Data & Storage"
                  subtitle="Manage your data and backups"
                  onPress={() => router.push('/settings/data' as any)}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LEGAL & COMPLIANCE</Text>
              <View style={styles.settingsGroup}>
                <SettingItem
                  icon={<Shield color={colors.primary} size={20} strokeWidth={2} />}
                  title="Regulatory Disclosures"
                  subtitle="TILA, RESPA, ECOA, and other disclosures"
                  onPress={() => router.push('/legal-compliance' as any)}
                />
                <SettingItem
                  icon={<Shield color={colors.primary} size={20} strokeWidth={2} />}
                  title="Consumer Rights"
                  subtitle="Your rights and protections"
                  onPress={() => router.push('/consumer-rights' as any)}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUPPORT</Text>
              <View style={styles.settingsGroup}>
                <SettingItem
                  icon={<HelpCircle color={colors.primary} size={20} strokeWidth={2} />}
                  title="Help & Support"
                  subtitle="Get help with your account"
                  onPress={() => router.push('/settings/help' as any)}
                />
                <SettingItem
                  icon={<MessageCircle color={colors.primary} size={20} strokeWidth={2} />}
                  title="Contact Us"
                  subtitle="Send us a message"
                  onPress={() => router.push('/settings/contact' as any)}
                />
                <SettingItem
                  icon={<FileText color={colors.primary} size={20} strokeWidth={2} />}
                  title="Terms & Policies"
                  subtitle="Privacy policy and terms of service"
                  onPress={() => router.push('/settings/terms' as any)}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACTIONS</Text>
              <View style={styles.settingsGroup}>
                <SettingItem
                  icon={<LogOut color={colors.error} size={20} strokeWidth={2} />}
                  title="Logout"
                  subtitle="Sign out of your account"
                  onPress={handleLogout}
                  danger
                />
                <SettingItem
                  icon={<Trash2 color={colors.error} size={20} strokeWidth={2} />}
                  title="Clear All Data"
                  subtitle="Delete all data and start fresh"
                  onPress={handleClearData}
                  danger
                  showDivider
                />
              </View>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Loan Agent v1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
  showDivider?: boolean;
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.settingIcon, { backgroundColor: danger ? colors.accentTint : colors.primaryTint }]}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>
            {title}
          </Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2} />
      </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...colors.shadowMedium,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -1,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 32,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  settingTitleDanger: {
    color: colors.error,
  },
  settingSubtitle: {
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
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
  },
});
