import type {
  AgentPipelineResult,
  AgentLogEntry,
  ApplicantData,
  RuleFlag,
  AgentStage,
} from '@/types/loanAgent';
import { AGENT_STAGES } from '@/types/loanAgent';
import { calculateDTI, calculateLTV, calculateAmortization, THRESHOLDS } from './underwriting';
import { evaluateRules } from './rulesEngine';
import { generateAnalystNarrative } from './aiAnalyst';

type LogCallback = (entry: AgentLogEntry) => void;

/**
 * Agent Pipeline Orchestrator.
 *
 * Runs the full 3-agent pipeline with simulated async stages,
 * emitting log entries at each transition so the UI can animate
 * the progress stepper in real time.
 */
export async function runAgentPipeline(
  applicantData: ApplicantData,
  onLog: LogCallback,
): Promise<AgentPipelineResult> {
  const logs: AgentLogEntry[] = [];
  let idCounter = 0;

  const log = (stage: AgentStage, message: string, severity?: RuleFlag['severity']) => {
    const entry: AgentLogEntry = {
      id: `log-${++idCounter}`,
      stage,
      message,
      timestamp: Date.now(),
      severity,
    };
    logs.push(entry);
    onLog(entry);
  };

  // Stage 1: Data Extraction
  log('Data_Extraction', 'Ingesting applicant financial data...');
  await delay(600);
  log(
    'Data_Extraction',
    `Parsed: Income $${applicantData.grossAnnualIncome.toLocaleString()}, ` +
      `${applicantData.existingDebts.length} debt accounts, ` +
      `Loan request $${applicantData.requestedLoanAmount.toLocaleString()}`,
  );
  await delay(400);

  // Stage 2: Rules Validation
  log('Rules_Validation', 'Running deterministic underwriting calculations...');
  await delay(300);

  const dti = calculateDTI(
    applicantData.totalMonthlyDebtPayments,
    applicantData.grossAnnualIncome,
  );
  log(
    'Rules_Validation',
    `DTI computed: ${dti.ratio.toFixed(1)}% (threshold: ${THRESHOLDS.DTI_MAX}%)`,
    dti.flag,
  );
  await delay(400);

  const ltv = calculateLTV(applicantData.requestedLoanAmount, applicantData.assetValue);
  log(
    'Rules_Validation',
    `LTV computed: ${ltv.ratio.toFixed(1)}% (threshold: ${THRESHOLDS.LTV_MAX}%)`,
    ltv.flag,
  );
  await delay(300);

  const amortization = calculateAmortization(
    applicantData.requestedLoanAmount,
    THRESHOLDS.DEFAULT_RATE,
    THRESHOLDS.DEFAULT_TERM_MONTHS,
  );
  log(
    'Rules_Validation',
    `Amortization: $${amortization.monthlyPayment.toLocaleString()}/mo × ${amortization.termMonths} months`,
  );
  await delay(300);

  const flags = evaluateRules(dti, ltv);
  const criticalCount = flags.filter((f) => f.severity === 'CriticalFail').length;
  const warningCount = flags.filter((f) => f.severity === 'Warning').length;

  log(
    'Rules_Validation',
    `Flag summary: ${flags.length} rules evaluated, ${criticalCount} critical, ${warningCount} warnings`,
    criticalCount > 0 ? 'CriticalFail' : warningCount > 0 ? 'Warning' : 'Success',
  );
  await delay(300);

  // Stage 3: Risk Analysis
  log('Risk_Analysis', 'Analyzing risk profile against lending guidelines...');
  await delay(500);

  const narrative = generateAnalystNarrative(flags, dti, ltv, amortization);

  log(
    'Risk_Analysis',
    `Analyst recommendation: ${narrative.recommendation.toUpperCase()}`,
    narrative.recommendation === 'reject'
      ? 'CriticalFail'
      : narrative.recommendation === 'caution'
        ? 'Warning'
        : 'Success',
  );
  await delay(200);

  // Stage 4: Human Review Required (if applicable)
  if (criticalCount > 0 || warningCount >= 2) {
    log(
      'Human_Review_Required',
      'Escalating to human underwriter — application flagged for manual review.',
      'Warning',
    );
    await delay(400);
    log(
      'Human_Review_Required',
      'Pending: Income verification and compensating factor assessment needed.',
      'Warning',
    );
    await delay(200);
  } else {
    log('Human_Review_Required', 'No manual review required — all checks passed.');
    await delay(200);
  }

  // Stage 5: Final Status
  const finalDecision = narrative.recommendation;
  log(
    'Final_Status',
    finalDecision === 'approve'
      ? 'Final decision: APPROVED — ready for final processing.'
      : finalDecision === 'caution'
        ? 'Final decision: CAUTION — pending human underwriter sign-off.'
        : 'Final decision: DECLINED — does not meet underwriting standards.',
    finalDecision === 'approve'
      ? 'Success'
      : finalDecision === 'caution'
        ? 'Warning'
        : 'CriticalFail',
  );

  return {
    applicantData,
    dti,
    ltv,
    amortization,
    flags,
    narrative,
    finalDecision,
    logs,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
