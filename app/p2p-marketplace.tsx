import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, TrendingUp, Shield, Clock, Users, ChevronRight, Plus, Wallet, CreditCard, Building2, X, CheckCircle, PiggyBank, HandCoins, Coins, Zap } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useP2PWallet, P2PLoanRequest } from '@/contexts/P2PWalletContext';
import { useApp } from '@/contexts/AppContext';

type TabType = 'invest' | 'borrow';
type PaymentMethod = 'wallet' | 'bank' | 'card';

export default function P2PMarketplaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, loanRequests, myLoanRequests, totalInvested, investInLoan, linkedCards, linkedBanks  } = useP2PWallet();
  const { tokens, consumeToken } = useApp();
  
  const [activeTab, setActiveTab] = useState<TabType>('invest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabContainerWidth, setTabContainerWidth] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedLoan, setSelectedLoan] = useState<P2PLoanRequest | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [isInvesting, setIsInvesting] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab === 'invest' ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [activeTab, tabIndicatorAnim]);

  const availableListings = useMemo(() => {
    return loanRequests.filter(listing => {
      if (listing.status !== 'funding') return false;
      const matchesSearch = listing.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || listing.riskLevel === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [loanRequests, searchQuery, selectedFilter]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return colors.success;
      case 'medium': return colors.warning;
      case 'high': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const handleInvest = () => {
    if (!selectedLoan) return;
    
    const amount = parseFloat(investAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount < 25) {
      Alert.alert('Minimum Investment', 'Please enter at least $25 to invest.');
      return;
    }

    if (tokens < 1) {
      Alert.alert(
        'Insufficient Tokens',
        'You need 1 token to invest in P2P loans. Upgrade your plan to get more tokens.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Tokens', onPress: () => router.push('/subscription') }
        ]
      );
      return;
    }

    if (paymentMethod === 'wallet' && amount > balance) {
      Alert.alert('Insufficient Balance', 'Add funds to your wallet or choose another payment method.');
      return;
    }

    setIsInvesting(true);
    
    setTimeout(() => {
      const tokenConsumed = consumeToken();
      if (!tokenConsumed) {
        setIsInvesting(false);
        Alert.alert('Token Error', 'Failed to process token. Please try again.');
        return;
      }

      const success = investInLoan(selectedLoan.id, amount, paymentMethod);
      setIsInvesting(false);
      
      if (success) {
        Alert.alert(
          'Investment Successful!',
          `You invested ${amount.toLocaleString()} in ${selectedLoan.borrowerName}'s loan.\n\nExpected return: ${selectedLoan.interestRate}% APR\n\n1 token used`,
          [{ text: 'Great!', onPress: () => setSelectedLoan(null) }]
        );
        setInvestAmount('');
      } else {
        Alert.alert('Investment Failed', 'Please try again or contact support.');
      }
    }, 1500);
  };

  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') return '';
    return parseInt(cleaned).toLocaleString();
  };

  const renderInvestTab = () => (
    <>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => router.push('/p2p/portfolio')}
      >
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#0A84FF', '#5E5CE6']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsHeaderRow}>
              <Text style={styles.statsHeaderText}>My Portfolio</Text>
              <View style={styles.statsHeaderBadge}>
                <Text style={styles.statsHeaderBadgeText}>Tap to view</Text>
                <ChevronRight color="rgba(255,255,255,0.9)" size={14} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Wallet color={colors.white} size={20} strokeWidth={2.5} />
                <Text style={styles.statValue}>${balance.toFixed(0)}</Text>
                <Text style={styles.statLabel}>Wallet Balance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <TrendingUp color={colors.white} size={20} strokeWidth={2.5} />
                <Text style={styles.statValue}>${totalInvested.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Invested</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Users color={colors.white} size={20} strokeWidth={2.5} />
                <Text style={styles.statValue}>{availableListings.length}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addFundsCard}
        activeOpacity={0.8}
        onPress={() => router.push('/p2p/add-funds')}
      >
        <View style={styles.addFundsContent}>
          <View style={styles.addFundsIcon}>
            <Plus color={colors.primary} size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.addFundsTextContainer}>
            <Text style={styles.addFundsTitle}>Add Funds to Invest</Text>
            <Text style={styles.addFundsSubtitle}>Link a card or bank account</Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color={colors.textTertiary} size={18} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search loan listings..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        {(['all', 'low', 'medium'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            {filter !== 'all' && (
              <View style={[styles.filterDot, { backgroundColor: getRiskColor(filter) }]} />
            )}
            <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>
              {filter === 'all' ? 'All' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Risk`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listingsContainer}>
        <Text style={styles.sectionTitle}>Investment Opportunities</Text>
        {availableListings.length === 0 ? (
          <View style={styles.emptyState}>
            <PiggyBank color={colors.textTertiary} size={48} strokeWidth={1.5} />
            <Text style={styles.emptyStateTitle}>No loans available</Text>
            <Text style={styles.emptyStateText}>Check back soon for new investment opportunities</Text>
          </View>
        ) : (
          availableListings.map((listing) => (
            <TouchableOpacity
              key={listing.id}
              style={styles.listingCard}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedLoan(listing);
                setInvestAmount('');
              }}
            >
              <View style={styles.listingHeader}>
                <View style={styles.borrowerInfo}>
                  <View style={styles.borrowerAvatar}>
                    <Text style={styles.borrowerInitial}>{listing.borrowerName[0]}</Text>
                  </View>
                  <View>
                    <View style={styles.borrowerNameRow}>
                      <Text style={styles.borrowerName}>{listing.borrowerName}</Text>
                      {listing.verified && (
                        <Shield color={colors.primary} size={14} strokeWidth={2.5} />
                      )}
                    </View>
                    <Text style={styles.creditScore}>Credit Score: {listing.creditScore}</Text>
                  </View>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(listing.riskLevel) + '20' }]}>
                  <Text style={[styles.riskText, { color: getRiskColor(listing.riskLevel) }]}>
                    {listing.riskLevel.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.loanPurpose}>{listing.purpose}</Text>
              <Text style={styles.loanDescription} numberOfLines={2}>{listing.description}</Text>

              <View style={styles.loanDetails}>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>Amount</Text>
                  <Text style={styles.loanDetailValue}>${listing.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>Return</Text>
                  <Text style={[styles.loanDetailValue, { color: colors.success }]}>{listing.interestRate}%</Text>
                </View>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>Term</Text>
                  <Text style={styles.loanDetailValue}>{listing.termMonths}mo</Text>
                </View>
              </View>

              <View style={styles.fundingContainer}>
                <View style={styles.fundingHeader}>
                  <Text style={styles.fundingLabel}>Funding Progress</Text>
                  <Text style={styles.fundingPercentage}>
                    {Math.round((listing.fundingProgress / listing.fundingGoal) * 100)}%
                  </Text>
                </View>
                <View style={styles.fundingBar}>
                  <View
                    style={[
                      styles.fundingFill,
                      { width: `${Math.min(100, (listing.fundingProgress / listing.fundingGoal) * 100)}%` },
                    ]}
                  />
                </View>
                <View style={styles.fundingFooter}>
                  <Text style={styles.fundingAmount}>
                    ${listing.fundingProgress.toLocaleString()} of ${listing.fundingGoal.toLocaleString()}
                  </Text>
                  <View style={styles.timeRemaining}>
                    <Clock color={colors.textSecondary} size={12} strokeWidth={2} />
                    <Text style={styles.timeRemainingText}>{listing.remainingTime} left</Text>
                  </View>
                </View>
              </View>

              <View style={styles.investButtonSmall}>
                <View style={styles.investButtonCost}>
                  <Coins color="#34C759" size={12} strokeWidth={2.5} />
                  <Text style={styles.investButtonCostText}>1 token</Text>
                </View>
                <Text style={styles.investButtonSmallText}>Tap to Invest</Text>
                <ChevronRight color={colors.primary} size={16} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </>
  );

  const renderBorrowTab = () => (
    <>
      <TouchableOpacity
        style={styles.requestLoanCard}
        activeOpacity={0.8}
        onPress={() => router.push('/p2p/request-loan' as any)}
      >
        <LinearGradient
          colors={['#FF9500', '#FF6B35']}
          style={styles.requestLoanGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.requestLoanContent}>
            <View style={styles.requestLoanIcon}>
              <HandCoins color={colors.white} size={32} strokeWidth={2} />
            </View>
            <View style={styles.requestLoanTextContainer}>
              <Text style={styles.requestLoanTitle}>Request a Loan</Text>
              <Text style={styles.requestLoanSubtitle}>
                Get funded by verified investors with competitive rates
              </Text>
            </View>
          </View>
          <View style={styles.requestLoanButton}>
            <Text style={styles.requestLoanButtonText}>Start Request</Text>
            <ChevronRight color={colors.white} size={18} strokeWidth={2.5} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Shield color={colors.primary} size={20} strokeWidth={2.5} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>How P2P Borrowing Works</Text>
          <Text style={styles.infoText}>
            1. Submit your loan request with amount and terms{'\n'}
            2. Investors review and fund your request{'\n'}
            3. Once funded, money is deposited to your account{'\n'}
            4. Make monthly payments until paid off
          </Text>
        </View>
      </View>

      {myLoanRequests.length > 0 && (
        <View style={styles.myRequestsSection}>
          <Text style={styles.sectionTitle}>Your Loan Requests</Text>
          {myLoanRequests.map((request) => (
            <View key={request.id} style={styles.myRequestCard}>
              <View style={styles.myRequestHeader}>
                <Text style={styles.myRequestPurpose}>{request.purpose}</Text>
                <View style={[styles.statusBadge, { backgroundColor: request.status === 'funding' ? colors.warning + '20' : colors.success + '20' }]}>
                  <Text style={[styles.statusText, { color: request.status === 'funding' ? colors.warning : colors.success }]}>
                    {request.status === 'funding' ? 'Seeking Funds' : 'Funded'}
                  </Text>
                </View>
              </View>
              <Text style={styles.myRequestAmount}>${request.amount.toLocaleString()}</Text>
              <View style={styles.fundingContainer}>
                <View style={styles.fundingBar}>
                  <View
                    style={[
                      styles.fundingFill,
                      { width: `${Math.min(100, (request.fundingProgress / request.fundingGoal) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.fundingAmount}>
                  ${request.fundingProgress.toLocaleString()} funded ({Math.round((request.fundingProgress / request.fundingGoal) * 100)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {myLoanRequests.length === 0 && (
        <View style={styles.emptyState}>
          <HandCoins color={colors.textTertiary} size={48} strokeWidth={1.5} />
          <Text style={styles.emptyStateTitle}>No active loan requests</Text>
          <Text style={styles.emptyStateText}>Submit a request to get funded by investors</Text>
        </View>
      )}
    </>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        <LinearGradient
          colors={["#050607", "#0B0D10", "#050607"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.bgOrb1} pointerEvents="none" />
        <View style={styles.bgOrb2} pointerEvents="none" />

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
            <Text style={styles.headerTitle}>P2P Lending</Text>
            <Text style={styles.headerSubtitle}>Invest in people • Request flexible funding</Text>
          </View>
          <TouchableOpacity 
            style={styles.tokenBadge}
            onPress={() => router.push('/subscription')}
            activeOpacity={0.7}
          >
            <Zap color={tokens <= 2 ? '#FF6B6B' : '#34C759'} size={14} fill={tokens <= 2 ? '#FF6B6B' : '#34C759'} />
            <Text style={[styles.tokenBadgeText, tokens <= 2 && styles.tokenBadgeTextLow]}>{tokens}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.tabContainer}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            console.log('[P2PMarketplace] tabContainer layout width', w);
            setTabContainerWidth(w);
          }}
          testID="p2p-tabs"
        >
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: Math.max(0, (tabContainerWidth - 12) / 2),
                transform: [{
                  translateX: tabIndicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.max(0, (tabContainerWidth - 12) / 2)],
                  }),
                }],
              },
            ]}
          />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('invest')}
            activeOpacity={0.7}
          >
            <PiggyBank color={activeTab === 'invest' ? colors.white : colors.textSecondary} size={18} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'invest' && styles.tabTextActive]}>
              Invest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('borrow')}
            activeOpacity={0.7}
          >
            <HandCoins color={activeTab === 'borrow' ? colors.white : colors.textSecondary} size={18} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'borrow' && styles.tabTextActive]}>
              Borrow
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'invest' ? renderInvestTab() : renderBorrowTab()}
          <View style={{ height: 40 }} />
        </ScrollView>
        </View>
      </View>

      <Modal
        visible={selectedLoan !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedLoan(null)}
      >
        {selectedLoan && (
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invest in Loan</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedLoan(null)}
                activeOpacity={0.7}
              >
                <X color={colors.text} size={24} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.loanSummaryCard}>
                <View style={styles.borrowerInfo}>
                  <View style={styles.borrowerAvatar}>
                    <Text style={styles.borrowerInitial}>{selectedLoan.borrowerName[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.borrowerName}>{selectedLoan.borrowerName}</Text>
                    <Text style={styles.loanPurpose}>{selectedLoan.purpose}</Text>
                  </View>
                </View>
                <View style={styles.loanSummaryStats}>
                  <View style={styles.loanSummaryStat}>
                    <Text style={styles.loanSummaryLabel}>Amount Needed</Text>
                    <Text style={styles.loanSummaryValue}>
                      ${(selectedLoan.fundingGoal - selectedLoan.fundingProgress).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.loanSummaryStat}>
                    <Text style={styles.loanSummaryLabel}>Expected Return</Text>
                    <Text style={[styles.loanSummaryValue, { color: colors.success }]}>
                      {selectedLoan.interestRate}% APR
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.investSection}>
                <Text style={styles.investSectionTitle}>Investment Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={investAmount}
                    onChangeText={(text) => setInvestAmount(formatAmount(text))}
                    placeholder="100"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <Text style={styles.amountHint}>Minimum $25 • Maximum ${(selectedLoan.fundingGoal - selectedLoan.fundingProgress).toLocaleString()}</Text>
              </View>

              <View style={styles.investSection}>
                <Text style={styles.investSectionTitle}>Payment Method</Text>
                
                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === 'wallet' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('wallet')}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionContent}>
                    <Wallet color={paymentMethod === 'wallet' ? colors.primary : colors.textSecondary} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'wallet' && styles.paymentOptionTitleActive]}>
                        Wallet Balance
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>Available: ${balance.toFixed(2)}</Text>
                    </View>
                  </View>
                  {paymentMethod === 'wallet' && <CheckCircle color={colors.primary} size={22} strokeWidth={2.5} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === 'bank' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('bank')}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionContent}>
                    <Building2 color={paymentMethod === 'bank' ? colors.primary : colors.textSecondary} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'bank' && styles.paymentOptionTitleActive]}>
                        Bank Account
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>
                        {linkedBanks.length > 0 ? `${linkedBanks[0].bankName} ••${linkedBanks[0].last4}` : 'Link a bank account'}
                      </Text>
                    </View>
                  </View>
                  {paymentMethod === 'bank' && <CheckCircle color={colors.primary} size={22} strokeWidth={2.5} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('card')}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionContent}>
                    <CreditCard color={paymentMethod === 'card' ? colors.primary : colors.textSecondary} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'card' && styles.paymentOptionTitleActive]}>
                        Debit/Credit Card
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>
                        {linkedCards.length > 0 ? `${linkedCards[0].brand} ••${linkedCards[0].last4}` : 'Link a card'}
                      </Text>
                    </View>
                  </View>
                  {paymentMethod === 'card' && <CheckCircle color={colors.primary} size={22} strokeWidth={2.5} />}
                </TouchableOpacity>
              </View>

              {investAmount && parseFloat(investAmount.replace(/,/g, '')) >= 25 && (
                <View style={styles.returnsCard}>
                  <Text style={styles.returnsTitle}>Estimated Returns</Text>
                  <View style={styles.returnsRow}>
                    <Text style={styles.returnsLabel}>Your Investment</Text>
                    <Text style={styles.returnsValue}>${investAmount}</Text>
                  </View>
                  <View style={styles.returnsRow}>
                    <Text style={styles.returnsLabel}>Expected Interest ({selectedLoan.interestRate}% APR)</Text>
                    <Text style={[styles.returnsValue, { color: colors.success }]}>
                      +${(parseFloat(investAmount.replace(/,/g, '')) * selectedLoan.interestRate / 100 * selectedLoan.termMonths / 12).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.returnsRow, styles.returnsTotalRow]}>
                    <Text style={styles.returnsTotalLabel}>Total Return</Text>
                    <Text style={styles.returnsTotalValue}>
                      ${(parseFloat(investAmount.replace(/,/g, '')) * (1 + selectedLoan.interestRate / 100 * selectedLoan.termMonths / 12)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.tokenCostBanner}>
                <Coins color="#34C759" size={16} strokeWidth={2.5} />
                <Text style={styles.tokenCostBannerText}>This action costs 1 token</Text>
                <Text style={styles.tokenCostBannerBalance}>{tokens} available</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.investButton,
                  (!investAmount || parseFloat(investAmount.replace(/,/g, '')) < 25 || isInvesting || tokens < 1) && styles.investButtonDisabled,
                ]}
                onPress={handleInvest}
                disabled={!investAmount || parseFloat(investAmount.replace(/,/g, '')) < 25 || isInvesting || tokens < 1}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#34C759', '#30D158']}
                  style={styles.investButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Zap color="#fff" size={18} strokeWidth={2.5} />
                  <Text style={styles.investButtonText}>
                    {isInvesting ? 'Processing...' : tokens < 1 ? 'Get Tokens to Invest' : `Invest ${investAmount ? `${investAmount}` : ''}`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgOrb1: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(29, 155, 240, 0.18)',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -160,
    right: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(25, 197, 52, 0.16)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 24, 28, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(47, 51, 54, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadowMedium,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(14, 16, 20, 0.92)',
    borderRadius: 18,
    padding: 6,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  tabIndicator: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 0,
    height: 44,
    backgroundColor: 'rgba(25, 197, 52, 0.16)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(25, 197, 52, 0.28)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    zIndex: 1,
    borderRadius: 14,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  statsContainer: {
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...colors.shadowStrong,
  },
  statsGradient: {
    padding: 20,
  },
  statsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statsHeaderText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: -0.2,
  },
  statsHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statsHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.white,
    marginTop: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    letterSpacing: -0.1,
  },
  addFundsCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    borderStyle: 'dashed',
  },
  addFundsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  addFundsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFundsTextContainer: {
    flex: 1,
  },
  addFundsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  addFundsSubtitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  searchContainer: {
    marginBottom: 14,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listingsContainer: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listingCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  borrowerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  borrowerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borrowerInitial: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  borrowerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  borrowerName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  creditScore: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  loanPurpose: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  loanDescription: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  loanDetails: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  loanDetailItem: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  loanDetailValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  fundingContainer: {
    marginBottom: 12,
  },
  fundingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fundingLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  fundingPercentage: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  fundingBar: {
    height: 6,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fundingFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  fundingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundingAmount: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeRemainingText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  investButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary + '12',
    borderRadius: 10,
    gap: 4,
  },
  investButtonSmallText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  requestLoanCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  requestLoanGradient: {
    padding: 20,
  },
  requestLoanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  requestLoanIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestLoanTextContainer: {
    flex: 1,
  },
  requestLoanTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  requestLoanSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  requestLoanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    gap: 6,
  },
  requestLoanButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  myRequestsSection: {
    gap: 12,
  },
  myRequestCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  myRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  myRequestPurpose: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  myRequestAmount: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 20,
  },
  loanSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loanSummaryStats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  loanSummaryStat: {
    flex: 1,
  },
  loanSummaryLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  loanSummaryValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  investSection: {
    marginBottom: 24,
  },
  investSectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  dollarSign: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  amountHint: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  paymentOptionTitleActive: {
    color: colors.primary,
  },
  paymentOptionSubtext: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  returnsCard: {
    backgroundColor: colors.successLight || 'rgba(52, 199, 89, 0.1)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  returnsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 14,
  },
  returnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  returnsLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  returnsValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  returnsTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  returnsTotalLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
  },
  returnsTotalValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: colors.success,
  },
  investButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...colors.shadowMedium,
  },
  investButtonDisabled: {
    opacity: 0.5,
  },
  investButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  investButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)',
  },
  tokenBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#34C759',
  },
  tokenBadgeTextLow: {
    color: '#FF6B6B',
  },
  investButtonCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  investButtonCostText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#34C759',
  },
  tokenCostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  tokenCostBannerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#34C759',
    flex: 1,
  },
  tokenCostBannerBalance: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.textSecondary,
  },
});
