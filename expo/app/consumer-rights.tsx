import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, Phone, Globe } from 'lucide-react-native';
import colors from '@/constants/colors';
import { CONSUMER_RIGHTS } from '@/constants/compliance';

export default function ConsumerRightsScreen() {
  const router = useRouter();

  const handleLink = (url: string) => {
    Linking.openURL(`https://${url}`);
  };

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`);
  };

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
          <Text style={styles.headerTitle}>Consumer Rights</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>{CONSUMER_RIGHTS.overview.title}</Text>
            <Text style={styles.description}>{CONSUMER_RIGHTS.overview.content}</Text>

            <View style={styles.sectionsContainer}>
              {CONSUMER_RIGHTS.sections.map((section, index) => (
                <View key={index} style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={styles.itemsList}>
                    {section.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.itemRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.resourcesSection}>
              <Text style={styles.resourcesTitle}>Important Resources</Text>
              <Text style={styles.resourcesSubtitle}>
                Contact these agencies if you need assistance or want to file a complaint
              </Text>

              {CONSUMER_RIGHTS.resources.map((resource, index) => (
                <View key={index} style={styles.resourceCard}>
                  <Text style={styles.resourceName}>{resource.name}</Text>
                  <Text style={styles.resourcePurpose}>{resource.purpose}</Text>

                  <View style={styles.resourceActions}>
                    <TouchableOpacity
                      style={styles.resourceButton}
                      onPress={() => handlePhone(resource.phone)}
                      activeOpacity={0.7}
                    >
                      <Phone color={colors.primary} size={18} />
                      <Text style={styles.resourceButtonText}>{resource.phone}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.resourceButton}
                      onPress={() => handleLink(resource.website)}
                      activeOpacity={0.7}
                    >
                      <Globe color={colors.primary} size={18} />
                      <Text style={styles.resourceButtonText} numberOfLines={1}>
                        {resource.website}
                      </Text>
                      <ExternalLink color={colors.primary} size={14} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.footerNote}>
              <Text style={styles.footerNoteText}>
                These rights are protected by federal law. If you believe your rights have been violated, you can file a complaint with the appropriate regulatory agency or seek legal counsel.
              </Text>
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
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  resourcesSection: {
    marginBottom: 24,
  },
  resourcesTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  resourcesSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  resourceName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 6,
  },
  resourcePurpose: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  resourceActions: {
    gap: 10,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  resourceButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  footerNote: {
    backgroundColor: colors.infoLight,
    padding: 16,
    borderRadius: 12,
  },
  footerNoteText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
});
