import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Info, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { formatCurrencyExact } from '@/constants/fees';

interface FeeBreakdownProps {
  amount: number;
  processorFee: number;
  processorFeePercent: number;
  appFee: number;
  appFeePercent: number;
  totalFees: number;
  netAmount: number;
  variant?: 'send' | 'receive' | 'withdraw' | 'add';
}

export default function FeeBreakdown({
  amount,
  processorFee,
  processorFeePercent,
  appFee,
  appFeePercent,
  totalFees,
  netAmount,
  variant = 'send',
}: FeeBreakdownProps) {
  const [showInfo, setShowInfo] = useState(false);

  const labels = {
    send: {
      total: 'Total you pay',
      net: 'Recipient receives',
    },
    receive: {
      total: 'Total received',
      net: 'You get',
    },
    withdraw: {
      total: 'Withdrawal amount',
      net: 'You receive',
    },
    add: {
      total: 'Amount to add',
      net: 'Added to wallet',
    },
  };

  const currentLabels = labels[variant];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>{formatCurrencyExact(amount)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.labelWithInfo}>
          <Text style={styles.feeLabel}>Processor fee</Text>
          <TouchableOpacity onPress={() => setShowInfo(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Info color={colors.textTertiary} size={14} />
          </TouchableOpacity>
        </View>
        <Text style={styles.feeValue}>
          {formatCurrencyExact(processorFee)} ({processorFeePercent.toFixed(1)}%)
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelWithInfo}>
          <Text style={styles.feeLabel}>App processing fee</Text>
          <TouchableOpacity onPress={() => setShowInfo(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Info color={colors.textTertiary} size={14} />
          </TouchableOpacity>
        </View>
        <Text style={styles.feeValue}>
          {formatCurrencyExact(appFee)} ({appFeePercent.toFixed(1)}%)
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total fees</Text>
        <Text style={styles.totalFeeValue}>{formatCurrencyExact(totalFees)}</Text>
      </View>

      <View style={[styles.row, styles.netRow]}>
        <Text style={styles.netLabel}>{currentLabels.net}</Text>
        <Text style={styles.netValue}>{formatCurrencyExact(netAmount)}</Text>
      </View>

      <Modal transparent visible={showInfo} animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInfo(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInfo(false)}>
              <X color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>About Fees</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Processor Fee</Text>
              <Text style={styles.modalText}>
                This fee is charged by our payment processor (e.g., Stripe, PayPal) to handle the transaction securely. 
                It varies by payment method: {'\n\n'}
                • Card: ~2.5% {'\n'}
                • Bank/ACH: ~0.5–1%{'\n'}
                • Instant: ~1.5%
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>App Processing Fee</Text>
              <Text style={styles.modalText}>
                We keep our app fee low (around {appFeePercent.toFixed(1)}%, capped at a small maximum) to cover security, operations, 
                and platform maintenance while staying cheaper than typical market rates.
              </Text>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={() => setShowInfo(false)}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
  },
  value: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feeLabel: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  totalFeeValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.error,
  },
  netRow: {
    paddingTop: 12,
    marginTop: 4,
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  netValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...colors.shadowStrong,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
});
