import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Crown, Lock, Star, TrendingUp, Shield, Wallet } from 'lucide-react-native';
import colors from '@/constants/colors';

interface CTAConfig {
  primary: string;
  secondary: string;
}

interface FlowCard {
  id: string;
  name: string;
  purpose: string;
  trigger: string;
  components: string[];
  ctas: CTAConfig;
  copy: {
    title: string;
    subtitle: string;
    bullets?: string[];
    price?: string;
    microcopy?: string;
  };
  stateNotes: string;
}

const feeConfig = {
  processorCard: '1.5%–2.5% (card / instant)',
  processorAch: '0%–1% (bank / ACH)',
  appFee: '0.3%–0.5% capped at $5',
};

const premiumPlans = [
  {
    tier: 'Monthly',
    price: '$9.99/mo',
    highlight: 'Flexible access to deeper insights',
  },
  {
    tier: 'Power Monthly',
    price: '$19.99/mo',
    highlight: 'Includes concierge + refinance alerts',
  },
  {
    tier: 'Annual',
    price: '$99.99/yr',
    highlight: 'Save 17% vs monthly billing',
  },
];

const premiumBenefits = [
  'Deeper loan intelligence + stress tests',
  'Unlimited what-if simulations with export',
  'Smart refinance + deal scanning alerts',
  'Priority human + AI concierge support',
  'Audit-ready fee transparency dashboards',
];

const premiumVsFree = [
  { label: 'Loan comparisons per month', free: '3 offers', premium: 'Unlimited + smart filters' },
  { label: 'What-if simulations', free: 'Basic APR toggle', premium: 'Income, payoff, extra principal' },
  { label: 'Alerts & automations', free: 'Email digest', premium: 'Real-time push + concierge tips' },
  { label: 'Support speed', free: 'Standard (24h)', premium: '<2h human + AI blend' },
];

const upgradeMoments: FlowCard[] = [
  {
    id: 'compare-limit',
    name: 'Analytics Depth Pop-up',
    purpose: 'Upsell when user wants total lifetime cost',
    trigger: 'User selects >3 loans for comparison',
    components: [
      'Title, short body, price tag',
      'Bullet list of insights unlocked',
      'Primary + secondary CTA buttons',
    ],
    ctas: { primary: 'Unlock Premium', secondary: 'Continue free' },
    copy: {
      title: 'See the full savings picture',
      subtitle: 'Access payoff dates, total interest, and score impact instantly.',
      bullets: ['Only $9.99/mo or $99.99/yr (save 17%)'],
      price: '$9.99/mo',
    },
    stateNotes: 'Rate-limit to once per compare session; remember dismissal for 24h.',
  },
  {
    id: 'what-if',
    name: 'What-If Scenario Lock',
    purpose: 'Convert planners running simulations',
    trigger: 'User taps “Add scenario” beyond free tier',
    components: ['Headline, sub copy, scenario preview blur', 'CTA pair'],
    ctas: { primary: 'Run advanced scenario', secondary: 'Maybe later' },
    copy: {
      title: 'Model every payoff move',
      subtitle: 'Change income, extra payments, or terms with Premium control.',
      bullets: ['Only $9.99/mo or $99.99/yr (save 17%)'],
      price: '$9.99/mo',
    },
    stateNotes: 'Show once per session per simulator entry; snooze 7 days if dismissed twice.',
  },
  {
    id: 'alerts',
    name: 'Refinance Alert Gate',
    purpose: 'Upsell proactive monitoring',
    trigger: 'User enables refinance or deal scanning alerts',
    components: ['Value statement', 'Price pill', 'CTA row'],
    ctas: { primary: 'Enable with Premium', secondary: 'Not now' },
    copy: {
      title: 'Never miss a cheaper offer',
      subtitle: 'Instant deal-scanning + Experian-powered alerts are Premium perks.',
      bullets: ['$19.99/mo concierge plan or $99.99/yr'],
      price: '$19.99/mo',
    },
    stateNotes: 'Remember opt-out; retry after 30 days or upon new approved offer.',
  },
  {
    id: 'limits',
    name: 'Portfolio Limit Notice',
    purpose: 'Nudge heavy users to upgrade',
    trigger: 'User tracks 4th car/loan/budget item (free cap at 3)',
    components: ['Progress ring showing limit', 'CTA pair', 'Microcopy about keeping data private'],
    ctas: { primary: 'Upgrade for unlimited tracking', secondary: 'Keep current limit' },
    copy: {
      title: 'Keep every goal in one place',
      subtitle: 'Premium unlocks unlimited trackers plus data export.',
      bullets: ['Only $9.99/mo or $99.99/yr'],
      price: '$9.99/mo',
    },
    stateNotes: 'Warn at 80% usage; lock once limit exceeded.',
  },
  {
    id: 'concierge',
    name: 'Concierge CTA',
    purpose: 'Highlight human help after denial',
    trigger: 'User gets declined or low offer score',
    components: ['Empathetic headline', 'Benefit bullets', 'CTA duo'],
    ctas: { primary: 'Try concierge for $19.99/mo', secondary: 'Skip for now' },
    copy: {
      title: 'Let us negotiate for you',
      subtitle: 'Premium concierge reviews your profile + finds better matches.',
      bullets: ['$19.99/mo or $99.99/yr'],
      price: '$19.99/mo',
    },
    stateNotes: 'Display once per denial event; don’t repeat if user already contacted support.',
  },
];

