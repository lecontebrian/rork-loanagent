import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, FileText, Shield, ExternalLink } from 'lucide-react-native';
import colors from '@/constants/colors';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsPoliciesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://example.com/terms');
  };

  const handleCookiePolicy = () => {
    Linking.openURL('https://example.com/cookies');
  };

  const handleDataPolicy = () => {
    Linking.openURL('https://example.com/data-policy');
  };

  const handleLicenseAgreement = () => {
    Linking.openURL('https://example.com/license');
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
            <Text style={styles.headerTitle}>Terms & Policies</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.infoSection}>
              <View style={styles.infoIcon}>
                <Shield color={colors.primary} size={32} strokeWidth={2} />
              </View>
              <Text style={styles.infoTitle}>Legal Documents</Text>
              <Text style={styles.infoSubtitle}>
                Read our terms, policies, and agreements to understand how we protect your data and rights.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>POLICIES</Text>
              <View style={styles.settingsGroup}>
                <PolicyItem
                  icon={<Shield color={colors.primary} size={20} strokeWidth={2} />}
                  title="Privacy Policy"
                  subtitle="How we collect and use your data"
                  onPress={handlePrivacyPolicy}
                />
                <PolicyItem
                  icon={<FileText color={colors.primary} size={20} strokeWidth={2} />}
                  title="Cookie Policy"
                  subtitle="Information about cookies and tracking"
                  onPress={handleCookiePolicy}
                />
                <PolicyItem
                  icon={<Shield color={colors.primary} size={20} strokeWidth={2} />}
                  title="Data Protection Policy"
                  subtitle="Your data rights and protection"
                  onPress={handleDataPolicy}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AGREEMENTS</Text>
              <View style={styles.settingsGroup}>
                <PolicyItem
                  icon={<FileText color={colors.primary} size={20} strokeWidth={2} />}
                  title="Terms of Service"
                  subtitle="Rules for using our services"
                  onPress={handleTermsOfService}
                />
                <PolicyItem
                  icon={<FileText color={colors.primary} size={20} strokeWidth={2} />}
                  title="End User License Agreement"
                  subtitle="Software license terms"
                  onPress={handleLicenseAgreement}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.updateInfo}>
              <Text style={styles.updateTitle}>Last Updated</Text>
              <Text style={styles.updateDate}>January 2, 2026</Text>
              <Text style={styles.updateText}>
                We may update our policies from time to time. We will notify you of any significant changes.
              </Text>
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function PolicyItem({
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
      <TouchableOpacity style={styles.policyItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.policyIcon}>
          {icon}
        </View>
        <View style={styles.policyContent}>
          <Text style={styles.policyTitle}>{title}</Text>
          <Text style={styles.policySubtitle}>{subtitle}</Text>
        </View>
        <ExternalLink color={colors.textTertiary} size={20} strokeWidth={2} />
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
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  infoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
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
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  policyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: colors.primaryTint,
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  policySubtitle: {
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
  updateInfo: {
    marginHorizontal: 28,
    marginTop: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...colors.shadow,
  },
  updateTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  updateDate: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  updateText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  bottomPadding: {
    height: 40,
  },
});
