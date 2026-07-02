import type { RuleFlag, DTIResult, LTVResult } from '@/types/loanAgent';
import { THRESHOLDS } from './underwriting';

/**
 * Deterministic Rules Engine.
 *
 * Evaluates all hard-coded thresholds and returns a flat list of flags.
 * The LLM/AI layer is strictly forbidden from performing math here —
 * it only reads the output flags and writes a narrative.
 */
export function evaluateRules(dti: DTIResult, ltv: LTVResult): RuleFlag[] {
  const flags: RuleFlag[] = [];

  // DTI rule
  flags.push({
    metric: 'DTI',
    calculatedValue: dti.ratio,
    threshold: THRESHOLDS.DTI_MAX,
    severity: dti.flag,
    label: dti.label,
    detail:
      dti.flag === 'CriticalFail'
        ? `DTI of ${dti.ratio.toFixed(1)}% exceeds the ${THRESHOLDS.DTI_MAX}% maximum. Manual underwriting required.`
        : dti.flag === 'Warning'
          ? `DTI of ${dti.ratio.toFixed(1)}% is elevated — additional income verification recommended.`
          : `DTI of ${dti.ratio.toFixed(1)}% is within acceptable range.`,
  });

  // LTV rule
  flags.push({
    metric: 'LTV',
    calculatedValue: ltv.ratio,
    threshold: THRESHOLDS.LTV_MAX,
    severity: ltv.flag,
    label: ltv.label,
    detail:
      ltv.flag === 'CriticalFail'
        ? `LTV of ${ltv.ratio.toFixed(1)}% exceeds the ${THRESHOLDS.LTV_MAX}% maximum. Automatic decline unless PMI present.`
        : ltv.flag === 'Warning'
          ? `LTV of ${ltv.ratio.toFixed(1)}% requires a recent property appraisal.`
          : `LTV of ${ltv.ratio.toFixed(1)}% is within acceptable range.`,
  });

  // Income sufficiency rule: monthly payment should not exceed 28% of gross monthly
  const grossMonthly = dti.grossMonthlyIncome;
  if (grossMonthly > 0) {
    const monthlyDebtRatio = (dti.totalMonthlyDebts / grossMonthly) * 100;
    flags.push({
      metric: 'Payment-to-Income',
      calculatedValue: monthlyDebtRatio,
      threshold: 28,
      severity: monthlyDebtRatio > 28 ? 'Warning' : 'Success',
      label: 'Payment/Income',
      detail:
        monthlyDebtRatio > 28
          ? `Monthly debt payments are ${monthlyDebtRatio.toFixed(1)}% of income — above the recommended 28% front-end ratio.`
          : `Monthly debt burden of ${monthlyDebtRatio.toFixed(1)}% is healthy.`,
    });
  }

  return flags;
}