const ratingPrompts: FlowCard[] = [
  {
    id: 'approval',
    name: 'Approval Celebration Prompt',
    purpose: 'Capture goodwill after success',
    trigger: 'User accepts first “Best Match” approval',
    components: ['Stars row', 'Question text', 'CTA trio (Review, Feedback, Later)'],
    ctas: { primary: 'Rate us ★★★★★', secondary: 'Later' },
    copy: {
      title: 'How’s your experience so far?',
      subtitle: 'Your review helps other drivers find better deals.',
      bullets: ['If rating ≤3, open in-app feedback form'],
    },
    stateNotes: 'Snooze 7 days after “Later”; never show twice in same flow.',
  },
  {
    id: 'savings',
    name: 'Savings Confirmation Prompt',
    purpose: 'Celebrate refinance or savings milestone',
    trigger: 'User documents $1K+ lifetime savings',
    components: ['Confetti badge', 'Copy block', 'CTA pair'],
    ctas: { primary: 'Share feedback', secondary: 'Maybe later' },
    copy: {
      title: 'Saved an extra $2.4K!',
      subtitle: 'Mind leaving a 30-sec review so more people save too?',
    },
    stateNotes: 'If user chooses feedback, open quick survey; store response status.',
  },
  {
    id: 'deal-done',
    name: 'Car Deal Prompt',
    purpose: 'Gather reviews after vehicle purchase',
    trigger: 'User marks deal as complete',
    components: ['Emoji or icon row', 'CTA pair'],
    ctas: { primary: 'Leave a quick review', secondary: 'Send feedback' },
    copy: {
      title: 'Enjoying the new ride?',
      subtitle: 'Tap ★★★★★ if Loan Agent made it smoother.',
    },
    stateNotes: 'Route low ratings to in-app feedback composer.',
  },
];

const persistentEntries = [
  {
    id: 'nav-tab',
    title: 'Premium Tab Badge',
    description: 'Add a crown icon in main tab bar; opens Premium screen.',
  },
  {
    id: 'dashboard-banner',
    title: 'Insight Banner',
    description: 'Slim card under hero metrics: “Unlock deeper insights with Premium →”.',
  },
  {
    id: 'crown-icons',
    title: 'Locked Feature Chips',
    description: 'Place mini crown/“Pro” icon on gated tiles; tapping opens paywall.',
  },
];

const persistentFlowCards: FlowCard[] = persistentEntries.map((entry) => ({
  id: entry.id,
  name: entry.title,
  purpose: entry.description,
  trigger: 'Always visible in respective surface',
  components: ['Badge or icon', 'Tap opens Premium offer', 'Tooltip explaining value'],
  ctas: { primary: 'Open Premium', secondary: 'Dismiss' },
  copy: {
    title: entry.title,
    subtitle: entry.description,
  },
  stateNotes: 'Ensure non-intrusive placement and accessible labels.',
}));

