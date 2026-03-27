export interface FeeConfig {
  processorFeePercent: number;
  appFeePercent: number;
  appFeeMax: number;
  description: string;
}

export const FEE_CONFIGS: Record<string, FeeConfig> = {
  card: {
    processorFeePercent: 2.5,
    appFeePercent: 0.5,
    appFeeMax: 5.0,
    description: 'Card/Credit transactions (instant)',
  },
  bank: {
    processorFeePercent: 0.8,
    appFeePercent: 0.3,
    appFeeMax: 3.0,
    description: 'Bank/ACH transfers (1-3 days)',
  },
  instant: {
    processorFeePercent: 1.75,
    appFeePercent: 0.4,
    appFeeMax: 4.0,
    description: 'Instant debit transfers',
  },
  standard: {
    processorFeePercent: 0.5,
    appFeePercent: 0.3,
    appFeeMax: 2.5,
    description: 'Standard ACH withdrawals (3-5 days)',
  },
};

export function calculateFees(amount: number, type: keyof typeof FEE_CONFIGS) {
  const config = FEE_CONFIGS[type];
  
  const processorFee = (amount * config.processorFeePercent) / 100;
  
  let appFee = (amount * config.appFeePercent) / 100;
  if (appFee > config.appFeeMax) {
    appFee = config.appFeeMax;
  }
  
  const totalFees = processorFee + appFee;
  const netAmount = amount - totalFees;
  
  return {
    processorFee,
    processorFeePercent: config.processorFeePercent,
    appFee,
    appFeePercent: config.appFeePercent,
    totalFees,
    netAmount,
    grossAmount: amount,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatCurrencyExact(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
