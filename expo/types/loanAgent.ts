/** State machine lifecycle for a loan application under agent review. */
export type AgentStage =
  | 'Draft'
  | 'Data_Extraction'
  | 'Rules_Validation'
  | 'Risk_Analysis'
  | 'Human_Review_Required'
  | 'Final_Status';

export const AGENT_STAGES: readonly AgentStage[] = [
  'Draft',
  'Data_Extraction',
  'Rules_Validation',
  'Risk_Analysis',
  'Human_Review_Required',
  'Final_Status',
] as const;

export type FlagSeverity = 'Success' | 'Warning' | 'CriticalFail';

/** Structured applicant data parsed from raw input (simulating OCR output). */
export interface ApplicantData {
  monthlyIncome: number;
  grossAnnualIncome: number;
  existingDebts: ExistingDebt[];
  totalMonthlyDebtPayments: number;
  requestedLoanAmount: number;
  assetValue: number;
  loanPurpose: string;
  employmentStatus: string;
  monthsEmployed: number;
}

export interface ExistingDebt {
  type: string;
  monthlyPayment: number;
  remainingBalance: number;
}

/** A single rule evaluation result. */
export interface RuleFlag {
  metric: string;
  calculatedValue: number;
  threshold: number;
  severity: FlagSeverity;
  label: string;
  detail: string;
}

/** DTI calculation result. */
export interface DTIResult {
  ratio: number;
  totalMonthlyDebts: number;
  grossMonthlyIncome: number;
  flag: FlagSeverity;
  threshold: number;
  label: string;
}

/** LTV calculation result. */
export interface LTVResult {
  ratio: number;
  requestedAmount: number;
  assetValue: number;
  flag: FlagSeverity;
  threshold: number;
  label: string;
}

/** Amortization estimate. */
export interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  termMonths: number;
  annualRate: number;
  label: string;
}

/** A single line in the agent reasoning log. */
export interface AgentLogEntry {
  id: string;
  stage: AgentStage;
  message: string;
  timestamp: number;
  severity?: FlagSeverity;
}

/** Analyst narrative with policy citations. */
export interface AnalystNarrative {
  summary: string;
  recommendation: 'approve' | 'caution' | 'reject';
  citations: PolicyCitation[];
  severityBorder: 'green' | 'yellow' | 'red';
}

export interface PolicyCitation {
  policy: string;
  section: string;
  excerpt: string;
}

/** Full pipeline output. */
export interface AgentPipelineResult {
  applicantData: ApplicantData;
  dti: DTIResult;
  ltv: LTVResult;
  amortization: AmortizationResult;
  flags: RuleFlag[];
  narrative: AnalystNarrative;
  finalDecision: 'approve' | 'caution' | 'reject';
  logs: AgentLogEntry[];
}

/** Input form state for the left panel. */
export interface AgentInputForm {
  applicantName: string;
  grossAnnualIncome: string;
  monthlyRent: string;
  creditCardPayments: string;
  autoLoanPayment: string;
  studentLoanPayment: string;
  otherDebtPayment: string;
  otherDebtDescription: string;
  requestedLoanAmount: string;
  assetValue: string;
  loanPurpose: string;
  employmentStatus: string;
  monthsEmployed: string;
  rawOcrText: string;
  activeTab: 'profile' | 'assets' | 'liabilities' | 'ocr';
}

/** Tab definitions for the input panel. */
export interface InputTab {
  id: AgentInputForm['activeTab'];
  label: string;
  description: string;
}
