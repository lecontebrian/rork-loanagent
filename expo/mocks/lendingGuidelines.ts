import type { PolicyCitation } from '@/types/loanAgent';

/**
 * Mock lending guidelines document — the "single source of truth"
 * that the AI analyst references when generating narratives.
 *
 * In production this would be fetched from a CMS, database, or
 * embedded as a structured policy file.
 */
export const LENDING_GUIDELINES = {
  title: 'LoanVault Standard Lending Guidelines v4.2',
  effectiveDate: '2026-01-01',
  sections: [
    {
      id: 'DTI-4.2.1',
      title: 'Debt-to-Income Ratio Limits',
      body: 'Applicants must maintain a DTI ratio below 43%. Applications with DTI between 36% and 43% require additional income verification and a compensating factor such as high credit score or significant liquid assets. DTI above 43% is an automatic flag for manual underwriting review.',
      threshold: 'DTI ≤ 43%',
      warnThreshold: 'DTI ≤ 36%',
    },
    {
      id: 'LTV-3.1.0',
      title: 'Loan-to-Value Ratio Limits',
      body: 'Secured loans must not exceed 80% LTV. Applications between 70% and 80% LTV require a property appraisal within the last 90 days. LTV above 80% is an automatic decline unless the applicant carries private mortgage insurance (PMI) or an equivalent guarantor.',
      threshold: 'LTV ≤ 80%',
      warnThreshold: 'LTV ≤ 70%',
    },
    {
      id: 'INC-2.3.5',
      title: 'Income Stability Requirements',
      body: 'Applicants must demonstrate at least 12 months of continuous employment in the same field. Self-employed applicants must provide 2 years of tax returns. Gaps in employment exceeding 60 days require a written explanation.',
      threshold: '≥ 12 months employed',
    },
    {
      id: 'CRD-5.1.2',
      title: 'Credit Score Minimums',
      body: 'Minimum credit score of 620 for conventional loans, 580 for FHA-equivalent products. Scores between 580 and 619 require a minimum 10% down payment or asset collateral.',
      threshold: 'Credit Score ≥ 620',
    },
    {
      id: 'AML-8.0.1',
      title: 'Anti-Money Laundering Compliance',
      body: 'All loans exceeding $10,000 require a Suspicious Activity Report (SAR) review. Source of funds must be documented for any cash deposit exceeding 25% of the applicant\'s reported annual income.',
      threshold: 'Funds documented for cash > 25% income',
    },
    {
      id: 'FCC-1.4.0',
      title: 'Fair Credit Compliance',
      body: 'All lending decisions must comply with the Equal Credit Opportunity Act (ECOA). No application may be declined based on race, color, religion, national origin, sex, marital status, age, or receipt of public assistance.',
      threshold: 'ECOA compliance mandatory',
    },
  ],
};

/**
 * Selects relevant policy citations based on flagged rules.
 * Returns the most relevant guideline sections for the narrative.
 */
export function getRelevantCitations(
  dtiFlag: 'Success' | 'Warning' | 'CriticalFail',
  ltvFlag: 'Success' | 'Warning' | 'CriticalFail',
): PolicyCitation[] {
  const citations: PolicyCitation[] = [];

  if (dtiFlag === 'CriticalFail') {
    citations.push({
      policy: LENDING_GUIDELINES.sections[0].title,
      section: 'DTI-4.2.1',
      excerpt: 'DTI above 43% is an automatic flag for manual underwriting review.',
    });
  } else if (dtiFlag === 'Warning') {
    citations.push({
      policy: LENDING_GUIDELINES.sections[0].title,
      section: 'DTI-4.2.1',
      excerpt: 'DTI between 36% and 43% requires additional income verification and a compensating factor.',
    });
  }

  if (ltvFlag === 'CriticalFail') {
    citations.push({
      policy: LENDING_GUIDELINES.sections[1].title,
      section: 'LTV-3.1.0',
      excerpt: 'LTV above 80% is an automatic decline unless PMI or equivalent guarantor is present.',
    });
  } else if (ltvFlag === 'Warning') {
    citations.push({
      policy: LENDING_GUIDELINES.sections[1].title,
      section: 'LTV-3.1.0',
      excerpt: 'Applications between 70% and 80% LTV require property appraisal within 90 days.',
    });
  }

  // Always include ECOA compliance reference for transparency
  citations.push({
    policy: LENDING_GUIDELINES.sections[5].title,
    section: 'FCC-1.4.0',
    excerpt: 'Decision complies with ECOA — no protected-class factors were evaluated.',
  });

  return citations;
}
