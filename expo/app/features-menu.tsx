import { View, Text, StyleSheet, ScrollView, Animated, Platform, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Brain, Wallet, Calculator, Users, FolderLock, AlertTriangle, TrendingUp, MapPin, MessageSquare, Settings, ChevronRight, LucideIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { spacing, typography } from '@/constants/theme';
import { ICON_SIZES, ICON_STROKE, PremiumIcon, PremiumIconContainer } from '@/components/PremiumIcon';
import { GlassScreen, GlassHeader, GlassCard } from '@/components/glass';
import { useRef, useEffect } from 'react';

export default function FeaturesMenuScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const features: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    route: string;
  }[] = [
    { id: 'coach', title: 'AI Financial Coach', description: 'Get personalized financial advice 24/7', icon: Brain, color: colors.warning, route: '/financial-coach' },
    { id: 'p2p', title: 'P2P Lending', description: 'Invest in loans and earn returns', icon: Users, color: colors.secondary, route: '/p2p-marketplace' },
    { id: 'budget', title: 'Budget Tracker', description: 'Track expenses and manage your budget', icon: Wallet, color: colors.success, route: '/budget-tracker' },
    { id: 'simulator', title: 'Loan Simulator', description: 'Simulate what-if scenarios for loans', icon: Calculator, color: colors.secondary, route: '/loan-simulator' },
    { id: 'credit', title: 'Credit Builder', description: 'Improve and repair your credit score', icon: TrendingUp, color: colors.primary, route: '/credit-builder' },
    { id: 'vault', title: 'Document Vault', description: 'Securely store your financial documents', icon: FolderLock, color: colors.primary, route: '/document-vault' },
    { id: 'local', title: 'Local Lenders', description: 'Find credit unions and local lenders', icon: MapPin, color: colors.secondary, route: '/local-lenders' },
    { id: 'disputes', title: 'Credit Disputes', description: 'File and track credit bureau disputes', icon: AlertTriangle, color: colors.warning, route: '/credit-disputes' },
    { id: 'chat', title: 'AI Assistant', description: 'Voice and text-based financial assistant', icon: MessageSquare, color: colors.primary, route: '/ai-assistant' },
  ];

  const go = (route: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    router.push(route as any);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GlassScreen>
        <GlassHeader
          title="All Features"
          subtitle="Comprehensive financial tools"
          largeTitle
          right={
            <Pressable onPress={() => router.push('/settings' as any)} hitSlop={8}>
              <PremiumIconContainer
                icon={Settings}
                tone="neutral"
                size={ICON_SIZES.header}
                containerSize={40}
                radius={20}
              />
            </Pressable>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim, gap: spacing.md }}>
            {features.map((feature) => (
              <GlassCard
                key={feature.id}
                weight="card"
                radius={22}
                onPress={() => go(feature.route)}
                contentStyle={styles.cardContent}
              >
                <PremiumIconContainer
                  icon={feature.icon}
                  color={feature.color}
                  size={26}
                  strokeWidth={ICON_STROKE.emphasized}
                  containerSize={56}
                  radius={18}
                  backgroundColor={feature.color + '20'}
                  borderColor={feature.color + '38'}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <PremiumIcon icon={ChevronRight} color={colors.textTertiary} size={20} strokeWidth={2.2} />
              </GlassCard>
            ))}
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </GlassScreen>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    padding: spacing.lg,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: 3,
  },
  featureDescription: {
    ...typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
