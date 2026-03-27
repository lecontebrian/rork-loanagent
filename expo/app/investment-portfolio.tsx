import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Zap,
  Target,
  PieChart,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Clock,
  Award,
  BarChart3,
  Users,
  Info,
  ChevronRight,
  Bell
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useMemo } from 'react';
import { portfolioDataMap } from '@/constants/portfolioData';

const { width } = Dimensions.get('window');

const iconMap: Record<string, typeof TrendingUp> = {
  PieChart, TrendingUp, Sparkles, Shield, Zap, Target, CheckCircle2, DollarSign, Clock, Award, BarChart3, Users,
};

export default function InvestmentPortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedAmount, setSelectedAmount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const data = portfolioDataMap[id || 'diversified'];
  const Icon = iconMap[data?.iconName] || PieChart;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (data) setSelectedAmount(data.minInvestment);
  }, [data]);

  const quickAmounts = useMemo(() => {
    if (!data) return [];
    return [data.minInvestment, data.minInvestment * 5, data.minInvestment * 10, data.minInvestment * 20];
  }, [data]);

  const handleInvest = () => {
    console.log('Investing', selectedAmount, 'in', data?.name);
    router.push('/p2p-marketplace' as any);
  };

  if (!data) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{data.name}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications' as any)} activeOpacity={0.7}>
            <Bell color={colors.text} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <LinearGradient colors={data.gradient} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.heroIcon}>
                <Icon color={colors.white} size={32} strokeWidth={2.5} />
              </View>
              <Text style={styles.heroTitle}>{data.name}</Text>
              <Text style={styles.heroDescription}>{data.description}</Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{data.expectedReturn}</Text>
                  <Text style={styles.heroStatLabel}>Expected Return</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{data.duration}</Text>
                  <Text style={styles.heroStatLabel}>Duration</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <View style={[styles.riskBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                    <Text style={styles.riskBadgeText}>{data.risk.charAt(0).toUpperCase() + data.risk.slice(1)} Risk</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.statsGrid}>
            {data.stats.map((stat, index) => (
              <Animated.View key={index} style={[styles.statCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                {stat.change && <Text style={[styles.statChange, { color: stat.change.startsWith('+') ? colors.success : colors.error }]}>{stat.change}</Text>}
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Strategy</Text>
            <Text style={styles.sectionText}>{data.longDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            {data.benefits.map((benefit, index) => {
              const BenefitIcon = iconMap[benefit.iconName] || Shield;
              return (
                <View key={index} style={styles.benefitCard}>
                  <View style={[styles.benefitIcon, { backgroundColor: data.color + '15' }]}>
                    <BenefitIcon color={data.color} size={24} strokeWidth={2.5} />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            {data.howItWorks.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={[styles.stepNumber, { backgroundColor: data.color }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ideal For</Text>
            <View style={styles.idealForContainer}>
              {data.idealFor.map((item, index) => (
                <View key={index} style={styles.idealForChip}>
                  <CheckCircle2 color={data.color} size={16} strokeWidth={2.5} />
                  <Text style={styles.idealForText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features Included</Text>
            <View style={styles.featuresGrid}>
              {data.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle2 color={colors.primary} size={18} strokeWidth={2.5} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.riskSection}>
            <View style={styles.riskHeader}>
              <Info color={colors.warning} size={20} strokeWidth={2.5} />
              <Text style={styles.riskTitle}>Risk Factors</Text>
            </View>
            {data.riskFactors.map((risk, index) => (
              <View key={index} style={styles.riskItem}>
                <View style={styles.riskDot} />
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Investment Amount</Text>
            <View style={styles.quickAmountsContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAmountButton, selectedAmount === amount && styles.quickAmountButtonSelected]}
                  onPress={() => setSelectedAmount(amount)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickAmountText, selectedAmount === amount && styles.quickAmountTextSelected]}>
                    ${amount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionTitle}>Projected Returns</Text>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Monthly:</Text>
                <Text style={styles.projectionValue}>${((selectedAmount * 0.08) / 12).toFixed(2)}</Text>
              </View>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Annual:</Text>
                <Text style={styles.projectionValue}>${(selectedAmount * 0.08).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <Animated.View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20, opacity: fadeAnim }]}>
          <View style={styles.bottomBarContent}>
            <View>
              <Text style={styles.bottomBarLabel}>Your Investment</Text>
              <Text style={styles.bottomBarValue}>${selectedAmount.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.investButton} onPress={handleInvest} activeOpacity={0.8}>
              <LinearGradient colors={data.gradient} style={styles.investButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.investButtonText}>Start Investing</Text>
                <ChevronRight color={colors.white} size={20} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...colors.shadow },
  notificationButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...colors.shadow },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600' as const, color: colors.text, letterSpacing: -0.3 },
  scrollContent: { paddingHorizontal: 20 },
  heroCard: { padding: 28, borderRadius: 24, marginBottom: 20, alignItems: 'center', ...colors.shadowStrong },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 28, fontWeight: '800' as const, color: colors.white, marginBottom: 12, letterSpacing: -0.5, textAlign: 'center' },
  heroDescription: { fontSize: 15, fontWeight: '500' as const, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  heroStats: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 20, fontWeight: '700' as const, color: colors.white, marginBottom: 4 },
  heroStatLabel: { fontSize: 12, fontWeight: '500' as const, color: 'rgba(255,255,255,0.8)' },
  heroStatDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  riskBadgeText: { fontSize: 12, fontWeight: '700' as const, color: colors.white },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: (width - 52) / 2, padding: 16, backgroundColor: colors.surface, borderRadius: 16, ...colors.shadow },
  statValue: { fontSize: 24, fontWeight: '700' as const, color: colors.text, marginBottom: 4 },
  statChange: { fontSize: 14, fontWeight: '600' as const, marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.text, marginBottom: 16 },
  sectionText: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  benefitCard: { flexDirection: 'row', padding: 16, backgroundColor: colors.surface, borderRadius: 16, marginBottom: 12, gap: 14, ...colors.shadow },
  benefitIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  benefitContent: { flex: 1 },
  benefitTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text, marginBottom: 6 },
  benefitDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  stepCard: { flexDirection: 'row', marginBottom: 16, gap: 14 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '700' as const, color: colors.white },
  stepText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 22, paddingTop: 4 },
  idealForContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  idealForChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.surface, borderRadius: 12, gap: 8, ...colors.shadow },
  idealForText: { fontSize: 14, fontWeight: '500' as const, color: colors.text },
  featuresGrid: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { flex: 1, fontSize: 15, fontWeight: '500' as const, color: colors.text },
  riskSection: { padding: 18, backgroundColor: colors.warningLight, borderRadius: 16, marginBottom: 28, borderWidth: 1, borderColor: colors.warning + '30' },
  riskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  riskTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  riskItem: { flexDirection: 'row', marginBottom: 10, gap: 12 },
  riskDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning, marginTop: 7 },
  riskText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  quickAmountsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickAmountButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  quickAmountButtonSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  quickAmountText: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  quickAmountTextSelected: { color: colors.primary },
  projectionCard: { padding: 18, backgroundColor: colors.surface, borderRadius: 16, ...colors.shadow },
  projectionTitle: { fontSize: 16, fontWeight: '700' as const, color: colors.text, marginBottom: 12 },
  projectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  projectionLabel: { fontSize: 15, fontWeight: '500' as const, color: colors.textSecondary },
  projectionValue: { fontSize: 18, fontWeight: '700' as const, color: colors.white },
  bottomBar: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, backgroundColor: colors.backgroundElevated, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, paddingHorizontal: 20, ...colors.shadowStrong },
  bottomBarContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  bottomBarLabel: { fontSize: 12, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 4 },
  bottomBarValue: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  investButton: { borderRadius: 14, overflow: 'hidden', ...colors.shadowMedium },
  investButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 14, gap: 6 },
  investButtonText: { fontSize: 16, fontWeight: '600' as const, color: colors.white },
});
