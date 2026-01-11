export const COMPLIANCE_DISCLAIMERS = {
  general: "Loan Agent is a financial technology company, not a bank. Banking services provided by our partner financial institutions. All loans are subject to credit approval.",
  
  creditCheck: "By proceeding, you authorize us to obtain your credit report and share your information with our lending partners. This may result in a hard inquiry on your credit report.",
  
  rates: "Rates, terms, and conditions are subject to change and may vary based on creditworthiness, loan amount, loan term, and other factors. APR includes interest rate and certain fees.",
  
  fairLending: "We are committed to equal opportunity lending. All qualified applicants will receive consideration without regard to race, color, religion, national origin, sex, marital status, age, or other protected characteristics.",
  
  dataPrivacy: "We use bank-level encryption to protect your personal information. Your data will be handled in accordance with our Privacy Policy and applicable federal and state laws including the Gramm-Leach-Bliley Act.",
  
  offers: "Loan offers are provided by our lending partners and are not guaranteed. Receiving an offer does not obligate you to accept it. Actual loan terms may differ from pre-qualified offers.",
};

export const REGULATORY_CONTENT = {
  tila: {
    title: "Truth in Lending Act (TILA) Disclosure",
    content: `Federal law requires us to provide you with important information about your loan:

• Annual Percentage Rate (APR): The cost of your credit as a yearly rate
• Finance Charge: The dollar amount the credit will cost you
• Amount Financed: The amount of credit provided to you
• Total of Payments: The amount you will have paid when all payments are made
• Payment Schedule: Number, amount, and timing of payments

You have the right to receive these disclosures before you are obligated on the loan. You should carefully review all loan documents and disclosures before signing.`,
  },
  
  respa: {
    title: "Real Estate Settlement Procedures Act (RESPA)",
    content: `RESPA requires lenders to disclose:

• Good Faith Estimate (GFE): An estimate of settlement costs
• Settlement Costs: A detailed list of costs at closing
• Servicing Disclosure: Information about whether the lender intends to service the loan or transfer servicing to another company

You have the right to:
• Shop for settlement services
• Receive a HUD-1 Settlement Statement at or before closing
• Protection against kickbacks and referral fees`,
  },
  
  ecoa: {
    title: "Equal Credit Opportunity Act (ECOA)",
    content: `The federal Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of:

• Race or color
• Religion
• National origin
• Sex
• Marital status
• Age (provided you have the capacity to contract)
• Receipt of income from public assistance programs
• Good faith exercise of any rights under the Consumer Credit Protection Act

If you believe you have been discriminated against, you should send a complaint to:

Consumer Financial Protection Bureau
P.O. Box 4503
Iowa City, Iowa 52244
(855) 411-2372
www.consumerfinance.gov/complaint`,
  },
  
  fcra: {
    title: "Fair Credit Reporting Act (FCRA)",
    content: `The Fair Credit Reporting Act gives you specific rights regarding your credit report:

• You have the right to know what is in your file
• You have the right to request and obtain your credit score
• You have the right to dispute incomplete or inaccurate information
• Consumer reporting agencies must correct or delete inaccurate, incomplete, or unverifiable information
• Access to your file is limited to those with a valid need
• You must give your consent for reports to be provided to employers
• You can seek damages from violators

If a lender denies your application based on your credit report, they must provide you with:
• The name, address, and phone number of the credit reporting agency
• A notice of your right to a free copy of your report
• A notice of your right to dispute inaccurate information`,
  },
  
  glba: {
    title: "Gramm-Leach-Bliley Act (GLBA) Privacy Notice",
    content: `We are required to inform you about our privacy practices:

INFORMATION WE COLLECT:
• Personal information you provide on applications
• Credit history from credit bureaus
• Employment and income verification
• Transaction history

HOW WE USE YOUR INFORMATION:
• To process your loan application
• To verify your identity and prevent fraud
• To comply with federal and state regulations
• To provide customer service

HOW WE PROTECT YOUR INFORMATION:
• Bank-level encryption for all data transmission
• Secure servers with restricted access
• Regular security audits and monitoring
• Employee training on data protection

YOUR PRIVACY RIGHTS:
• You can limit some information sharing
• You have the right to opt out of certain disclosures
• We will provide you with our detailed Privacy Policy

We do not sell your personal information to third parties.`,
  },
  
  hmda: {
    title: "Home Mortgage Disclosure Act (HMDA)",
    content: `The Home Mortgage Disclosure Act requires lenders to collect and report data about loan applications and originations.

This data includes:
• Type, purpose, and amount of the loan
• Property location
• Race, ethnicity, sex, and income of applicants

PURPOSE:
• To identify possible discriminatory lending patterns
• To help government officials distribute public-sector investments
• To assist in identifying credit needs of communities

YOUR INFORMATION:
The law protects your privacy. Your name and address are not disclosed. Reported data does not identify specific applicants.

You may refuse to provide this information, but federal law requires us to note your refusal. This information will not affect your application.`,
  },
  
  bsa: {
    title: "Bank Secrecy Act & Anti-Money Laundering",
    content: `Federal law requires financial institutions to help detect and prevent money laundering and terrorist financing.

WHAT THIS MEANS FOR YOU:
• We must verify your identity
• We may ask for additional documentation
• We monitor transactions for suspicious activity
• We are required to report certain transactions to federal authorities

CUSTOMER IDENTIFICATION PROGRAM (CIP):
To help fight identity theft and fraud, we will ask for:
• Your name
• Address
• Date of birth
• Government-issued identification number (SSN or ITIN)

We may also ask to see your driver's license or other identifying documents.

SUSPICIOUS ACTIVITY:
Federal law prohibits us from informing you if we file a Suspicious Activity Report (SAR) about your transaction.`,
  },
  
  udaap: {
    title: "Unfair, Deceptive, or Abusive Acts or Practices",
    content: `Federal law protects you from unfair, deceptive, or abusive acts or practices (UDAAP).

UNFAIR PRACTICES:
• Cause or are likely to cause substantial injury to consumers
• Cannot be reasonably avoided by consumers
• Not outweighed by benefits to consumers or competition

DECEPTIVE PRACTICES:
• Misleading representations or omissions
• Likely to mislead reasonable consumers
• Material to consumers' decisions

ABUSIVE PRACTICES:
• Materially interfere with ability to understand terms or conditions
• Take unreasonable advantage of:
  - Lack of understanding
  - Inability to protect interests
  - Reasonable reliance on the covered person

YOUR PROTECTIONS:
• Clear, accurate information about loan terms
• Honest advertising and marketing
• Fair treatment throughout the loan process
• Right to file complaints with the CFPB

To file a complaint:
www.consumerfinance.gov/complaint
(855) 411-2372`,
  },
};

