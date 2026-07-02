import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { REGULATORY_CONTENT } from '@/constants/compliance';

export default function LegalComplianceScreen() {
  const router = useRouter();

  const sections = [
    {
      id: 'tila',
      title: 'TILA Disclosure',
      icon: FileText,
      color: colors.primary,
    },
    {
      id: 'respa',
      title: 'RESPA',
      icon: FileText,
      color: colors.secondary,
    },
    {
      id: 'ecoa',
      title: 'Equal Credit Opportunity',
      icon: Shield,
      color: colors.accent,
    },
    {
      id: 'fcra',
      title: 'Fair Credit Reporting',
      icon: FileText,
      color: colors.info,
    },
    {
      id: 'glba',
      title: 'Privacy Notice (GLBA)',
      icon: Shield,
      color: colors.primary,
    },
    {
      id: 'hmda',
      title: 'HMDA Disclosure',
      icon: FileText,
      color: colors.secondary,
    },
    {
      id: 'bsa',
      title: 'Anti-Money Laundering',
      icon: Shield,
      color: colors.warning,
    },
    {
      id: 'udaap',
      title: 'Consumer Protections',
      icon: AlertCircle,
      color: colors.success,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Legal & Compliance</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Regulatory Disclosures</Text>
            <Text style={styles.description}>
              Important information about your rights and protections under federal law
            </Text>

            <View style={styles.sectionsContainer}>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <TouchableOpacity
                    key={section.id}
                    style={styles.sectionCard}
                    onPress={() => router.push(`/legal/${section.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                      <Icon color={section.color} size={24} />
                    </View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.additionalLinks}>
              <TouchableOpacity
                style={styles.linkCard}
                onPress={() => router.push('/consumer-rights' as any)}
                activeOpacity={0.7}
              >
                <Shield color={colors.primary} size={24} />
                <View style={styles.linkContent}>
                  <Text style={styles.linkTitle}>Consumer Rights & Resources</Text>
                  <Text style={styles.linkDescription}>
                    Learn about your rights and how to protect yourself
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkCard}
                onPress={() => router.push('/terms-of-service' as any)}
                activeOpacity={0.7}
              >
                <FileText color={colors.secondary} size={24} />
                <View style={styles.linkContent}>
                  <Text style={styles.linkTitle}>Terms of Service</Text>
                  <Text style={styles.linkDescription}>
                    Review our terms and conditions
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkCard}
                onPress={() => router.push('/privacy-policy' as any)}
                activeOpacity={0.7}
              >
                <Shield color={colors.accent} size={24} />
                <View style={styles.linkContent}>
                  <Text style={styles.linkTitle}>Privacy Policy</Text>
                  <Text style={styles.linkDescription}>
                    How we protect and use your information
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  sectionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  additionalLinks: {
    gap: 12,
  },
  linkCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  linkContent: {
    flex: 1,
    marginLeft: 16,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
