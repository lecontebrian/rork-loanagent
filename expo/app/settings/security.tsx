import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Lock, ScanFace, Eye, Shield, Key, Smartphone, AlertTriangle, MessageSquare } from 'lucide-react-native';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to change your password',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Change password') }
      ]
    );
  };

  const handleBiometricToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Face ID',
        'Use Face ID to securely log in to your account. Your face data stays on your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enable Face ID', 
            onPress: () => {
              setBiometricEnabled(true);
              Alert.alert('Face ID Enabled', 'You can now use Face ID to log in to your account.');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Disable Face ID',
        'You will need to use your password to log in.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', style: 'destructive', onPress: () => setBiometricEnabled(false) }
        ]
      );
    }
  };

  const handle2FAToggle = (value: boolean) => {
    if (value) {
      Alert.prompt(
        'Enable SMS Verification',
        'Enter your phone number to receive verification codes via text message.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Code', 
            onPress: (phone?: string) => {
              if (phone && phone.length >= 10) {
                setPhoneNumber(phone);
                Alert.alert(
                  'Verification Code Sent',
                  `A 6-digit code has been sent to ${phone}. Enter it below to complete setup.`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Verify',
                      onPress: () => {
                        setTwoFactorEnabled(true);
                        Alert.alert('SMS Verification Enabled', 'You will receive a text message code each time you log in.');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
              }
            }
          }
        ],
        'plain-text',
        '',
        'phone-pad'
      );
    } else {
      Alert.alert(
        'Disable SMS Verification',
        'This will remove the extra security layer from your account. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive', 
            onPress: () => {
              setTwoFactorEnabled(false);
              setPhoneNumber('');
            }
          }
        ]
      );
    }
  };

  const handleViewActiveSessions = () => {
    Alert.alert('Active Sessions', 'Feature coming soon - View and manage devices logged into your account');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Feature coming soon - Manage your data privacy preferences');
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
            <Text style={styles.headerTitle}>Security & Privacy</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AUTHENTICATION</Text>
              <View style={styles.settingsGroup}>
                <ActionItem
                  icon={<Key color={colors.primary} size={20} strokeWidth={2} />}
                  title="Change Password"
                  subtitle="Update your account password"
                  onPress={handleChangePassword}
                />
                <ToggleItem
                  icon={<ScanFace color={colors.primary} size={20} strokeWidth={2} />}
                  title="Face ID"
                  subtitle="Use your face to unlock the app"
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                />
                <ToggleItem
                  icon={<MessageSquare color={colors.primary} size={20} strokeWidth={2} />}
                  title="SMS Verification"
                  subtitle={twoFactorEnabled && phoneNumber ? `Code sent to ${phoneNumber}` : "Receive codes via text message"}
                  value={twoFactorEnabled}
                  onValueChange={handle2FAToggle}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SECURITY MONITORING</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<Eye color={colors.primary} size={20} strokeWidth={2} />}
                  title="Login Notifications"
                  subtitle="Alert for new device logins"
                  value={loginNotifications}
                  onValueChange={setLoginNotifications}
                />
                <ActionItem
                  icon={<Smartphone color={colors.primary} size={20} strokeWidth={2} />}
                  title="Active Sessions"
                  subtitle="Manage logged-in devices"
                  onPress={handleViewActiveSessions}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DATA PROTECTION</Text>
              <View style={styles.settingsGroup}>
                <ToggleItem
                  icon={<Lock color={colors.primary} size={20} strokeWidth={2} />}
                  title="Data Encryption"
                  subtitle="Encrypt your personal data"
                  value={dataEncryption}
                  onValueChange={setDataEncryption}
                  disabled
                />
                <ActionItem
                  icon={<Shield color={colors.primary} size={20} strokeWidth={2} />}
                  title="Privacy Settings"
                  subtitle="Control your data sharing"
                  onPress={handlePrivacySettings}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.warningBox}>
              <AlertTriangle color={colors.warning} size={20} strokeWidth={2} />
              <Text style={styles.warningText}>
                Keep your account secure by using a strong password and enabling two-factor authentication.
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
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
  disabled?: boolean;
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
          disabled={disabled}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

function ActionItem({
  icon,
  title,
  subtitle,
  onPress,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  showDivider?: boolean;
}) {
  return (
    <>
      <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.actionIcon}>
          {icon}
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: colors.primaryTint,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  actionSubtitle: {
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
  warningBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: 16,
    marginHorizontal: 28,
    marginTop: 24,
    gap: 12,
    ...colors.shadow,
  },
  warningText: {
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