export const CONSUMER_RIGHTS = {
  overview: {
    title: "Your Consumer Rights & Protections",
    content: `As a borrower, you have important rights and protections under federal and state law.`,
  },
  
  sections: [
    {
      title: "Right to Shop & Compare",
      items: [
        "Compare offers from multiple lenders",
        "Shop for settlement services",
        "No obligation to accept any offer",
        "Take time to review all documents",
      ],
    },
    {
      title: "Right to Accurate Information",
      items: [
        "Receive clear disclosure of all loan terms",
        "Get accurate estimates of costs",
        "Receive updated information if terms change",
        "Review documents before closing",
      ],
    },
    {
      title: "Right to Fair Treatment",
      items: [
        "Equal opportunity regardless of protected characteristics",
        "Fair credit reporting",
        "Protection from discrimination",
        "Respect and professionalism",
      ],
    },
    {
      title: "Right to Privacy",
      items: [
        "Know how your information is used",
        "Security of your personal data",
        "Control over information sharing",
        "Protection from identity theft",
      ],
    },
    {
      title: "Right to Complain",
      items: [
        "File complaints with regulators",
        "Seek legal remedies",
        "Report violations",
        "Receive responses to concerns",
      ],
    },
  ],
  
  resources: [
    {
      name: "Consumer Financial Protection Bureau (CFPB)",
      phone: "(855) 411-2372",
      website: "www.consumerfinance.gov",
      purpose: "Submit complaints about financial products and services",
    },
    {
      name: "Federal Trade Commission (FTC)",
      phone: "(877) 382-4357",
      website: "www.ftc.gov",
      purpose: "Report identity theft and fraud",
    },
    {
      name: "Annual Credit Report",
      phone: "(877) 322-8228",
      website: "www.annualcreditreport.com",
      purpose: "Get your free annual credit reports",
    },
  ],
};

export const CONSENT_LANGUAGE = {
  creditCheck: {
    title: "Credit Check Authorization",
    content: `By checking this box and proceeding, I authorize Loan Agent and its lending partners to:

• Obtain my consumer credit report from one or more consumer reporting agencies
• Verify my identity, income, and employment
• Share my information with lending partners for the purpose of obtaining loan offers

I understand that:
• This authorization may result in one or more hard inquiries on my credit report
• Hard inquiries may temporarily affect my credit score
• Multiple inquiries for the same purpose within a short time period (typically 14-45 days) may be treated as a single inquiry for scoring purposes
• I will receive an adverse action notice if my application is denied based on my credit report`,
    required: true,
  },
  
  dataSharing: {
    title: "Information Sharing Consent",
    content: `I consent to Loan Agent sharing my personal and financial information with:

• Lending partners for the purpose of obtaining loan offers
• Service providers who assist in processing my application
• Credit reporting agencies as required by law
• Fraud prevention and identity verification services

I understand that:
• Information sharing is necessary to process my loan application
• All parties are required to maintain the confidentiality of my information
• I can review the detailed Privacy Policy for more information
• I can withdraw consent, but this may prevent processing of my application`,
    required: true,
  },
  
  electronicConsent: {
    title: "Electronic Communications Consent",
    content: `I consent to receive all disclosures, notices, and documents electronically, including:

• Loan disclosures and terms
• Privacy notices
• Marketing communications (optional)
• Account statements and notifications

I understand that:
• I need access to the internet and email to receive electronic communications
• I can request paper copies of any document at no charge
• I can withdraw consent at any time
• Withdrawal of consent may delay processing`,
    required: true,
  },
  
  termsAcceptance: {
    title: "Terms of Service",
    content: `I acknowledge that I have read, understood, and agree to:

• Loan Agent Terms of Service
• Privacy Policy
• Website Terms of Use
• Applicable disclosures and notices

I understand that:
• My use of the service is subject to these terms
• Terms may be updated from time to time
• I will be notified of material changes
• Continued use constitutes acceptance of updated terms`,
    required: true,
  },
};
