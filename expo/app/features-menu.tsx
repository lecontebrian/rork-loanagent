import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Brain, Wallet, Calculator, Users, FolderLock, AlertTriangle, TrendingUp, MapPin, MessageSquare, Settings, LucideIcon, Bot } from 'lucide-react-native';
import colors from '@/constants/colors';
import { ICON_SIZES, ICON_STROKE, PremiumIcon, PremiumIconContainer } from '@/components/PremiumIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';

export default function FeaturesMenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    gradient: [string, string];
    route: string;
  }[] = [
    {
      id: 'coach',
      title: 'AI Financial Coach',
      description: 'Get personalized financial advice 24/7',
      icon: Brain,
      gradient: ['#FF9500', '#FF6B00'],
      route: '/financial-coach',
    },
    {
      id: 'p2p',
      title: 'P2P Lending',
      description: 'Invest in loans and earn returns',
      icon: Users,
      gradient: ['#5E5CE6', '#BF5AF2'],
      route: '/p2p-marketplace',
    },
    {
      id: 'budget',
      title: 'Budget Tracker',
      description: 'Track expenses and manage your budget',
      icon: Wallet,
      gradient: ['#30D158', '#28B349'],
      route: '/budget-tracker',
    },
    {
      id: 'simulator',
      title: 'Loan Simulator',
      description: 'Simulate what-if scenarios for loans',
      icon: Calculator,
      gradient: ['#0A84FF', '#0066D6'],
      route: '/loan-simulator',
    },
    {
      id: 'credit',
      title: 'Credit Builder',
      description: 'Improve and repair your credit score',
      icon: TrendingUp,
      gradient: ['#FF375F', '#FF1744'],
      route: '/credit-builder',
    },
    {
      id: 'vault',
      title: 'Document Vault',
      description: 'Securely store your financial documents',
      icon: FolderLock,
      gradient: ['#5856D6', '#7C3AED'],
      route: '/document-vault',
    },
    {
      id: 'local',
      title: 'Local Lenders',
      description: 'Find credit unions and local lenders',
      icon: MapPin,
      gradient: ['#32ADE6', '#0891B2'],
      route: '/local-lenders',
    },
    {
      id: 'disputes',
      title: 'Credit Disputes',
      description: 'File and track credit bureau disputes',
      icon: AlertTriangle,
      gradient: ['#FF9F0A', '#FF6D00'],
      route: '/credit-disputes',
    },
    {
      id: 'chat',
      title: 'AI Assistant',
      description: 'Voice and text-based financial assistant',
      icon: MessageSquare,
      gradient: ['#BF5AF2', '#8A2BE2'],
      route: '/ai-assistant',
    },
    {
      id: 'agent',
      title: 'Loan Agent',
      description: 'Multi-agent underwriting & risk analysis',
      icon: Bot,
      gradient: ['#0A84FF', '#30D158'],
      route: '/loan-agent',
    },
  ];

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
            <PremiumIcon icon={ArrowLeft} color={colors.text} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>All Features</Text>
            <Text style={styles.headerSubtitle}>Comprehensive Tools</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <PremiumIcon icon={Settings} color={colors.text} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                activeOpacity={0.85}
                onPress={() => router.push(feature.route as any)}
              >
                <LinearGradient
                  colors={feature.gradient}
                  style={styles.featureGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.featureContent}>
                    <PremiumIconContainer icon={feature.icon} color={colors.white} size={28} strokeWidth={ICON_STROKE.emphasized} containerSize={64} radius={20} backgroundColor="rgba(255, 255, 255, 0.18)" borderColor="rgba(255, 255, 255, 0.26)" style={styles.featureIcon} />
                    <View style={styles.featureInfo}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  featureGradient: {
    padding: 24,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: -0.1,
    lineHeight: 20,
  },
});
