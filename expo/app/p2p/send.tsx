import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, UserRound, BadgeDollarSign } from 'lucide-react-native';
import colors from '@/constants/colors';
import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useP2PWallet } from '@/contexts/P2PWalletContext';
import { calculateFees, formatCurrencyExact } from '@/constants/fees';
import FeeBreakdown from '@/components/FeeBreakdown';
import { formatNumberInputText, parseNumberInput } from '@/utils/formatters';

export default function SendMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance, sendMoney } = useP2PWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [fundingSource, setFundingSource] = useState<'wallet' | 'bank' | 'card'>('wallet');

  const amountNum = useMemo(() => parseNumberInput(amount), [amount]);
  
  const feeData = useMemo(() => {
    if (amountNum === 0) return null;
    
    const feeType = fundingSource === 'card' ? 'card' : fundingSource === 'bank' ? 'bank' : 'instant';
    return calculateFees(amountNum, feeType);
  }, [amountNum, fundingSource]);

  const canSend = recipient.trim().length > 0 && amountNum > 0 && (fundingSource === 'wallet' ? amountNum + (feeData?.totalFees || 0) <= balance : true);

  const handleSend = () => {
    if (!canSend) return;
    
    Alert.alert(
      'Confirm Send Money',
      `Send ${formatCurrencyExact(amountNum)} to ${recipient}?\n\nTotal fees: ${formatCurrencyExact(feeData?.totalFees || 0)}\nYou'll be charged: ${formatCurrencyExact((feeData?.grossAmount || 0) + (feeData?.totalFees || 0))}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            sendMoney(recipient, amountNum, note, fundingSource);
            Alert.alert('Success', `${formatCurrencyExact(amountNum)} sent to ${recipient}`);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={21} strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrencyExact(balance)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recipient</Text>
            <View style={styles.inputContainer}>
              <UserRound color={colors.textTertiary} size={19} strokeWidth={2.25} />
              <TextInput
                style={styles.input}
                placeholder="Name, email, or username"
                placeholderTextColor={colors.textTertiary}
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.inputContainer}>
              <BadgeDollarSign color={colors.textTertiary} size={19} strokeWidth={2.25} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                value={amount}
                onChangeText={(t) => setAmount(formatNumberInputText(t, { allowDecimal: true, maxDecimals: 2, compactMillions: true }))}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Note (optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { paddingLeft: 16 }]}
                placeholder="What's this for?"
                placeholderTextColor={colors.textTertiary}
                value={note}
                onChangeText={setNote}
                maxLength={100}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Funding Source</Text>
            <View style={styles.fundingOptions}>
              <TouchableOpacity
                style={[styles.fundingOption, fundingSource === 'wallet' && styles.fundingOptionActive]}
                onPress={() => setFundingSource('wallet')}
                activeOpacity={0.7}
              >
                <Text style={[styles.fundingOptionText, fundingSource === 'wallet' && styles.fundingOptionTextActive]}>
                  Wallet
                </Text>
                <Text style={styles.fundingOptionSubtext}>Instant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fundingOption, fundingSource === 'bank' && styles.fundingOptionActive]}
                onPress={() => setFundingSource('bank')}
                activeOpacity={0.7}
              >
                <Text style={[styles.fundingOptionText, fundingSource === 'bank' && styles.fundingOptionTextActive]}>
                  Bank
                </Text>
                <Text style={styles.fundingOptionSubtext}>1–3 days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fundingOption, fundingSource === 'card' && styles.fundingOptionActive]}
                onPress={() => setFundingSource('card')}
                activeOpacity={0.7}
              >
                <Text style={[styles.fundingOptionText, fundingSource === 'card' && styles.fundingOptionTextActive]}>
                  Card
                </Text>
                <Text style={styles.fundingOptionSubtext}>Instant</Text>
              </TouchableOpacity>
            </View>
          </View>

          {feeData && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fee Breakdown</Text>
              <FeeBreakdown
                amount={feeData.grossAmount}
                processorFee={feeData.processorFee}
                processorFeePercent={feeData.processorFeePercent}
                appFee={feeData.appFee}
                appFeePercent={feeData.appFeePercent}
                totalFees={feeData.totalFees}
                netAmount={feeData.netAmount}
                variant="send"
              />
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.85}
          >
            <Text style={styles.sendButtonText}>
              Send {feeData ? formatCurrencyExact(amountNum) : '$0.00'}
            </Text>
            {feeData && (
              <Text style={styles.sendButtonSubtext}>
                Total: {formatCurrencyExact(feeData.grossAmount + feeData.totalFees)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.08)',
    ...colors.shadow,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    marginLeft: 12,
  },
  fundingOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  fundingOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  fundingOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  fundingOptionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  fundingOptionTextActive: {
    color: colors.primary,
  },
  fundingOptionSubtext: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    ...colors.shadowMedium,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 2,
  },
  sendButtonSubtext: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
