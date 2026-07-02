import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle, BookOpen, MessageSquare, Video, ExternalLink, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently Asked Questions - Feature coming soon');
  };

  const handleTutorials = () => {
    Alert.alert('Tutorials', 'Video tutorials and guides - Feature coming soon');
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Start a live chat with support - Feature coming soon');
  };

  const handleDocumentation = () => {
    Alert.alert('Documentation', 'Read our complete documentation - Feature coming soon');
  };

  const handleContactSupport = () => {
    router.push('/settings/contact' as any);
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://example.com/help');
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
            <Text style={styles.headerTitle}>Help & Support</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.heroSection}>
              <View style={styles.heroIcon}>
                <HelpCircle color={colors.primary} size={48} strokeWidth={2} />
              </View>
              <Text style={styles.heroTitle}>How can we help you?</Text>
              <Text style={styles.heroSubtitle}>
                Find answers, learn how to use the app, or get in touch with our support team
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SELF-SERVICE</Text>
              <View style={styles.settingsGroup}>
                <HelpItem
                  icon={<HelpCircle color={colors.primary} size={20} strokeWidth={2} />}
                  title="Frequently Asked Questions"
                  subtitle="Find answers to common questions"
                  onPress={handleFAQ}
                />
                <HelpItem
                  icon={<BookOpen color={colors.primary} size={20} strokeWidth={2} />}
                  title="Documentation"
                  subtitle="Complete guides and documentation"
                  onPress={handleDocumentation}
                />
                <HelpItem
                  icon={<Video color={colors.primary} size={20} strokeWidth={2} />}
                  title="Video Tutorials"
                  subtitle="Learn with step-by-step videos"
                  onPress={handleTutorials}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>GET IN TOUCH</Text>
              <View style={styles.settingsGroup}>
                <HelpItem
                  icon={<MessageSquare color={colors.primary} size={20} strokeWidth={2} />}
                  title="Live Chat"
                  subtitle="Chat with our support team"
                  onPress={handleLiveChat}
                  badge="Online"
                />
                <HelpItem
                  icon={<MessageSquare color={colors.primary} size={20} strokeWidth={2} />}
                  title="Contact Support"
                  subtitle="Send us a detailed message"
                  onPress={handleContactSupport}
                />
                <HelpItem
                  icon={<ExternalLink color={colors.primary} size={20} strokeWidth={2} />}
                  title="Visit Help Center"
                  subtitle="Browse our online help center"
                  onPress={handleVisitWebsite}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.quickTips}>
              <Text style={styles.quickTipsTitle}>Quick Tips</Text>
              <TipItem text="Check your email for account verification and updates" />
              <TipItem text="Enable two-factor authentication for extra security" />
              <TipItem text="Connect your bank account for better loan offers" />
              <TipItem text="Review loan terms carefully before applying" />
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function HelpItem({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
  showDivider?: boolean;
}) {
  return (
    <>
      <TouchableOpacity style={styles.helpItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.helpIcon}>
          {icon}
        </View>
        <View style={styles.helpContent}>
          <View style={styles.helpHeader}>
            <Text style={styles.helpTitle}>{title}</Text>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.helpSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2} />
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View style={styles.tipItem}>
      <View style={styles.tipDot} />
      <Text style={styles.tipText}>{text}</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: colors.primaryTint,
  },
  helpContent: {
    flex: 1,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.successLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.success,
    letterSpacing: -0.1,
  },
  helpSubtitle: {
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
  quickTips: {
    marginTop: 32,
    marginHorizontal: 28,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...colors.shadow,
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  bottomPadding: {
    height: 40,
  },
});
