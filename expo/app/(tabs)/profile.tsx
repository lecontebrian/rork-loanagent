import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import {
  Bell,
  Lock,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Shield,
  Crown,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { userProfile } from '@/mocks/loanData';

interface ToggleRow {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  label: string;
  value: boolean;
  onToggle: () => void;
}

interface NavRow {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  showChevron?: boolean;
}

function SettingsToggle({ icon: Icon, iconColor, label, value, onToggle }: ToggleRow) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}22` }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>{label}</Text>
      <View
        style={[
          styles.toggle,
          { backgroundColor: value ? theme.primary : theme.surfaceTertiary },
        ]}
      >
        <View
          style={[
            styles.toggleKnob,
            {
              backgroundColor: '#FFFFFF',
              transform: [{ translateX: value ? 20 : 0 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function SettingsNavRow({
  icon: Icon,
  iconColor,
  label,
  sublabel,
  onPress,
  showChevron = true,
}: NavRow) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.surfaceSecondary : 'transparent' },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}22` }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body, { color: theme.text }]}>{label}</Text>
        {sublabel && (
          <Text style={[Typography.caption1, { color: theme.textMuted, marginTop: 2 }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {showChevron && <ChevronRight size={18} color={theme.textMuted} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { theme, darkMode, toggleDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [faceId, setFaceId] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      await AsyncStorage.removeItem('@loanagent_onboarded');
      router.replace('/onboarding');
    } catch {
      // ignore
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <Text style={[Typography.title1, { color: theme.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <GlassCard padding={Spacing.xl} intensity={30}>
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: userProfile.avatarColor }]}>
                <Text style={[Typography.title2, { color: '#FFFFFF', fontWeight: '800' }]}>
                  {userProfile.initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.title3, { color: theme.text }]}>
                  {userProfile.name} Kelly
                </Text>
                <Text style={[Typography.subheadline, { color: theme.textMuted, marginTop: 2 }]}>
                  {userProfile.email}
                </Text>
                <View style={styles.profileMeta}>
                  <View style={[styles.premiumBadge, { backgroundColor: `${theme.primary}22` }]}>
                    <Crown size={12} color={theme.primary} />
                    <Text style={[Typography.caption2, { color: theme.primary, fontWeight: '700' }]}>
                      PREMIUM
                    </Text>
                  </View>
                  <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                    Member since {userProfile.memberSince}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.creditScoreBox, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.creditScoreLeft}>
                <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                  Credit Score
                </Text>
                <Text style={[Typography.title2, { color: theme.primary, fontWeight: '800' }]}>
                  {userProfile.creditScore}
                </Text>
              </View>
              <View style={styles.creditScoreRight}>
                <Text style={[Typography.caption1, { color: theme.primary, fontWeight: '600' }]}>
                  Excellent
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Security Settings */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <Text style={[Typography.subheadline, { color: theme.textMuted, fontWeight: '700', marginBottom: Spacing.sm, marginLeft: 4 }]}>
            SECURITY
          </Text>
          <GlassCard padding={0} intensity={30}>
            <SettingsToggle
              icon={Shield}
              iconColor="#16C784"
              label="Face ID"
              value={faceId}
              onToggle={() => setFaceId(!faceId)}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsToggle
              icon={Moon}
              iconColor="#3B9EFF"
              label="Dark Mode"
              value={darkMode}
              onToggle={toggleDark}
            />
          </GlassCard>
        </View>

        {/* Notifications */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
          <Text style={[Typography.subheadline, { color: theme.textMuted, fontWeight: '700', marginBottom: Spacing.sm, marginLeft: 4 }]}>
            NOTIFICATIONS
          </Text>
          <GlassCard padding={0} intensity={30}>
            <SettingsToggle
              icon={Bell}
              iconColor="#F5A623"
              label="Push Notifications"
              value={notifications}
              onToggle={() => setNotifications(!notifications)}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsToggle
              icon={CreditCard}
              iconColor="#16C784"
              label="Payment Alerts"
              value={paymentAlerts}
              onToggle={() => setPaymentAlerts(!paymentAlerts)}
            />
          </GlassCard>
        </View>

        {/* Connected Accounts */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
          <Text style={[Typography.subheadline, { color: theme.textMuted, fontWeight: '700', marginBottom: Spacing.sm, marginLeft: 4 }]}>
            CONNECTED ACCOUNTS
          </Text>
          <GlassCard padding={0} intensity={30}>
            <SettingsNavRow
              icon={CreditCard}
              iconColor="#16C784"
              label="Wells Fargo"
              sublabel="Mortgage account connected"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsNavRow
              icon={CreditCard}
              iconColor="#3B9EFF"
              label="Chase Bank"
              sublabel="Auto loan connected"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsNavRow
              icon={CreditCard}
              iconColor="#F5A623"
              label="Marcus by Goldman"
              sublabel="Personal loan connected"
              onPress={() => {}}
            />
          </GlassCard>
        </View>

        {/* Help & Support */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
          <Text style={[Typography.subheadline, { color: theme.textMuted, fontWeight: '700', marginBottom: Spacing.sm, marginLeft: 4 }]}>
            HELP & SUPPORT
          </Text>
          <GlassCard padding={0} intensity={30}>
            <SettingsNavRow
              icon={HelpCircle}
              iconColor="#3B9EFF"
              label="Help Center"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsNavRow
              icon={Lock}
              iconColor="#7A8A85"
              label="Privacy Policy"
              onPress={() => {}}
            />
          </GlassCard>
        </View>

        {/* Sign Out */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl }}>
          <GradientButton
            label="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            fullWidth
            size="md"
            icon={<LogOut size={18} color="#FF4D6D" />}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[Typography.caption1, { color: theme.textMuted, textAlign: 'center' }]}>
            Loan Agent v1.0.0 · Made with care
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  creditScoreBox: {
    marginTop: Spacing.lg,
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creditScoreRight: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
});
