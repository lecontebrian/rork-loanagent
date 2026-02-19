import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Crown, Shield, Wallet } from 'lucide-react-native';
import colors from '@/constants/colors';

const sections = [
  { title: 'Premium Plans', icon: Crown, items: ['Monthly: $9.99/mo', 'Power Monthly: $19.99/mo', 'Annual: $99.99/yr (save 17%)'] },
  { title: 'Premium Benefits', icon: Shield, items: ['Deeper loan intelligence', 'Unlimited what-if simulations', 'Smart refinance alerts', 'Priority support', 'Audit-ready fee dashboards'] },
  { title: 'Fee Structure', icon: Wallet, items: ['Card/Instant: 1.5%–2.5%', 'Bank/ACH: 0%–1%', 'App fee: 0.3%–0.5% (capped at $5)'] },
];

export default function PremiumExperienceScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Premium UX Blueprint' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="premiumUxScroll">
        <Text style={styles.heroTitle}>Ethical, high-converting monetization</Text>
        <Text style={styles.heroSubtitle}>Charm pricing, transparent fees, and timely prompts across Premium, P2P, and affiliate flows.</Text>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <section.icon color={colors.primary} size={22} strokeWidth={2} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item) => (
              <Text key={item} style={styles.item}>• {item}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 100 },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, marginBottom: 8 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: 24 },
  section: { marginBottom: 24, backgroundColor: colors.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '700' as const },
  item: { color: colors.text, fontSize: 14, lineHeight: 22, marginLeft: 8 },
});