const p2pScreens: FlowCard[] = [
  {
    id: 'wallet-overview',
    name: 'P2P Wallet Overview',
    purpose: 'Surface balances, cash flow, and trust signals',
    trigger: 'Primary P2P tab landing',
    components: [
      'Hero balance card with “Available”, “Pending”, “On Hold” chips',
      'KPIs: Total Sent, Total Received, Net Change filters',
      'Mini chart (30d / 12m toggle)',
      'CTA row: Send Money, Request Money, Add Funds',
      'Fees & Limits link opening modal with processor/app breakdown',
    ],
    ctas: { primary: 'Send Money', secondary: 'Add Funds' },
    copy: {
      title: 'Secure P2P Wallet',
      subtitle: 'Insured rails + encryption badges reassure every transfer.',
      microcopy: 'We keep our app fee low (~0.3%–0.5%, capped) for security + operations.',
    },
    stateNotes: 'Empty state shows illustration + “Add funds to start”; loading skeleton for chart.',
  },
  {
    id: 'send-money',
    name: 'Send Money Flow',
    purpose: 'Guided send with transparent fees',
    trigger: 'CTA tap from wallet or contacts card',
    components: [
      'Recipient search (contact, username, email) + trust badges',
      'Amount field + currency toggle',
      'Note input + funding source chips (Wallet, Bank, Card)',
      'Fee breakdown card (Amount, Processor fee, App fee, Total charged, Recipient receives)',
      'Info icons for each fee line',
      'Confirm screen with arrival estimate + “Confirm & Send” button',
    ],
    ctas: { primary: 'Confirm & Send', secondary: 'Review fees' },
    copy: {
      title: 'Transparent transfer',
      subtitle: 'Processor fee example: 1.9% ($0.42). App fee: 0.4% ($0.18).',
      microcopy: 'We keep our fee low to cover security + ops while staying cheaper than market rates.',
    },
    stateNotes: 'Error state surfaces insufficient balance, invalid contact, or exceeded limits.',
  },
  {
    id: 'request-money',
    name: 'Request Money Flow',
    purpose: 'Collect funds via link or in-app request',
    trigger: 'CTA tap “Request Money”',
    components: [
      'Recipient selector + multi-select',
      'Amount + note',
      'Shareable link with copy/share buttons',
      'Fee notice banner (“Standard processor + app fees apply when paid”)',
      'Status pill showing pending requests',
    ],
    ctas: { primary: 'Send Request', secondary: 'Copy link' },
    copy: {
      title: 'Request instantly',
      subtitle: 'Your contact sees exact fees before approving.',
    },
    stateNotes: 'Success toast with tracking ID; empty state encourages inviting contacts.',
  },
  {
    id: 'history',
    name: 'P2P Transaction History',
    purpose: 'Audit trail with filters + detail drill-down',
    trigger: 'History tab in P2P module',
    components: [
      'Segmented filters: All, Sent, Received, Pending',
      'Timeline cards listing counterparty, date, amount, status',
      'Detail drawer showing ID, method, note, fee breakdown (processor/app/total, net)',
      'Export button (CSV/PDF) for Premium only (crown chip)',
    ],
    ctas: { primary: 'Filter', secondary: 'Export (Premium)' },
    copy: {
      title: 'Stay audit-ready',
      subtitle: 'Each line shows “You sent”, “Processor fee”, “App fee”, “Recipient received”.',
    },
    stateNotes: 'Empty state message: “No transfers yet—Send money to get started.”',
  },
  {
    id: 'add-withdraw',
    name: 'Add Funds & Withdraw',
    purpose: 'Move money with clarity on timing + fees',
    trigger: 'CTA from wallet hero or settings',
    components: [
      'Toggle tabs: Add Funds | Withdraw',
      'Linked account status + add/manage button',
      'Amount input + preset chips ($50, $100, $250)',
      'Processing time chips (Instant, Standard ACH)',
      'Fees & Limits card (Processor fee line, App fee line, Total fees, You pay/receive)',
      'Microcopy about capped app fee (0.3%–0.5% up to $5)',
      'History list with statuses (Processing, Completed, Failed)',
    ],
    ctas: { primary: 'Continue', secondary: 'View limits' },
    copy: {
      title: 'Move money with confidence',
      subtitle: 'Example: Processor fee $0.42 (1.9%), App fee $0.18 (0.4%), Total $0.60.',
    },
    stateNotes: 'Error banner for failed transfers; success screen with confetti checkmark.',
  },
];

