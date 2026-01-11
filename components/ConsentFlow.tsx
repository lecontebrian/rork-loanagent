import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { CheckSquare, Square, Info } from 'lucide-react-native';
import colors from '@/constants/colors';
import { CONSENT_LANGUAGE } from '@/constants/compliance';

type ConsentType = 'creditCheck' | 'dataSharing' | 'electronicConsent' | 'termsAcceptance';

interface ConsentFlowProps {
  onComplete: (consents: Record<ConsentType, boolean>) => void;
  onCancel?: () => void;
}

export default function ConsentFlow({ onComplete, onCancel }: ConsentFlowProps) {
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    creditCheck: false,
    dataSharing: false,
    electronicConsent: false,
    termsAcceptance: false,
  });

  const [expanded, setExpanded] = useState<ConsentType | null>(null);

  const toggleConsent = (type: ConsentType) => {
    setConsents(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleExpand = (type: ConsentType) => {
    setExpanded(prev => prev === type ? null : type);
  };

  const allRequired = Object.entries(CONSENT_LANGUAGE).every(([key, value]) => {
    if (value.required) {
      return consents[key as ConsentType];
    }
    return true;
  });

  const handleContinue = () => {
    if (allRequired) {
      onComplete(consents);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review & Consent</Text>
        <Text style={styles.subtitle}>
          Please review and accept the following to continue
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {(Object.keys(CONSENT_LANGUAGE) as ConsentType[]).map((key) => {
            const consent = CONSENT_LANGUAGE[key];
            const isExpanded = expanded === key;
            const isChecked = consents[key];

            return (
              <View key={key} style={styles.consentCard}>
                <TouchableOpacity
                  style={styles.consentHeader}
                  onPress={() => toggleConsent(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContainer}>
                    {isChecked ? (
                      <CheckSquare color={colors.primary} size={24} strokeWidth={2} />
                    ) : (
                      <Square color={colors.textTertiary} size={24} strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.consentTitleContainer}>
                    <Text style={styles.consentTitle}>{consent.title}</Text>
                    {consent.required && (
                      <Text style={styles.requiredBadge}>Required</Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => toggleExpand(key)}
                  activeOpacity={0.7}
                >
                  <Info color={colors.primary} size={18} />
                  <Text style={styles.expandText}>
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.consentContent}>
                    <Text style={styles.consentText}>{consent.content}</Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.noteContainer}>
            <Info color={colors.info} size={20} />
            <Text style={styles.noteText}>
              By continuing, you confirm that you have read and understood all consent agreements. You may withdraw consent at any time by contacting our support team.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !allRequired && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!allRequired}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  consentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  consentTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consentTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
  },
  requiredBadge: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.error,
    backgroundColor: colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
    marginLeft: 6,
  },
  consentContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  consentText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: colors.infoLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  continueButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    ...colors.shadow,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
  },
});
