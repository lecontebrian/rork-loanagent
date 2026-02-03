import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
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
  Calendar,
  Info,
  ChevronRight,
  Bell
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const CK_TEXT = colors.text;
const CK_TEXT_SECONDARY = colors.textSecondary;
const CK_BG = colors.background;
const CK_SURFACE = colors.surface;
const CK_BORDER = colors.border;

interface PortfolioDetails {
  id: string;
  name: string;
  minInvestment: number;
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high';
  duration: string;
  icon: typeof TrendingUp;
  color: string;
  gradient: [string, string];
  description: string;
  longDescription: string;
  features: string[];
  benefits: { title: string; description: string; icon: typeof CheckCircle2 }[];
  riskFactors: string[];
  howItWorks: string[];
  idealFor: string[];
  stats: { label: string; value: string; change?: string }[];
}

const portfolioDetailsMap: Record<string, PortfolioDetails> = {
  diversified: {
    id: 'diversified',
    name: 'Diversified Portfolio',
    minInvestment: 100,
    expectedReturn: '6-10%',
    risk: 'low',
    duration: '12-36 months',
    icon: PieChart,
    color: colors.primary,
    gradient: [colors.primary, colors.primaryDark],
    description: 'Spread your investment across multiple loans to minimize risk',
    longDescription: 'Our Diversified Portfolio automatically distributes your investment across 10+ carefully vetted loans from various sectors, credit tiers, and loan types. This strategy minimizes your exposure to any single borrower default while maintaining steady returns.',
    features: [
      'Auto-invest across 10+ loans',
      'Balanced risk exposure',
      'Monthly returns',
      'Priority customer support',
      'Automatic rebalancing',
      'Risk-adjusted allocations',
    ],
    benefits: [
      {
        title: 'Risk Mitigation',
        description: 'Spread investments across multiple borrowers to reduce single-loan exposure',
        icon: Shield,
      },
      {
        title: 'Steady Returns',
        description: 'Monthly income from a portfolio of performing loans',
        icon: TrendingUp,
      },
      {
        title: 'Automated Management',
        description: 'Set it and forget it - our AI handles rebalancing',
        icon: Award,
      },
    ],
    riskFactors: [
      'Individual loan defaults may occur',
      'Returns not guaranteed',
      'Market conditions may affect performance',
    ],
    howItWorks: [
      'Deposit minimum $100 into your investment account',
      'AI algorithm analyzes thousands of loan applications',
      'Your funds are automatically split across 10+ qualified loans',
      'Receive monthly interest payments directly to your account',
      'Reinvest or withdraw earnings anytime',
    ],
    idealFor: [
      'First-time P2P investors',
      'Those seeking passive income',
      'Risk-averse investors',
      'Long-term wealth builders',
    ],
    stats: [
      { label: 'Avg. Annual Return', value: '8.2%', change: '+1.3%' },
      { label: 'Default Rate', value: '2.1%' },
      { label: 'Active Investors', value: '4.2K' },
      { label: 'Loans Funded', value: '12.5K' },
    ],
  },
  'high-yield': {
    id: 'high-yield',
    name: 'High-Yield Focus',
    minInvestment: 500,
    expectedReturn: '10-15%',
    risk: 'medium',
    duration: '12-48 months',
    icon: TrendingUp,
    color: '#1D9BF0',
    gradient: ['#1D9BF0', '#0D7AC7'],
    description: 'Target higher returns with carefully selected medium-risk loans',
    longDescription: 'High-Yield Focus targets borrowers with good credit (650-720) seeking larger loans. These loans offer higher interest rates while maintaining reasonable default risk through our advanced credit scoring and verification process.',
    features: [
      'Curated high-yield loans',
      'Credit-score filtering',
      'Monthly or quarterly returns',
      'Advanced analytics dashboard',
      'Loan performance tracking',
      'Early exit options',
    ],
    benefits: [
      {
        title: 'Higher Returns',
        description: '10-15% expected annual returns from quality medium-risk loans',
        icon: TrendingUp,
      },
      {
        title: 'Curated Selection',
        description: 'Access to hand-picked loans vetted by credit experts',
        icon: Award,
      },
      {
        title: 'Flexibility',
        description: 'Choose monthly or quarterly distribution schedule',
        icon: Calendar,
      },
    ],
    riskFactors: [
      'Higher default risk than conservative portfolios',
      'Credit score variations may affect returns',
      'Economic downturns can impact performance',
    ],
    howItWorks: [
      'Minimum $500 investment to access high-yield loans',
      'Browse curated loan listings with detailed borrower profiles',
      'Select loans manually or use auto-invest',
      'Track performance with real-time analytics',
      'Receive payments on your chosen schedule',
    ],
    idealFor: [
      'Experienced P2P investors',
      'Those comfortable with moderate risk',
      'Investors seeking higher yields',
      'Active portfolio managers',
    ],
    stats: [
      { label: 'Avg. Annual Return', value: '12.4%', change: '+2.1%' },
      { label: 'Default Rate', value: '4.2%' },
      { label: 'Active Investors', value: '2.8K' },
      { label: 'Avg. Investment', value: '$2.4K' },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium Investor',
    minInvestment: 2000,
    expectedReturn: '12-18%',
    risk: 'medium',
    duration: '24-60 months',
    icon: Sparkles,
    color: '#FFD400',
    gradient: ['#FFD400', '#E6BE00'],
    description: 'Exclusive access to premium loan listings with higher returns',
    longDescription: 'Premium Investor tier provides early access to high-quality borrowers with excellent credit profiles seeking business expansion, real estate investments, or major purchases. Includes dedicated account management and tax optimization guidance.',
    features: [
      'Early access to listings',
      'Premium borrower pool',
      'Dedicated account manager',
      'Tax optimization guidance',
      'Quarterly strategy reviews',
      'VIP investor events',
    ],
    benefits: [
      {
        title: 'Exclusive Access',
        description: 'First look at premium borrowers before general investors',
        icon: Sparkles,
      },
      {
        title: 'Personal Support',
        description: 'Dedicated account manager for portfolio optimization',
        icon: Users,
      },
      {
        title: 'Tax Guidance',
        description: 'Expert advice on tax-efficient investing strategies',
        icon: Award,
      },
    ],
    riskFactors: [
      'Larger minimum investment required',
      'Returns dependent on premium borrower performance',
      'Longer investment horizon recommended',
    ],
    howItWorks: [
      'Minimum $2,000 investment unlocks premium tier',
      'Get matched with dedicated account manager',
      'Receive early access to premium loan listings',
      'Quarterly portfolio reviews and optimization',
      'Access exclusive investor events and networking',
    ],
    idealFor: [
      'High net worth individuals',
      'Serious P2P investors',
      'Those seeking personalized service',
      'Long-term wealth builders',
    ],
    stats: [
      { label: 'Avg. Annual Return', value: '14.8%', change: '+3.2%' },
      { label: 'Default Rate', value: '1.8%' },
      { label: 'Active Investors', value: '892' },
      { label: 'Avg. Investment', value: '$12.5K' },
    ],
  },
  conservative: {
    id: 'conservative',
    name: 'Conservative Growth',
    minInvestment: 50,
    expectedReturn: '4-7%',
    risk: 'low',
    duration: '6-24 months',
    icon: Shield,
    color: colors.primaryDark,
    gradient: [colors.primaryDark, colors.primary],
    description: 'Safe and steady returns with low-risk, verified borrowers',
    longDescription: 'Conservative Growth focuses exclusively on borrowers with excellent credit (720+), stable employment, and low debt-to-income ratios. Shorter loan terms and principal protection features make this ideal for risk-averse investors.',
    features: [
      'Verified borrowers only',
      'Credit score 720+',
      'Shorter loan terms',
      'Principal protection',
      'Priority repayment',
      'Insurance coverage',
    ],
    benefits: [
      {
        title: 'Maximum Safety',
        description: 'Lowest default rates with verified, high-credit borrowers',
        icon: Shield,
      },
      {
        title: 'Short Terms',
        description: '6-24 month loans mean faster capital return',
        icon: Clock,
      },
      {
        title: 'Protected Principal',
        description: 'Insurance coverage for qualified loan defaults',
        icon: CheckCircle2,
      },
    ],
    riskFactors: [
      'Lower returns than higher-risk portfolios',
      'Inflation may exceed returns',
      'Limited growth potential',
    ],
    howItWorks: [
      'Start with as little as $50',
      'Funds allocated to top-tier credit borrowers',
      'Short 6-24 month loan terms',
      'Monthly interest payments',
      'Principal protected by insurance on eligible loans',
    ],
    idealFor: [
      'Conservative investors',
      'Retirees seeking income',
      'Those new to P2P lending',
      'Risk-averse individuals',
    ],
    stats: [
      { label: 'Avg. Annual Return', value: '5.6%', change: '+0.8%' },
      { label: 'Default Rate', value: '0.6%' },
      { label: 'Active Investors', value: '6.7K' },
      { label: 'Avg. Loan Term', value: '18 mo' },
    ],
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid Returns',
    minInvestment: 1000,
    expectedReturn: '8-12%',
    risk: 'medium',
    duration: '3-12 months',
    icon: Zap,
    color: '#F4212E',
    gradient: ['#F4212E', '#C0192A'],
    description: 'Quick turnaround investments for active investors',
    longDescription: 'Rapid Returns specializes in short-term loans (3-12 months) for borrowers needing bridge financing, emergency funds, or seasonal business capital. Perfect for investors who want faster capital turnover and higher liquidity.',
    features: [
      'Short-term loans only',
      'Fast capital turnover',
      'Monthly reinvestment',
      'Higher liquidity',
      'Real-time notifications',
      'Instant withdrawals',
    ],
    benefits: [
      {
        title: 'Fast Turnover',
        description: '3-12 month loans mean your capital returns quickly',
        icon: Zap,
      },
      {
        title: 'High Liquidity',
        description: 'Easy access to your funds when you need them',
        icon: DollarSign,
      },
      {
        title: 'Active Trading',
        description: 'Perfect for investors who like frequent portfolio changes',
        icon: BarChart3,
      },
    ],
    riskFactors: [
      'Shorter terms may have higher default risk',
      'Requires more active management',
      'Frequent reinvestment needed',
    ],
    howItWorks: [
      'Invest minimum $1,000 in short-term loans',
      'Select loans with 3-12 month terms',
      'Receive payments as loans mature',
      'Automatically reinvest or withdraw',
      'Maintain high portfolio liquidity',
    ],
    idealFor: [
      'Active investors',
      'Those needing liquidity',
      'Investors with short timelines',
      'Experienced traders',
    ],
    stats: [
      { label: 'Avg. Annual Return', value: '10.2%', change: '+1.8%' },
      { label: 'Default Rate', value: '3.4%' },
      { label: 'Active Investors', value: '1.9K' },
      { label: 'Avg. Loan Term', value: '8 mo' },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom Strategy',
    minInvestment: 5000,
    expectedReturn: 'Variable',
    risk: 'low',
    duration: 'Flexible',
    icon: Target,
    color: '#9E5AF2',
    gradient: ['#9E5AF2', '#7E42D2'],
    description: 'Work with our team to create a personalized investment strategy',
    longDescription: 'Custom Strategy is designed for sophisticated investors who want a tailored approach. Our investment team works directly with you to understand your risk tolerance, return goals, and timeline, then builds a custom portfolio matching your exact specifications.',
    features: [
      'Custom portfolio design',
      '1-on-1 strategy sessions',
      'Risk profiling & matching',
      'VIP support',
      'Personalized reporting',
      'Tax-loss harvesting',
    ],
    benefits: [
      {
        title: 'Fully Customized',
        description: 'Portfolio built specifically for your goals and risk tolerance',
        icon: Target,
      },
      {
        title: 'Expert Guidance',
        description: 'Direct access to our investment strategy team',
        icon: Users,
      },
      {
        title: 'Flexible Terms',
        description: 'Choose your own mix of loan types, terms, and risk levels',
        icon: Award,
      },
    ],
    riskFactors: [
      'Requires significant minimum investment',
      'Returns vary based on strategy',
      'May require longer commitment',
    ],
    howItWorks: [
      'Minimum $5,000 investment required',
      'Schedule consultation with investment team',
      'Complete detailed risk profile',
      'Receive custom strategy proposal',
      'Team builds and manages your portfolio',
    ],
    idealFor: [
      'High net worth investors',
      'Those with specific goals',
      'Investors wanting personal attention',
      'Sophisticated portfolio managers',
    ],
    stats: [
      { label: 'Min. Investment', value: '$5K' },
      { label: 'Active Investors', value: '324' },
      { label: 'Avg. Investment', value: '$28K' },
      { label: 'Satisfaction', value: '98%' },
    ],
  },
};

export default function InvestmentPortfolioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedAmount, setSelectedAmount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const portfolio = portfolioDetailsMap[id || 'diversified'];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    setSelectedAmount(portfolio.minInvestment);
  }, [portfolio]);

  const getRiskLabel = (risk: string) => {
    return risk.charAt(0).toUpperCase() + risk.slice(1) + ' Risk';
  };

  const quickAmounts = [
    portfolio.minInvestment,
    portfolio.minInvestment * 5,
    portfolio.minInvestment * 10,
    portfolio.minInvestment * 20,
  ];

  const Icon = portfolio.icon;

  const handleInvest = () => {
    console.log('Investing', selectedAmount, 'in', portfolio.name);
    router.push('/p2p-marketplace');
  };

  if (!portfolio) {
    return null;
  }

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
            <ArrowLeft color={CK_TEXT} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{portfolio.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Bell color={CK_TEXT} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View
              style={[styles.heroCard, { backgroundColor: CK_SURFACE, borderColor: portfolio.color, borderWidth: 1 }]}
            >
              <View style={[styles.heroIcon, { backgroundColor: portfolio.color + '15' }]}>
                <Icon color={portfolio.color} size={32} strokeWidth={2.5} />
              </View>
              <Text style={[styles.heroTitle, { color: CK_TEXT }]}>{portfolio.name}</Text>
              <Text style={[styles.heroDescription, { color: CK_TEXT_SECONDARY }]}>{portfolio.description}</Text>
              
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={[styles.heroStatValue, { color: CK_TEXT }]}>{portfolio.expectedReturn}</Text>
                  <Text style={[styles.heroStatLabel, { color: CK_TEXT_SECONDARY }]}>Expected Return</Text>
                </View>
                <View style={[styles.heroStatDivider, { backgroundColor: CK_BORDER }]} />
                <View style={styles.heroStatItem}>
                  <Text style={[styles.heroStatValue, { color: CK_TEXT }]}>{portfolio.duration}</Text>
                  <Text style={[styles.heroStatLabel, { color: CK_TEXT_SECONDARY }]}>Duration</Text>
                </View>
                <View style={[styles.heroStatDivider, { backgroundColor: CK_BORDER }]} />
                <View style={styles.heroStatItem}>
                  <View style={[styles.riskBadge, { backgroundColor: portfolio.color + '15' }]}>
                    <Text style={[styles.riskBadgeText, { color: portfolio.color }]}>{getRiskLabel(portfolio.risk)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          <View style={styles.statsGrid}>
            {portfolio.stats.map((stat, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                {stat.change && (
                  <Text style={[styles.statChange, { color: stat.change.startsWith('+') ? colors.success : colors.error }]}>
                    {stat.change}
                  </Text>
                )}
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Strategy</Text>
            <Text style={styles.sectionText}>{portfolio.longDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            {portfolio.benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <View key={index} style={styles.benefitCard}>
                  <View style={[styles.benefitIcon, { backgroundColor: portfolio.color + '15' }]}>
                    <BenefitIcon color={portfolio.color} size={24} strokeWidth={2.5} />
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
            {portfolio.howItWorks.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={[styles.stepNumber, { backgroundColor: portfolio.color }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ideal For</Text>
            <View style={styles.idealForContainer}>
              {portfolio.idealFor.map((item, index) => (
                <View key={index} style={styles.idealForChip}>
                  <CheckCircle2 color={portfolio.color} size={16} strokeWidth={2.5} />
                  <Text style={styles.idealForText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features Included</Text>
            <View style={styles.featuresGrid}>
              {portfolio.features.map((feature, index) => (
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
            {portfolio.riskFactors.map((risk, index) => (
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
                  style={[
                    styles.quickAmountButton,
                    selectedAmount === amount && styles.quickAmountButtonSelected,
                  ]}
                  onPress={() => setSelectedAmount(amount)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      selectedAmount === amount && styles.quickAmountTextSelected,
                    ]}
                  >
                    ${amount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.projectionCard}>
              <Text style={styles.projectionTitle}>Projected Returns</Text>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Monthly:</Text>
                <Text style={styles.projectionValue}>
                  ${((selectedAmount * 0.08) / 12).toFixed(2)}
                </Text>
              </View>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Annual:</Text>
                <Text style={styles.projectionValue}>
                  ${(selectedAmount * 0.08).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <Animated.View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom + 20,
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.bottomBarContent}>
            <View>
              <Text style={styles.bottomBarLabel}>Your Investment</Text>
              <Text style={styles.bottomBarValue}>${selectedAmount.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={[styles.investButton, { backgroundColor: portfolio.color }]}
              onPress={handleInvest}
              activeOpacity={0.8}
            >
              <View
                style={styles.investButtonGradient}
              >
                <Text style={styles.investButtonText}>Start Investing</Text>
                <ChevronRight color={colors.white} size={20} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CK_BG,
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
    backgroundColor: CK_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CK_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: CK_TEXT,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroCard: {
    padding: 28,
    borderRadius: 24,
    marginBottom: 20,
    alignItems: 'center',
    ...colors.shadowStrong,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: CK_TEXT,
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: CK_TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    letterSpacing: -0.2,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: CK_TEXT,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  heroStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: CK_TEXT_SECONDARY,
    letterSpacing: -0.1,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: CK_BORDER,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    backgroundColor: CK_SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: CK_TEXT,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: CK_TEXT_SECONDARY,
    letterSpacing: -0.1,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: CK_TEXT,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: '400',
    color: CK_TEXT_SECONDARY,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  benefitCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: CK_SURFACE,
    borderRadius: 16,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CK_TEXT,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  benefitDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: CK_TEXT_SECONDARY,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: CK_TEXT,
    lineHeight: 22,
    letterSpacing: -0.2,
    paddingTop: 4,
  },
  idealForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  idealForChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: CK_SURFACE,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  idealForText: {
    fontSize: 14,
    fontWeight: '500',
    color: CK_TEXT,
    letterSpacing: -0.1,
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: CK_TEXT,
    letterSpacing: -0.1,
  },
  riskSection: {
    padding: 18,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CK_TEXT,
    letterSpacing: -0.3,
  },
  riskItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    marginTop: 7,
  },
  riskText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: CK_TEXT,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: CK_SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CK_BORDER,
  },
  quickAmountButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  quickAmountText: {
    fontSize: 15,
    fontWeight: '600',
    color: CK_TEXT,
    letterSpacing: -0.2,
  },
  quickAmountTextSelected: {
    color: colors.primary,
  },
  projectionCard: {
    padding: 18,
    backgroundColor: CK_SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CK_BORDER,
    ...colors.shadow,
  },
  projectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CK_TEXT,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  projectionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: CK_TEXT_SECONDARY,
    letterSpacing: -0.2,
  },
  projectionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: CK_TEXT,
    letterSpacing: -0.3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CK_SURFACE,
    borderTopWidth: 1,
    borderTopColor: CK_BORDER,
    paddingTop: 16,
    paddingHorizontal: 20,
    ...colors.shadowStrong,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  bottomBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: CK_TEXT_SECONDARY,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  bottomBarValue: {
    fontSize: 20,
    fontWeight: '700',
    color: CK_TEXT,
    letterSpacing: -0.4,
  },
  investButton: {
    borderRadius: 14,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  investButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 6,
  },
  investButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
});