const affiliateScreens: FlowCard[] = [
  {
    id: 'affiliate-overview',
    name: 'Affiliate Overview',
    purpose: 'Show growth + available funds',
    trigger: 'Affiliate tab landing',
    components: [
      'Hero earnings card: Total Earned, Available, Pending, On Hold',
      'Mini KPI row: Referrals, Conversion %, Avg payout',
      'Line chart (weekly/monthly growth)',
      'CTA row: Withdraw Earnings, View Details, Share my Link',
      'Fee note link (“See payout fees”)',
    ],
    ctas: { primary: 'Withdraw earnings', secondary: 'Share my link' },
    copy: {
      title: 'Your referral impact',
      subtitle: 'Track every bonus, commission, and pending payout.',
    },
    stateNotes: 'Empty state: “Invite your first friend to start earning.”',
  },
  {
    id: 'earnings-breakdown',
    name: 'Earnings Breakdown',
    purpose: 'Detailed ledger by referral and activity',
    trigger: 'Tap “View Details”',
    components: [
      'Filters: Date range, Status (Pending, Cleared, Paid)',
      'List items with referral name, action, commission, status pill',
      'Expandable row showing “Processor fee”, “App fee”, “Net paid”',
      'Export button for CSV/PDF (Premium perk)',
    ],
    ctas: { primary: 'Filter results', secondary: 'Export report' },
    copy: {
      title: 'Understand every dollar',
      subtitle: 'See how much was deducted by processor vs Loan Agent.',
    },
    stateNotes: 'Loading skeleton rows; error toast for network issues.',
  },
  {
    id: 'referral-tools',
    name: 'Referral Tools',
    purpose: 'Make sharing effortless',
    trigger: 'CTA tap from overview',
    components: [
      'Hero showing referral code + copy button',
      'Quick-share row (Text, Email, Social, QR)',
      'Explainer accordion: “How payouts work”, “When do I get paid?”, “Fees & Payouts”',
      'Microcopy clarifying processor vs app fees on withdrawals',
    ],
    ctas: { primary: 'Copy link', secondary: 'Share invite' },
    copy: {
      title: 'Share Loan Agent',
      subtitle: 'Earn up to $200 per funded deal; payouts weekly.',
    },
    stateNotes: 'Empty state reminds users to verify identity before earning.',
  },
  {
    id: 'withdraw-earnings',
    name: 'Withdraw Earnings',
    purpose: 'Cash out commissions transparently',
    trigger: 'Withdraw button',
    components: [
      'Available balance card',
      'Payout method picker (Bank ACH, Instant card, P2P wallet)',
      'Minimum + processing time info',
      'Amount input + “Withdraw all” chip',
      'Fee breakdown table (Processor fee line, App processing fee line, Total fees, You receive)',
      'History list with statuses + fee columns',
    ],
    ctas: { primary: 'Confirm withdrawal', secondary: 'View fee policy' },
    copy: {
      title: 'Transfer earnings safely',
      subtitle: 'Example: Processor fee $0.32 (ACH 0.8%), App fee $0.14 (0.3%).',
      microcopy: 'We keep our app fee low (~0.3%–0.5%, capped) to cover security + ops.',
    },
    stateNotes: 'Error state for amounts below minimum; success toast with ETA.',
  },
];

