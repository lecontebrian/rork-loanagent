import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, TrendingUp, Shield, Clock, Users, ChevronRight, Plus, Wallet, CreditCard, Building2, X, CheckCircle, PiggyBank, HandCoins, Coins, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useP2PWallet, P2PLoanRequest } from '@/contexts/P2PWalletContext';
import { useApp } from '@/contexts/AppContext';

type TabType = 'invest' | 'borrow';
type PaymentMethod = 'wallet' | 'bank' | 'card';

const CK_GREEN = '#5BDE00';
const CK_GREEN_DARK = '#2B8000';
const CK_TEXT = '#111827';
const CK_TEXT_SECONDARY = '#6B7280';
const CK_BORDER = '#E5E7EB';
const CK_BG = '#F9FAFB';

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
      case 'low': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return CK_TEXT_SECONDARY;
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
            colors={[CK_GREEN_DARK, CK_GREEN]}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
                <Wallet color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.statValue}>${balance.toFixed(0)}</Text>
                <Text style={styles.statLabel}>Wallet Balance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <TrendingUp color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.statValue}>${totalInvested.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Invested</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Users color="#FFFFFF" size={20} strokeWidth={2.5} />
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
            <Plus color={CK_GREEN_DARK} size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.addFundsTextContainer}>
            <Text style={styles.addFundsTitle}>Add Funds to Invest</Text>
            <Text style={styles.addFundsSubtitle}>Link a card or bank account</Text>
          </View>
          <ChevronRight color={CK_TEXT_SECONDARY} size={20} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color={CK_TEXT_SECONDARY} size={18} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search loan listings..."
            placeholderTextColor={CK_TEXT_SECONDARY}
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
            <PiggyBank color={CK_TEXT_SECONDARY} size={48} strokeWidth={1.5} />
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
                        <Shield color={CK_GREEN} size={14} strokeWidth={2.5} />
                      )}
                    </View>
                    <Text style={styles.creditScore}>Credit Score: {listing.creditScore}</Text>
                  </View>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(listing.riskLevel) + '15' }]}>
                  <Text style={[styles.riskText, { color: getRiskColor(listing.riskLevel) }]}>
                    {listing.riskLevel.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.loanPurpose}>{listing.purpose}</Text>
              <Text style={styles.loanDescription} numberOfLines={2}>{listing.description}</Text>

              <View style={styles.loanDetails}>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>AMOUNT</Text>
                  <Text style={styles.loanDetailValue}>${listing.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>RETURN</Text>
                  <Text style={[styles.loanDetailValue, { color: CK_GREEN_DARK }]}>{listing.interestRate}%</Text>
                </View>
                <View style={styles.loanDetailItem}>
                  <Text style={styles.loanDetailLabel}>TERM</Text>
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
                    <Clock color={CK_TEXT_SECONDARY} size={12} strokeWidth={2} />
                    <Text style={styles.timeRemainingText}>{listing.remainingTime} left</Text>
                  </View>
                </View>
              </View>

              <View style={styles.investButtonSmall}>
                <View style={styles.investButtonCost}>
                  <Coins color={CK_GREEN_DARK} size={12} strokeWidth={2.5} />
                  <Text style={styles.investButtonCostText}>1 token</Text>
                </View>
                <Text style={styles.investButtonSmallText}>Tap to Invest</Text>
                <ChevronRight color={CK_GREEN_DARK} size={16} strokeWidth={2.5} />
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
          colors={[CK_GREEN_DARK, '#45A000']}
          style={styles.requestLoanGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.requestLoanContent}>
            <View style={styles.requestLoanIcon}>
              <HandCoins color="#FFFFFF" size={32} strokeWidth={2} />
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
            <ChevronRight color="#FFFFFF" size={18} strokeWidth={2.5} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Shield color={CK_GREEN_DARK} size={20} strokeWidth={2.5} />
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
                <View style={[styles.statusBadge, { backgroundColor: request.status === 'funding' ? '#FEF3C7' : '#D1FAE5' }]}>
                  <Text style={[styles.statusText, { color: request.status === 'funding' ? '#D97706' : '#059669' }]}>
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
          <HandCoins color={CK_TEXT_SECONDARY} size={48} strokeWidth={1.5} />
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
        <View style={styles.bgGradientTop} />
        <View style={styles.bgAccent1} pointerEvents="none" />
        <View style={styles.bgAccent2} pointerEvents="none" />

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
            <Text style={styles.headerTitle}>P2P Lending</Text>
            <Text style={styles.headerSubtitle}>Invest in people • Request flexible funding</Text>
          </View>
          <TouchableOpacity 
            style={styles.tokenBadge}
            onPress={() => router.push('/subscription')}
            activeOpacity={0.7}
          >
            <Zap color={tokens <= 2 ? '#EF4444' : CK_GREEN} size={14} fill={tokens <= 2 ? '#EF4444' : CK_GREEN} />
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
                width: Math.max(0, (tabContainerWidth - 8) / 2),
                transform: [{
                  translateX: tabIndicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.max(0, (tabContainerWidth - 8) / 2)],
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
            <PiggyBank color={activeTab === 'invest' ? CK_GREEN_DARK : CK_TEXT_SECONDARY} size={18} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'invest' && styles.tabTextActive]}>
              Invest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('borrow')}
            activeOpacity={0.7}
          >
            <HandCoins color={activeTab === 'borrow' ? CK_GREEN_DARK : CK_TEXT_SECONDARY} size={18} strokeWidth={2} />
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
                <X color={CK_TEXT} size={24} strokeWidth={2} />
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
                    <Text style={[styles.loanSummaryValue, { color: CK_GREEN_DARK }]}>
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
                    placeholderTextColor={CK_TEXT_SECONDARY}
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
                    <Wallet color={paymentMethod === 'wallet' ? CK_GREEN_DARK : CK_TEXT_SECONDARY} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'wallet' && styles.paymentOptionTitleActive]}>
                        Wallet Balance
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>Available: ${balance.toFixed(2)}</Text>
                    </View>
                  </View>
                  {paymentMethod === 'wallet' && <CheckCircle color={CK_GREEN} size={22} strokeWidth={2.5} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === 'bank' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('bank')}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionContent}>
                    <Building2 color={paymentMethod === 'bank' ? CK_GREEN_DARK : CK_TEXT_SECONDARY} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'bank' && styles.paymentOptionTitleActive]}>
                        Bank Account
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>
                        {linkedBanks.length > 0 ? `${linkedBanks[0].bankName} ••${linkedBanks[0].last4}` : 'Link a bank account'}
                      </Text>
                    </View>
                  </View>
                  {paymentMethod === 'bank' && <CheckCircle color={CK_GREEN} size={22} strokeWidth={2.5} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('card')}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionContent}>
                    <CreditCard color={paymentMethod === 'card' ? CK_GREEN_DARK : CK_TEXT_SECONDARY} size={24} strokeWidth={2} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[styles.paymentOptionTitle, paymentMethod === 'card' && styles.paymentOptionTitleActive]}>
                        Debit/Credit Card
                      </Text>
                      <Text style={styles.paymentOptionSubtext}>
                        {linkedCards.length > 0 ? `${linkedCards[0].brand} ••${linkedCards[0].last4}` : 'Link a card'}
                      </Text>
                    </View>
                  </View>
                  {paymentMethod === 'card' && <CheckCircle color={CK_GREEN} size={22} strokeWidth={2.5} />}
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
                    <Text style={[styles.returnsValue, { color: CK_GREEN_DARK }]}>
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
                <Coins color={CK_GREEN_DARK} size={16} strokeWidth={2.5} />
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
                  colors={[CK_GREEN_DARK, CK_GREEN]}
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
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  bgGradientTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, backgroundColor: '#F8FAF5' },
  bgAccent1: { position: 'absolute', top: 150, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(91,222,0,0.06)' },
  bgAccent2: { position: 'absolute', bottom: 150, left: -80, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(43,128,0,0.04)' },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: CK_BORDER, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  headerTitleContainer: { alignItems: 'center' },
  headerSubtitle: { marginTop: 3, fontSize: 12, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  headerTitle: { fontSize: 20, fontWeight: '700' as const, color: CK_TEXT },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 16, position: 'relative' },
  tabIndicator: { position: 'absolute', top: 4, left: 4, width: 0, height: 40, backgroundColor: '#FFFFFF', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 8, zIndex: 1, borderRadius: 8 },
  tabText: { fontSize: 15, fontWeight: '600' as const, color: CK_TEXT_SECONDARY },
  tabTextActive: { color: CK_GREEN_DARK },
  scrollContent: { paddingHorizontal: 20, paddingTop: 2 },
  statsContainer: { marginBottom: 16, borderRadius: 16, overflow: 'hidden', shadowColor: CK_GREEN_DARK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  statsGradient: { padding: 20 },
  statsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statsHeaderText: { fontSize: 14, fontWeight: '600' as const, color: 'rgba(255,255,255,0.95)' },
  statsHeaderBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statsHeaderBadgeText: { fontSize: 11, fontWeight: '600' as const, color: 'rgba(255,255,255,0.95)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.25)' },
  statValue: { fontSize: 22, fontWeight: '800' as const, color: '#FFFFFF', marginTop: 6 },
  statLabel: { fontSize: 11, fontWeight: '500' as const, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  addFundsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: CK_GREEN, borderStyle: 'dashed' },
  addFundsContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  addFundsIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(91,222,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  addFundsTextContainer: { flex: 1 },
  addFundsTitle: { fontSize: 16, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 2 },
  addFundsSubtitle: { fontSize: 13, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  searchContainer: { marginBottom: 14 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: CK_BG, borderRadius: 10, borderWidth: 1, borderColor: CK_BORDER },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' as const, color: CK_TEXT },
  filtersContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: CK_BORDER },
  filterChipActive: { backgroundColor: CK_GREEN_DARK, borderColor: CK_GREEN_DARK },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  filterChipText: { fontSize: 13, fontWeight: '600' as const, color: CK_TEXT_SECONDARY },
  filterChipTextActive: { color: '#FFFFFF' },
  listingsContainer: { gap: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyStateTitle: { fontSize: 17, fontWeight: '700' as const, color: CK_TEXT },
  emptyStateText: { fontSize: 14, fontWeight: '500' as const, color: CK_TEXT_SECONDARY, textAlign: 'center' },
  listingCard: { padding: 18, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: CK_BORDER, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  borrowerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  borrowerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: CK_GREEN_DARK, alignItems: 'center', justifyContent: 'center' },
  borrowerInitial: { fontSize: 17, fontWeight: '700' as const, color: '#FFFFFF' },
  borrowerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  borrowerName: { fontSize: 15, fontWeight: '600' as const, color: CK_TEXT },
  creditScore: { fontSize: 12, fontWeight: '600' as const, color: CK_GREEN, marginTop: 2 },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  riskText: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.5 },
  loanPurpose: { fontSize: 17, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 6 },
  loanDescription: { fontSize: 13, fontWeight: '500' as const, color: CK_TEXT_SECONDARY, lineHeight: 18, marginBottom: 14 },
  loanDetails: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  loanDetailItem: { flex: 1 },
  loanDetailLabel: { fontSize: 10, fontWeight: '600' as const, color: '#9CA3AF', marginBottom: 4, letterSpacing: 0.5 },
  loanDetailValue: { fontSize: 16, fontWeight: '700' as const, color: CK_TEXT },
  fundingContainer: { marginBottom: 12 },
  fundingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  fundingLabel: { fontSize: 12, fontWeight: '600' as const, color: '#374151' },
  fundingPercentage: { fontSize: 14, fontWeight: '700' as const, color: CK_GREEN },
  fundingBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  fundingFill: { height: '100%', backgroundColor: CK_GREEN, borderRadius: 4 },
  fundingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fundingAmount: { fontSize: 12, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  timeRemaining: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeRemainingText: { fontSize: 11, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  investButtonSmall: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: 'rgba(91,222,0,0.1)', borderRadius: 8, gap: 4 },
  investButtonSmallText: { fontSize: 14, fontWeight: '600' as const, color: CK_GREEN_DARK },
  requestLoanCard: { marginBottom: 20, borderRadius: 16, overflow: 'hidden', shadowColor: CK_GREEN_DARK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  requestLoanGradient: { padding: 20 },
  requestLoanContent: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  requestLoanIcon: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  requestLoanTextContainer: { flex: 1 },
  requestLoanTitle: { fontSize: 22, fontWeight: '800' as const, color: '#FFFFFF', marginBottom: 4 },
  requestLoanSubtitle: { fontSize: 14, fontWeight: '500' as const, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  requestLoanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, gap: 6 },
  requestLoanButtonText: { fontSize: 16, fontWeight: '700' as const, color: '#FFFFFF' },
  infoCard: { flexDirection: 'row', gap: 14, backgroundColor: '#F0FDF4', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(91,222,0,0.2)' },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 8 },
  infoText: { fontSize: 13, fontWeight: '500' as const, color: '#4B5563', lineHeight: 20 },
  myRequestsSection: { gap: 12 },
  myRequestCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: CK_BORDER },
  myRequestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  myRequestPurpose: { fontSize: 16, fontWeight: '700' as const, color: CK_TEXT },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' as const },
  myRequestAmount: { fontSize: 24, fontWeight: '800' as const, color: CK_TEXT, marginBottom: 12 },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: CK_BORDER },
  modalTitle: { fontSize: 18, fontWeight: '700' as const, color: CK_TEXT },
  modalCloseButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalContent: { padding: 20 },
  loanSummaryCard: { backgroundColor: CK_BG, borderRadius: 12, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: CK_BORDER },
  loanSummaryStats: { flexDirection: 'row', marginTop: 16, gap: 16 },
  loanSummaryStat: { flex: 1 },
  loanSummaryLabel: { fontSize: 12, fontWeight: '500' as const, color: CK_TEXT_SECONDARY, marginBottom: 4 },
  loanSummaryValue: { fontSize: 20, fontWeight: '700' as const, color: CK_TEXT },
  investSection: { marginBottom: 24 },
  investSectionTitle: { fontSize: 15, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 12 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: CK_BORDER, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 16 },
  dollarSign: { fontSize: 28, fontWeight: '700' as const, color: CK_TEXT, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700' as const, color: CK_TEXT },
  amountHint: { fontSize: 12, fontWeight: '500' as const, color: '#9CA3AF', marginTop: 8 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: CK_BORDER },
  paymentOptionActive: { borderColor: CK_GREEN, backgroundColor: 'rgba(91,222,0,0.05)' },
  paymentOptionContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  paymentOptionText: { flex: 1 },
  paymentOptionTitle: { fontSize: 15, fontWeight: '600' as const, color: CK_TEXT, marginBottom: 2 },
  paymentOptionTitleActive: { color: CK_GREEN_DARK },
  paymentOptionSubtext: { fontSize: 13, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  returnsCard: { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(91,222,0,0.2)' },
  returnsTitle: { fontSize: 15, fontWeight: '700' as const, color: CK_TEXT, marginBottom: 14 },
  returnsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  returnsLabel: { fontSize: 14, fontWeight: '500' as const, color: CK_TEXT_SECONDARY },
  returnsValue: { fontSize: 14, fontWeight: '600' as const, color: CK_TEXT },
  returnsTotalRow: { borderTopWidth: 1, borderTopColor: 'rgba(91,222,0,0.2)', paddingTop: 12, marginTop: 4, marginBottom: 0 },
  returnsTotalLabel: { fontSize: 15, fontWeight: '700' as const, color: CK_TEXT },
  returnsTotalValue: { fontSize: 18, fontWeight: '800' as const, color: CK_GREEN_DARK },
  investButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 20, shadowColor: CK_GREEN_DARK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  investButtonDisabled: { opacity: 0.5 },
  investButtonGradient: { flexDirection: 'row', paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  investButtonText: { fontSize: 17, fontWeight: '700' as const, color: '#FFFFFF' },
  tokenBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(91,222,0,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(91,222,0,0.25)' },
  tokenBadgeText: { fontSize: 14, fontWeight: '700' as const, color: CK_GREEN_DARK },
  tokenBadgeTextLow: { color: '#EF4444' },
  investButtonCost: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(91,222,0,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  investButtonCostText: { fontSize: 11, fontWeight: '600' as const, color: CK_GREEN_DARK },
  tokenCostBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(91,222,0,0.08)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(91,222,0,0.2)' },
  tokenCostBannerText: { fontSize: 14, fontWeight: '600' as const, color: CK_GREEN_DARK, flex: 1 },
  tokenCostBannerBalance: { fontSize: 13, fontWeight: '700' as const, color: CK_TEXT_SECONDARY },
});
