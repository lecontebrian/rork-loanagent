import type { DTIResult, LTVResult, AmortizationResult, FlagSeverity } from '@/types/loanAgent';

/** Policy thresholds — the single source of truth. AI never touches these numbers. */
export const THRESHOLDS = {
  DTI_MAX: 43,
  DTI_WARN: 36,
  LTV_MAX: 80,
  LTV_WARN: 70,
  DEFAULT_RATE: 7.5,
  DEFAULT_TERM_MONTHS: 60,
} as const;

function severityFor(value: number, max: number, warn: number): FlagSeverity {
  if (value > max) return 'CriticalFail';
  if (value > warn) return 'Warning';
  return 'Success';
}

/**
 * Calculates Debt-to-Income ratio.
 * DTI = (Total Monthly Debt Payments) / (Gross Monthly Income) × 100
 */
export function calculateDTI(
  totalMonthlyDebtPayments: number,
  grossAnnualIncome: number,
): DTIResult {
  const grossMonthlyIncome = grossAnnualIncome / 12;

  if (grossMonthlyIncome <= 0) {
    return {
      ratio: 0,
      totalMonthlyDebts: totalMonthlyDebtPayments,
      grossMonthlyIncome,
      flag: 'CriticalFail',
      threshold: THRESHOLDS.DTI_MAX,
      label: 'DTI Ratio',
    };
  }

  const ratio = ((totalMonthlyDebtPayments / grossMonthlyIncome) * 100);
  const flag = severityFor(ratio, THRESHOLDS.DTI_MAX, THRESHOLDS.DTI_WARN);

  return {
    ratio: Math.round(ratio * 100) / 100,
    totalMonthlyDebts: totalMonthlyDebtPayments,
    grossMonthlyIncome,
    flag,
    threshold: THRESHOLDS.DTI_MAX,
    label: 'DTI Ratio',
  };
}

/**
 * Calculates Loan-to-Value ratio.
 * LTV = (Requested Loan Amount) / (Asset Value) × 100
 */
export function calculateLTV(
  requestedLoanAmount: number,
  assetValue: number,
): LTVResult {
  if (assetValue <= 0) {
    return {
      ratio: 0,
      requestedAmount: requestedLoanAmount,
      assetValue,
      flag: 'CriticalFail',
      threshold: THRESHOLDS.LTV_MAX,
      label: 'LTV Ratio',
    };
  }

  const ratio = ((requestedLoanAmount / assetValue) * 100);
  const flag = severityFor(ratio, THRESHOLDS.LTV_MAX, THRESHOLDS.LTV_WARN);

  return {
    ratio: Math.round(ratio * 100) / 100,
    requestedAmount: requestedLoanAmount,
    assetValue,
    flag,
    threshold: THRESHOLDS.LTV_MAX,
    label: 'LTV Ratio',
  };
}

/**
 * Calculates amortization schedule estimate using the standard formula:
 * M = P × [ r(1+r)^n ] / [ (1+r)^n − 1 ]
 *
 * Returns monthly payment, total payment, and total interest.
 */
export function calculateAmortization(
  principal: number,
  annualRate: number,
  termMonths: number,
): AmortizationResult {
  if (principal <= 0 || termMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      termMonths,
      annualRate,
      label: 'Amortization Estimate',
    };
  }

  const monthlyRate = (annualRate / 100) / 12;

  // Edge case: zero interest
  if (monthlyRate === 0) {
    const monthlyPayment = principal / termMonths;
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: principal,
      totalInterest: 0,
      termMonths,
      annualRate,
      label: 'Amortization Estimate',
    };
  }

  const pow = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPayment = principal * ((monthlyRate * pow) / (pow - 1));
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    termMonths,
    annualRate,
    label: 'Amortization Estimate',
  };
}