export default function PremiumExperienceScreen() {
  useEffect(() => {
    console.log('[PremiumExperienceScreen] mounted with feeConfig', feeConfig);
  }, []);

  const groupedSections = useMemo(
    () => [
      {
        id: 'premium-offer',
        title: 'Go Premium Presentation',
        icon: Crown,
        data: [
          {
            id: 'offer-screen',
            name: 'Premium Offer Page',
            purpose: 'Benefit-first screen to convert curious users.',
            trigger: 'Accessible via nav badge, paywalls, or settings.',
            components: [
              'Hero headline + value-driven subheadline',
              'Benefit bullet list (3–5 items)',
              'Free vs Premium comparison table',
              'Plan cards with charm pricing ($9.99/mo, $19.99/mo, $99.99/yr)',
              'Primary CTA “Start Premium” + secondary “Continue with Free”',
              'Trust block: secure badges, “No hidden fees” microcopy',
            ],
            ctas: { primary: 'Start Premium', secondary: 'Continue with Free' },
            copy: {
              title: 'Unlock smarter lending decisions',
              subtitle: 'Premium combines AI + human experts so you save more and stress less.',
              bullets: premiumBenefits,
              microcopy: 'Cancel anytime. Transparent pricing, no surprise fees.',
            },
            stateNotes: 'If already subscribed, convert CTA to “Manage subscription”.',
          },
        ],
      },
      { id: 'upgrade-moments', title: 'Smart Upgrade Pop-ups', icon: Lock, data: upgradeMoments },
      { id: 'ratings', title: 'In-app Rating Moments', icon: Star, data: ratingPrompts },
      { id: 'persistent', title: 'Persistent Premium Entry Points', icon: Shield, data: persistentFlowCards },
      { id: 'p2p', title: 'P2P Payments Suite', icon: Wallet, data: p2pScreens },
      { id: 'affiliate', title: 'Affiliate / Earnings Suite', icon: TrendingUp, data: affiliateScreens },
    ],
    [],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Premium UX Blueprint' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="premiumUxScroll">
        <View style={styles.hero} testID="premiumHero">
          <Text style={styles.heroEyebrow}>Loan Agent Premium</Text>
          <Text style={styles.heroTitle}>Ethical, high-converting monetization</Text>
          <Text style={styles.heroSubtitle}>
            Charm pricing, transparent fees, and timely prompts across Premium, P2P, and affiliate flows.
          </Text>
          <View style={styles.planRow} testID="planOptions">
            {premiumPlans.map((plan) => (
              <View key={plan.tier} style={styles.planCard}>
                <Text style={styles.planTier}>{plan.tier}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planHighlight}>{plan.highlight}</Text>
              </View>
            ))}
          </View>
          <View style={styles.feeConfig}>
            <Text style={styles.feeTitle}>Default Fee Config</Text>
            <Text style={styles.feeLine}>Processor (card/instant): {feeConfig.processorCard}</Text>
            <Text style={styles.feeLine}>Processor (ACH): {feeConfig.processorAch}</Text>
            <Text style={styles.feeLine}>App processing fee: {feeConfig.appFee}</Text>
            <Text style={styles.feeMicrocopy}>
              We keep our app fee low (~0.3%–0.5%, capped) to cover security + operations while staying cheaper than market rates.
            </Text>
          </View>
          <View style={styles.comparison} testID="premiumComparison">
            <Text style={styles.comparisonTitle}>Free vs Premium</Text>
            {premiumVsFree.map((row) => (
              <View key={row.label} style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>{row.label}</Text>
                <Text style={styles.comparisonValue}>{row.free}</Text>
                <Text style={styles.comparisonValuePremium}>{row.premium}</Text>
              </View>
            ))}
          </View>
        </View>

        {groupedSections.map((section) => (
          <View key={section.id} style={styles.section} testID={`section-${section.id}`}>
            <View style={styles.sectionHeader}>
              <section.icon color={colors.primary} size={22} strokeWidth={2} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.data.map((card) => (
              <View key={card.id} style={styles.card} testID={`card-${card.id}`}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardPurpose}>{card.purpose}</Text>
                <Text style={styles.cardLabel}>Trigger</Text>
                <Text style={styles.cardValue}>{card.trigger}</Text>
                <Text style={styles.cardLabel}>Components</Text>
                {card.components.map((component) => (
                  <Text key={component} style={styles.cardBullet}>
                    • {component}
                  </Text>
                ))}
                <Text style={styles.cardLabel}>Copy & Pricing</Text>
                <Text style={styles.cardCopyTitle}>{card.copy.title}</Text>
                <Text style={styles.cardCopySubtitle}>{card.copy.subtitle}</Text>
                {card.copy.bullets?.map((bullet: string) => (
                  <Text key={bullet} style={styles.cardMicrocopy}>
                    – {bullet}
                  </Text>
                ))}
                {card.copy.price ? (
                  <Text style={styles.priceTag}>{card.copy.price}</Text>
                ) : null}
                {card.copy.microcopy ? (
                  <Text style={styles.cardMicrocopy}>{card.copy.microcopy}</Text>
                ) : null}
                <View style={styles.ctaRow}>
                  <TouchableOpacity style={styles.primaryCta} activeOpacity={0.85}>
                    <Text style={styles.primaryCtaText}>{card.ctas.primary}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryCta} activeOpacity={0.7}>
                    <Text style={styles.secondaryCtaText}>{card.ctas.secondary}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardLabel}>State & Timing</Text>
                <Text style={styles.cardValue}>{card.stateNotes}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 120,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  heroEyebrow: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  planTier: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  planPrice: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  planHighlight: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  feeConfig: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feeTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  feeLine: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  feeMicrocopy: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  comparison: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  comparisonTitle: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  comparisonLabel: {
    flex: 2,
    color: colors.textSecondary,
    fontSize: 13,
  },
  comparisonValue: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    textAlign: 'right' as const,
  },
  comparisonValuePremium: {
    flex: 1,
    color: colors.primaryLight,
    fontSize: 13,
    textAlign: 'right' as const,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
    marginBottom: 6,
  },
  cardPurpose: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  cardValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  cardBullet: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  cardCopyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  cardCopySubtitle: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  cardMicrocopy: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  priceTag: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.primaryTint,
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  primaryCta: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  secondaryCta: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryCtaText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
