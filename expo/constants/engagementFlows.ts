export type ReviewPrompt = {
  ahaMoment: string;
  triggerCondition: string;
  promptCopy: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  snoozeDurationDays: number;
  frequencyRule: string;
  behaviorNotes: string[];
};

export type PaywallMoment = {
  name: string;
  triggerCondition: string;
  premiumValue: string[];
  priceCallout: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  visualTreatment: string;
  postActionBehavior: string;
};

export type DataIntegrationFlow = {
  state: 'prompt' | 'reminderCard' | 'connected';
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta?: string;
  behaviorNotes: string[];
};

export type NotificationTemplate = {
  id: string;
  delayDays: number;
  title: string;
  body: string;
  dismissible: boolean;
  disablePath: string;
};

export const reviewPrompts: ReviewPrompt[] = [
  {
    ahaMoment: 'First approval match',
    triggerCondition: 'User taps into "BEST MATCH" result with approval odds ≥ 80%',
    promptCopy: {
      title: 'Low payment unlocked',
      subtitle: 'Was this helpful? Rate us and help others find better deals.',
      ctaPrimary: 'Rate now',
      ctaSecondary: 'Later',
    },
    snoozeDurationDays: 7,
    frequencyRule: 'Show once per approval flow until user rates or dismisses twice.',
    behaviorNotes: [
      'Prompt animates from bottom with subtle bounce after offer summary loads.',
      'If user rates, mark flow complete and never show again on this device.',
      'If user taps Later, set snooze timestamp to avoid resurfacing for 7 days.',
    ],
  },
  {
    ahaMoment: 'Refinance savings milestone',
    triggerCondition: 'User completes refinance simulation showing ≥ $1,200 annual savings',
    promptCopy: {
      title: 'Savings locked in',
      subtitle: 'Was this helpful? Rate us to keep these tools free.',
      ctaPrimary: 'Rate now',
      ctaSecondary: 'Later',
    },
    snoozeDurationDays: 7,
    frequencyRule: 'One prompt per refinance session.',
    behaviorNotes: [
      'Displays after waveform animation that highlights savings difference.',
      'Auto-dismisses when user navigates away from savings screen.',
    ],
  },
];

export const paywallMoments: PaywallMoment[] = [
  {
    name: 'Deep comparison',
    triggerCondition: 'User adds 4th loan to side-by-side compare table.',
    premiumValue: [
      'Unlimited side-by-side comparisons',
      'Smart highlight of lowest lifetime cost',
      'Export-ready summary PDF for advisors',
    ],
    priceCallout: '$19/month or $99/year',
    ctaPrimary: 'Upgrade for deeper insight',
    ctaSecondary: 'Continue with 3 loans',
    visualTreatment: 'Glass card over blurred table with accent gradient CTA button.',
    postActionBehavior: 'If user continues free, keep only first 3 loans visible and hint button to upgrade again after 24h.',
  },
  {
    name: 'What-if simulation',
    triggerCondition: 'User taps sliders for income or payoff speed adjustments beyond basic preset.',
    premiumValue: [
      'Unlimited what-if scenarios',
      'AI insights on payoff timeline',
      'Auto alerts when scenario becomes viable',
    ],
    priceCallout: 'Included in Premium',
    ctaPrimary: 'Unlock simulations',
    ctaSecondary: 'Back to summary',
    visualTreatment: 'Full-height modal with animated chart preview and lock icon.',
    postActionBehavior: 'Dismiss modal and revert sliders to default if user backs out.',
  },
  {
    name: 'Auto refinance alerts',
    triggerCondition: 'User toggles "Always scan for better rate" in settings.',
    premiumValue: [
      'Daily Experian + lender scans',
      'Push + email alerts when savings > $50/mo',
      'Concierge review before notifying you',
    ],
    priceCallout: '$12/month add-on or included in annual Premium',
    ctaPrimary: 'Enable alerts with Premium',
    ctaSecondary: 'Maybe later',
    visualTreatment: 'Stacked cards showing upcoming alert preview with shield icon.',
    postActionBehavior: 'If dismissed, leave toggle off and remind after 2 weeks.',
  },
];

export const dashboardIntegrationStates: DataIntegrationFlow[] = [
  {
    state: 'prompt',
    title: 'Connect Experian + Banks',
    subtitle: 'Unlock accurate matches and real savings projections.',
    primaryCta: 'Connect now',
    secondaryCta: 'Maybe later',
    behaviorNotes: [
      'Slide-in panel on dashboard hero until completed or dismissed once per session.',
      'If user taps Maybe later, collapse into reminder card after session ends.',
    ],
  },
  {
    state: 'reminderCard',
    title: 'Boost accuracy',
    subtitle: 'Link credit + accounts for smarter offers.',
    primaryCta: 'Resume connection',
    behaviorNotes: [
      'Compact card under hero section, no modal.',
      'Auto hides after user completes connection.',
    ],
  },
  {
    state: 'connected',
    title: 'Data synced',
    subtitle: 'Updated 2h ago from Experian & Chase.',
    primaryCta: 'Refresh data',
    behaviorNotes: [
      'Shows status badge + timestamp.',
      'Refresh triggers manual pull with optimistic timestamp update.',
    ],
  },
];

export const integrationReminderNotification: NotificationTemplate = {
  id: 'connect-data-reminder',
  delayDays: 5,
  title: 'Sync accounts for smarter matches',
  body: 'Connect your accounts to get more accurate offers and avoid wasting time on loans you won\'t qualify for.',
  dismissible: true,
  disablePath: 'Settings → Notifications',
};
