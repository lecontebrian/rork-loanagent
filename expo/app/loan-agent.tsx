import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Building2,
  Wallet,
  ScanLine,
  ChevronDown,
  ChevronUp,
  Circle,
  Loader,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { PremiumIcon, ICON_SIZES, ICON_STROKE } from '@/components/PremiumIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  AgentStage,
  AgentLogEntry,
  AgentPipelineResult,
  AgentInputForm,
  RuleFlag,
  InputTab,
} from '@/types/loanAgent';
import { AGENT_STAGES } from '@/types/loanAgent';
import { runAgentPipeline } from '@/utils/agentPipeline';
import { parseRawFinancialText, parseStructuredFormInput } from '@/utils/ocrParser';
import { formatCurrency, formatPercent } from '@/utils/formatters';

const STAGE_LABELS: Record<AgentStage, string> = {
  Draft: 'Draft',
  Data_Extraction: 'Data Extraction',
  Rules_Validation: 'Rules Validation',
  Risk_Analysis: 'Risk Analysis',
  Human_Review_Required: 'Human Review',
  Final_Status: 'Final Status',
};

const INPUT_TABS: InputTab[] = [
  { id: 'profile', label: 'Profile', description: 'Applicant details' },
  { id: 'assets', label: 'Assets & Income', description: 'Financial standing' },
  { id: 'liabilities', label: 'Liabilities', description: 'Existing debts' },
  { id: 'ocr', label: 'OCR Import', description: 'Parse documents' },
];

const DEFAULT_FORM: AgentInputForm = {
  applicantName: '',
  grossAnnualIncome: '',
  monthlyRent: '',
  creditCardPayments: '',
  autoLoanPayment: '',
  studentLoanPayment: '',
  otherDebtPayment: '',
  otherDebtDescription: '',
  requestedLoanAmount: '',
  assetValue: '',
  loanPurpose: '',
  employmentStatus: '',
  monthsEmployed: '',
  rawOcrText: '',
  activeTab: 'profile',
};

const FULL_TIME = 3500; // total pipeline animation time in ms

