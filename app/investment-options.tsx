import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  PieChart,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';

interface InvestmentOption {
  id: string;
  name: string;
  minInvestment: number;
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high';
  duration: string;
  icon: typeof TrendingUp;
  color: string;
  description: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

const investmentOptions: InvestmentOption[] = [
  {
    id: 'diversified',
    name: 'Diversified Portfolio',
    minInvestment: 100,
    expectedReturn: '6-10%',
    risk: 'low',
    duration: '12-36 months',
    icon: PieChart,
    color: '#00D66F',
    description: 'Spread your investment across multiple loans to minimize risk',
    features: [
      'Auto-invest across 10+ loans',
      'Balanced risk exposure',
      'Monthly returns',
      'Priority customer support'
    ],
    recommended: true,
  },
  {
    id: 'high-yield',
    name: 'High-Yield Focus',
    minInvestment: 500,
    expectedReturn: '10-15%',
    risk: 'medium',
    duration: '12-48 months',
    icon: TrendingUp,
    color: '#1D9BF0',
    description: 'Target higher returns with carefully selected medium-risk loans',
    features: [
      'Curated high-yield loans',
      'Credit-score filtering',
      'Monthly or quarterly returns',
      'Advanced analytics dashboard'
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Investor',
    minInvestment: 2000,
    expectedReturn: '12-18%',
    risk: 'medium',
    duration: '24-60 months',
    icon: Sparkles,
    color: '#FFD400',
    description: 'Exclusive access to premium loan listings with higher returns',
    features: [
      'Early access to listings',
      'Premium borrower pool',
      'Dedicated account manager',
      'Tax optimization guidance'
    ],
  },
  {
    id: 'conservative',
    name: 'Conservative Growth',
    minInvestment: 50,
    expectedReturn: '4-7%',
    risk: 'low',
    duration: '6-24 months',
    icon: Shield,
    color: '#00B85D',
    description: 'Safe and steady returns with low-risk, verified borrowers',
    features: [
      'Verified borrowers only',
      'Credit score 720+',
      'Shorter loan terms',
      'Principal protection'
    ],
  },
  {
    id: 'rapid',
    name: 'Rapid Returns',
    minInvestment: 1000,
    expectedReturn: '8-12%',
    risk: 'medium',
    duration: '3-12 months',
    icon: Zap,
    color: '#F4212E',
    description: 'Quick turnaround investments for active investors',
    features: [
      'Short-term loans only',
      'Fast capital turnover',
      'Monthly reinvestment',
      'Higher liquidity'
    ],
  },
  {
    id: 'custom',
    name: 'Custom Strategy',
    minInvestment: 5000,
    expectedReturn: 'Variable',
    risk: 'low',
    duration: 'Flexible',
    icon: Target,
    color: '#9E5AF2',
    description: 'Work with our team to create a personalized investment strategy',
    features: [
      'Custom portfolio design',
      '1-on-1 strategy sessions',
      'Risk profiling & matching',
      'VIP support'
    ],
  },
];

export default function InvestmentOptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [customAmount, setCustomAmount] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return colors.success;
      case 'medium': return colors.warning;
      case 'high': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getRiskLabel = (risk: string) => {
    return risk.charAt(0).toUpperCase() + risk.slice(1) + ' Risk';
  };

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'custom') {
        setShowCustomInput(true);
    } else {
        setShowCustomInput(false);
    }
    setSelectedOption(optionId);
    
