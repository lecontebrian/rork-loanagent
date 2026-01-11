import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, AlertCircle, Plus, CheckCircle, Clock, XCircle, FileText, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { CreditDispute } from '@/types';

const sampleDisputes: CreditDispute[] = [
  {
    id: '1',
    bureau: 'experian',
    accountName: 'ABC Credit Card',
    reason: 'Account is not mine',
    status: 'investigating',
    submittedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    bureau: 'equifax',
    accountName: 'XYZ Collections',
    reason: 'Incorrect balance amount',
    status: 'submitted',
    submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    bureau: 'transunion',
    accountName: 'Late Payment Record',
    reason: 'Payment was on time',
    status: 'resolved',
    submittedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function CreditDisputesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [disputes] = useState(sampleDisputes);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getStatusIcon = (status: CreditDispute['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle color={colors.success} size={20} strokeWidth={2.5} />;
      case 'investigating':
        return <Clock color={colors.warning} size={20} strokeWidth={2.5} />;
      case 'rejected':
        return <XCircle color={colors.error} size={20} strokeWidth={2.5} />;
      default:
        return <FileText color={colors.primary} size={20} strokeWidth={2.5} />;
    }
  };

  const getStatusColor = (status: CreditDispute['status']) => {
    switch (status) {
      case 'resolved': return colors.success;
      case 'investigating': return colors.warning;
      case 'rejected': return colors.error;
      default: return colors.primary;
    }
  };

  const getBureauLogo = (bureau: CreditDispute['bureau']) => {
    const logos: Record<CreditDispute['bureau'], string> = {
      experian: 'https://logo.clearbit.com/experian.com',
      equifax: 'https://logo.clearbit.com/equifax.com',
      transunion: 'https://logo.clearbit.com/transunion.com',
    };
    return logos[bureau];
  };

  const activeDisputes = disputes.filter(d => d.status !== 'resolved' && d.status !== 'rejected');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved' || d.status === 'rejected');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Credit Disputes</Text>
            <Text style={styles.headerSubtitle}>File & Track</Text>
          </View>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Plus color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['#FF9F0A', '#FF6D00']}
              style={styles.infoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.infoIcon}>
                <AlertCircle color={colors.white} size={28} strokeWidth={2.5} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Dispute Inaccurate Items</Text>
                <Text style={styles.infoText}>
                  Remove negative items from your credit report that are inaccurate or unverifiable.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{disputes.length}</Text>
              <Text style={styles.statLabel}>Total Disputes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{activeDisputes.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{resolvedDisputes.length}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          {activeDisputes.length > 0 && (
            <View style={styles.disputesSection}>
              <Text style={styles.sectionTitle}>Active Disputes</Text>
              {activeDisputes.map((dispute) => (
                <Animated.View
                  key={dispute.id}
                  style={[
                    styles.disputeCard,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  <View style={styles.disputeHeader}>
                    <View style={styles.disputeInfo}>
                      <View style={styles.bureauLogo}>
                        <Text style={styles.bureauText}>{dispute.bureau.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={styles.disputeDetails}>
                        <Text style={styles.disputeAccount}>{dispute.accountName}</Text>
                        <Text style={styles.disputeBureau}>{dispute.bureau.toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(dispute.status) + '20' }]}>
                      {getStatusIcon(dispute.status)}
                    </View>
                  </View>

                  <View style={styles.disputeReason}>
                    <Text style={styles.disputeReasonLabel}>Reason:</Text>
                    <Text style={styles.disputeReasonText}>{dispute.reason}</Text>
                  </View>

                  <View style={styles.disputeTimeline}>
                    <View style={styles.timelineItem}>
                      <Text style={styles.timelineLabel}>Submitted</Text>
                      <Text style={styles.timelineDate}>
                        {new Date(dispute.submittedDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.timelineDivider} />
                    <View style={styles.timelineItem}>
                      <Text style={styles.timelineLabel}>Last Update</Text>
                      <Text style={styles.timelineDate}>
                        {new Date(dispute.updatedDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusBar, { backgroundColor: getStatusColor(dispute.status) + '10' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(dispute.status) }]}>
                      {dispute.status === 'investigating' ? 'Under Investigation' : dispute.status.toUpperCase()}
                    </Text>
                    <ChevronRight color={getStatusColor(dispute.status)} size={18} strokeWidth={2} />
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {resolvedDisputes.length > 0 && (
            <View style={styles.disputesSection}>
              <Text style={styles.sectionTitle}>Resolved Disputes</Text>
              {resolvedDisputes.map((dispute) => (
                <View key={dispute.id} style={styles.disputeCard}>
                  <View style={styles.disputeHeader}>
                    <View style={styles.disputeInfo}>
                      <View style={styles.bureauLogo}>
                        <Text style={styles.bureauText}>{dispute.bureau.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={styles.disputeDetails}>
                        <Text style={styles.disputeAccount}>{dispute.accountName}</Text>
                        <Text style={styles.disputeBureau}>{dispute.bureau.toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(dispute.status) + '20' }]}>
                      {getStatusIcon(dispute.status)}
                    </View>
                  </View>

                  <View style={styles.disputeReason}>
                    <Text style={styles.disputeReasonText}>{dispute.reason}</Text>
                  </View>

                  <View style={[styles.statusBar, { backgroundColor: getStatusColor(dispute.status) + '10' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(dispute.status) }]}>
                      {dispute.status === 'resolved' ? 'RESOLVED ✓' : 'REJECTED'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.newDisputeButton} activeOpacity={0.85}>
            <LinearGradient
              colors={['#0A84FF', '#5E5CE6']}
              style={styles.newDisputeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Plus color={colors.white} size={24} strokeWidth={2.5} />
              <Text style={styles.newDisputeButtonText}>File New Dispute</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  infoCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...colors.shadow,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  disputesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  disputeCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...colors.shadowMedium,
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  disputeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bureauLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bureauText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  disputeDetails: {
    flex: 1,
  },
  disputeAccount: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  disputeBureau: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeReason: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 12,
    marginBottom: 14,
  },
  disputeReasonLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  disputeReasonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  disputeTimeline: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineItem: {
    flex: 1,
  },
  timelineDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  newDisputeButton: {
    marginBottom: 24,
    borderRadius: 18,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  newDisputeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  newDisputeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
