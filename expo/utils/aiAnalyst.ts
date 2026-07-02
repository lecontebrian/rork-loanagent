import type {
  RuleFlag,
  DTIResult,
  LTVResult,
  AmortizationResult,
  AnalystNarrative,
} from '@/types/loanAgent';
import { getRelevantCitations } from '@/mocks/lendingGuidelines';
import { formatCurrency, formatPercent } from './formatters';

/**
 * AI Analyst — Narrative Synthesis Layer.
 *
 * This module generates the human-readable summary, approval recommendation,
 * and policy citations. It reads the deterministic calculation flags and
 * composes a narrative. The AI NEVER does math — it only writes.
 *
 * In production this would call an LLM with the flags and guidelines as context.
 * The deterministic output shape ensures the frontend never breaks.
 */
export function generateAnalystNarrative(
  flags: RuleFlag[],
  dti: DTIResult,
  ltv: LTVResult,
  amortization: AmortizationResult,
): AnalystNarrative {
  const criticalCount = flags.filter((f) => f.severity === 'CriticalFail').length;
  const warningCount = flags.filter((f) => f.severity === 'Warning').length;

  let recommendation: AnalystNarrative['recommendation'];
  let severityBorder: AnalystNarrative['severityBorder'];

  if (criticalCount > 0) {
    recommendation = 'reject';
    severityBorder = 'red';
  } else if (warningCount >= 2) {
    recommendation = 'caution';
    severityBorder = 'yellow';
  } else if (warningCount === 1) {
    recommendation = 'caution';
    severityBorder = 'yellow';
  } else {
    recommendation = 'approve';
    severityBorder = 'green';
  }

  const citations = getRelevantCitations(dti.flag, ltv.flag);

  const summary = buildSummary(
    recommendation,
    dti,
    ltv,
    amortization,
    flags,
    criticalCount,
    warningCount,
  );

  return { summary, recommendation, citations, severityBorder };
}

function buildSummary(
  recommendation: AnalystNarrative['recommendation'],
  dti: DTIResult,
  ltv: LTVResult,
  amort: AmortizationResult,
  flags: RuleFlag[],
  criticalCount: number,
  warningCount: number,
): string {
  const dtiPct = dti.ratio.toFixed(1);
  const ltvPct = ltv.ratio.toFixed(1);
  const monthly = formatCurrency(amort.monthlyPayment);
  const totalInterest = formatCurrency(amort.totalInterest);
  const totalPayment = formatCurrency(amort.totalPayment);

  if (recommendation === 'approve') {
    return `**Recommendation: Approve** — This application meets all underwriting thresholds. The applicant's DTI of ${dtiPct}% is comfortably below the ${dti.threshold}% ceiling, and LTV of ${ltvPct}% falls within the ${ltv.threshold}% limit. At the projected ${amort.annualRate}% rate, monthly payments would be ${monthly} over ${amort.termMonths} months, with total interest of ${totalInterest} on a ${totalPayment} obligation. No flags require escalation. This application can proceed to final approval.`;
  }

  if (recommendation === 'caution') {
    const flagSummary = flags
      .filter((f) => f.severity !== 'Success')
      .map((f) => f.detail)
      .join(' ');

    return `**Recommendation: Flag for Manual Review** — This application has ${warningCount} warning flag${warningCount > 1 ? 's' : ''} that warrant underwriter attention. DTI stands at ${dtiPct}% (threshold: ${dti.threshold}%) and LTV at ${ltvPct}% (threshold: ${ltv.threshold}%). ${flagSummary} The projected monthly payment of ${monthly} (${amort.annualRate}% APR, ${amort.termMonths} months) results in ${totalInterest} total interest. A human underwriter should verify income documentation and consider compensating factors before proceeding.`;
  }

  // reject
  const criticalFlags = flags
    .filter((f) => f.severity === 'CriticalFail')
    .map((f) => f.detail)
    .join(' ');

  return `**Recommendation: Decline** — This application fails ${criticalCount} critical underwriting threshold${criticalCount > 1 ? 's' : ''}. ${criticalFlags} The applicant's DTI of ${dtiPct}% and LTV of ${ltvPct}% place this application outside our standard lending guidelines. Even with a projected monthly payment of ${monthly} at ${amort.annualRate}% APR, the risk profile exceeds acceptable parameters. This application should not proceed without a material change in circumstances (higher income, lower loan amount, or additional collateral).`;
}
