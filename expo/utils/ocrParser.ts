import type { ApplicantData, ExistingDebt } from '@/types/loanAgent';

/**
 * Simulates OCR ingestion of unstructured financial documents.
 *
 * Parses raw text (like a scanned paystub or tax return) and extracts
 * structured financial data. This is a deterministic parser — no AI.
 *
 * In production, this would connect to a real OCR service (Google Document AI,
 * AWS Textract, etc.) but this module always returns the same shape so the
 * downstream pipeline is real.
 */
export function parseRawFinancialText(rawText: string): ApplicantData {
  const text = rawText.toLowerCase();

  const monthlyIncome = extractNumber(text, [
    /monthly\s*income:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /gross\s*monthly:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /monthly\s*gross:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
  ]);

  const annualIncome = extractNumber(text, [
    /annual\s*(?:salary|income):?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /gross\s*annual:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /yearly:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
  ]);

  const grossAnnualIncome = annualIncome > 0 ? annualIncome : monthlyIncome * 12;

  const requestedLoanAmount = extractNumber(text, [
    /loan\s*amount:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /requested:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /borrow(?:ing)?:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
  ]);

  const assetValue = extractNumber(text, [
    /asset\s*value:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /collateral:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
    /property\s*value:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i,
  ]);

  const employmentStatus = extractEmploymentStatus(text);
  const monthsEmployed = extractNumber(text, [
    /employed\s*(?:for)?\s*(\d+)\s*months?/i,
    /tenure:?\s*(\d+)\s*months?/i,
    /(\d+)\s*months?\s*(?:of)?\s*employment/i,
  ]);

  const loanPurpose = extractPurpose(text);

  // Extract existing debts from the text
  const existingDebts = extractDebts(text);

  const totalMonthlyDebtPayments = existingDebts.reduce(
    (sum, d) => sum + d.monthlyPayment,
    0,
  );

  return {
    monthlyIncome: grossAnnualIncome > 0 ? grossAnnualIncome / 12 : monthlyIncome,
    grossAnnualIncome,
    existingDebts,
    totalMonthlyDebtPayments,
    requestedLoanAmount,
    assetValue,
    loanPurpose,
    employmentStatus,
    monthsEmployed,
  };
}

/** Parses structured applicant info from form fields, ensuring all values are numbers. */
export function parseStructuredFormInput(fields: {
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
}): ApplicantData {
  const income = parseNumericString(fields.grossAnnualIncome);

  const debts: ExistingDebt[] = [];
  const addDebt = (type: string, val: string) => {
    const n = parseNumericString(val);
    if (n > 0) debts.push({ type, monthlyPayment: n, remainingBalance: 0 });
  };

  addDebt('Rent/Mortgage', fields.monthlyRent);
  addDebt('Credit Card', fields.creditCardPayments);
  addDebt('Auto Loan', fields.autoLoanPayment);
  addDebt('Student Loan', fields.studentLoanPayment);

  const otherN = parseNumericString(fields.otherDebtPayment);
  if (otherN > 0 && fields.otherDebtDescription) {
    debts.push({
      type: fields.otherDebtDescription,
      monthlyPayment: otherN,
      remainingBalance: 0,
    });
  } else if (otherN > 0) {
    debts.push({ type: 'Other Debt', monthlyPayment: otherN, remainingBalance: 0 });
  }

  const totalMonthlyDebtPayments = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);

  return {
    monthlyIncome: income > 0 ? income / 12 : 0,
    grossAnnualIncome: income,
    existingDebts: debts,
    totalMonthlyDebtPayments,
    requestedLoanAmount: parseNumericString(fields.requestedLoanAmount),
    assetValue: parseNumericString(fields.assetValue),
    loanPurpose: fields.loanPurpose || 'Not specified',
    employmentStatus: fields.employmentStatus || 'Unknown',
    monthsEmployed: parseNumericString(fields.monthsEmployed),
  };
}

// -- private helpers --

function parseNumericString(s: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/[$,]/g, '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function extractNumber(text: string, patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const n = parseNumericString(m[1]);
      if (n > 0) return n;
    }
  }
  return 0;
}

function extractEmploymentStatus(text: string): string {
  if (/\bself.employed\b/i.test(text)) return 'Self-employed';
  if (/\bunemployed\b/i.test(text)) return 'Unemployed';
  if (/\bcontract(?:or)?\b/i.test(text)) return 'Contract';
  if (/\bpart.time\b/i.test(text)) return 'Part-time';
  if (/\bfull.time\b/i.test(text)) return 'Full-time';
  if (/\bemployed\b/i.test(text)) return 'Full-time';
  return 'Unknown';
}

function extractPurpose(text: string): string {
  const purposes: [RegExp, string][] = [
    [/\bdebt\s*consolidation\b/i, 'Debt Consolidation'],
    [/\bhome\s*improv(?:ement)?\b/i, 'Home Improvement'],
    [/\bauto\b|\bcar\s*(?:loan|purchase)\b/i, 'Auto Purchase'],
    [/\bbusiness\b|\bstart.?up\b/i, 'Business'],
    [/\beducation\b|\bstudent\b|\btuition\b/i, 'Education'],
    [/\bpersonal\b/i, 'Personal'],
  ];
  for (const [p, label] of purposes) {
    if (p.test(text)) return label;
  }
  return 'Not specified';
}

function extractDebts(text: string): ExistingDebt[] {
  const debts: ExistingDebt[] = [];

  const patterns: [RegExp, string][] = [
    [/(?:auto|car)\s*(?:loan|payment)?:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i, 'Auto Loan'],
    [/student\s*(?:loan|payment)?:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i, 'Student Loan'],
    [/credit\s*card\s*(?:payment)?:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i, 'Credit Card'],
    [/mortgage:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i, 'Mortgage'],
    [/rent:?\s*\$?([\d,]+(?:\.\d{1,2})?)/i, 'Rent'],
  ];

  for (const [p, label] of patterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const n = parseNumericString(m[1]);
      if (n > 0) debts.push({ type: label, monthlyPayment: n, remainingBalance: 0 });
    }
  }

  return debts;
}