    // Auto-navigate for non-custom options
    // For custom, we wait for them to fill details
  };

  const handleContinue = () => {
    if (selectedOption === 'custom') {
        if (customAmount && customRate) {
            console.log('Custom Investment:', { customAmount, customRate });
            router.push(`/p2p-marketplace?amount=${customAmount}&rate=${customRate}` as any);
        } else {
            // If they didn't fill it, just go with defaults
             router.push('/p2p-marketplace');
        }
    } else if (selectedOption) {
      console.log('Selected investment option:', selectedOption);
      router.push('/p2p-marketplace');
    }
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
            <Text style={styles.headerTitle}>Investment Options</Text>
            <Text style={styles.headerSubtitle}>Choose Your Strategy</Text>
          </View>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => router.push('/premium' as any)}
            activeOpacity={0.7}
          >
            <Sparkles color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={['#00D66F', '#1D9BF0']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroIcon}>
                <BarChart3 color={colors.white} size={28} strokeWidth={2.5} />
              </View>
              <Text style={styles.heroTitle}>Become an Investor</Text>
              <Text style={styles.heroDescription}>
                Start earning passive income by investing in peer-to-peer loans. Choose the strategy that fits your goals and risk tolerance.
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Users color={colors.white} size={16} strokeWidth={2.5} />
                  <Text style={styles.heroStatText}>12K+ Investors</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <TrendingUp color={colors.white} size={16} strokeWidth={2.5} />
                  <Text style={styles.heroStatText}>$125M Funded</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.infoCard}>
            <AlertCircle color={colors.info} size={18} strokeWidth={2.5} />
            <Text style={styles.infoText}>
              All investments are subject to risk. Past performance does not guarantee future results.
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Select Your Investment Strategy</Text>
            {investmentOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Animated.View
                  key={option.id}
                  style={[
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleOptionSelect(option.id)}
                    activeOpacity={0.8}
                  >
                    {option.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>RECOMMENDED</Text>
                      </View>
                    )}
                    {option.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}

                    <View style={styles.optionHeader}>
                      <View style={[styles.optionIconContainer, { backgroundColor: option.color + '20' }]}>
                        <Icon color={option.color} size={24} strokeWidth={2.5} />
                      </View>
                      <View style={styles.optionHeaderInfo}>
                        <Text style={styles.optionName}>{option.name}</Text>
                        <View style={styles.optionMeta}>
                          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(option.risk) + '20' }]}>
                            <Text style={[styles.riskText, { color: getRiskColor(option.risk) }]}>
                              {getRiskLabel(option.risk)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {isSelected && (
                        <CheckCircle2 color={colors.primary} size={24} strokeWidth={2.5} />
                      )}
                    </View>

                    <Text style={styles.optionDescription}>{option.description}</Text>

                    <View style={styles.optionStats}>
                      <View style={styles.optionStatItem}>
                        <Text style={styles.optionStatLabel}>Min Investment</Text>
                        <Text style={styles.optionStatValue}>${option.minInvestment.toLocaleString()}</Text>
                      </View>
                      <View style={styles.optionStatItem}>
                        <Text style={styles.optionStatLabel}>Expected Return</Text>
                        <Text style={styles.optionStatValue}>{option.expectedReturn}</Text>
                      </View>
                      <View style={styles.optionStatItem}>
                        <Text style={styles.optionStatLabel}>Duration</Text>
                        <Text style={styles.optionStatValue}>{option.duration}</Text>
                      </View>
                    </View>

                    <View style={styles.featuresList}>
                      {option.features.map((feature, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <CheckCircle2 color={colors.primary} size={14} strokeWidth={2.5} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

            {showCustomInput && selectedOption === 'custom' && (
              <Animated.View style={[styles.customInputContainer, { opacity: fadeAnim }]}>
                 <Text style={styles.sectionTitle}>Customize Your Investment</Text>
                 <View style={styles.customRow}>
                    <View style={styles.customField}>
                        <Text style={styles.customLabel}>Investment Amount ($)</Text>
                        <TextInput 
                            style={styles.customInput}
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            placeholder="5000"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.customField}>
                        <Text style={styles.customLabel}>Target Return (%)</Text>
                        <TextInput 
                            style={styles.customInput}
                            value={customRate}
                            onChangeText={setCustomRate}
                            placeholder="8.5"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="numeric"
                        />
                    </View>
                 </View>
                 <View style={styles.disclaimerBox}>
                    <AlertCircle size={14} color={colors.textSecondary} />
                    <Text style={styles.disclaimerText}>
                        Note: Standard market rates typically range from 6% to 12%. 
                        Higher target returns may carry higher risk and longer funding times.
                    </Text>
                 </View>
              </Animated.View>
            )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {selectedOption && (
          <Animated.View
            style={[
              styles.bottomBar,
              {
                paddingBottom: insets.bottom + 20,
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.bottomBarContent}>
              <View>
                <Text style={styles.bottomBarLabel}>Selected Strategy</Text>
                <Text style={styles.bottomBarValue}>
                  {investmentOptions.find(opt => opt.id === selectedOption)?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00D66F', '#00B85D']}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ChevronRight color={colors.white} size={20} strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...colors.shadow },
  infoButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', ...colors.shadow },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  headerSubtitle: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary, marginTop: 2 },
  scrollContent: { paddingHorizontal: 20 },
  heroCard: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', ...colors.shadowStrong },
  heroGradient: { padding: 24, alignItems: 'center' },
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: '800' as const, color: colors.white, marginBottom: 12, textAlign: 'center' },
  heroDescription: { fontSize: 15, fontWeight: '500' as const, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroStatItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStatText: { fontSize: 14, fontWeight: '600' as const, color: colors.white },
  heroStatDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.3)' },
  infoCard: { flexDirection: 'row', padding: 16, backgroundColor: colors.infoLight, borderRadius: 14, gap: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.info + '30' },
  infoText: { flex: 1, fontSize: 13, fontWeight: '500' as const, color: colors.text, lineHeight: 18 },
  optionsContainer: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.text, marginBottom: 8 },
  optionCard: { padding: 20, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 2, borderColor: colors.border, ...colors.shadowMedium },
  optionCardSelected: { borderColor: colors.primary, backgroundColor: colors.surface },
  recommendedBadge: { position: 'absolute' as const, top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.primary, borderRadius: 8 },
  recommendedText: { fontSize: 10, fontWeight: '700' as const, color: colors.white, letterSpacing: 0.5 },
  popularBadge: { position: 'absolute' as const, top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.secondary, borderRadius: 8 },
  popularText: { fontSize: 10, fontWeight: '700' as const, color: colors.white, letterSpacing: 0.5 },
  optionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  optionIconContainer: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionHeaderInfo: { flex: 1 },
  optionName: { fontSize: 18, fontWeight: '700' as const, color: colors.text, marginBottom: 6 },
  optionMeta: { flexDirection: 'row', alignItems: 'center' },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  riskText: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.3 },
  optionDescription: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  optionStats: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  optionStatItem: { flex: 1 },
  optionStatLabel: { fontSize: 11, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 6 },
  optionStatValue: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  featuresList: { gap: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 13, fontWeight: '500' as const, color: colors.text },
  bottomBar: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, backgroundColor: colors.backgroundElevated, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, paddingHorizontal: 20, ...colors.shadowStrong },
  bottomBarContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  bottomBarLabel: { fontSize: 12, fontWeight: '500' as const, color: colors.textSecondary, marginBottom: 4 },
  bottomBarValue: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  continueButton: { borderRadius: 14, overflow: 'hidden', ...colors.shadowMedium },
  continueButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 14, gap: 6 },
  continueButtonText: { fontSize: 16, fontWeight: '600' as const, color: colors.white },
  customInputContainer: { marginTop: 20, backgroundColor: colors.surface, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  customRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  customField: { flex: 1 },
  customLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  customInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: colors.text },
  disclaimerBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.background, padding: 12, borderRadius: 12, marginBottom: 16 },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
