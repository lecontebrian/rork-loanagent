import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { REGULATORY_CONTENT } from '@/constants/compliance';

export default function RegulatoryDisclosureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const disclosureId = params.id as keyof typeof REGULATORY_CONTENT;

  const disclosure = REGULATORY_CONTENT[disclosureId];

  if (!disclosure) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Disclosure not found</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle} numberOfLines={1}>Disclosure</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>{disclosure.title}</Text>
            
            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{disclosure.content}</Text>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                This disclosure is provided to comply with federal law. If you have questions or need assistance understanding this information, please contact our support team.
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
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 32,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  noteContainer: {
    backgroundColor: colors.infoLight,
    padding: 16,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