export default function LoanAgentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth >= 768;

  const [form, setForm] = useState<AgentInputForm>(DEFAULT_FORM);
  const [activeStage, setActiveStage] = useState<AgentStage>('Draft');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [result, setResult] = useState<AgentPipelineResult | null>(null);
  const [running, setRunning] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Pulse animation for active stage dot
  useEffect(() => {
    if (running) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [running, pulseAnim]);

  const updateField = useCallback(
    (field: keyof AgentInputForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setForm(DEFAULT_FORM);
    setActiveStage('Draft');
    setCurrentStageIndex(0);
    setLogs([]);
    setResult(null);
    setRunning(false);
  }, []);

  const handleRunPipeline = useCallback(async () => {
    setRunning(true);
    setLogs([]);
    setResult(null);
    setActiveStage('Draft');
    setCurrentStageIndex(0);

    let data;
    if (form.rawOcrText.trim()) {
      data = parseRawFinancialText(form.rawOcrText.trim());
    } else {
      data = parseStructuredFormInput({
        grossAnnualIncome: form.grossAnnualIncome,
        monthlyRent: form.monthlyRent,
        creditCardPayments: form.creditCardPayments,
        autoLoanPayment: form.autoLoanPayment,
        studentLoanPayment: form.studentLoanPayment,
        otherDebtPayment: form.otherDebtPayment,
        otherDebtDescription: form.otherDebtDescription,
        requestedLoanAmount: form.requestedLoanAmount,
        assetValue: form.assetValue,
        loanPurpose: form.loanPurpose,
        employmentStatus: form.employmentStatus,
        monthsEmployed: form.monthsEmployed,
      });
    }

    // Validate we have minimum data
    if (data.grossAnnualIncome <= 0 && data.requestedLoanAmount <= 0) {
      const stubLog: AgentLogEntry = {
        id: 'err-1',
        stage: 'Data_Extraction',
        message: 'Error: Please enter income and loan amount before running analysis.',
        timestamp: Date.now(),
        severity: 'CriticalFail',
      };
      setLogs([stubLog]);
      setRunning(false);
      return;
    }

    const onLog = (entry: AgentLogEntry) => {
      setLogs((prev) => [...prev, entry]);
      // Advance stage based on the log entry stage
      const stageIdx = AGENT_STAGES.indexOf(entry.stage);
      if (stageIdx >= 0) {
        setActiveStage(entry.stage);
        setCurrentStageIndex(stageIdx);
      }
    };

    try {
      const pipelineResult = await runAgentPipeline(data, onLog);
      setResult(pipelineResult);
      setActiveStage('Final_Status');
      setCurrentStageIndex(AGENT_STAGES.length - 1);
    } catch (e) {
      onLog({
        id: 'err-2',
        stage: 'Rules_Validation',
        message: 'Pipeline error: ' + (e instanceof Error ? e.message : 'Unknown error'),
        timestamp: Date.now(),
        severity: 'CriticalFail',
      });
    } finally {
      setRunning(false);
    }
  }, [form]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <PremiumIcon
              icon={ArrowLeft}
              color={colors.text}
              size={ICON_SIZES.header}
              strokeWidth={ICON_STROKE.regular}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Loan Agent</Text>
            <Text style={styles.headerSubtitle}>Multi-Agent Underwriting</Text>
          </View>
          <View style={styles.headerBadge}>
            <LinearGradient
              colors={['#0A84FF', '#5E5CE6']}
              style={styles.headerBadgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.headerBadgeText}>AI</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Body: two-panel on wide, stacked on narrow */}
        <ScrollView
          ref={scrollRef}
          style={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.panels, isWide && styles.panelsWide]}>
            {/* Left Panel — Input Forms */}
            <Animated.View
              style={[
                styles.leftPanel,
                isWide && styles.leftPanelWide,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Applicant Data</Text>
                <Text style={styles.sectionSubtitle}>
                  Enter financial details or paste raw OCR text
                </Text>

                {/* Tab bar */}
                <View style={styles.tabBar}>
                  {INPUT_TABS.map((tab) => (
                    <TouchableOpacity
                      key={tab.id}
                      style={[
                        styles.tab,
                        form.activeTab === tab.id && styles.tabActive,
                      ]}
                      onPress={() => updateField('activeTab', tab.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.tabLabel,
                          form.activeTab === tab.id && styles.tabLabelActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tab content */}
                {form.activeTab === 'profile' && (
                  <ProfileTab form={form} updateField={updateField} />
                )}
                {form.activeTab === 'assets' && (
                  <AssetsTab form={form} updateField={updateField} />
                )}
                {form.activeTab === 'liabilities' && (
                  <LiabilitiesTab form={form} updateField={updateField} />
                )}
                {form.activeTab === 'ocr' && (
                  <OcrTab form={form} updateField={updateField} />
                )}

                {/* Run & Reset buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.runButton}
                    onPress={handleRunPipeline}
                    disabled={running}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={
                        running
                          ? [colors.textTertiary, colors.textTertiary]
                          : ['#0A84FF', '#30D158']
                      }
                      style={styles.runButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {running ? (
                        <Loader
                          color={colors.white}
                          size={ICON_SIZES.action}
                          strokeWidth={ICON_STROKE.emphasized}
                          style={{ marginRight: 8 }}
                        />
                      ) : (
                        <Play
                          color={colors.white}
                          size={ICON_SIZES.action}
                          strokeWidth={ICON_STROKE.emphasized}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text style={styles.runButtonText}>
                        {running ? 'Processing...' : 'Run Agent Pipeline'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetAll}
                    activeOpacity={0.7}
                    disabled={running}
                  >
                    <RotateCcw
                      color={colors.textSecondary}
                      size={ICON_SIZES.action}
                      strokeWidth={ICON_STROKE.regular}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Right Panel — Agent Reasoning Log */}
            <Animated.View
              style={[
                styles.rightPanel,
                isWide && styles.rightPanelWide,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.sectionCard}>
                <View style={styles.rightHeader}>
                  <Text style={styles.sectionTitle}>Agent Reasoning Log</Text>
                  <TouchableOpacity
                    onPress={() => setExpandedLogs(!expandedLogs)}
                    activeOpacity={0.7}
                  >
                    <PremiumIcon
                      icon={expandedLogs ? ChevronUp : ChevronDown}
                      color={colors.textSecondary}
                      size={ICON_SIZES.action}
                      strokeWidth={ICON_STROKE.regular}
                    />
                  </TouchableOpacity>
                </View>

                {/* Progress Stepper */}
                <ProgressStepper
                  activeStage={activeStage}
                  currentStageIndex={currentStageIndex}
                  running={running}
                  pulseAnim={pulseAnim}
                />

                {expandedLogs && (
                  <>
                    {/* Live log entries */}
                    {logs.length > 0 && (
                      <View style={styles.logContainer}>
                        {logs.map((entry) => (
                          <LogEntry key={entry.id} entry={entry} />
                        ))}
                      </View>
                    )}

                    {!running && logs.length === 0 && !result && (
                      <View style={styles.emptyLog}>
                        <ScanLine
                          color={colors.textTertiary}
                          size={40}
                          strokeWidth={1.5}
                        />
                        <Text style={styles.emptyLogTitle}>
                          Ready to Analyze
                        </Text>
                        <Text style={styles.emptyLogText}>
                          Enter applicant data and run the agent pipeline to see
                          real-time underwriting analysis.
                        </Text>
                      </View>
                    )}

                    {/* Threshold Comparison Table */}
                    {result && (
                      <ComparisonTable flags={result.flags} />
                    )}

                    {/* Analyst Narrative */}
                    {result && (
                      <NarrativeBlock narrative={result.narrative} />
                    )}
                  </>
                )}
              </View>
            </Animated.View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function ProgressStepper({
  activeStage,
  currentStageIndex,
  running,
  pulseAnim,
}: {
  activeStage: AgentStage;
  currentStageIndex: number;
  running: boolean;
  pulseAnim: Animated.Value;
}) {
  return (
    <View style={styles.stepper}>
      {AGENT_STAGES.map((stage, idx) => {
        const isComplete = idx < currentStageIndex;
        const isActive = stage === activeStage && (running || idx === currentStageIndex);
        const isFuture = idx > currentStageIndex;

        let dotColor = colors.textTertiary;
        let lineColor = colors.border;
        if (isComplete) {
          dotColor = colors.success;
          lineColor = colors.success;
        } else if (isActive) {
          dotColor = colors.primary;
        }

        return (
          <View key={stage} style={styles.stepRow}>
            {/* Connector line */}
            {idx > 0 && (
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: lineColor },
                ]}
              />
            )}

            {/* Step dot */}
            <View style={[styles.stepCircle, { borderColor: dotColor }]}>
              {isComplete ? (
                <Check color={colors.success} size={12} strokeWidth={3} />
              ) : isActive && running ? (
                <Animated.View
                  style={[
                    styles.stepPulse,
                    {
                      backgroundColor: dotColor,
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.4],
                        outputRange: [0.7, 0.2],
                      }),
                    },
                  ]}
                />
              ) : null}
              {isActive && !running ? (
                <Circle
                  color={colors.primary}
                  size={10}
                  strokeWidth={2}
                  fill={colors.primary}
                />
              ) : isFuture ? (
                <Circle
                  color={colors.textTertiary}
                  size={8}
                  strokeWidth={1.5}
                />
              ) : null}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.stepLabel,
                isComplete && styles.stepLabelComplete,
                isActive && styles.stepLabelActive,
                isFuture && styles.stepLabelFuture,
              ]}
              numberOfLines={1}
            >
              {STAGE_LABELS[stage]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function LogEntry({ entry }: { entry: AgentLogEntry }) {
  const severityColor =
    entry.severity === 'CriticalFail'
      ? colors.error
      : entry.severity === 'Warning'
        ? colors.warning
        : entry.severity === 'Success'
          ? colors.success
          : colors.secondary;

  const SeverityIcon =
    entry.severity === 'CriticalFail'
      ? XCircle
      : entry.severity === 'Warning'
        ? AlertTriangle
        : entry.severity === 'Success'
          ? Check
          : FileText;

  return (
    <View style={styles.logEntry}>
      <View style={[styles.logIcon, { backgroundColor: severityColor + '20' }]}>
        <SeverityIcon color={severityColor} size={14} strokeWidth={2} />
      </View>
      <View style={styles.logContent}>
        <Text style={[styles.logMessage, { color: severityColor }]}>
          {STAGE_LABELS[entry.stage]}
        </Text>
        <Text style={styles.logDetail}>{entry.message}</Text>
      </View>
    </View>
  );
}

function ComparisonTable({ flags }: { flags: RuleFlag[] }) {
  return (
    <View style={styles.comparisonTable}>
      <Text style={styles.tableTitle}>Threshold Comparison</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Metric</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Calculated</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Threshold</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
      </View>

      {flags.map((flag, idx) => {
        const isPct = flag.metric === 'DTI' || flag.metric === 'LTV' || flag.metric === 'Payment-to-Income';
        const rowBg = idx % 2 === 0 ? colors.surfaceLight : 'transparent';

        const statusColor =
          flag.severity === 'CriticalFail'
            ? colors.error
            : flag.severity === 'Warning'
              ? colors.warning
              : colors.success;

        const StatusIcon =
          flag.severity === 'CriticalFail'
            ? XCircle
            : flag.severity === 'Warning'
              ? AlertTriangle
              : Check;

        return (
          <View key={flag.metric} style={[styles.tableRow, { backgroundColor: rowBg }]}>
            <Text style={[styles.tableCell, styles.tableCellBold, { flex: 2 }]}>
              {flag.label}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {isPct ? formatPercent(flag.calculatedValue, 1) : formatCurrency(flag.calculatedValue)}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {isPct ? formatPercent(flag.threshold, 0) : formatCurrency(flag.threshold)}
            </Text>
            <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <StatusIcon color={statusColor} size={14} strokeWidth={2.5} />
              <Text style={[styles.tableStatus, { color: statusColor }]}>
                {flag.severity === 'CriticalFail'
                  ? 'Fail'
                  : flag.severity === 'Warning'
                    ? 'Warn'
                    : 'Pass'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function NarrativeBlock({ narrative }: { narrative: AgentPipelineResult['narrative'] }) {
  const borderColor =
    narrative.severityBorder === 'green'
      ? colors.success
      : narrative.severityBorder === 'yellow'
        ? colors.warning
        : colors.error;

  const bgColor =
    narrative.severityBorder === 'green'
      ? colors.successLight
      : narrative.severityBorder === 'yellow'
        ? colors.warningLight
        : colors.errorLight;

  return (
    <View style={[styles.narrativeContainer, { borderLeftColor: borderColor, backgroundColor: bgColor }]}>
      <Text style={styles.narrativeRecommendation}>
        {narrative.recommendation === 'approve'
          ? 'APPROVED'
          : narrative.recommendation === 'caution'
            ? 'CAUTION — MANUAL REVIEW'
            : 'DECLINED'}
      </Text>
      <Text style={styles.narrativeSummary}>{narrative.summary}</Text>

      {narrative.citations.length > 0 && (
        <View style={styles.citationsContainer}>
          <Text style={styles.citationsTitle}>Policy Citations</Text>
          {narrative.citations.map((c, idx) => (
            <View key={idx} style={styles.citation}>
              <View style={styles.citationDot} />
              <View style={styles.citationContent}>
                <Text style={styles.citationPolicy}>
                  {c.policy} — {c.section}
                </Text>
                <Text style={styles.citationExcerpt}>{c.excerpt}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Tab content components ───────────────────────────────────────

function ProfileTab({
  form,
  updateField,
}: {
  form: AgentInputForm;
  updateField: (f: keyof AgentInputForm, v: string) => void;
}) {
  return (
    <View style={styles.tabContent}>
      <FormField
        label="Applicant Name"
        placeholder="e.g. Jane Smith"
        icon={User}
        value={form.applicantName}
        onChangeText={(v) => updateField('applicantName', v)}
      />
      <FormField
        label="Employment Status"
        placeholder="Full-time, Self-employed, etc."
        icon={Building2}
        value={form.employmentStatus}
        onChangeText={(v) => updateField('employmentStatus', v)}
      />
      <FormField
        label="Loan Purpose"
        placeholder="e.g. Debt Consolidation, Home Improvement"
        icon={FileText}
        value={form.loanPurpose}
        onChangeText={(v) => updateField('loanPurpose', v)}
      />
    </View>
  );
}

function AssetsTab({
  form,
  updateField,
}: {
  form: AgentInputForm;
  updateField: (f: keyof AgentInputForm, v: string) => void;
}) {
  return (
    <View style={styles.tabContent}>
      <FormField
        label="Gross Annual Income"
        placeholder="e.g. 85000"
        icon={Wallet}
        value={form.grossAnnualIncome}
        onChangeText={(v) => updateField('grossAnnualIncome', v)}
        isCurrency
      />
      <FormField
        label="Months Employed"
        placeholder="e.g. 24"
        icon={Building2}
        value={form.monthsEmployed}
        onChangeText={(v) => updateField('monthsEmployed', v)}
      />
      <FormField
        label="Requested Loan Amount"
        placeholder="e.g. 250000"
        icon={Wallet}
        value={form.requestedLoanAmount}
        onChangeText={(v) => updateField('requestedLoanAmount', v)}
        isCurrency
      />
      <FormField
        label="Asset / Collateral Value"
        placeholder="e.g. 350000"
        icon={Building2}
        value={form.assetValue}
        onChangeText={(v) => updateField('assetValue', v)}
        isCurrency
      />
    </View>
  );
}

function LiabilitiesTab({
  form,
  updateField,
}: {
  form: AgentInputForm;
  updateField: (f: keyof AgentInputForm, v: string) => void;
}) {
  return (
    <View style={styles.tabContent}>
      <FormField
        label="Monthly Rent / Mortgage"
        placeholder="e.g. 1800"
        icon={Wallet}
        value={form.monthlyRent}
        onChangeText={(v) => updateField('monthlyRent', v)}
        isCurrency
      />
      <FormField
        label="Credit Card Payments"
        placeholder="e.g. 450"
        icon={Wallet}
        value={form.creditCardPayments}
        onChangeText={(v) => updateField('creditCardPayments', v)}
        isCurrency
      />
      <FormField
        label="Auto Loan Payment"
        placeholder="e.g. 520"
        icon={Wallet}
        value={form.autoLoanPayment}
        onChangeText={(v) => updateField('autoLoanPayment', v)}
        isCurrency
      />
      <FormField
        label="Student Loan Payment"
        placeholder="e.g. 300"
        icon={Wallet}
        value={form.studentLoanPayment}
        onChangeText={(v) => updateField('studentLoanPayment', v)}
        isCurrency
      />
      <FormField
        label="Other Debt Description"
        placeholder="e.g. Personal Loan"
        icon={FileText}
        value={form.otherDebtDescription}
        onChangeText={(v) => updateField('otherDebtDescription', v)}
      />
      <FormField
        label="Other Debt Payment"
        placeholder="e.g. 200"
        icon={Wallet}
        value={form.otherDebtPayment}
        onChangeText={(v) => updateField('otherDebtPayment', v)}
        isCurrency
      />
    </View>
  );
}

function OcrTab({
  form,
  updateField,
}: {
  form: AgentInputForm;
  updateField: (f: keyof AgentInputForm, v: string) => void;
}) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.ocrHint}>
        Paste raw text from scanned paystubs, tax returns, or bank statements.
        The parser will extract income, debts, and loan details automatically.
      </Text>
      <TextInput
        style={styles.ocrInput}
        multiline
        numberOfLines={8}
        placeholder="Paste unstructured financial text here...
e.g.
Gross Annual Income: $85,000
Monthly Rent: $1,800
Credit Card Payment: $450
Auto Loan: $520/mo
Requested Loan Amount: $250,000
Asset Value: $350,000
Employed for 24 months"
        placeholderTextColor={colors.textTertiary}
        value={form.rawOcrText}
        onChangeText={(v) => updateField('rawOcrText', v)}
        textAlignVertical="top"
      />
    </View>
  );
}

// ─── Shared Form Field ────────────────────────────────────────────

function FormField({
  label,
  placeholder,
  icon: Icon,
  value,
  onChangeText,
  isCurrency,
}: {
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ color: string; size: number; strokeWidth: number }>;
  value: string;
  onChangeText: (v: string) => void;
  isCurrency?: boolean;
}) {
  return (
    <View style={styles.formField}>
      <View style={styles.formFieldLabel}>
        <Icon color={colors.textSecondary} size={14} strokeWidth={1.8} />
        <Text style={styles.formFieldLabelText}>{label}</Text>
      </View>
      <View style={styles.formFieldInputWrapper}>
        {isCurrency && (
          <Text style={styles.currencyPrefix}>$</Text>
        )}
        <TextInput
          style={[styles.formFieldInput, isCurrency && styles.formFieldInputCurrency]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={isCurrency ? 'decimal-pad' : 'default'}
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    overflow: 'hidden',
  },
  headerBadgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },

  // Body & panels
  body: {
    flex: 1,
  },
  panels: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  panelsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftPanel: {
    flex: 1,
  },
  leftPanelWide: {
    maxWidth: '50%' as const,
  },
  rightPanel: {
    flex: 1,
  },
  rightPanelWide: {
    maxWidth: '50%' as const,
  },

  // Section cards
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...colors.shadowMedium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginBottom: 16,
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary + '40',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: colors.primary,
  },

  // Tab content
  tabContent: {
    gap: 14,
    marginBottom: 20,
  },

  // Form fields
  formField: {
    gap: 6,
  },
  formFieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formFieldLabelText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  formFieldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginRight: 4,
  },
  formFieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    paddingVertical: 12,
    letterSpacing: -0.2,
  },
  formFieldInputCurrency: {
    paddingLeft: 0,
  },

  // OCR
  ocrHint: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  ocrInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.text,
    minHeight: 140,
    fontFamily: 'monospace',
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  runButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  runButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  runButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Progress stepper
  stepper: {
    marginBottom: 20,
    paddingTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginRight: 10,
  },
  stepPulse: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
  },
  stepLine: {
    width: 2,
    height: 14,
    position: 'absolute',
    left: 11,
    top: -12,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
    flexShrink: 0,
  },
  stepLabelComplete: {
    color: colors.success,
    fontWeight: '600' as const,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700' as const,
  },
  stepLabelFuture: {
    color: colors.textQuaternary,
  },

  // Log entries
  logContainer: {
    marginBottom: 16,
    gap: 8,
  },
  logEntry: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  logIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  logContent: {
    flex: 1,
    gap: 2,
  },
  logMessage: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: -0.1,
  },
  logDetail: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  // Empty state
  emptyLog: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyLogTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  emptyLogText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    letterSpacing: -0.1,
  },

  // Comparison table
  comparisonTable: {
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.textTertiary,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tableCell: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  tableCellBold: {
    fontWeight: '700' as const,
    color: colors.text,
  },
  tableStatus: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: -0.1,
  },

  // Narrative block
  narrativeContainer: {
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },
  narrativeRecommendation: {
    fontSize: 13,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  narrativeSummary: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  citationsContainer: {
    marginTop: 4,
    gap: 10,
  },
  citationsTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  citation: {
    flexDirection: 'row',
    gap: 10,
  },
  citationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    marginTop: 6,
  },
  citationContent: {
    flex: 1,
    gap: 2,
  },
  citationPolicy: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  citationExcerpt: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
});
